/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
    solidity: '0.8.8',
    networks: {
        ropsten: {
            url: API_URL, // ropsten testnet
            accounts: [PRIVATE_KEY], // Input your private Key
        },
    },
};
