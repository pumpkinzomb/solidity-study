export const ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'balance0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'balance1',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'liquidityAmount',
                type: 'uint256',
            },
        ],
        name: 'removeLiquidityLog',
        type: 'event',
    },
    {
        inputs: [],
        name: 'MINIMUM_LIQUIDITY',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_amount0',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_amount1',
                type: 'uint256',
            },
        ],
        name: 'addLiquidity',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'a',
                type: 'address',
            },
        ],
        name: 'getBalance',
        outputs: [
            {
                internalType: 'uint256',
                name: '_liqudity',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getPoolInfo',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getReserves',
        outputs: [
            {
                internalType: 'uint256',
                name: '_reserve0',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_reserve1',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'initialized',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_liquidityAmount',
                type: 'uint256',
            },
        ],
        name: 'removeLiquidity',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'reserve0',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'reserve1',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
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
                name: '_token0',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_token1',
                type: 'address',
            },
        ],
        name: 'setPool',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountA',
                type: 'uint256',
            },
        ],
        name: 'swapAtoB',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountB',
                type: 'uint256',
            },
        ],
        name: 'swapBtoA',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'token0',
        outputs: [
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
        inputs: [],
        name: 'token1',
        outputs: [
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
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];

export const CA = '0xC05F75dfC2C0c356BCC4320f84e72a9D90CB0A11';
