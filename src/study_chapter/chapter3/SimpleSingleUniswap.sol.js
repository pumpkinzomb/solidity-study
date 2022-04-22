export const sourceCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./libraries/Math.sol";

contract SingleUniswap {
    address public token0;
    address public token1;
    mapping(address => uint256) balances;

    uint256 public reserve0;
    uint256 public reserve1;
    uint256 public totalSupply;

    uint public initialized = 0;
    uint public constant MINIMUM_LIQUIDITY = 10 ** 3;

    function setPool(address _token0, address _token1) public {
        require(initialized == 0);
        token0 = _token0;
        token1 = _token1;
        reserve0 = 0;
        reserve1 = 0;
        totalSupply = 0;
        initialized = 1;
    }

    function getPoolInfo() public view returns (uint256, uint256, uint256){
        return(reserve0, reserve1, totalSupply);
    }

    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
    }

    function getBalance(address a) public view returns (uint256 _liqudity) {
        _liqudity = balances[a];
    }

    function addLiquidity(uint256 _amount0, uint256 _amount1) public{
        require(initialized == 1);
        uint256 liquidity;

        if(reserve0 == 0) {
            liquidity = Math.sqrt(_amount0 * _amount1);
        }
        else {
            //uint256 inputRatio = _amount0/_amount1;
            //uint256 reserveRatio = reserve0/_reserve1;
            //require( inputRatio >> 3 == reserveRatio >> 3);
            liquidity = Math.min(_amount0 * totalSupply / reserve0, _amount1 * totalSupply / reserve1);
        }

        balances[msg.sender] += liquidity; // the ratio must same, even we use amount 1 / _reserve1
        totalSupply += liquidity;
        reserve0 += _amount0;
        reserve1 += _amount1;

        IERC20(token0).transferFrom(msg.sender, address(this), _amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), _amount1);
    }

    event removeLiquidityLog (
        uint balance0, uint balance1, uint liquidityAmount
    );

    function removeLiquidity(uint256 _liquidityAmount) public {
        // require(_liquidityAmount > balances[msg.sender]);
        uint256 balance0 = _liquidityAmount * reserve0 / totalSupply;
        uint256 balance1 = _liquidityAmount * reserve1 / totalSupply;
        emit removeLiquidityLog(balance0, balance1, _liquidityAmount);
        reserve0 -= balance0;
        reserve1 -= balance1;
        totalSupply -= _liquidityAmount;
        balances[msg.sender] -= _liquidityAmount; 
        IERC20(token0).transfer(msg.sender, balance0);
        IERC20(token1).transfer(msg.sender, balance1);
    }

    function swapAtoB(uint256 amountA) public {
        // Tranfer tokens from sender to this contract
        IERC20(token0).transferFrom(msg.sender, address(this), amountA);

        //Calculation
        uint256 lastK = reserve0*reserve1;
        uint256 amountB = reserve1 - lastK/(reserve0+amountA);
        reserve0 += amountA;
        reserve1 -= amountB;

        // Transfer amount minus fees to sender
        IERC20(token1).transfer(msg.sender, amountB);
    }

    function swapBtoA(uint256 amountB) public {
        // Tranfer tokens from sender to this contract
        IERC20(token1).transferFrom(msg.sender, address(this), amountB);

        //Calculation
        uint256 lastK = reserve0 * reserve1;
        uint256 amountA = reserve0 - lastK / (reserve1 + amountB);
        reserve0 -= amountA;
        reserve1 += amountB;

        // Transfer amount minus fees to sender
        IERC20(token0).transfer(msg.sender, amountA);
    }
}
`;
