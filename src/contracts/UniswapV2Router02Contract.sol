// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/lib/contracts/libraries/TransferHelper.sol';

import './interfaces/IUniswapV2Router02.sol';
import './libraries/UniswapV2Library.sol';
import './libraries/SafeMath.sol';
import './interfaces/IERC20.sol';
import './interfaces/IWETH.sol';

contract UniswapV2Router02Contract {
    
    using SafeMath for uint;

    address public constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public immutable UNISWAP_V2_FACTORY;
    address public immutable UNISWAP_V2_WETH;
    
    constructor(address _UNISWAP_V2_FACTORY, address _UNISWAP_V2_WETH) public {
        UNISWAP_V2_FACTORY = _UNISWAP_V2_FACTORY;
        UNISWAP_V2_WETH = _UNISWAP_V2_WETH;
    }

        modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'UniswapV2Router: EXPIRED');
        _;
    }

    event swapDone(address indexed _fromToken, address indexed _toToken, uint _amountIn);

    function testSomeThings(address tokenA, address tokenB,  uint _amount)external view returns(uint){

        (uint reserveA, uint reserveB) = UniswapV2Library.getReserves(UNISWAP_V2_FACTORY, tokenA, tokenB);

        (uint amountB) = UniswapV2Library.quote(_amount, reserveA, reserveB);

        return amountB;

    }


    function getReserveOfTokenIn(address _tokenIn, address _tokenOut) external view returns(uint[] memory amounts){

        amounts = new uint[](2);

        (uint reserveA, uint reserveB) = UniswapV2Library.getReserves(UNISWAP_V2_FACTORY, _tokenIn, _tokenOut);
        amounts[0] = reserveA;
        amounts[1] = reserveB;
    }

    function getAmountOutForSwap(address _tokenIn, address _tokenOut, uint _amountIn) external view returns(uint){      
        address[] memory path;
        if (_tokenIn == UNISWAP_V2_WETH || _tokenOut == UNISWAP_V2_WETH) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
            } else {
                path = new address[](3);
                path[0] = _tokenIn;
                path[1] = UNISWAP_V2_WETH;
                path[2] = _tokenOut;
                }
            
            uint[] memory amounts = UniswapV2Library.getAmountsOut(UNISWAP_V2_FACTORY, _amountIn, path);
            
            return amounts[1];
    }
    
    
    
    function getAmountInForSwap(address _tokenIn, address _tokenOut, uint _amountIn) external view returns(uint){      
        address[] memory path;
        if (_tokenIn == UNISWAP_V2_WETH || _tokenOut == UNISWAP_V2_WETH) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
            } else {
                path = new address[](3);
                path[0] = _tokenIn;
                path[1] = UNISWAP_V2_WETH;
                path[2] = _tokenOut;
                }
            
            uint[] memory amounts = UniswapV2Library.getAmountsIn(UNISWAP_V2_FACTORY, _amountIn, path);
            
            return amounts[0];
    }



    function makeSwapExactTokensForTokens( address _tokenIn, address _tokenOut, uint _amountIn, uint _amountOutMin, address _to) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountIn);
        
        address[] memory path;
        if (_tokenIn == UNISWAP_V2_WETH || _tokenOut == UNISWAP_V2_WETH) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
            } else {
                path = new address[](3);
                path[0] = _tokenIn;
                path[1] = UNISWAP_V2_WETH;
                path[2] = _tokenOut;
                }
            
            IUniswapV2Router02(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
                _amountIn,
                _amountOutMin,
                path,
                _to,
                block.timestamp
            );

        emit swapDone(_tokenIn, _tokenOut, _amountIn);
    }



    function _addLiquidityToExchanger(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin
    ) private returns (uint amountA, uint amountB) {
        // create the pair if it doesn't exist yet
        if (IUniswapV2Factory(UNISWAP_V2_FACTORY).getPair(tokenA, tokenB) == address(0)) {
            IUniswapV2Factory(UNISWAP_V2_FACTORY).createPair(tokenA, tokenB);
        }
        (uint reserveA, uint reserveB) = UniswapV2Library.getReserves(UNISWAP_V2_FACTORY, tokenA, tokenB);
        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint amountBOptimal = UniswapV2Library.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, 'UniswapV2Router: INSUFFICIENT_B_AMOUNT');
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint amountAOptimal = UniswapV2Library.quote(amountBDesired, reserveB, reserveA);
                assert(amountAOptimal <= amountADesired);
                require(amountAOptimal >= amountAMin, 'UniswapV2Router: INSUFFICIENT_A_AMOUNT');
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }



    function addLiquidityToExchanger(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external ensure(deadline) returns (uint amountA, uint amountB, uint liquidity) {
        (amountA, amountB) = _addLiquidityToExchanger(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);
        address pair = UniswapV2Library.pairFor(UNISWAP_V2_FACTORY, tokenA, tokenB);
        TransferHelper.safeTransferFrom(tokenA, msg.sender, pair, amountA);
        TransferHelper.safeTransferFrom(tokenB, msg.sender, pair, amountB);
        liquidity = IUniswapV2Pair(pair).mint(to);
    }


        function removeLiquidityFromExchanger(
        address tokenA,
        address tokenB,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) public ensure(deadline) returns (uint amountA, uint amountB) {
        address pair = UniswapV2Library.pairFor(UNISWAP_V2_FACTORY, tokenA, tokenB);
        uint liquidity = IERC20(pair).balanceOf(msg.sender);
        IUniswapV2Pair(pair).transferFrom(msg.sender, pair, liquidity); // send liquidity to pair
        (uint amount0, uint amount1) = IUniswapV2Pair(pair).burn(to);
        (address token0,) = UniswapV2Library.sortTokens(tokenA, tokenB);
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= amountAMin, 'UniswapV2Router: INSUFFICIENT_A_AMOUNT');
        require(amountB >= amountBMin, 'UniswapV2Router: INSUFFICIENT_B_AMOUNT');
    }


    function getPairAddress(address _tokenA, address _tokenB) external view returns(address){
        
        address pair = UniswapV2Library.pairFor(UNISWAP_V2_FACTORY, _tokenA, _tokenB);
        return pair;
    }



    function getUserBalanceFromLiq(address _tokenA, address _tokenB) external view returns(uint){
        
        address pair = UniswapV2Library.pairFor(UNISWAP_V2_FACTORY, _tokenA, _tokenB);
        uint liquidity = IERC20(pair).balanceOf(msg.sender);
        return liquidity;
    }

}
