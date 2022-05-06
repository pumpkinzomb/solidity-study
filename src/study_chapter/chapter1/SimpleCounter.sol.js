export const sourceCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCounter {
    uint value = 0;

    function increment () public {
        value += 1;
    }

    function decrement () public {
        value -= 1;
    }

    function getCount () public view returns (uint){
        return value;
    }
}
`;
