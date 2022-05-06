// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './Uni_v2_Pair.sol';

contract UniswapV2Factory {

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);
    event InitSuccess(bytes32 init_code);

    constructor() {
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        bytes32 init_code = keccak256(abi.encodePacked(bytecode));
        emit InitSuccess(init_code);
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'UniswapV2: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
            // address 확보를 위해 create2 함수를 사용한다. 
            // salt값으로 Pair 컨트랙트의 init_code hash를 사용하는 이유는 배포된 deployed 주소값을
            // storage reading없이 계산하여 UniswapV2Library에서 사용하기 위해서다.
        }
        UniswapV2Pair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }
}