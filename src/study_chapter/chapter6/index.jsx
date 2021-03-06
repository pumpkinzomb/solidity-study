/* global BigInt */
import * as React from 'react';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import { sourceCode as getRouterCode } from './sols/Uni_v2_Router.sol';
import { sourceCode as getFactoryCode } from './sols/Uni_v2_Factory.sol';
import { sourceCode as getPairCode } from './sols/Uni_v2_Pair.sol';

import { Factory_CA, Router_CA, WETH_CA, ERC20_ABI, WETH_ABI } from './contract';
import getFactoryABI from '@/hardhat/artifacts/contracts/Uni_v2_Factory.sol/UniswapV2Factory.json';
import getPairABI from '@/hardhat/artifacts/contracts/Uni_v2_Pair.sol/UniswapV2Pair.json';
import getRouterABI from '@/hardhat/artifacts/contracts/Uni_v2_Router.sol/UniswapV2Router02.json';

export const StyledDialogContent = styled(DialogContent)(
    (props) => `
    & pre { margin: 0; }
  `,
);

const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'https://ropsten.infura.io/v3/a07cd96ad0bb435f9e750c8faa672052');

const Factory_ABI = getFactoryABI.abi;
const Pair_ABI = getPairABI.abi;
const Router_ABI = getRouterABI.abi;

let Uni_Router;
let Uni_Factory;

const UniswapV2 = (props) => {
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState(null);
    const [openSourceCode, setOpenSourceCode] = useState(false);
    const [openManageLiquidity, setOpenMangeLiquidity] = useState(false);
    const [myLiquidity, setMyLiquidity] = useState('0');
    const [selectedTab, setSelectedTab] = useState(0);
    const [removeLiquidity, setRemoveLiquidity] = useState('0');
    const [openSwapToken, setOpenSwapToken] = useState(false);
    const [selectedSwapTokenTab, setSelectedSwapTokenTab] = useState(0);
    const [aToBSlippage, setAtoBSlippage] = useState(0);
    const [swappedBTokenAmount, setSwappedBTokenAmount] = useState(0);
    const [bToASlippage, setBtoASlippage] = useState(0);
    const [swappedATokenAmount, setSwappedATokenAmount] = useState(0);
    const [sourceCode, setSourceCode] = useState({});
    const [codeType, setCodeType] = useState('router');
    const [poolList, setPoolList] = useState([]);
    const [selectedPool, setSelectedPool] = useState(null);
    const [aTokenAmount, setATokenAmount] = useState('0');
    const [bTokenAmount, setBTokenAmount] = useState('0');
    const [selectedMyATokenBalance, setSelectedMyATokenBalance] = useState('0');
    const [selectedMyBTokenBalance, setSelectedMyBTokenBalance] = useState('0');
    const [openCreatePool, setOpenCreatePool] = useState(false);
    const [createAtokenAddress, setCreateAtokenAddress] = useState('');
    const [createBtokenAddress, setCreateBtokenAddress] = useState('');
    const [createAtokenSymbol, setCreateAtokenSymbol] = useState('None');
    const [createBtokenSymbol, setCreateBtokenSymbol] = useState('None');
    const [createAtokenAmount, setCreateAtokenAmount] = useState('0');
    const [createAtokenMaxAmount, setCreateAtokenMaxAmount] = useState('0');
    const [createBtokenAmount, setCreateBtokenAmount] = useState('0');
    const [createBtokenMaxAmount, setCreateBtokenMaxAmount] = useState('0');
    const [openETHSwapToken, setOpenETHSwapToken] = useState(false);
    const [ethAmount, setETHAmount] = useState('0');
    const [wethAmount, setWETHAmount] = useState('0');

    useEffect(() => {
        getAccounts();
        getSourceCode();
    }, []);

    const getSourceCode = async () => {
        const newCodes = {};
        await Promise.all(
            ['router', 'factory', 'pair'].map(async (item) => {
                const code =
                    item === 'router'
                        ? getRouterCode
                        : item === 'factory'
                        ? getFactoryCode
                        : item === 'pair'
                        ? getPairCode
                        : '';
                // const response = await axios(code);
                // console.log('??', response.data);
                newCodes[`${item}`] = code;
            }),
        );
        setSourceCode(newCodes);
    };

    const getTokenBalance = async (account, tokenAddress) => {
        const TokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
        try {
            const balance = await TokenContract.methods.balanceOf(account).call();
            return Web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.log('error: ', error);
            return 0;
        }
    };

    const getOwnLiquidity = (_account, pairAddress) => {
        const getAccount = _account || account;
        return new Promise(async (resolve, reject) => {
            try {
                const myLiquidity = await getTokenBalance(getAccount, pairAddress);
                console.log('myLiquidity', myLiquidity);
                setMyLiquidity(myLiquidity);
                resolve(myLiquidity);
                // console.log('check', poolLiquidity);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    };

    const getAllTokenBalance = async (_account, aTokenAddress, bTokenAddress) => {
        const getAccount = _account || account;
        await Promise.all(
            [aTokenAddress, bTokenAddress].map(async (item) => {
                let balance = await getTokenBalance(getAccount, item);
                balance = String(Number(balance).toFixed(2));
                if (item === aTokenAddress) {
                    setSelectedMyATokenBalance(balance);
                } else if (bTokenAddress) {
                    setSelectedMyBTokenBalance(balance);
                }
                return item;
            }),
        );
    };

    const getAccounts = async () => {
        try {
            // await window.ethereum.enable();
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const _account = await web3.eth.getAccounts();
            // console.log('check', _account);

            Uni_Factory = new web3.eth.Contract(Factory_ABI, Factory_CA);
            Uni_Router = new web3.eth.Contract(Router_ABI, Router_CA);

            // Contract = new web3.eth.Contract(ABI, CA);
            setAccount(_account[0]);
            getAllpools(_account[0]);
            // const TokenContract = new web3.eth.Contract(ERC20_ABI, '0x847Df48E6583430d22e0da425761aF1aCc8107c7');
            // let checkAllow = await TokenContract.methods.allowance(_account[0], Router_CA).call();
            // console.log('checkAllow', checkAllow);
            // await TokenContract.methods
            //     .approve(Router_CA, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
            //     .send({
            //         from: _account[0],
            //     });
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const getAllpools = async (_account) => {
        setLoading(true);
        try {
            const poolLength = await Uni_Factory.methods.allPairsLength().call();

            const pairArray = await Promise.all(
                [...Array(Number(poolLength)).keys()].map(async (item) => {
                    const address = await Uni_Factory.methods.allPairs(item).call();
                    return address;
                }),
            );
            let dividePair = await Promise.all(
                pairArray.map(async (item) => {
                    let Contract = new web3.eth.Contract(Pair_ABI, item);
                    const tokenA = await Contract.methods.token0().call();
                    const tokenB = await Contract.methods.token1().call();
                    Contract = new web3.eth.Contract(ERC20_ABI, tokenA);
                    const tokenA_symbol = await Contract.methods.symbol().call();
                    Contract = new web3.eth.Contract(ERC20_ABI, tokenB);
                    const tokenB_symbol = await Contract.methods.symbol().call();
                    const { _reserve0, _reserve1 } = await Uni_Router.methods.getReserves(tokenA, tokenB).call();
                    Contract = new web3.eth.Contract(ERC20_ABI, item);
                    const liquidity = await Contract.methods.balanceOf(_account || account).call();
                    return {
                        pair: item,
                        tokenA: {
                            address: tokenA,
                            symbol: tokenA_symbol,
                            reserve: _reserve0,
                        },
                        tokenB: {
                            address: tokenB,
                            symbol: tokenB_symbol,
                            reserve: _reserve1,
                        },
                        liquidity,
                    };
                }),
            );
            setPoolList(dividePair);
            console.log('poolList', dividePair);
            setLoading(false);
        } catch (error) {
            console.log('error: ', error);
            setLoading(false);
        }
    };

    const handleSourceCodeOpen = (type) => {
        setCodeType(type);
        setOpenSourceCode(true);
    };

    const handleSourceCodeClose = () => {
        setCodeType('router');
        setOpenSourceCode(false);
    };

    const handleLiquidityOpen = async (pool) => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setSelectedTab(0);
        getOwnLiquidity(account, pool.pair);
        setSelectedPool(pool);
        getAllTokenBalance(account, pool.tokenA.address, pool.tokenB.address);
        setOpenMangeLiquidity(true);
    };

    const handleLiquidityClose = () => {
        initLiquidity();
        setOpenMangeLiquidity(false);
        setSelectedPool(null);
    };

    const initLiquidity = () => {
        setATokenAmount('0');
        setBTokenAmount('0');
        setRemoveLiquidity('0');
    };

    const handleATokenChange = (event) => {
        let amount = event.target.value;
        if (amount.includes('.') && amount.length > 2) {
            if (!isNaN(Number(amount))) {
                amount = Number(amount);
                if (amount > Number(selectedPool.tokenA.balance)) {
                    amount = selectedPool.tokenA.balance;
                }
                amountBTokenCalcRatio(amount);
            } else {
                setATokenAmount('0');
            }
        } else {
            if (!isNaN(Number(amount))) {
                amountBTokenCalcRatio(amount);
            } else {
                setATokenAmount(amount);
            }
        }
    };

    const handleASliderChange = (event, newValue) => {
        amountBTokenCalcRatio(newValue);
    };

    const amountBTokenCalcRatio = (aAmount) => {
        let calc = aAmount * (Number(selectedPool.tokenB.reserve) / Number(selectedPool.tokenA.reserve));
        if (calc > Number(selectedMyBTokenBalance)) {
            aAmount =
                Number(selectedMyBTokenBalance) *
                (Number(selectedPool.tokenA.reserve) / Number(selectedPool.tokenB.reserve));
            calc = Number(selectedMyBTokenBalance);
        }
        // console.log('check', calc, pAmount);
        setBTokenAmount(String(calc.toFixed(2)));
        setATokenAmount(String(aAmount));
    };

    const amountATokenCalcRatio = (bAmount) => {
        let calc = bAmount * (Number(selectedPool.tokenA.reserve) / Number(selectedPool.tokenB.reserve));
        if (calc > Number(selectedMyATokenBalance)) {
            bAmount =
                Number(selectedMyATokenBalance) *
                (Number(selectedPool.tokenB.reserve) / Number(selectedPool.tokenA.reserve));
            calc = Number(selectedMyATokenBalance);
        }
        setATokenAmount(String(calc.toFixed(2)));
        setBTokenAmount(String(bAmount));
    };

    const handleBTokenChange = (event) => {
        let amount = event.target.value;
        if (amount.includes('.') && amount.length > 2) {
            if (!isNaN(Number(amount))) {
                amount = Number(amount);
                if (amount > Number(selectedMyBTokenBalance)) {
                    amount = selectedMyBTokenBalance;
                }
                amountATokenCalcRatio(amount);
            } else {
                setBTokenAmount('0');
            }
        } else {
            if (!isNaN(Number(amount))) {
                amountATokenCalcRatio(amount);
            } else {
                setBTokenAmount(amount);
            }
        }
    };

    const handleBSliderChange = (event, newValue) => {
        amountATokenCalcRatio(newValue);
    };

    const handleAddLiquiditySubmit = async () => {
        setLoading(true);
        try {
            let TokenContract = new web3.eth.Contract(ERC20_ABI, selectedPool.tokenA.address);
            let checkAtoken = await TokenContract.methods.allowance(account, Router_CA).call();
            // console.log('checkAtoken', Web3.utils.fromWei(checkAtoken, 'ether'));
            if (Number(checkAtoken) < 1) {
                await TokenContract.methods
                    .approve(Router_CA, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                    .send({
                        from: account,
                    });
                // throw 'token A not allowed';
            }
            TokenContract = new web3.eth.Contract(ERC20_ABI, selectedPool.tokenB.address);
            let checkBtoken = await TokenContract.methods.allowance(account, Router_CA).call();
            if (Number(checkBtoken) < 1) {
                await TokenContract.methods
                    .approve(Router_CA, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                    .send({
                        from: account,
                    });
                // throw 'token B not allowed';
            }
            // console.log('checkBtoken', Web3.utils.fromWei(checkBtoken, 'ether'));
            const aToken = Web3.utils.toWei(aTokenAmount, 'ether');
            const bToken = Web3.utils.toWei(bTokenAmount, 'ether');
            await Uni_Router.methods
                .addLiquidity(
                    selectedPool.tokenA.address,
                    selectedPool.tokenB.address,
                    aToken,
                    bToken,
                    '10000000000000000',
                    '10000000000000000',
                    account,
                )
                .send({ from: account });
            getAllpools(account);
            setLoading(false);
            handleLiquidityClose();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleTabSelect = (event, newValue) => {
        setSelectedTab(newValue);
        initLiquidity();
    };

    const handleRemoveLiquidity = (event, newValue) => {
        setRemoveLiquidity(String(newValue));
    };

    const handleRemoveLiquiditySubmit = async () => {
        setLoading(true);
        try {
            // let liquidity = Web3.utils.toWei(removeLiquidity, 'ether');
            let liquidity = removeLiquidity;
            if (Number(liquidity) > Number(myLiquidity)) {
                liquidity = myLiquidity;
            }
            // console.log(removeLiquidity, myLiquidity);
            liquidity = Web3.utils.toWei(liquidity, 'ether');
            console.log('liquidity', liquidity);
            const TokenContract = new web3.eth.Contract(ERC20_ABI, selectedPool.pair);
            let checkLiquidityToken = await TokenContract.methods.allowance(account, Router_CA).call();
            // console.log('checkAtoken', Web3.utils.fromWei(checkAtoken, 'ether'));
            if (Number(checkLiquidityToken) < 1) {
                await TokenContract.methods
                    .approve(Router_CA, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                    .send({
                        from: account,
                    });
                // throw 'Liquidity Token not allowed.';
            }
            await Uni_Router.methods
                .removeLiquidity(
                    selectedPool.tokenA.address,
                    selectedPool.tokenB.address,
                    liquidity,
                    '10000000000000000',
                    '10000000000000000',
                    account,
                )
                .send({ from: account });
            getAllpools(account);
            setLoading(false);
            handleLiquidityClose();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleOpenSwapToken = async (pool) => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setSelectedSwapTokenTab(0);
        getOwnLiquidity(account, pool.pair);
        setSelectedPool(pool);
        getAllTokenBalance(account, pool.tokenA.address, pool.tokenB.address);
        setOpenSwapToken(true);
    };

    const handleCloseSwapToken = () => {
        setOpenSwapToken(false);
        setATokenAmount('0');
        setBTokenAmount('0');
        setAtoBSlippage(0);
        setBtoASlippage(0);
        setSwappedATokenAmount(0);
        setSwappedBTokenAmount(0);
        setSelectedPool(null);
    };

    const handleSwapASliderChange = (event, newValue) => {
        const x = Number(Web3.utils.fromWei(selectedPool.tokenA.reserve, 'ether'));
        const y = Number(Web3.utils.fromWei(selectedPool.tokenB.reserve, 'ether'));
        const z = newValue;
        const slippage = calcSlippage(x, y, x * y, z);
        // console.log('slippage', slippage);
        setAtoBSlippage(slippage.toFixed(2));
        setATokenAmount(String(newValue));
        setSwappedBTokenAmount(y - (x * y) / (x + z));
    };
    const handleSwapATokenChange = (event) => {
        let amount = event.target.value;
        if (amount.includes('.') && amount.length > 2) {
            if (!isNaN(Number(amount))) {
                amount = Number(amount);
                if (amount > Number(selectedMyATokenBalance)) {
                    amount = selectedMyATokenBalance;
                }
                setATokenAmount(String(amount));
            } else {
                setATokenAmount('0');
            }
        } else {
            if (!isNaN(Number(amount))) {
                if (Number(amount) > Number(selectedMyATokenBalance)) {
                    amount = selectedMyATokenBalance;
                }
                setATokenAmount(amount);
            } else {
                setATokenAmount(amount);
            }
        }
        const x = Number(Web3.utils.fromWei(selectedPool.tokenA.reserve, 'ether'));
        const y = Number(Web3.utils.fromWei(selectedPool.tokenB.reserve, 'ether'));
        const z = Number(amount);
        const slippage = calcSlippage(x, y, x * y, z);
        setAtoBSlippage(slippage.toFixed(2));
        setSwappedBTokenAmount(y - (x * y) / (x + z));
    };

    const handleSwapBSliderChange = (event, newValue) => {
        const x = Number(Web3.utils.fromWei(selectedPool.tokenB.reserve, 'ether'));
        const y = Number(Web3.utils.fromWei(selectedPool.tokenA.reserve, 'ether'));
        const z = newValue;
        const slippage = calcSlippage(x, y, x * y, z);
        setBtoASlippage(slippage.toFixed(2));
        setBTokenAmount(String(newValue));
        setSwappedATokenAmount(y - (x * y) / (x + z));
    };

    const handleSwapBTokenChange = (event) => {
        let amount = event.target.value;
        if (amount.includes('.') && amount.length > 2) {
            if (!isNaN(Number(amount))) {
                amount = Number(amount);
                if (amount > Number(selectedMyBTokenBalance)) {
                    amount = selectedMyBTokenBalance;
                }
                setBTokenAmount(String(amount));
            } else {
                setBTokenAmount('0');
            }
        } else {
            if (!isNaN(Number(amount))) {
                if (Number(amount) > Number(selectedMyBTokenBalance)) {
                    amount = selectedMyBTokenBalance;
                }
                setBTokenAmount(amount);
            } else {
                setBTokenAmount(amount);
            }
        }
        const x = Number(Web3.utils.fromWei(selectedPool.tokenB.reserve, 'ether'));
        const y = Number(Web3.utils.fromWei(selectedPool.tokenA.reserve, 'ether'));
        const z = Number(amount);
        const slippage = calcSlippage(x, y, x * y, z);
        setBtoASlippage(slippage.toFixed(2));
        setSwappedATokenAmount(y - (x * y) / (x + z));
    };

    const calcSlippage = (x, y, k, z) => {
        if (z === 0) {
            return 0;
        }
        // let calc = Math.abs(z / (y - (k / (x + z)) * (x / y)) - 1).toFixed(2);
        let step1 = y / x; // A:B ?????? ????????? ????????? ?????? ??????????????????
        let step2 = y - k / (x + z); // ??????????????? ????????? B?????? ??????
        let step3 = z * step1; // ?????????????????????
        // console.log('step1', step1);
        // console.log('step2', step2);
        // console.log('step3', step3);
        let calc = (step3 / step2) * 100 - 100;
        return calc;
    };

    const handleSwapTokenSubmit = async () => {
        setLoading(true);
        try {
            if (selectedSwapTokenTab === 0) {
                let TokenContract = new web3.eth.Contract(ERC20_ABI, selectedPool.tokenA.address);
                let checkAtoken = await TokenContract.methods.allowance(account, Router_CA).call();
                console.log('checkAtoken', Web3.utils.fromWei(checkAtoken, 'ether'));
                if (Number(checkAtoken) < 1) {
                    await TokenContract.methods
                        .approve(Router_CA, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                        .send({
                            from: account,
                        });
                    // throw 'token A not allowed';
                }
                const aToken = Web3.utils.toWei(aTokenAmount, 'ether');
                console.log(
                    'swap',
                    aToken,
                    aToken,
                    [selectedPool.tokenA.address, selectedPool.tokenB.address],
                    account,
                );
                await Uni_Router.methods
                    .swapExactTokensForTokens(
                        aToken,
                        aToken,
                        [selectedPool.tokenA.address, selectedPool.tokenB.address],
                        account,
                    )
                    .send({ from: account });
            } else if (selectedSwapTokenTab === 1) {
                let TokenContract = new web3.eth.Contract(ERC20_ABI, selectedPool.tokenB.address);
                let checkBtoken = await TokenContract.methods.allowance(account, Router_CA).call();
                console.log('checkBtoken', Web3.utils.fromWei(checkBtoken, 'ether'));
                if (Number(checkBtoken) < 1) {
                    await TokenContract.methods
                        .approve(Router_CA, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                        .send({
                            from: account,
                        });
                    // throw 'token B not allowed';
                }
                const bToken = Web3.utils.toWei(bTokenAmount, 'ether');
                console.log(
                    'swap',
                    bToken,
                    bToken,
                    [selectedPool.tokenB.address, selectedPool.tokenA.address],
                    account,
                );
                await Uni_Router.methods
                    .swapExactTokensForTokens(
                        bToken,
                        bToken,
                        [selectedPool.tokenB.address, selectedPool.tokenA.address],
                        account,
                    )
                    .send({ from: account });
                // const bToken = Web3.utils.toWei(bTokenAmount, 'ether');
                // await Contract.methods.swapBtoA(bToken).send({ from: account });
            }
            setLoading(false);
            getAllpools(account);
            handleCloseSwapToken();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleSwapTokenTabSelect = (event, newValue) => {
        setATokenAmount('0');
        setBTokenAmount('0');
        setAtoBSlippage(0);
        setBtoASlippage(0);
        setSwappedATokenAmount(0);
        setSwappedBTokenAmount(0);
        setSelectedSwapTokenTab(newValue);
    };

    const handleOpenCreatePool = async () => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setOpenCreatePool(true);
    };

    const handleCloseCreatePool = () => {
        setOpenCreatePool(false);
        setCreateAtokenSymbol('None');
        setCreateBtokenSymbol('None');
        setCreateAtokenAddress('');
        setCreateBtokenAddress('');
        setCreateAtokenAmount('0');
        setCreateBtokenAmount('0');
        setCreateAtokenMaxAmount('0');
        setCreateBtokenMaxAmount('0');
    };

    const handleCreatePoolSubmit = async () => {
        setLoading(true);
        try {
            let TokenContract = new web3.eth.Contract(ERC20_ABI, createAtokenAddress);
            let checkAtoken = await TokenContract.methods.allowance(account, Router_CA).call();
            // console.log('checkAtoken', Web3.utils.fromWei(checkAtoken, 'ether'));
            if (Number(checkAtoken) < 1) {
                await TokenContract.methods
                    .approve(Router_CA, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                    .send({
                        from: account,
                    });
                // throw 'token A not allowed';
            }
            TokenContract = new web3.eth.Contract(ERC20_ABI, createBtokenAddress);
            let checkBtoken = await TokenContract.methods.allowance(account, Router_CA).call();
            if (Number(checkBtoken) < 1) {
                await TokenContract.methods
                    .approve(Router_CA, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                    .send({
                        from: account,
                    });
                // throw 'token B not allowed';
            }
            await Uni_Router.methods
                .addLiquidity(
                    createAtokenAddress,
                    createBtokenAddress,
                    Web3.utils.toWei(createAtokenAmount, 'ether'),
                    Web3.utils.toWei(createBtokenAmount, 'ether'),
                    '10000000000000000',
                    '10000000000000000',
                    account,
                )
                .send({ from: account });
            setLoading(false);
            getAllpools(account);
            handleCloseCreatePool();
        } catch (error) {
            setLoading(false);
            console.log('error: ', error);
        }
    };

    const handleCreateAtokenAddressChange = async (event) => {
        const inputValue = event.target.value;
        setCreateAtokenAddress(inputValue);
        if (web3.utils.isAddress(inputValue)) {
            const TokenContract = new web3.eth.Contract(ERC20_ABI, inputValue);
            const getSymbol = await TokenContract.methods.symbol().call();
            const maxAmount = await TokenContract.methods.balanceOf(account).call();
            setCreateAtokenSymbol(getSymbol);
            setCreateAtokenMaxAmount(Web3.utils.fromWei(maxAmount, 'ether'));
        } else {
            setCreateAtokenSymbol('None');
        }
    };

    const handleCreateBtokenAddressChange = async (event) => {
        const inputValue = event.target.value;
        setCreateBtokenAddress(inputValue);
        if (web3.utils.isAddress(inputValue)) {
            const TokenContract = new web3.eth.Contract(ERC20_ABI, inputValue);
            const getSymbol = await TokenContract.methods.symbol().call();
            const maxBmount = await TokenContract.methods.balanceOf(account).call();
            setCreateBtokenSymbol(getSymbol);
            setCreateBtokenMaxAmount(Web3.utils.fromWei(maxBmount, 'ether'));
        } else {
            setCreateBtokenSymbol('None');
            setCreateBtokenMaxAmount('0');
        }
    };

    const handleCreateAtokenAmountChange = (event, newValue) => {
        setCreateAtokenAmount(String(newValue));
    };

    const handleCreateBtokenAmountChange = (event, newValue) => {
        setCreateBtokenAmount(String(newValue));
    };

    const handleOpenETHSwapToken = async (event) => {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setSelectedSwapTokenTab(0);
        setOpenETHSwapToken(true);
        let balance = await web3.eth.getBalance(account);
        balance = Web3.utils.fromWei(balance, 'ether');
        balance = String(Number(balance).toFixed(2));
        console.log('my eth: ', balance);
        setSelectedMyATokenBalance(balance);
        balance = await getTokenBalance(account, WETH_CA);
        balance = String(Number(balance).toFixed(2));
        console.log('my weth: ', balance);
        setSelectedMyBTokenBalance(balance);
    };

    const handleCloseETHSwapToken = () => {
        setOpenETHSwapToken(false);
        setETHAmount('0');
        setWETHAmount('0');
        setAtoBSlippage(0);
        setBtoASlippage(0);
        setSelectedMyATokenBalance('0');
        setSelectedMyBTokenBalance('0');
    };

    const handleSwapETHSliderChange = (event, newValue) => {
        setETHAmount(String(newValue));
    };

    const handleSwapWETHSliderChange = (event, newValue) => {
        setWETHAmount(String(newValue));
    };

    const handleSwapETHtokenSubmit = async () => {
        setLoading(true);
        const TokenContract = new web3.eth.Contract(WETH_ABI, WETH_CA);
        let checkWETHtoken = await TokenContract.methods.allowance(account, Router_CA).call();
        console.log('checkWETH allowed: ', Web3.utils.fromWei(checkWETHtoken, 'ether'));
        if (Number(checkWETHtoken) < 1) {
            await TokenContract.methods
                .approve(Router_CA, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                .send({
                    from: account,
                });
            // throw 'token B not allowed';
        }
        try {
            if (selectedSwapTokenTab === 0) {
                const _ethAmount = Web3.utils.toWei(ethAmount, 'ether');
                console.log('checkETHAmount:', _ethAmount);
                await TokenContract.methods.deposit().send({ from: account, value: _ethAmount });
            } else if (selectedSwapTokenTab === 1) {
                const _wethAmount = Web3.utils.toWei(wethAmount, 'ether');
                console.log('checkWETHAmount:', _wethAmount);
                await TokenContract.methods.withdraw(_wethAmount).send({ from: account });
            }
            setLoading(false);
            getAllpools(account);
            handleCloseETHSwapToken();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <Box p={2}>
            <Stack direction="row" sx={{ paddingBottom: 2 }} alignItems={'center'}>
                <Typography variant="h4">Uniswap v2</Typography>
                <Button
                    variant="outlined"
                    onClick={() => handleSourceCodeOpen('router')}
                    sx={{ textTransform: 'none', marginLeft: 2 }}
                >
                    Open UniswapV2Router.sol
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => handleSourceCodeOpen('factory')}
                    sx={{ textTransform: 'none', marginLeft: 2 }}
                >
                    Open UniswapV2Factory.sol
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => handleSourceCodeOpen('pair')}
                    sx={{ textTransform: 'none', marginLeft: 2 }}
                >
                    Open UniswapV2Pair.sol
                </Button>
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }}>
                <Box sx={{ marginLeft: 2 }}>{loading && 'Loading...'}</Box>
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }} spacing={1}>
                <LoadingButton variant="contained" onClick={() => handleOpenCreatePool()} loading={loading}>
                    Setting Pool
                </LoadingButton>
                {loading && <CircularProgress />}
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }} spacing={2} alignItems={'center'}>
                <Typography variant="h6" alignItems={'center'}>
                    Pool #0 :
                </Typography>
                <Stack direction="row" spacing={2} alignItems={'center'} sx={{ paddingRight: 2 }}>
                    ETH
                </Stack>
                {' / '}
                <Stack direction="row" spacing={2} alignItems={'center'} sx={{ marginRight: 2 }}>
                    WETH
                    <CopyToClipboard text={WETH_CA}>
                        <Tooltip title={WETH_CA}>
                            <IconButton aria-label={`Copy WETH Address.`}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </CopyToClipboard>
                </Stack>
                <Button
                    variant="contained"
                    onClick={() => handleOpenETHSwapToken()}
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                >
                    Swap Token
                </Button>
            </Stack>
            {poolList.map((item, index) => {
                return (
                    <Box key={index} sx={{ paddingTop: `2rem` }}>
                        <Stack direction="row" sx={{ paddingBottom: 2 }} spacing={2} alignItems={'center'}>
                            <Typography variant="h6" alignItems={'center'}>
                                Pool #{index + 1} :
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems={'center'}>
                                {item.tokenA.symbol}
                                <CopyToClipboard text={item.tokenA.address}>
                                    <Tooltip title={item.tokenA.address}>
                                        <IconButton aria-label={`Copy ${item.tokenA.symbol} Token Address.`}>
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </CopyToClipboard>
                            </Stack>
                            {' / '}
                            <Stack direction="row" spacing={2} alignItems={'center'} sx={{ marginRight: 2 }}>
                                {item.tokenB.symbol}
                                <CopyToClipboard text={item.tokenB.address}>
                                    <Tooltip title={item.tokenB.address}>
                                        <IconButton aria-label={`Copy ${item.tokenB.symbol} Token Address.`}>
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </CopyToClipboard>
                            </Stack>
                            <Button
                                variant="contained"
                                onClick={() => handleLiquidityOpen(item)}
                                sx={{ textTransform: 'none' }}
                                disabled={loading}
                            >
                                Add / Remove Liquidity
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => handleOpenSwapToken(item)}
                                disabled={loading}
                                sx={{ textTransform: 'none' }}
                            >
                                Swap Token
                            </Button>
                        </Stack>
                        <Stack direction="row" sx={{ paddingBottom: 2 }} spacing={5}>
                            <Stack direction="column">
                                <Typography variant="body1" color={'#757575'}>
                                    My Liquidity
                                </Typography>
                                <Typography variant="h3">
                                    {Number(Web3.utils.fromWei(item.liquidity, 'ether')).toFixed(3)}
                                </Typography>
                            </Stack>
                            <Stack direction="column">
                                <Typography variant="body1" color={'#757575'}>
                                    Total Bonded
                                </Typography>
                                <Typography variant="h6">{`${Number(
                                    Web3.utils.fromWei(item.tokenA.reserve, 'ether'),
                                ).toFixed(3)} (${item.tokenA.symbol}) / ${Number(
                                    Web3.utils.fromWei(item.tokenB.reserve, 'ether'),
                                ).toFixed(3)} (${item.tokenB.symbol})`}</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                );
            })}

            <Dialog open={openSourceCode} onClose={handleSourceCodeClose} maxWidth={'xl'} fullWidth={true}>
                <DialogTitle>
                    Source Code (
                    {codeType === 'router'
                        ? 'UniswapV2Router.sol'
                        : codeType === 'factory'
                        ? 'UniswapV2Factory.sol'
                        : codeType === 'pair'
                        ? 'UniswapV2Pair.sol'
                        : ''}
                    )
                </DialogTitle>
                <StyledDialogContent sx={{ padding: 0 }}>
                    <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers={true}>
                        {sourceCode[codeType]}
                    </SyntaxHighlighter>
                </StyledDialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant="contained" onClick={handleSourceCodeClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openManageLiquidity}
                onClose={() => {
                    !loading && handleLiquidityClose();
                }}
                sx={{ paddingBottom: 0 }}
            >
                <DialogTitle>Manage Liquidity</DialogTitle>
                <DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={selectedTab} onChange={handleTabSelect} aria-label="basic tabs example">
                            <Tab label="Add Liquidity" />
                            <Tab label="Remove Liquidity" />
                        </Tabs>
                    </Box>
                    {selectedTab === 0 ? (
                        <React.Fragment>
                            <Stack direction="row" sx={{ marginTop: 2 }} alignItems={'center'}>
                                <Typography variant="body2" sx={{ marginRight: 2, minWidth: '60px' }}>
                                    {selectedPool?.tokenA?.symbol || '-'}:
                                </Typography>
                                <Slider
                                    aria-label={selectedPool?.tokenA?.symbol || '-'}
                                    value={Number(aTokenAmount)}
                                    valueLabelDisplay="auto"
                                    onChange={handleASliderChange}
                                    step={0.1}
                                    max={Number(selectedMyATokenBalance || '0')}
                                    disabled={loading}
                                />
                            </Stack>
                            <TextField
                                id="standard-basic"
                                variant="standard"
                                sx={{ minWidth: '450px' }}
                                value={aTokenAmount}
                                onChange={handleATokenChange}
                            />
                            <Stack direction="row" alignItems={'center'} sx={{ paddingTop: 2 }}>
                                <Typography variant="body2" sx={{ marginRight: 2, minWidth: '60px' }}>
                                    {selectedPool?.tokenB?.symbol || '-'}:
                                </Typography>
                                <Slider
                                    aria-label={selectedPool?.tokenB?.symbol || '-'}
                                    value={Number(bTokenAmount)}
                                    valueLabelDisplay="auto"
                                    onChange={handleBSliderChange}
                                    step={0.1}
                                    max={Number(selectedMyBTokenBalance || '0')}
                                    disabled={loading}
                                />
                            </Stack>
                            <TextField
                                id="standard-basic"
                                variant="standard"
                                sx={{ minWidth: '450px' }}
                                value={bTokenAmount}
                                onChange={handleBTokenChange}
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Stack direction="row" sx={{ marginTop: 2 }} alignItems={'center'}>
                                <Slider
                                    aria-label="My Liquidity"
                                    value={Number(removeLiquidity)}
                                    valueLabelDisplay="auto"
                                    onChange={handleRemoveLiquidity}
                                    step={0.001}
                                    max={Number(Number(myLiquidity).toFixed(2))}
                                />{' '}
                            </Stack>
                            {isNaN(
                                ((Number(removeLiquidity) / Number(Number(myLiquidity).toFixed(2))) * 100).toFixed(2),
                            )
                                ? '0'
                                : ((Number(removeLiquidity) / Number(Number(myLiquidity).toFixed(2))) * 100).toFixed(2)}
                            %
                        </React.Fragment>
                    )}
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    {selectedTab === 0 ? (
                        <LoadingButton
                            variant="contained"
                            onClick={handleAddLiquiditySubmit}
                            loading={loading}
                            disabled={
                                aTokenAmount === '0' ||
                                bTokenAmount === '0' ||
                                isNaN(Number(aTokenAmount)) ||
                                isNaN(Number(bTokenAmount)) ||
                                aTokenAmount.length < 1 ||
                                bTokenAmount.length < 1
                            }
                        >
                            Add Liquidity
                        </LoadingButton>
                    ) : (
                        <LoadingButton
                            variant="contained"
                            onClick={handleRemoveLiquiditySubmit}
                            loading={loading}
                            disabled={removeLiquidity === '0'}
                        >
                            Remove Liquidity
                        </LoadingButton>
                    )}

                    <Button variant="contained" onClick={handleLiquidityClose} disabled={loading}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {selectedPool && (
                <Dialog
                    open={openSwapToken}
                    onClose={() => {
                        !loading && handleCloseSwapToken();
                    }}
                >
                    <DialogTitle>Swap Tokens</DialogTitle>
                    <DialogContent>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={selectedSwapTokenTab}
                                onChange={handleSwapTokenTabSelect}
                                aria-label="basic tabs example"
                            >
                                <Tab label={`${selectedPool.tokenA.symbol} to ${selectedPool.tokenB.symbol}`} />
                                <Tab label={`${selectedPool.tokenB.symbol} to ${selectedPool.tokenA.symbol}`} />
                            </Tabs>
                        </Box>
                        {selectedSwapTokenTab === 0 ? (
                            <React.Fragment>
                                <Stack direction="row" sx={{ marginTop: 4 }} alignItems={'center'}>
                                    <Typography variant="body2" sx={{ marginRight: 2, minWidth: '60px' }}>
                                        {selectedPool.tokenA.symbol}:
                                    </Typography>
                                    <Slider
                                        aria-label={selectedPool.tokenA.symbol}
                                        value={Number(aTokenAmount)}
                                        valueLabelDisplay="auto"
                                        onChange={handleSwapASliderChange}
                                        step={0.1}
                                        max={Number(selectedMyATokenBalance)}
                                        disabled={loading}
                                    />
                                </Stack>
                                <TextField
                                    id="standard-basic"
                                    variant="standard"
                                    sx={{ minWidth: '450px' }}
                                    value={aTokenAmount}
                                    onChange={handleSwapATokenChange}
                                    disabled={loading}
                                />
                                <Typography variant="body2" sx={{ marginTop: 2 }}>
                                    slippage: {aToBSlippage}%
                                </Typography>
                                <Typography variant="body2" sx={{ marginTop: 2 }}>
                                    ??????????????? {selectedPool.tokenB.symbol}?????? ??????: {swappedBTokenAmount}
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Stack direction="row" alignItems={'center'} sx={{ paddingTop: 2 }}>
                                    <Typography variant="body2" sx={{ marginRight: 2, minWidth: '60px' }}>
                                        {selectedPool.tokenB.symbol}:
                                    </Typography>
                                    <Slider
                                        aria-label={selectedPool.tokenB.symbol}
                                        value={Number(bTokenAmount)}
                                        valueLabelDisplay="auto"
                                        onChange={handleSwapBSliderChange}
                                        step={0.1}
                                        max={Number(selectedMyBTokenBalance)}
                                        disabled={loading}
                                    />
                                </Stack>
                                <TextField
                                    id="standard-basic"
                                    variant="standard"
                                    sx={{ minWidth: '450px' }}
                                    value={bTokenAmount}
                                    onChange={handleSwapBTokenChange}
                                    disabled={loading}
                                />
                                <Typography variant="body2" sx={{ marginTop: 2 }}>
                                    slippage: {bToASlippage}%
                                </Typography>
                                <Typography variant="body2" sx={{ marginTop: 2 }}>
                                    ??????????????? {selectedPool.tokenA.symbol}?????? ??????: {swappedATokenAmount}
                                </Typography>
                            </React.Fragment>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ padding: 2 }}>
                        <LoadingButton
                            variant="contained"
                            onClick={handleSwapTokenSubmit}
                            loading={loading}
                            disabled={
                                (selectedSwapTokenTab === 0 && Number(aTokenAmount) === 0) ||
                                (selectedSwapTokenTab === 1 && Number(bTokenAmount) === 0)
                            }
                        >
                            Swap Tokens
                        </LoadingButton>
                        <LoadingButton
                            variant="contained"
                            onClick={handleCloseSwapToken}
                            loading={loading}
                            disabled={loading}
                        >
                            Close
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            )}
            <Dialog
                open={openCreatePool}
                onClose={() => {
                    !loading && handleCloseCreatePool();
                }}
            >
                <DialogTitle>Create New Pool</DialogTitle>
                <DialogContent>
                    <Stack direction="row" sx={{ marginTop: 4 }} alignItems={'center'}>
                        <TextField
                            id="standard-basic"
                            variant="standard"
                            sx={{ minWidth: '450px' }}
                            value={createAtokenAddress}
                            onChange={handleCreateAtokenAddressChange}
                            disabled={loading}
                            error={createAtokenAddress !== '' && createAtokenAddress === createBtokenAddress}
                        />
                        <Typography variant="body2" sx={{ marginLeft: 2, minWidth: '60px' }}>
                            {createAtokenSymbol}
                        </Typography>
                    </Stack>
                    <Stack direction="row" sx={{ marginTop: 2 }} alignItems={'center'}>
                        <Slider
                            value={Number(createAtokenAmount)}
                            valueLabelDisplay="auto"
                            onChange={handleCreateAtokenAmountChange}
                            step={0.1}
                            max={Number(createAtokenMaxAmount)}
                            disabled={loading}
                        />
                        <Typography variant="body2" sx={{ marginLeft: 2, minWidth: '60px' }}>
                            {createAtokenAmount}
                        </Typography>
                    </Stack>
                    <Stack direction="row" sx={{ marginTop: 4 }} alignItems={'center'}>
                        <TextField
                            id="standard-basic"
                            variant="standard"
                            sx={{ minWidth: '450px' }}
                            value={createBtokenAddress}
                            onChange={handleCreateBtokenAddressChange}
                            disabled={loading}
                            error={createBtokenAddress !== '' && createAtokenAddress === createBtokenAddress}
                        />
                        <Typography variant="body2" sx={{ marginLeft: 2, minWidth: '60px' }}>
                            {createBtokenSymbol}
                        </Typography>
                    </Stack>
                    <Stack direction="row" sx={{ marginTop: 2 }} alignItems={'center'}>
                        <Slider
                            value={Number(createBtokenAmount)}
                            valueLabelDisplay="auto"
                            onChange={handleCreateBtokenAmountChange}
                            step={0.1}
                            max={Number(createBtokenMaxAmount)}
                            disabled={loading}
                        />
                        <Typography variant="body2" sx={{ marginLeft: 2, minWidth: '60px' }}>
                            {createBtokenAmount}
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <LoadingButton
                        variant="contained"
                        onClick={handleCreatePoolSubmit}
                        loading={loading}
                        disabled={
                            !web3.utils.isAddress(createAtokenAddress) ||
                            !web3.utils.isAddress(createBtokenAddress) ||
                            createAtokenAddress === createBtokenAddress ||
                            Number(createAtokenAmount) === 0 ||
                            Number(createBtokenAmount) === 0
                        }
                    >
                        Create New Pool
                    </LoadingButton>
                    <LoadingButton
                        variant="contained"
                        onClick={handleCloseCreatePool}
                        loading={loading}
                        disabled={loading}
                    >
                        Close
                    </LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openETHSwapToken}
                onClose={() => {
                    !loading && handleCloseETHSwapToken();
                }}
            >
                <DialogTitle>Swap Tokens</DialogTitle>
                <DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={selectedSwapTokenTab}
                            onChange={handleSwapTokenTabSelect}
                            aria-label="basic tabs example"
                        >
                            <Tab label={`ETH to WETH`} />
                            <Tab label={`WETH to ETH`} />
                        </Tabs>
                    </Box>
                    {selectedSwapTokenTab === 0 ? (
                        <React.Fragment>
                            <Stack direction="row" sx={{ marginTop: 4 }} alignItems={'center'}>
                                <Typography variant="body2" sx={{ marginRight: 2, minWidth: '60px' }}>
                                    ETH:
                                </Typography>
                                <Slider
                                    aria-label={'ETH'}
                                    value={Number(ethAmount)}
                                    valueLabelDisplay="auto"
                                    onChange={handleSwapETHSliderChange}
                                    step={0.1}
                                    max={Number(selectedMyATokenBalance)}
                                    disabled={loading}
                                />
                            </Stack>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Stack direction="row" alignItems={'center'} sx={{ paddingTop: 2 }}>
                                <Typography variant="body2" sx={{ marginRight: 2, minWidth: '60px' }}>
                                    WETH:
                                </Typography>
                                <Slider
                                    aria-label={'WETH'}
                                    value={Number(wethAmount)}
                                    valueLabelDisplay="auto"
                                    onChange={handleSwapWETHSliderChange}
                                    step={0.1}
                                    max={Number(selectedMyBTokenBalance)}
                                    disabled={loading}
                                />
                            </Stack>
                        </React.Fragment>
                    )}
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <LoadingButton
                        variant="contained"
                        onClick={handleSwapETHtokenSubmit}
                        loading={loading}
                        disabled={
                            (selectedSwapTokenTab === 0 && Number(ethAmount) === 0) ||
                            (selectedSwapTokenTab === 1 && Number(wethAmount) === 0)
                        }
                    >
                        Swap Tokens
                    </LoadingButton>
                    <LoadingButton
                        variant="contained"
                        onClick={handleCloseETHSwapToken}
                        loading={loading}
                        disabled={loading}
                    >
                        Close
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UniswapV2;
