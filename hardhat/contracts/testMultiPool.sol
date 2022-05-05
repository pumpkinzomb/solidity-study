// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./libraries/Math.sol";

contract ZombSimpleExchange {
    using SafeMath for uint256;

    uint public constant MINIMUN_LIQUIDITY = 10 ** 3;
    uint index = 0; 
    struct Pool {
        string poolName;
        address token0;
        address token1;
        uint256 reserve0;
        uint256 reserve1;
        uint256 totalSupply;
        mapping (address => uint) balances;
    }

    mapping (uint => Pool) Pools;
    mapping (string => uint) PoolIds;

    event LogSetPool(string poolName, uint poolId);
    event LogLiquidity(string poolName, uint256 reserve0, uint256 reserve1, uint256 totalSupply);

    modifier checkPool(string memory _poolName, bool _flag) {
        uint poolId = PoolIds[_poolName]; 
        if(!_flag){
            require(keccak256(abi.encodePacked(Pools[poolId].poolName)) != keccak256(abi.encodePacked(_poolName)));
        } else {
            require(keccak256(abi.encodePacked(Pools[poolId].poolName)) == keccak256(abi.encodePacked(_poolName)));
        }
        _;
    }

    function setPool(string memory _poolName, address _token0, address _token1) public checkPool(_poolName, false) {
        Pool storage newPoolItem = Pools[index];

        newPoolItem.poolName = _poolName;
        newPoolItem.token0 = _token0;
        newPoolItem.token1 = _token1;
        newPoolItem.reserve0 = 0;
        newPoolItem.reserve1 = 0;
        newPoolItem.totalSupply = 0;

        emit LogSetPool(_poolName, index);
        PoolIds[_poolName] = index;
        index += 1;
    }
    
    function getReserves(string memory _poolName) public view returns (uint256 _reserve0, uint256 _reserve1){
        uint poolId = PoolIds[_poolName];
        _reserve0 = Pools[poolId].reserve0;
        _reserve1 = Pools[poolId].reserve1;
    }

    function getBalance(address a, string memory _poolName) public view returns (uint _liqudity){
        uint poolId = PoolIds[_poolName];
        _liqudity = Pools[poolId].balances[a];
    }

    function addLiquidity(string memory _poolName, uint256 _amount0, uint256 _amount1) public {
        uint poolId = PoolIds[_poolName];
        uint256 liquidity;
        uint256 reserve0 = Pools[poolId].reserve0;
        uint256 reserve1 = Pools[poolId].reserve1;
        uint256 totalSupply = Pools[poolId].totalSupply;
        address token0 = Pools[poolId].token0;
        address token1 = Pools[poolId].token1;

        if(reserve0 == 0){
            liquidity = Math.sqrt(_amount0 * _amount1);
        } else {
            liquidity = Math.min(_amount0 * totalSupply / reserve0, _amount1 * totalSupply / reserve1);
        }

        Pools[poolId].balances[msg.sender] += liquidity;
        Pools[poolId].totalSupply += liquidity;
        Pools[poolId].reserve0 += _amount0;
        Pools[poolId].reserve1 += _amount1;

        emit LogLiquidity(_poolName, Pools[poolId].reserve0, Pools[poolId].reserve1, Pools[poolId].totalSupply);

        IERC20(token0).transferFrom(msg.sender, address(this), _amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), _amount1);
    }

    function removeLiquidity(string memory _poolName) public {
        uint poolId = PoolIds[_poolName];
        uint reserve0 = Pools[poolId].reserve0;
        uint reserve1 = Pools[poolId].reserve1;
        uint totalSupply = Pools[poolId].totalSupply;
        address token0 = Pools[poolId].token0;
        address token1 = Pools[poolId].token1;
        uint256 liquidity = Pools[poolId].balances[msg.sender];
        uint256 balance0 = liquidity.mul(reserve0) / totalSupply;
        uint256 balance1 = liquidity.mul(reserve1) / totalSupply;

        Pools[poolId].reserve0 -= balance0;
        Pools[poolId].reserve1 -= balance1;
        Pools[poolId].totalSupply -= liquidity;

        emit LogLiquidity(_poolName, Pools[poolId].reserve0, Pools[poolId].reserve1, Pools[poolId].totalSupply);

        IERC20(token0).transfer(msg.sender, balance0);
        IERC20(token1).transfer(msg.sender, balance1);
    }
    
    function swapAtoB(string memory _poolName, uint256 amountA) public {
        uint poolId = PoolIds[_poolName];
        uint256 reserve0 = Pools[poolId].reserve0;
        uint256 reserve1 = Pools[poolId].reserve1;
        address token0 = Pools[poolId].token0;
        address token1 = Pools[poolId].token1;

        IERC20(token0).transferFrom(msg.sender, address(this), amountA);

        uint256 lastK = reserve0 * reserve1;
        uint256 amountB = reserve1 - lastK / (reserve0 + amountA);
        Pools[poolId].reserve0 += amountA;
        Pools[poolId].reserve1 -= amountB;

        IERC20(token1).transfer(msg.sender, amountB);
    }

    function swapBtoA(string memory _poolName, uint256 amountB) public {
        uint poolId = PoolIds[_poolName];
        uint256 reserve0 = Pools[poolId].reserve0;
        uint256 reserve1 = Pools[poolId].reserve1;
        address token0 = Pools[poolId].token0;
        address token1 = Pools[poolId].token1;

        IERC20(token1).transferFrom(msg.sender, address(this), amountB);

        uint256 lastK = reserve0 * reserve1;
        uint256 amountA = reserve0 / lastK - (reserve1 + amountB);
        Pools[poolId].reserve0 -= amountA;
        Pools[poolId].reserve1 += amountB;

        IERC20(token0).transfer(msg.sender, amountA);
    }

}
