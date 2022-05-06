export const sourceCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract ZombBank {
    struct Asset {
        string tokenName;
        string tokenSymbol;
        address tokenAddress;
        mapping(address => uint256) balance;
        uint256 totalAmount;
    }
    struct _Asset {
        string tokenName;
        string tokenSymbol;
        address tokenAddress;
        uint256 balance;
    }

    _Asset[] public assetList;

    mapping (address => Asset) bankAssets;

    uint bankAssetCount = 0;
    
    constructor () payable {}

    function deposit(address token, uint256 amount) public {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        Asset storage asset = bankAssets[token];
        asset.balance[msg.sender] += amount;
        asset.totalAmount += amount;
    }

    function withdraw(address token, uint256 amount) public {
        IERC20(token).transfer(msg.sender, amount);
         Asset storage asset = bankAssets[token];
        asset.balance[msg.sender] -= amount;
        asset.totalAmount -= amount;
    }

    function getMyBalance(address token) view public returns (_Asset memory, address){
        _Asset memory asset = _Asset({
            tokenName: bankAssets[token].tokenName,
            tokenSymbol: bankAssets[token].tokenSymbol,
            tokenAddress: bankAssets[token].tokenAddress,
            balance: bankAssets[token].balance[msg.sender]
        });
        return (asset, msg.sender);
    }

    function getAllBankAssets() view public returns (_Asset[] memory){
        return assetList;
    }

    modifier notExist(address assetAddress) {
        require(bankAssets[assetAddress].tokenAddress != assetAddress);
        _;
    }

    function registAsset(string memory tokenName, string memory tokenSymbol, address tokenAddress) notExist(tokenAddress) public {
        Asset storage asset = bankAssets[tokenAddress];
        asset.tokenAddress = tokenAddress;
        asset.tokenName = tokenName;
        asset.tokenSymbol = tokenSymbol;
        asset.totalAmount = 0;
        assetList.push(_Asset({
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            tokenAddress: tokenAddress,
            balance: 0
        }));
        bankAssetCount += 1;
    }
}
`;
