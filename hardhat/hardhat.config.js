/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');

module.exports = {
    solidity: '0.8.8',
    networks: {
        ropsten: {
            url: 'https://ethereum-ropsten-rpc.allthatnode.com/', // ropsten testnet
            accounts: [''], // Input your private Key
        },
    },
};
