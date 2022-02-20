const Intl = require('Intl');
const nf = Intl.NumberFormat();

// IMPORT ABIS
const IERC20ABI = require('../src/abis/IERC20.json')["abi"];
const daiABI = require("../mint-Token/dai-abi.json"); 
const wethABI = require("../mint-Token/weth-abi.json"); 
const UniswapV2RouterABI = require("../src/abis/UniswapV2Router02Contract.json")["abi"];

//SET TOKEN ADDRESS
const DAIWETHPairAddress = '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11';
const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const UniswapV2RouterAddress = require("../src/abis/UniswapV2Router02Contract.json")["networks"]["1"]["address"];

//CREATE CONTRACTS WITH WEB3
const DAIWETHPairContract = new web3.eth.Contract(IERC20ABI, DAIWETHPairAddress);
const DaiContract = new web3.eth.Contract(daiABI, daiAddress);
const WethContract = new web3.eth.Contract(wethABI, wethAddress);
const UniswapV2RouterContract = new web3.eth.Contract(UniswapV2RouterABI, UniswapV2RouterAddress);


require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('UniswapV2Router Test', ([deployer]) => {

    beforeEach(async () => {

    })

    describe('', async () => {
        
        let amount = 3000
        let amountInWei = web3.utils.toWei(amount.toString(), 'ether')

        it('Check Deployed Contract Address With Web3', async () => {

            // const daiBalance = await DaiContract.methods.balanceOf(deployer).call();
            // console.log('daiBalance of deployer : ', nf.format((daiBalance/(10**18)).toFixed(2)));
    
            // const wethBalance = await WethContract.methods.balanceOf(deployer).call();
            // console.log('wethBalance of deployer : ', nf.format((wethBalance/(10**18)).toFixed(2)));
    
            // const UniswapV2RouterFactoryAddress = await UniswapV2RouterContract.methods.UNISWAP_V2_FACTORY().call();
            // console.log('UniswapV2RouterFactoryAddress : ', UniswapV2RouterFactoryAddress);
    
        })
    
        it('Check Swap Exact Tokens For Tokens And Balance After Swap ', async () => {

            // await DaiContract.methods.approve(UniswapV2RouterAddress, amountInWei).send({ from: deployer }).should.be.fulfilled;
            // const estimateGasForMakeSwapExactTokensForTokens = await UniswapV2RouterContract.methods.makeSwapExactTokensForTokens
            // (daiAddress, wethAddress, amountInWei, 1, deployer)
            // .estimateGas({gas: 5000000});
            // console.log('estimateGasForMakeSwapExactTokensForTokens : ', estimateGasForMakeSwapExactTokensForTokens)

            // const daiBalanceAfterEstimateGas = await DaiContract.methods.balanceOf(deployer).call();
            // console.log('daiBalanceAfterEstimateGas of deployer : ', daiBalanceAfterEstimateGas);
    
            // const wethBalanceAfterEstimateGas = await WethContract.methods.balanceOf(deployer).call();
            // console.log('wethBalanceAfterEstimateGas of deployer : ', wethBalanceAfterEstimateGas);
    

            // const gasPrice = await web3.eth.getGasPrice();
            // console.log('gasPrice : ', gasPrice )

            // const finalGPrice = gasPrice *  estimateGasForMakeSwapExactTokensForTokens;
            // console.log('finalGPrice :', web3.utils.fromWei(finalGPrice.toString(),'ether'))

            const getAmountOutForSwap = await UniswapV2RouterContract.methods.getAmountOutForSwap(daiAddress, wethAddress, amountInWei).call();
            console.log('getAmountOutForSwap :', nf.format((getAmountOutForSwap/(10**18)).toFixed(2)));

            const amountInWeiToGetOutAmount = web3.utils.toWei('1', 'ether')
            
            const getAmountInForSwap = await UniswapV2RouterContract.methods.getAmountInForSwap(daiAddress, wethAddress, amountInWeiToGetOutAmount).call();
            console.log('getAmountInForSwap :', nf.format((getAmountInForSwap/(10**18)).toFixed(2)));

            const testSomeThings = await UniswapV2RouterContract.methods.testSomeThings(wethAddress, daiAddress, amountInWeiToGetOutAmount).call();
            console.log('testSomeThings :', nf.format((testSomeThings/(10**18)).toFixed(2)));

            // const finalClculation = Number(web3.utils.fromWei(finalGPrice.toString(),'ether')) * getAmountInForSwap;
            // console.log('finalClculation :', nf.format((finalClculation/(10**18)).toFixed(2)));


            // await DaiContract.methods.approve(UniswapV2RouterAddress, amountInWei).send({ from: deployer }).should.be.fulfilled;
            // await UniswapV2RouterContract.methods.makeSwapExactTokensForTokens(daiAddress, wethAddress, amountInWei, getAmountOutForSwap, deployer)
            // .send({ from: deployer , gas:1000000 })
            // .should.be.fulfilled;
    
            // const daiBalanceAfterFirstSwap = await DaiContract.methods.balanceOf(deployer).call();
            // console.log('daiBalanceAfterFirstSwap of deployer : ', nf.format((daiBalanceAfterFirstSwap/(10**18)).toFixed(2)));
    
            // const wethBalanceAfterFirstSwap = await WethContract.methods.balanceOf(deployer).call();
            // console.log('wethBalanceAfterFirstSwap of deployer : ', nf.format((wethBalanceAfterFirstSwap/(10**18)).toFixed(2)));
    
        })

        it('Check Add Liquidity ', async () => {

            // const daiBalanceAfterFirstSwap = await DaiContract.methods.balanceOf(deployer).call();
            // console.log('daiBalanceAfterFirstSwap of deployer : ', nf.format((daiBalanceAfterFirstSwap/(10**18)).toFixed(2)));
            // await DaiContract.methods.approve(UniswapV2RouterAddress, daiBalanceAfterFirstSwap).send({ from: deployer }).should.be.fulfilled;

            // const wethBalanceAfterFirstSwap = await WethContract.methods.balanceOf(deployer).call();
            // console.log('wethBalanceAfterFirstSwap of deployer : ', nf.format((wethBalanceAfterFirstSwap/(10**18)).toFixed(2)));
            // await WethContract.methods.approve(UniswapV2RouterAddress, wethBalanceAfterFirstSwap).send({ from: deployer }).should.be.fulfilled;

            // await UniswapV2RouterContract.methods.addLiquidityToExchanger(daiAddress, wethAddress, daiBalanceAfterFirstSwap, wethBalanceAfterFirstSwap, 1, 1, deployer, Date.now())
            // .send({from : deployer , gas:3000000}).should.be.fulfilled;

            // const daiBalanceAfterAddLiquidity = await DaiContract.methods.balanceOf(deployer).call();
            // console.log('daiBalanceAfterAddLiquidity of deployer : ', nf.format((daiBalanceAfterAddLiquidity/(10**18)).toFixed(2)));
    
            // const wethBalanceAfterAddLiquidity = await WethContract.methods.balanceOf(deployer).call();
            // console.log('wethBalanceAfterAddLiquidity of deployer : ', nf.format((wethBalanceAfterAddLiquidity/(10**18)).toFixed(2)));

            // const liqBalance = await UniswapV2RouterContract.methods.getUserBalanceFromLiq(daiAddress, wethAddress)
            // .call();
            // console.log('liqBalance of deployer : ', nf.format((liqBalance/(10**18)).toFixed(2)))


        })

        it('Check Remove Liquidity ', async () => {

            // const daiBalanceAfterAddLiq = await DaiContract.methods.balanceOf(deployer).call();
            // console.log('daiBalanceAfterAddLiq of deployer : ', nf.format((daiBalanceAfterAddLiq/(10**18)).toFixed(2)));

            // const wethBalanceAfterAddLiq = await WethContract.methods.balanceOf(deployer).call();
            // console.log('wethBalanceAfterAddLiq of deployer : ', nf.format((wethBalanceAfterAddLiq/(10**18)).toFixed(2)));

            // const liqBalance = await DAIWETHPairContract.methods.balanceOf(deployer)
            // .call();
            // console.log('liqBalance of deployer : ', nf.format((liqBalance/(10**18)).toFixed(2)))


            // await DAIWETHPairContract.methods.approve(UniswapV2RouterAddress, liqBalance).send({ from: deployer }).should.be.fulfilled;


            // await UniswapV2RouterContract.methods.removeLiquidityFromExchanger(daiAddress, wethAddress, 1, 1, deployer, Date.now())
            // .send({from : deployer , gas:3000000}).should.be.fulfilled;
            
            // const daiBalanceAfterRemoveLiq = await DaiContract.methods.balanceOf(deployer).call();
            // console.log('daiBalanceAfterRemoveLiq of deployer : ', nf.format((daiBalanceAfterRemoveLiq/(10**18)).toFixed(2)));

            // const wethBalanceAfterRemoveLiq = await WethContract.methods.balanceOf(deployer).call();
            // console.log('wethBalanceAfterRemoveLiq of deployer : ', nf.format((wethBalanceAfterRemoveLiq/(10**18)).toFixed(2)));

            // const liqBalanceAfterRemoveLiq = await UniswapV2RouterContract.methods.getUserBalanceFromLiq(daiAddress, wethAddress)
            // .call();
            // console.log('liqBalanceAfterRemoveLiq of deployer : ', nf.format((liqBalanceAfterRemoveLiq/(10**18)).toFixed(2)))


        })
    })

})