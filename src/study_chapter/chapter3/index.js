/* global BigInt */
import * as React from 'react';
import { useEffect, useState } from 'react';
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
import useClipboard from 'react-use-clipboard';

import { ABI, CA } from './contract';
import { TOKEN_ABI } from '../chapter2/tokenContract';
import { sourceCode } from './SimpleSingleUniswap.sol';

export const StyledDialogContent = styled(DialogContent)(
    (props) => `
    & pre { margin: 0; }
  `,
);

const BigNumber = require('big-number');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'https://ropsten.infura.io/v3/a07cd96ad0bb435f9e750c8faa672052');

let Contract;
let TokenContract;
const P_TOKEN_A = '0x86e9370D10A4220e82Fd9F7D61E85c6322cf80C7';
const Z_TOKEN_A = '0x74d512263322194886B8471EC5C3494Ba7A947F2';
const SinglePool = (props) => {
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState(null);
    const [openSourceCode, setOpenSourceCode] = useState(false);
    const [openManageLiquidity, setOpenMangeLiquidity] = useState(false);
    const [pTokenAmount, setPTokenAmount] = useState('0');
    const [maxPToken, setMaxPToken] = useState('0');
    const [zTokenAmount, setZTokenAmount] = useState('0');
    const [maxZToken, setMaxZToken] = useState('0');
    const [poolPTokenAmount, setPoolPTokenAmount] = useState('0');
    const [poolZTokenAmount, setPoolZTokenAmount] = useState('0');
    const [poolLiquidity, setPoolLiquidity] = useState('0');
    const [myLiquidity, setMyLiquidity] = useState('0');
    const [selectedTab, setSelectedTab] = useState(0);
    const [removeLiquidity, setRemoveLiquidity] = useState('0');
    const [openSwapToken, setOpenSwapToken] = useState(false);
    const [selectedSwapTokenTab, setSelectedSwapTokenTab] = useState(0);
    const [pToZSlippage, setPtoZSlippage] = useState(0);
    const [swappedZTokenAmount, setSwappedZTokenAmount] = useState(0);
    const [zToPSlippage, setZtoPSlippage] = useState(0);
    const [swappedPTokenAmount, setSwappedPTokenAmount] = useState(0);
    const [pTokenAddressIsCopied, setPTokenCopied] = useClipboard(P_TOKEN_A);
    const [zTokenAddressIsCopied, setZTokenCopied] = useClipboard(Z_TOKEN_A);

    useEffect(() => {
        getAccounts();
    }, []);

    const getTokenBalance = async (tokenAddress, account) => {
        TokenContract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
        try {
            const balance = await TokenContract.methods.balanceOf(account).call();
            return Web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.log('error: ', error);
            return 0;
        }
    };

    const getPoolLiquidity = async () => {
        try {
            const poolLiquidity = await Contract.methods.getPoolInfo().call();
            // console.log('check', poolLiquidity);
            setPoolPTokenAmount(poolLiquidity[0]);
            setPoolZTokenAmount(poolLiquidity[1]);
            setPoolLiquidity(poolLiquidity[2]);
        } catch (error) {
            console.log(error);
        }
    };

    const getOwnLiquidity = async (_account) => {
        const getAccount = _account || account;
        try {
            const myLiquidity = await Contract.methods.getBalance(getAccount).call();
            setMyLiquidity(myLiquidity);
            // console.log('check', poolLiquidity);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllTokenBalance = async (_account) => {
        const getAccount = _account || account;
        await Promise.all(
            [P_TOKEN_A, Z_TOKEN_A].map(async (item) => {
                let balance = await getTokenBalance(item, getAccount);
                balance = String(Number(balance).toFixed(2));
                if (item === P_TOKEN_A) {
                    setMaxPToken(balance);
                } else if (Z_TOKEN_A) {
                    setMaxZToken(balance);
                }
                return item;
            }),
        );
    };

    const handleSetPool = async (tokenA, tokenB) => {
        setLoading(true);
        try {
            await Contract.methods.setPool(tokenA, tokenB).send({
                from: account,
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const getAccounts = async () => {
        try {
            // await window.ethereum.enable();
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const _account = await web3.eth.getAccounts();
            // console.log('check', _account);
            Contract = new web3.eth.Contract(ABI, CA);
            setAccount(_account[0]);
            getAllTokenBalance(_account[0]);
            getPoolLiquidity();
            getOwnLiquidity(_account[0]);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const handleSourceCodeOpen = () => {
        setOpenSourceCode(true);
    };

    const handleSourceCodeClose = () => {
        setOpenSourceCode(false);
    };

    const handleLiquidityOpen = () => {
        setSelectedTab(0);
        setOpenMangeLiquidity(true);
    };

    const handleLiquidityClose = () => {
        initLiquidity();
        setOpenMangeLiquidity(false);
    };

    const initLiquidity = () => {
        setPTokenAmount('0');
        setZTokenAmount('0');
        setRemoveLiquidity('0');
    };

    const handleApproveToken = async (tokenAddress) => {
        setLoading(true);
        TokenContract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
        try {
            await TokenContract.methods.approve(CA, '100000000000000000000').send({
                from: account,
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handlePTokenChange = (event) => {
        let amount = event.target.value;
        if (amount.includes('.') && amount.length > 2) {
            if (!isNaN(Number(amount))) {
                amount = Number(amount);
                if (amount > Number(maxPToken)) {
                    amount = maxPToken;
                }
                amountZTokenCalcRatio(amount);
            } else {
                setPTokenAmount('0');
            }
        } else {
            if (!isNaN(Number(amount))) {
                amountZTokenCalcRatio(amount);
            } else {
                setPTokenAmount(amount);
            }
        }
    };

    const handlePSliderChange = (event, newValue) => {
        amountZTokenCalcRatio(newValue);
    };

    const amountZTokenCalcRatio = (pAmount) => {
        if (Number(poolLiquidity) !== 0) {
            let calc = pAmount * (Number(poolZTokenAmount) / Number(poolPTokenAmount));
            if (calc > Number(maxZToken)) {
                pAmount = Number(maxZToken) * (Number(poolPTokenAmount) / Number(poolZTokenAmount));
                calc = Number(maxZToken);
            }
            // console.log('check', calc, pAmount);
            setZTokenAmount(String(calc.toFixed(2)));
            setPTokenAmount(String(pAmount));
        } else {
            setPTokenAmount(String(pAmount));
        }
    };

    const amountPTokenCalcRatio = (zAmount) => {
        if (Number(poolLiquidity) !== 0) {
            let calc = zAmount * (Number(poolPTokenAmount) / Number(poolZTokenAmount));
            if (calc > Number(maxPToken)) {
                zAmount = Number(maxPToken) * (Number(poolZTokenAmount) / Number(poolPTokenAmount));
                calc = Number(maxPToken);
            }
            setPTokenAmount(String(calc.toFixed(2)));
            setZTokenAmount(String(zAmount));
        } else {
            setZTokenAmount(String(zAmount));
        }
    };

    const handleZTokenChange = (event) => {
        let amount = event.target.value;
        if (amount.includes('.') && amount.length > 2) {
            if (!isNaN(Number(amount))) {
                amount = Number(amount);
                if (amount > Number(maxZToken)) {
                    amount = maxZToken;
                }
                amountPTokenCalcRatio(amount);
            } else {
                setZTokenAmount('0');
            }
        } else {
            if (!isNaN(Number(amount))) {
                amountPTokenCalcRatio(amount);
            } else {
                setZTokenAmount(amount);
            }
        }
    };

    const handleZSliderChange = (event, newValue) => {
        amountPTokenCalcRatio(newValue);
    };

    const handleAddLiquiditySubmit = async () => {
        setLoading(true);
        try {
            const pToken = Web3.utils.toWei(pTokenAmount, 'ether');
            const zToken = Web3.utils.toWei(zTokenAmount, 'ether');

            await Contract.methods.addLiquidity(pToken, zToken).send({ from: account });
            getPoolLiquidity();
            getOwnLiquidity();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        handleLiquidityClose();
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
            let liquidity = Web3.utils.toWei(removeLiquidity, 'ether');

            if (Number(liquidity) > Number(myLiquidity)) {
                liquidity = myLiquidity;
            }

            await Contract.methods.removeLiquidity(liquidity).send({ from: account });
            getPoolLiquidity();
            getOwnLiquidity();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        handleLiquidityClose();
    };

    const handleOpenSwapToken = () => {
        setOpenSwapToken(true);
    };

    const handleCloseSwapToken = () => {
        setOpenSwapToken(false);
        setPTokenAmount('0');
        setZTokenAmount('0');
        setZtoPSlippage(0);
        setPtoZSlippage(0);
        setSwappedZTokenAmount(0);
        setSwappedPTokenAmount(0);
        setSelectedSwapTokenTab(0);
    };

    const handleSwapPSliderChange = (event, newValue) => {
        if (Number(poolLiquidity) !== 0) {
            const x = Number(Web3.utils.fromWei(poolPTokenAmount, 'ether'));
            const y = Number(Web3.utils.fromWei(poolZTokenAmount, 'ether'));
            const z = newValue;
            const slippage = calcSlippage(x, y, x * y, z);
            // console.log('slippage', slippage);
            setPtoZSlippage(slippage.toFixed(2));
            setPTokenAmount(String(newValue));
            setSwappedZTokenAmount(y - (x * y) / (x + z));
        } else {
            setPTokenAmount('0');
        }
    };
    const handleSwapPTokenChange = (event) => {
        let amount = event.target.value;
        if (amount.includes('.') && amount.length > 2) {
            if (!isNaN(Number(amount))) {
                amount = Number(amount);
                if (amount > Number(maxPToken)) {
                    amount = maxPToken;
                }
                setPTokenAmount(amount);
            } else {
                setPTokenAmount('0');
            }
        } else {
            if (!isNaN(Number(amount))) {
                if (Number(amount) > Number(maxPToken)) {
                    amount = maxPToken;
                }
                setPTokenAmount(amount);
            } else {
                setPTokenAmount(amount);
            }
        }
        const x = Number(Web3.utils.fromWei(poolPTokenAmount, 'ether'));
        const y = Number(Web3.utils.fromWei(poolZTokenAmount, 'ether'));
        const z = Number(amount);
        const slippage = calcSlippage(x, y, x * y, z);
        setPtoZSlippage(slippage.toFixed(2));
        setSwappedZTokenAmount(y - (x * y) / (x + z));
    };

    const handleSwapZSliderChange = (event, newValue) => {
        if (Number(poolLiquidity) !== 0) {
            const x = Number(Web3.utils.fromWei(poolZTokenAmount, 'ether'));
            const y = Number(Web3.utils.fromWei(poolPTokenAmount, 'ether'));
            const z = newValue;
            const slippage = calcSlippage(x, y, x * y, z);
            setZtoPSlippage(slippage.toFixed(2));
            setZTokenAmount(String(newValue));
            setSwappedPTokenAmount(y - (x * y) / (x + z));
        } else {
            setZTokenAmount('0');
        }
    };

    const handleSwapZTokenChange = (event) => {
        let amount = event.target.value;
        if (amount.includes('.') && amount.length > 2) {
            if (!isNaN(Number(amount))) {
                amount = Number(amount);
                if (amount > Number(maxZToken)) {
                    amount = maxZToken;
                }
                setZTokenAmount(amount);
            } else {
                setZTokenAmount('0');
            }
        } else {
            if (!isNaN(Number(amount))) {
                if (Number(amount) > Number(maxZToken)) {
                    amount = maxZToken;
                }
                setZTokenAmount(amount);
            } else {
                setZTokenAmount(amount);
            }
        }
        const x = Number(Web3.utils.fromWei(poolZTokenAmount, 'ether'));
        const y = Number(Web3.utils.fromWei(poolPTokenAmount, 'ether'));
        const z = Number(amount);
        const slippage = calcSlippage(x, y, x * y, z);
        setZtoPSlippage(slippage.toFixed(2));
        setSwappedPTokenAmount(y - (x * y) / (x + z));
    };

    const calcSlippage = (x, y, k, z) => {
        if (z === 0) {
            return 0;
        }
        // let calc = Math.abs(z / (y - (k / (x + z)) * (x / y)) - 1).toFixed(2);
        let step1 = y / x; // A:B 초기 비율을 구하기 위한 토큰가중치비
        let step2 = y - k / (x + z); // 실질적으로 변환된 B토큰 갯수
        let step3 = z * step1; // 예측토큰변환치
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
                const pToken = Web3.utils.toWei(pTokenAmount, 'ether');
                await Contract.methods.swapAtoB(pToken).send({ from: account });
                // p to z
            } else if (selectedSwapTokenTab === 1) {
                const zToken = Web3.utils.toWei(zTokenAmount, 'ether');
                await Contract.methods.swapBtoA(zToken).send({ from: account });
                // z to p
            }
            setLoading(false);
            getPoolLiquidity();
            handleCloseSwapToken();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleSwapTokenTabSelect = (event, newValue) => {
        setPTokenAmount('0');
        setZTokenAmount('0');
        setZtoPSlippage(0);
        setPtoZSlippage(0);
        setSwappedZTokenAmount(0);
        setSwappedPTokenAmount(0);
        setSelectedSwapTokenTab(newValue);
    };

    return (
        <Box p={2}>
            <Stack direction="row" sx={{ paddingBottom: 2 }} alignItems={'center'}>
                <Typography variant="h4">Uniswap Single Pool</Typography>
                <Button variant="outlined" onClick={handleSourceCodeOpen} sx={{ textTransform: 'none', marginLeft: 2 }}>
                    Open SingleUniswap.sol
                </Button>
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }}>
                <Box sx={{ marginLeft: 2 }}>{loading && 'Loading...'}</Box>
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }} spacing={1}>
                <LoadingButton
                    variant="contained"
                    onClick={() => handleSetPool(P_TOKEN_A, Z_TOKEN_A)}
                    loading={loading}
                    disabled={true}
                >
                    Setting Pool (Already Set)
                </LoadingButton>
                <LoadingButton variant="contained" onClick={() => handleApproveToken(P_TOKEN_A)} loading={loading}>
                    Approve PMPKT1
                </LoadingButton>
                <LoadingButton variant="contained" onClick={() => handleApproveToken(Z_TOKEN_A)} loading={loading}>
                    Approve ZMBT1
                </LoadingButton>
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }} spacing={2} alignItems={'center'}>
                <Typography variant="h6" alignItems={'center'}>
                    Pool #1 :
                </Typography>
                <Stack direction="row" spacing={2} alignItems={'center'}>
                    PMPKT1
                    <IconButton aria-label="PMPKT1 Token Address Copy" onClick={setPTokenCopied}>
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Stack>
                {' / '}
                <Stack direction="row" spacing={2} alignItems={'center'} sx={{ marginRight: 2 }}>
                    ZMBT1
                    <IconButton aria-label="ZMBT1 Token Address Copy" onClick={setZTokenCopied}>
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Stack>

                <Button
                    variant="contained"
                    onClick={handleLiquidityOpen}
                    sx={{ textTransform: 'none' }}
                    disabled={loading}
                >
                    Add / Remove Liquidity
                </Button>
                <Button
                    variant="contained"
                    onClick={handleOpenSwapToken}
                    disabled={loading}
                    sx={{ textTransform: 'none' }}
                >
                    Swap Token
                </Button>
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }} spacing={5}>
                <Stack direction="column">
                    <Typography variant="body1" color={'#757575'}>
                        Pool Liquidity
                    </Typography>
                    <Typography variant="h3">
                        {Number(Web3.utils.fromWei(poolLiquidity, 'ether')).toFixed(3)}
                    </Typography>
                </Stack>
                <Stack direction="column">
                    <Typography variant="body1" color={'#757575'}>
                        My Liquidity
                    </Typography>
                    <Typography variant="h3">{Number(Web3.utils.fromWei(myLiquidity, 'ether')).toFixed(3)}</Typography>
                </Stack>
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }} spacing={5}>
                <Stack direction="column">
                    <Typography variant="body1" color={'#757575'}>
                        Total Bonded
                    </Typography>
                    <Typography variant="h6">{`${Number(Web3.utils.fromWei(poolPTokenAmount, 'ether')).toFixed(
                        3,
                    )} (PMPKT1) / ${Number(Web3.utils.fromWei(poolZTokenAmount, 'ether')).toFixed(
                        3,
                    )} (ZMBT1)`}</Typography>
                </Stack>
            </Stack>
            <Dialog open={openSourceCode} onClose={handleSourceCodeClose} maxWidth={'xl'} fullWidth={true}>
                <DialogTitle>Source Code (SingleUniswap.sol)</DialogTitle>
                <StyledDialogContent sx={{ padding: 0 }}>
                    <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers={true}>
                        {sourceCode}
                    </SyntaxHighlighter>
                </StyledDialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant="contained" onClick={handleSourceCodeClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openManageLiquidity} onClose={handleLiquidityClose} sx={{ paddingBottom: 0 }}>
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
                                    PMPKT1:
                                </Typography>
                                <Slider
                                    aria-label="PMPKT1"
                                    value={Number(pTokenAmount)}
                                    valueLabelDisplay="auto"
                                    onChange={handlePSliderChange}
                                    step={0.1}
                                    max={Number(maxPToken)}
                                    disabled={loading}
                                />
                            </Stack>
                            <TextField
                                id="standard-basic"
                                variant="standard"
                                sx={{ minWidth: '450px' }}
                                value={pTokenAmount}
                                onChange={handlePTokenChange}
                            />
                            <Stack direction="row" alignItems={'center'} sx={{ paddingTop: 2 }}>
                                <Typography variant="body2" sx={{ marginRight: 2, minWidth: '60px' }}>
                                    ZMBT1:
                                </Typography>
                                <Slider
                                    aria-label="ZMBT1"
                                    value={Number(zTokenAmount)}
                                    valueLabelDisplay="auto"
                                    onChange={handleZSliderChange}
                                    step={0.1}
                                    max={Number(maxZToken)}
                                    disabled={loading}
                                />
                            </Stack>
                            <TextField
                                id="standard-basic"
                                variant="standard"
                                sx={{ minWidth: '450px' }}
                                value={zTokenAmount}
                                onChange={handleZTokenChange}
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
                                    max={Number(Number(Web3.utils.fromWei(myLiquidity, 'ether')).toFixed(3))}
                                />
                            </Stack>
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
                                pTokenAmount === '0' ||
                                zTokenAmount === '0' ||
                                isNaN(Number(pTokenAmount)) ||
                                isNaN(Number(zTokenAmount)) ||
                                pTokenAmount.length < 1 ||
                                zTokenAmount.length < 1
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
            <Dialog open={openSwapToken} onClose={handleOpenSwapToken}>
                <DialogTitle>Swap Tokens</DialogTitle>
                <DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={selectedSwapTokenTab}
                            onChange={handleSwapTokenTabSelect}
                            aria-label="basic tabs example"
                        >
                            <Tab label="P to Z" />
                            <Tab label="Z to P" />
                        </Tabs>
                    </Box>
                    {selectedSwapTokenTab === 0 ? (
                        <React.Fragment>
                            <Stack direction="row" sx={{ marginTop: 4 }} alignItems={'center'}>
                                <Typography variant="body2" sx={{ marginRight: 2, minWidth: '60px' }}>
                                    PMPKT1:
                                </Typography>
                                <Slider
                                    aria-label="PMPKT1"
                                    value={Number(pTokenAmount)}
                                    valueLabelDisplay="auto"
                                    onChange={handleSwapPSliderChange}
                                    step={0.1}
                                    max={Number(maxPToken)}
                                    disabled={loading}
                                />
                            </Stack>
                            <TextField
                                id="standard-basic"
                                variant="standard"
                                sx={{ minWidth: '450px' }}
                                value={pTokenAmount}
                                onChange={handleSwapPTokenChange}
                                disabled={loading}
                            />
                            <Typography variant="body2" sx={{ marginTop: 2 }}>
                                slippage: {pToZSlippage}%
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 2 }}>
                                교환되어질 Z토큰 갯수: {swappedZTokenAmount}
                            </Typography>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Stack direction="row" alignItems={'center'} sx={{ paddingTop: 2 }}>
                                <Typography variant="body2" sx={{ marginRight: 2, minWidth: '60px' }}>
                                    ZMBT1:
                                </Typography>
                                <Slider
                                    aria-label="ZMBT1"
                                    value={Number(zTokenAmount)}
                                    valueLabelDisplay="auto"
                                    onChange={handleSwapZSliderChange}
                                    step={0.1}
                                    max={Number(maxZToken)}
                                    disabled={loading}
                                />
                            </Stack>
                            <TextField
                                id="standard-basic"
                                variant="standard"
                                sx={{ minWidth: '450px' }}
                                value={zTokenAmount}
                                onChange={handleSwapZTokenChange}
                                disabled={loading}
                            />
                            <Typography variant="body2" sx={{ marginTop: 2 }}>
                                slippage: {zToPSlippage}%
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: 2 }}>
                                교환되어질 P토큰 갯수: {swappedPTokenAmount}
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
                            (selectedSwapTokenTab === 0 && Number(pTokenAmount) === 0) ||
                            (selectedSwapTokenTab === 1 && Number(zTokenAmount) === 0)
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
        </Box>
    );
};

export default SinglePool;
