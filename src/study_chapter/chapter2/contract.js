export const ABI = [
    {
        inputs: [],
        stateMutability: 'payable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'assetList',
        outputs: [
            {
                internalType: 'string',
                name: 'tokenName',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'tokenSymbol',
                type: 'string',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getAllBankAssets',
        outputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'tokenName',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'tokenSymbol',
                        type: 'string',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'balance',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct ZombBank._Asset[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
        ],
        name: 'getMyBalance',
        outputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'tokenName',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'tokenSymbol',
                        type: 'string',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'balance',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct ZombBank._Asset',
                name: '',
                type: 'tuple',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'tokenName',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'tokenSymbol',
                type: 'string',
            },
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address',
            },
        ],
        name: 'registAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export const CA = '0x84076D69fECD111d441f8c49b3b336BA2D84f213';
