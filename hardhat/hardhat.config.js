/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');

module.exports = {
    solidity: '0.8.8',
    networks: {
        ropsten: {
            url: 'https://ethereum-ropsten-rpc.allthatnode.com/',
            accounts: ['e1e63fe55b610df7557392879025780336e1bf30ab27480fbf1df047367ada55'],
        },
    },
};
