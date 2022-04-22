export const sourceCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./libraries/Math.sol";

contract SingleUniswapWithNative {
    address public token0; // erc20 Token
    mapping(address => uint256) balances;

    uint256 public reserve0; // erc20 token total amount
    uint256 public reserve1; // native eth token total amount
    uint256 public totalSupply;

    uint public initialized = 0;

    constructor () payable {
    }

    function setPool(address _token0) public {
        require(initialized == 0);
        token0 = _token0;
        reserve0 = 0;
        reserve1 = 0;
        totalSupply = 0;
        initialized = 1;
    }

    function getPoolInfo() public view returns (uint256, uint256, uint256){
        return(reserve0, reserve1, totalSupply);
    }

    function getBalance(address a) public view returns (uint256 _liqudity) {
        _liqudity = balances[a];
    }

    function addLiquidity(uint256 _amount0, uint256 _amount1) public{
        require(initialized == 1);
        uint256 liquidity;
        address payable CA_address = payable(address(this));
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
        CA_address.transfer(_amount1);
        emit addLiquidityLog(reserve0, reserve1, totalSupply);
    }

   

    function removeLiquidity(uint256 _liquidityAmount) public {
        // require(_liquidityAmount > balances[msg.sender]);
        uint256 balance0 = _liquidityAmount * reserve0 / totalSupply;
        uint256 balance1 = _liquidityAmount * reserve1 / totalSupply;
        address payable msgSender = payable(msg.sender);
        reserve0 -= balance0;
        reserve1 -= balance1;
        totalSupply -= _liquidityAmount;
       
        balances[msg.sender] -= _liquidityAmount; 
        IERC20(token0).transfer(msg.sender, balance0);
        msgSender.transfer(balance1);
         emit removeLiquidityLog(balance0, balance1, reserve0, reserve1, totalSupply);
    }

    function swapAtoB(uint256 amountA) public {
        address payable msgSender = payable(msg.sender);
        // Tranfer tokens from sender to this contract
        IERC20(token0).transferFrom(msg.sender, address(this), amountA);

        //Calculation
        uint256 lastK = reserve0*reserve1;
        uint256 amountB = reserve1 - lastK/(reserve0+amountA);
        reserve0 += amountA;
        reserve1 -= amountB;
        
        // Transfer amount minus fees to sender
        msgSender.transfer(amountB);
        emit swapAtoBLog(reserve0, reserve1, totalSupply);
    }

    function swapBtoA(uint256 amountB) public {
        // Tranfer tokens from sender to this contract
        address payable CA_address = payable(address(this));
        CA_address.transfer(amountB);

        //Calculation
        uint256 lastK = reserve0 * reserve1;
        uint256 amountA = reserve0 - lastK / (reserve1 + amountB);
        reserve0 -= amountA;
        reserve1 += amountB;
        
        // Transfer amount minus fees to sender
        IERC20(token0).transfer(msg.sender, amountA);
        emit swapBtoALog(reserve1, reserve0, totalSupply);
    }

     event addLiquidityLog (
         uint256 reserve0, uint256 reserve1, uint256 totalSupply
    );

    event removeLiquidityLog (
        uint256 balance0, uint256 balance1, uint256 reserve0, uint256 reserve1, uint256 totalSupply
    );

    event swapAtoBLog (
        uint256 reserve0, uint256 reserve1, uint256 totalSupply
    );

    event swapBtoALog (
        uint256 reserve1, uint256 reserve0, uint256 totalSupply
    );
}
`;
