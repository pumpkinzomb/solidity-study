export const ABI = [
    {
        inputs: [],
        stateMutability: 'payable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'reserve0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'reserve1',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256',
            },
        ],
        name: 'addLiquidityLog',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'received',
        type: 'event',
    },
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
                name: 'reserve0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'reserve1',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256',
            },
        ],
        name: 'removeLiquidityLog',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'reserve0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'reserve1',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256',
            },
        ],
        name: 'swapAtoBLog',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'reserve1',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'reserve0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256',
            },
        ],
        name: 'swapBtoALog',
        type: 'event',
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
        stateMutability: 'payable',
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
        stateMutability: 'payable',
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
        stateMutability: 'payable',
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
        stateMutability: 'payable',
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
    {
        stateMutability: 'payable',
        type: 'receive',
    },
];

export const CA = '0x46835eCF8e2048fdfe29127886ADbd4781d33E85';
