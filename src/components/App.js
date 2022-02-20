import Web3 from 'web3'

import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import NavBar from './Navbar'

const IERC20ABI = require('../abis/IERC20.json');
const daiABI = require("../helpers/dai-abi.json"); 
const wethABI = require("../helpers/weth-abi.json"); 
const UniswapV2RouterABI = require("../abis/UniswapV2Router02Contract.json");

class App extends Component {

	constructor() {
		super();
		this.state = {
			web3: null,
			userAccount : "0x0",
			daiAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
			wethAddress : '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
			DAIWETHPairAddress : '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
			UniswapV2RouterAddress : null,
			loading: true,
			UniswapV2RouterContract:null,
			DaiContract:null,
			WethContract:null,
			DAIWETHPairContract:null,
			DaiTokenBalance : "0",
			WETHTokenBalance : "0",
			amountIn :0,
			amountOut : 0,
			networkId:null,
			priceImpact : null,
			lpToken : '0',
			onlineOutPutPrice : 0,
			selectedTokenInAddress : "0x6B175474E89094C44Da98b954EedeAC495271d0F",
			selectedTokenOutAddress : "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
			selectedTokenInAmount : 0,
			selectedTokenOutAmount : 0,
		};

		// Binding methods here
		this.depositHandler = this.SwapHandlr.bind(this)
		this.addLiquidity = this.addLiquidity.bind(this)
		this.removeLiquidity = this.removeLiquidity.bind(this)
		// this.setAmountOutFromAmountIn = this.setAmountOutFromAmountIn.bind(this)

	}

	componentWillMount() {
		this.loadWeb3()
	}

	async loadWeb3() {
		if (window.ethereum) {

			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()

			this.loadBlockchainData(this.props.dispatch)

		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		} else {
			window.alert('Non-ethereum browser detected.')
		}
	}

	async loadBlockchainData(dispatch) {
		const web3 = new Web3(window.ethereum)
		this.setState({ web3 })

		const networkId = await web3.eth.net.getId()

		this.setState({networkId})

		const accounts = await web3.eth.getAccounts()
		this.setState({ userAccount: accounts[0] })

		this.setState({UniswapV2RouterAddress : UniswapV2RouterABI.networks[networkId].address})

		const UniswapV2RouterContract = new web3.eth.Contract(UniswapV2RouterABI.abi, UniswapV2RouterABI.networks[networkId].address)


		if (!UniswapV2RouterContract) {
			window.alert('Aggregator smart contract not detected on the current network. Please select another network with Metamask.')
			return
		}

		this.setState({ UniswapV2RouterContract })

		const DaiContract = new web3.eth.Contract(daiABI, this.state.daiAddress);

		this.setState({ DaiContract })

		const WethContract = new web3.eth.Contract(wethABI, this.state.wethAddress);

		this.setState({ WethContract })

		const DAIWETHPairContract = new web3.eth.Contract(IERC20ABI.abi, this.state.DAIWETHPairAddress)

		this.setState({ DAIWETHPairContract })

		await this.loadAccountInfo();
	}

	async loadAccountInfo() {

		let DaiTokenBalance = await this.state.DaiContract.methods.balanceOf(this.state.userAccount).call();
		this.setState({DaiTokenBalance});

		let WETHTokenBalance = await this.state.WethContract.methods.balanceOf(this.state.userAccount).call();
		this.setState({WETHTokenBalance});

		const liqBalance = await this.state.UniswapV2RouterContract.methods.getUserBalanceFromLiq(this.state.daiAddress, this.state.wethAddress)
		.call();

		this.setState({lpToken : liqBalance})

	}
	
	async SwapHandlr() {

		console.log(this.state.amountIn)

		if(Number(this.state.amountIn) > 0 && Number.isInteger(this.state.amountIn)){

			const amountInWei = await this.state.web3.utils.toWei(this.state.amountIn.toString(), 'ether');

			const getAmountOutForSwap = 
			await this.state.UniswapV2RouterContract.methods.getAmountOutForSwap(this.state.daiAddress, this.state.wethAddress,amountInWei)
			.call();


			await this.state.DaiContract.methods.approve(this.state.UniswapV2RouterAddress, amountInWei).send({ from: this.state.userAccount });
			
			console.log('Approve AnjamShod');

			await this.state.UniswapV2RouterContract.methods.makeSwapExactTokensForTokens(
				this.state.daiAddress, this.state.wethAddress, amountInWei, getAmountOutForSwap, this.state.userAccount)
				.send({ from: this.state.userAccount , gas:1000000 })

				console.log(this.state.UniswapV2RouterContract.events.swapDone)

				console.log('Swap AnjamShod')



		} else{
			console.log('Nooooo')
		}

	}


	setAmountOutFromAmountIn = async (e) => {

		this.setState({amountIn : Number(e)})

		let amountInWei = await this.state.web3.utils.toWei(e.toString(), 'ether');

		const getAmountOutForSwap = await 
		this.state.UniswapV2RouterContract.methods.testSomeThings(
		this.state.selectedTokenInAddress, 
		this.state.selectedTokenOutAddress, 
		amountInWei).call();

		console.log((getAmountOutForSwap/(10**18)).toFixed(5))
	}

	setAmountInFromAmountOut = async (e) => {


		let amountInWei = await this.state.web3.utils.toWei(e.toString(), 'ether');

		const getAmountInForSwap = await 
		this.state.UniswapV2RouterContract.methods.testSomeThings(
		this.state.selectedTokenOutAddress, 
		this.state.selectedTokenInAddress, 
		amountInWei).call();

		console.log((getAmountInForSwap/(10**18)).toFixed(5))


	}

	async addLiquidity() {

		    const daiBalance = await this.state.DaiContract.methods.balanceOf(this.state.userAccount).call();
            await this.state.DaiContract.methods.approve(this.state.UniswapV2RouterAddress, daiBalance).send({ from: this.state.userAccount });


		    const wethBalance = await this.state.WethContract.methods.balanceOf(this.state.userAccount).call();
            await this.state.WethContract.methods.approve(this.state.UniswapV2RouterAddress, wethBalance).send({ from: this.state.userAccount });

            await this.state.UniswapV2RouterContract.methods.addLiquidityToExchanger(this.state.daiAddress, this.state.wethAddress, this.state.DaiTokenBalance, this.state.WETHTokenBalance, 1, 1, this.state.userAccount, Date.now())
            .send({from : this.state.userAccount , gas:3000000});

	}

	async removeLiquidity() {


		await this.state.DAIWETHPairContract.methods.approve(this.state.UniswapV2RouterAddress, this.state.lpToken).send({ from: this.state.userAccount });

		await this.state.UniswapV2RouterContract.methods.removeLiquidityFromExchanger(this.state.daiAddress, this.state.wethAddress, 1, 1, this.state.userAccount, Date.now())
		.send({from : this.state.userAccount , gas:3000000});

	}

	render() {
		return (
			<div>
				<NavBar account={this.state.userAccount} />
				<div className="container-fluid">
					<main role="main" className="col-lg-12 text-center">
						<div className="row content">
							<div className="col user-controls">

								<form onSubmit={(e) => {
									e.preventDefault()
									this.SwapHandlr()
								}}>
									<input type="number" placeholder="Amount In" 
									onChange={

										e => this.setAmountOutFromAmountIn(e.target.value)
										
										}/>

									<input type="number" placeholder="Amount Out" onChange={

										e => this.setAmountInFromAmountOut(e.target.value)
										
										}/>

									<h3>Price Impact : {this.state.priceImpact ? '0' : ''}</h3>

									<h3>{Number(this.state.onlineOutPutPrice) > 0 ? `1WETH = ${this.state.selectedTokenOutAmount ? this.state.selectedTokenOutAmount : null} $` : null}</h3>

									<button type="submit" onClick={()=> this.SwapHandlr}>Swap</button>
								</form>

								<button onClick={()=> this.addLiquidity()} >Add Liquidity</button>

								<button onClick={()=> this.removeLiquidity()}>Remove Liquidity</button>

							</div>
							<div className="col user-stats">
								<p>Current Wallet Balance (DAI): {Number(this.state.DaiTokenBalance/(10**18)).toFixed(5)}</p>
								<p>Current Wallet Balance (WETH): {Number(this.state.WETHTokenBalance/(10**18)).toFixed(5)}</p>
								<p>Current LP Token: {Number(this.state.lpToken/(10**18)).toFixed(5)}</p>
							</div>
						</div>
					</main>

				</div>
			</div>
		);
	}
}

export default App;
