export const Factory_ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'token0',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'token1',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'pair',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'PairCreated',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'allPairs',
        outputs: [
            {
                internalType: 'address',
                name: 'pair',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'allPairsLength',
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
                name: 'tokenA',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'tokenB',
                type: 'address',
            },
        ],
        name: 'createPair',
        outputs: [
            {
                internalType: 'address',
                name: 'pair',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'feeTo',
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
        name: 'feeToSetter',
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
        inputs: [
            {
                internalType: 'address',
                name: 'tokenA',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'tokenB',
                type: 'address',
            },
        ],
        name: 'getPair',
        outputs: [
            {
                internalType: 'address',
                name: 'pair',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'setFeeTo',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'setFeeToSetter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export const Factory_CA = '0x1265A95a383Ea034E0b0149EA21660422A750893';

export const Pair_ABI = [
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount1',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'Burn',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount0',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount1',
                type: 'uint256',
            },
        ],
        name: 'Mint',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount0In',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount1In',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount0Out',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount1Out',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'Swap',
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
        ],
        name: 'Sync',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
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
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'allowance',
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
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'balanceOf',
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
                name: 'to',
                type: 'address',
            },
        ],
        name: 'burn',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amount0',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount1',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'factory',
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
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'mint',
        outputs: [
            {
                internalType: 'uint256',
                name: 'liquidity',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'skim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount0Out',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount1Out',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'swap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'sync',
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
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export const ERC20_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_spender',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_from',
                type: 'address',
            },
            {
                name: '_to',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: 'balance',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_to',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address',
            },
            {
                name: '_spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
];

export const Router_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_factory',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_WETH',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [],
        name: 'WETH',
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
        inputs: [
            {
                internalType: 'address',
                name: 'tokenA',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'tokenB',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amountADesired',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountBDesired',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountAMin',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountBMin',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'addLiquidity',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountA',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountB',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'liquidity',
                type: 'uint256',
            },
        ],
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
                name: 'amountTokenDesired',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountTokenMin',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountETHMin',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'addLiquidityETH',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountToken',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountETH',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'liquidity',
                type: 'uint256',
            },
        ],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'factory',
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
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'reserveIn',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'reserveOut',
                type: 'uint256',
            },
        ],
        name: 'getAmountIn',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'reserveIn',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'reserveOut',
                type: 'uint256',
            },
        ],
        name: 'getAmountOut',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
            },
        ],
        name: 'getAmountsIn',
        outputs: [
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
            },
        ],
        name: 'getAmountsOut',
        outputs: [
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenA',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'tokenB',
                type: 'address',
            },
        ],
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
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountA',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'reserveA',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'reserveB',
                type: 'uint256',
            },
        ],
        name: 'quote',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountB',
                type: 'uint256',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenA',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'tokenB',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'liquidity',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountAMin',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountBMin',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'removeLiquidity',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountA',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountB',
                type: 'uint256',
            },
        ],
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
                name: 'liquidity',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountTokenMin',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountETHMin',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'removeLiquidityETH',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountToken',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountETH',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'swapETHForExactTokens',
        outputs: [
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountOutMin',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'swapExactETHForTokens',
        outputs: [
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountOutMin',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'swapExactTokensForETH',
        outputs: [
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountOutMin',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'swapExactTokensForTokens',
        outputs: [
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountInMax',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'swapTokensForExactETH',
        outputs: [
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountInMax',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'swapTokensForExactTokens',
        outputs: [
            {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        stateMutability: 'payable',
        type: 'receive',
    },
];
export const Router_CA = '0x535bEc5966748bA34371664E914227B786F20999';

export const WETH_CA = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
export const WETH_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'guy',
                type: 'address',
            },
            {
                name: 'wad',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'src',
                type: 'address',
            },
            {
                name: 'dst',
                type: 'address',
            },
            {
                name: 'wad',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'wad',
                type: 'uint256',
            },
        ],
        name: 'withdraw',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: 'dst',
                type: 'address',
            },
            {
                name: 'wad',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'deposit',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'address',
            },
            {
                name: '',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'src',
                type: 'address',
            },
            {
                indexed: true,
                name: 'guy',
                type: 'address',
            },
            {
                indexed: false,
                name: 'wad',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'src',
                type: 'address',
            },
            {
                indexed: true,
                name: 'dst',
                type: 'address',
            },
            {
                indexed: false,
                name: 'wad',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'dst',
                type: 'address',
            },
            {
                indexed: false,
                name: 'wad',
                type: 'uint256',
            },
        ],
        name: 'Deposit',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'src',
                type: 'address',
            },
            {
                indexed: false,
                name: 'wad',
                type: 'uint256',
            },
        ],
        name: 'Withdrawal',
        type: 'event',
    },
];
