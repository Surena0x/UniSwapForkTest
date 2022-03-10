const Intl = require('Intl');
const nf = Intl.NumberFormat();

// IMPORT ABIS
const IERC20ABI = require('../src/abis/IERC20.json')["abi"];
const daiABI = require("../mint-Token/dai-abi.json");
const wethABI = require("../mint-Token/weth-abi.json");
const linkABI = require("../mint-Token/link-abi.json");
const UniswapV2RouterABI = require("../src/abis/UniswapV2Router02Contract.json")["abi"];

//SET TOKEN ADDRESS
const DAIWETHPairAddress = '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11';
const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const linkAddress = '0x514910771af9ca656af840dff83e8264ecf986ca';
const UniswapV2RouterAddress = require("../src/abis/UniswapV2Router02Contract.json")["networks"]["1"]["address"];

//CREATE CONTRACTS WITH WEB3
const DAIWETHPairContract = new web3.eth.Contract(IERC20ABI, DAIWETHPairAddress);
const DaiContract = new web3.eth.Contract(daiABI, daiAddress);
const WethContract = new web3.eth.Contract(wethABI, wethAddress);
const LinkContract = new web3.eth.Contract(linkABI, linkAddress);
const UniswapV2RouterContract = new web3.eth.Contract(UniswapV2RouterABI, UniswapV2RouterAddress);


require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('UniswapV2Router Test', ([deployer]) => {

    beforeEach(async () => {

    })

    describe('', async () => {

        it('Check Deployed Contract Address With Web3', async () => {

            const daiBalance = await DaiContract.methods.balanceOf(deployer).call();
            console.log('daiBalance of deployer : ', nf.format((daiBalance / (10 ** 18)).toFixed(2)));

            const wethBalance = await WethContract.methods.balanceOf(deployer).call();
            console.log('wethBalance of deployer : ', nf.format((wethBalance / (10 ** 18)).toFixed(2)));

            const linkBalance = await LinkContract.methods.balanceOf(deployer).call();
            console.log('linkBalance of deployer : ', nf.format((linkBalance / (10 ** 18)).toFixed(2)));

            // const UniswapV2RouterFactoryAddress = await UniswapV2RouterContract.methods.factory().call();
            // console.log('UniswapV2RouterFactoryAddress : ', UniswapV2RouterFactoryAddress);

            // expect(UniswapV2RouterFactoryAddress).to.eql('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f');
        })

        it('Check Swap Exact Tokens For Tokens And Balance After Swap - DAI-WETH ', async () => {

            let amount = 500
            let amountInWei = web3.utils.toWei(amount.toString(), 'ether')

            let tokenInActive = true;
            let tokenOutActive = false;

            let path = [daiAddress, wethAddress];

            if (tokenInActive) {

                const getAmountOutForSwap = await UniswapV2RouterContract.methods.getAmountsOut(amountInWei, path).call();
                console.log('getAmountOutForSwap :', nf.format((getAmountOutForSwap[getAmountOutForSwap.length - 1] / (10 ** 18)).toFixed(2)));

                const daiBalanceBeforeSwap = await DaiContract.methods.balanceOf(deployer).call();
                console.log('daiBalanceBeforeSwap of deployer : ', nf.format((daiBalanceBeforeSwap / (10 ** 18)).toFixed(2)));

                if (daiBalanceBeforeSwap >= Number(amountInWei)) {

                    await DaiContract.methods.approve(UniswapV2RouterAddress, amountInWei).send({ from: deployer }).should.be.fulfilled;

                    await UniswapV2RouterContract.methods.
                        swapExactTokensForTokens(amountInWei, getAmountOutForSwap[getAmountOutForSwap.length - 1], path, deployer, Date.now())
                        .send({ from: deployer, gas: 1000000 })
                        .should.be.fulfilled;

                    const daiBalanceAfterFirstSwap = await DaiContract.methods.balanceOf(deployer).call();
                    console.log('daiBalanceAfterFirstSwap of deployer : ', nf.format((daiBalanceAfterFirstSwap / (10 ** 18)).toFixed(2)));

                    const wethBalanceAfterFirstSwap = await WethContract.methods.balanceOf(deployer).call();
                    console.log('wethBalanceAfterFirstSwap of deployer : ', nf.format((wethBalanceAfterFirstSwap / (10 ** 18)).toFixed(2)));

                }

            } else if (tokenOutActive) {

                const amountInWeiToGetOutAmount = web3.utils.toWei('0.5', 'ether')

                const getAmountInForSwap = await UniswapV2RouterContract.methods.getAmountsIn(amountInWeiToGetOutAmount, path).call();
                console.log('getAmountInForSwap :', nf.format((getAmountInForSwap[0] / (10 ** 18)).toFixed(2)));

                const daiBalanceBeforeSwap = await DaiContract.methods.balanceOf(deployer).call();
                console.log('daiBalanceBeforeSwap of deployer : ', nf.format((daiBalanceBeforeSwap / (10 ** 18)).toFixed(2)));

                if (daiBalanceBeforeSwap >= Number(getAmountInForSwap[0])) {

                    await DaiContract.methods.approve(UniswapV2RouterAddress, getAmountInForSwap[0]).send({ from: deployer }).should.be.fulfilled;

                    await UniswapV2RouterContract.methods.
                        swapTokensForExactTokens(amountInWeiToGetOutAmount, getAmountInForSwap[0], path, deployer, Date.now())
                        .send({ from: deployer, gas: 1000000 })
                        .should.be.fulfilled;

                    const daiBalanceAfterFirstSwap = await DaiContract.methods.balanceOf(deployer).call();
                    console.log('daiBalanceAfterFirstSwap of deployer : ', nf.format((daiBalanceAfterFirstSwap / (10 ** 18)).toFixed(2)));

                    const wethBalanceAfterFirstSwap = await WethContract.methods.balanceOf(deployer).call();
                    console.log('wethBalanceAfterFirstSwap of deployer : ', nf.format((wethBalanceAfterFirstSwap / (10 ** 18)).toFixed(2)));

                }

            }


        })

        it('Check Swap Exact Tokens For Tokens And Balance After Swap - DAI-LINK ', async () => {

            const amountIn = 500;
            const amountInInWei = web3.utils.toWei(amountIn.toString(), 'ether')

            let tokenInActive = true;
            let tokenOutActive = false;

            let path = [daiAddress, wethAddress, linkAddress];

            if (tokenInActive) {

                const getAmountOutForSwap = await UniswapV2RouterContract.methods.getAmountsOut(amountInInWei, path).call();
                console.log('getAmountOutForSwap :', nf.format((getAmountOutForSwap[getAmountOutForSwap.length - 1] / (10 ** 18)).toFixed(2)));

                const daiBalanceBeforeSwap = await DaiContract.methods.balanceOf(deployer).call();
                console.log('daiBalanceBeforeSwap of deployer : ', nf.format((daiBalanceBeforeSwap / (10 ** 18)).toFixed(2)));


                if (daiBalanceBeforeSwap >= Number(amountInInWei)) {

                    await DaiContract.methods.approve(UniswapV2RouterAddress, amountInInWei).send({ from: deployer }).should.be.fulfilled;
                    await UniswapV2RouterContract.methods.
                        swapExactTokensForTokens(amountInInWei, getAmountOutForSwap[getAmountOutForSwap.length - 1], path, deployer, Date.now())
                        .send({ from: deployer, gas: 1000000 })
                        .should.be.fulfilled;

                    const daiBalanceAfterFirstSwap = await DaiContract.methods.balanceOf(deployer).call();
                    console.log('daiBalanceAfterFirstSwap of deployer : ', nf.format((daiBalanceAfterFirstSwap / (10 ** 18)).toFixed(2)));

                    const linkBalanceAfterFirstSwap = await LinkContract.methods.balanceOf(deployer).call();
                    console.log('linkBalanceAfterFirstSwap of deployer : ', nf.format((linkBalanceAfterFirstSwap / (10 ** 18)).toFixed(2)));

                }

            } else if (tokenOutActive) {

                const amountInWeiToGetOutAmount = web3.utils.toWei('10', 'ether')

                const getAmountInForSwap = await UniswapV2RouterContract.methods.getAmountsIn(amountInWeiToGetOutAmount, path).call();
                console.log('getAmountInForSwap :', nf.format((getAmountInForSwap[0] / (10 ** 18)).toFixed(2)));


                const daiBalanceBeforeSwap = await DaiContract.methods.balanceOf(deployer).call();
                console.log('daiBalanceBeforeSwap of deployer : ', nf.format((daiBalanceBeforeSwap / (10 ** 18)).toFixed(2)));

                if (daiBalanceBeforeSwap >= Number(getAmountInForSwap[0])) {

                    await DaiContract.methods.approve(UniswapV2RouterAddress, getAmountInForSwap[0]).send({ from: deployer }).should.be.fulfilled;

                    await UniswapV2RouterContract.methods.
                        swapTokensForExactTokens(amountInWeiToGetOutAmount, getAmountInForSwap[0], path, deployer, Date.now())
                        .send({ from: deployer, gas: 1000000 })
                        .should.be.fulfilled;

                    const daiBalanceAfterFirstSwap = await DaiContract.methods.balanceOf(deployer).call();
                    console.log('daiBalanceAfterFirstSwap of deployer : ', nf.format((daiBalanceAfterFirstSwap / (10 ** 18)).toFixed(2)));

                    const linkBalanceAfterFirstSwap = await LinkContract.methods.balanceOf(deployer).call();
                    console.log('linkBalanceAfterFirstSwap of deployer : ', nf.format((linkBalanceAfterFirstSwap / (10 ** 18)).toFixed(2)));

                }

            }


        })

        it('Check Add Liquidity ', async () => {

            const amountIn = 100000;
            const amountInInWei = web3.utils.toWei(amountIn.toString(), 'ether')

            let tokenInActive = false;
            let tokenOutActive = true;

            let path = [daiAddress, wethAddress];

            if (tokenInActive) {

                const getAmountOutToAddLiq = await UniswapV2RouterContract.methods.getAmountsOut(amountInInWei, path).call();
                console.log('getAmountOutToAddLiq :', nf.format((getAmountOutToAddLiq[getAmountOutToAddLiq.length - 1] / (10 ** 18)).toFixed(2)));

                const daiBalanceBeforeAddLiquidity = await DaiContract.methods.balanceOf(deployer).call();
                console.log('daiBalanceBeforeAddLiquidity of deployer : ', nf.format((daiBalanceBeforeAddLiquidity / (10 ** 18)).toFixed(2)));

                const wethBalanceBeforeAddLiquidity = await WethContract.methods.balanceOf(deployer).call();
                console.log('wethBalanceBeforeAddLiquidity of deployer : ', nf.format((wethBalanceBeforeAddLiquidity / (10 ** 18)).toFixed(2)));


                if (daiBalanceBeforeAddLiquidity >= Number(amountInInWei) && wethBalanceBeforeAddLiquidity >= getAmountOutToAddLiq[getAmountOutToAddLiq.length - 1]) {

                    await DaiContract.methods.approve(UniswapV2RouterAddress, amountInInWei).send({ from: deployer }).should.be.fulfilled;
                    await WethContract.methods.approve(UniswapV2RouterAddress, getAmountOutToAddLiq[getAmountOutToAddLiq.length - 1]).send({ from: deployer }).should.be.fulfilled;

                    const liqBalanceBeforeAdd = await DAIWETHPairContract.methods.balanceOf(deployer).call();
                    console.log('liqBalanceBeforeAdd of deployer : ', nf.format((liqBalanceBeforeAdd / (10 ** 18)).toFixed(2)))

                    await UniswapV2RouterContract.methods.
                        addLiquidity(daiAddress, wethAddress, amountInInWei, getAmountOutToAddLiq[getAmountOutToAddLiq.length - 1], 1, 1, deployer, Date.now())
                        .send({ from: deployer, gas: 1000000 }).should.be.fulfilled;

                    const daiBalanceAfterAddLiquidity = await DaiContract.methods.balanceOf(deployer).call();
                    console.log('daiBalanceAfterAddLiquidity of deployer : ', nf.format((daiBalanceAfterAddLiquidity / (10 ** 18)).toFixed(2)));

                    const wethBalanceAfterAddLiquidity = await WethContract.methods.balanceOf(deployer).call();
                    console.log('wethBalanceAfterAddLiquidity of deployer : ', nf.format((wethBalanceAfterAddLiquidity / (10 ** 18)).toFixed(2)));

                    const liqBalanceAfterAdd = await DAIWETHPairContract.methods.balanceOf(deployer).call();
                    console.log('liqBalanceAfterAdd of deployer : ', nf.format((liqBalanceAfterAdd / (10 ** 18)).toFixed(2)))

                }

            } else if (tokenOutActive) {

                const amountInWeiToGetOutAmount = web3.utils.toWei('10', 'ether')

                const getAmountInToAddLiq = await UniswapV2RouterContract.methods.getAmountsIn(amountInWeiToGetOutAmount, path).call();
                console.log('getAmountInToAddLiq :', nf.format((getAmountInToAddLiq[0] / (10 ** 18)).toFixed(2)));

                const daiBalanceBeforeAddLiquidity = await DaiContract.methods.balanceOf(deployer).call();
                console.log('daiBalanceBeforeAddLiquidity of deployer : ', nf.format((daiBalanceBeforeAddLiquidity / (10 ** 18)).toFixed(2)));

                const wethBalanceBeforeAddLiquidity = await WethContract.methods.balanceOf(deployer).call();
                console.log('wethBalanceBeforeAddLiquidity of deployer : ', nf.format((wethBalanceBeforeAddLiquidity / (10 ** 18)).toFixed(2)));

                if (daiBalanceBeforeAddLiquidity >= getAmountInToAddLiq[0] && wethBalanceBeforeAddLiquidity >= Number(amountInWeiToGetOutAmount)) {

                    await DaiContract.methods.approve(UniswapV2RouterAddress, getAmountInToAddLiq[0]).send({ from: deployer }).should.be.fulfilled;
                    await WethContract.methods.approve(UniswapV2RouterAddress, amountInWeiToGetOutAmount).send({ from: deployer }).should.be.fulfilled;

                    const liqBalanceBeforeAdd = await DAIWETHPairContract.methods.balanceOf(deployer).call();
                    console.log('liqBalanceBeforeAdd of deployer : ', nf.format((liqBalanceBeforeAdd / (10 ** 18)).toFixed(2)))

                    await UniswapV2RouterContract.methods.
                        addLiquidity(daiAddress, wethAddress, getAmountInToAddLiq[0], amountInWeiToGetOutAmount, 1, 1, deployer, Date.now())
                        .send({ from: deployer, gas: 1000000 }).should.be.fulfilled;

                    const daiBalanceAfterAddLiquidity = await DaiContract.methods.balanceOf(deployer).call();
                    console.log('daiBalanceAfterAddLiquidity of deployer : ', nf.format((daiBalanceAfterAddLiquidity / (10 ** 18)).toFixed(2)));

                    const wethBalanceAfterAddLiquidity = await WethContract.methods.balanceOf(deployer).call();
                    console.log('wethBalanceAfterAddLiquidity of deployer : ', nf.format((wethBalanceAfterAddLiquidity / (10 ** 18)).toFixed(2)));

                    const liqBalanceAfterAdd = await DAIWETHPairContract.methods.balanceOf(deployer).call();
                    console.log('liqBalanceAfterAdd of deployer : ', nf.format((liqBalanceAfterAdd / (10 ** 18)).toFixed(2)))

                }

            }


        })

        it('Check Remove Liquidity ', async () => {

            const daiBalanceAfterAddLiq = await DaiContract.methods.balanceOf(deployer).call();
            console.log('daiBalanceAfterAddLiq of deployer : ', nf.format((daiBalanceAfterAddLiq / (10 ** 18)).toFixed(2)));

            const wethBalanceAfterAddLiq = await WethContract.methods.balanceOf(deployer).call();
            console.log('wethBalanceAfterAddLiq of deployer : ', nf.format((wethBalanceAfterAddLiq / (10 ** 18)).toFixed(2)));

            const liqBalance = await DAIWETHPairContract.methods.balanceOf(deployer)
                .call();
            console.log('liqBalance of deployer : ', nf.format((liqBalance / (10 ** 18)).toFixed(2)))

            if (liqBalance > 0) {

                await DAIWETHPairContract.methods.approve(UniswapV2RouterAddress, liqBalance).send({ from: deployer }).should.be.fulfilled;


                await UniswapV2RouterContract.methods.removeLiquidity(daiAddress, wethAddress, liqBalance, 1, 1, deployer, Date.now())
                    .send({ from: deployer, gas: 3000000 }).should.be.fulfilled;

                const daiBalanceAfterRemoveLiq = await DaiContract.methods.balanceOf(deployer).call();
                console.log('daiBalanceAfterRemoveLiq of deployer : ', nf.format((daiBalanceAfterRemoveLiq / (10 ** 18)).toFixed(2)));

                const wethBalanceAfterRemoveLiq = await WethContract.methods.balanceOf(deployer).call();
                console.log('wethBalanceAfterRemoveLiq of deployer : ', nf.format((wethBalanceAfterRemoveLiq / (10 ** 18)).toFixed(2)));

                const liqBalanceAfterRemoveLiq = await UniswapV2RouterContract.methods.getUserBalanceFromLiq(daiAddress, wethAddress)
                    .call();
                console.log('liqBalanceAfterRemoveLiq of deployer : ', nf.format((liqBalanceAfterRemoveLiq / (10 ** 18)).toFixed(2)))
            }
        })
    })

})