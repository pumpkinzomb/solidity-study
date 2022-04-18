import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { ABI, CA } from './contract';
import { TOKEN_ABI } from './tokenContract';
import { sourceCode } from './SimpleBank.sol';

export const StyledDialogContent = styled(DialogContent)(
    (props) => `
    & pre { margin: 0; }
  `,
);

const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'https://ropsten.infura.io/v3/a07cd96ad0bb435f9e750c8faa672052');

let Contract;
let PMPKT1_TOKEN;
let ZMBT1_TOKEN;
let TokenContract;
const SimpleCounter = (props) => {
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState(null);
    const [openSourceCode, setOpenSourceCode] = useState(false);
    const [openRegistToken, setOpenRegistToken] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [tokenList, setTokenList] = useState([]);
    const [openDeposit, setOpenDeposit] = useState(false);
    const [openWithdraw, setOpenWithdraw] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const [tokenAmount, setTokenAmount] = useState('0');
    const [isWithdraw, setIsWithdraw] = useState(false);

    useEffect(() => {
        getAccounts();
    }, []);

    const getAccounts = async () => {
        try {
            // await window.ethereum.enable();
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const _account = await web3.eth.getAccounts();
            // console.log('check', _account);
            Contract = new web3.eth.Contract(ABI, CA);
            // PMPKT1_TOKEN = new web3.eth.Contract(PMPKT1_ABI, PMPKT1_CA);
            // ZMBT1_TOKEN = new web3.eth.Contract(PMPKT1_ABI, ZMBT1_CA);
            setAccount(_account[0]);
            getAllBankAssets(_account[0]);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const getAllBankAssets = async (_account) => {
        const getAccount = account || _account;
        try {
            const assetList = await Contract.methods.getAllBankAssets().call({ from: getAccount });
            const mappingTokenList = assetList.map((item) => {
                return {
                    tokenName: item['tokenName'],
                    tokenSymbol: item['tokenSymbol'],
                    tokenAddress: item['tokenAddress'],
                    balance: item['balance'],
                };
            });
            // console.log('assetList', mappingTokenList);
            // setTokenList(mappingTokenList);
            const updateBalance = await Promise.all(
                mappingTokenList.map(async (item) => {
                    const itemBalance = await getOwnAssetBalance(item.tokenAddress, getAccount);
                    // console.log('itemBalance', itemBalance);
                    item.balance = itemBalance;
                    return item;
                }),
            );
            setTokenList(updateBalance);
            // console.log('assetList', assetList);
            console.log('updateBalance', updateBalance);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const getOwnAssetBalance = async (tokenAddress, account) => {
        try {
            const asset = await Contract.methods.getMyBalance(tokenAddress).call({ from: account });
            return asset[0]['balance'];
        } catch (error) {
            console.log('error: ', error);
            return 0;
        }
    };

    const handleTokenAddressChange = async (event) => {
        const tokenAddress = event.target.value.replace(' ', '');
        setTokenAddress(tokenAddress);
        TokenContract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
        try {
            const value = {};
            await Promise.all(
                ['name', 'symbol'].map(async (item) => {
                    let getInfo;
                    if (item === 'name') {
                        getInfo = await TokenContract.methods.name().call({
                            from: account,
                        });
                    } else if (item === 'symbol') {
                        getInfo = await TokenContract.methods.symbol().call({
                            from: account,
                        });
                    }
                    // console.log('check', getInfo);
                    value[`${item}`] = getInfo;
                    return getInfo;
                }),
            );
            const { name, symbol } = value;
            setTokenName(name);
            setTokenSymbol(symbol);
        } catch (error) {
            console.log(error);
        }
    };

    const handleTokenNameChange = (event) => {
        const tokenName = event.target.value.replace(' ', '');
        setTokenName(tokenName);
    };

    const handleTokenSymbolChange = (event) => {
        const tokenSymbol = event.target.value.replace(' ', '');
        setTokenSymbol(tokenSymbol);
    };

    const handleRegistTokenSubmit = async () => {
        setLoading(true);
        try {
            await Contract.methods.registAsset(tokenName, tokenSymbol, tokenAddress).send({
                from: account,
            });
        } catch (error) {
            console.log('error: ', error);
        }
        setLoading(false);
        handleRegistTokenClose();
        getAllBankAssets();
    };

    const handleSourceCodeOpen = () => {
        setOpenSourceCode(true);
    };

    const handleSourceCodeClose = () => {
        setOpenSourceCode(false);
    };

    const handleRegistTokenOpen = () => {
        setOpenRegistToken(true);
        setTokenName('');
        setTokenSymbol('');
        setTokenAddress('');
    };

    const handleRegistTokenClose = () => {
        setOpenRegistToken(false);
    };

    const handleDepositOpen = (token) => {
        setOpenDeposit(true);
        setSelectedToken(token);
    };

    const handleDepositClose = () => {
        setOpenDeposit(false);
        setSelectedToken(null);
        setTokenAmount('0');
    };

    const handleWithdrawOpen = (token) => {
        setOpenWithdraw(true);
        setIsWithdraw(true);
        setSelectedToken(token);
    };

    const handleWithdrawClose = () => {
        setOpenWithdraw(false);
        setIsWithdraw(false);
        setSelectedToken(null);
        setTokenAmount('0');
    };

    const handleChangeTokenAmount = (event) => {
        let amount = event.target.value;
        if (Number(amount) !== NaN) {
            if (isWithdraw && selectedToken !== null) {
                // console.log('check', selectedToken);
                if (Number(amount) > Number(selectedToken.balance)) {
                    amount = selectedToken.balance;
                }
            }
            setTokenAmount(amount);
        }
    };

    const handleDepositSubmit = async () => {
        setLoading(true);
        try {
            await Contract.methods.deposit(selectedToken.tokenAddress, tokenAmount).send({
                from: account,
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        handleDepositClose();
        getAllBankAssets();
    };

    const handleWithdrawSubmit = async () => {
        setLoading(true);
        try {
            await Contract.methods.withdraw(selectedToken.tokenAddress, tokenAmount).send({
                from: account,
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        handleWithdrawClose();
        getAllBankAssets();
    };

    const handleApproveToken = async (token) => {
        setLoading(true);
        TokenContract = new web3.eth.Contract(TOKEN_ABI, token.tokenAddress);
        try {
            await TokenContract.methods.approve(CA, '100000000000000000000').send({
                from: account,
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <Box p={2}>
            <Typography variant="h6">Welcome to ZombBank!</Typography>
            <Stack direction="row" sx={{ paddingBottom: 2 }}>
                <Box sx={{ marginLeft: 2 }}>{loading && 'Loading...'}</Box>
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleRegistTokenOpen}
                    sx={{ textTransform: 'none' }}
                    disabled={false}
                >
                    Token Regist
                </Button>
            </Stack>
            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                Registered Tokens (Your Balance)
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: 650 }}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Token</TableCell>
                            <TableCell align="center">Balance</TableCell>
                            <TableCell align="center">Approve Token</TableCell>
                            <TableCell align="center">Deposit</TableCell>
                            <TableCell align="center">Withdraw</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tokenList.length > 0 ? (
                            tokenList.map((row) => (
                                <TableRow
                                    key={row.tokenName}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {`${row.tokenName} (${row.tokenSymbol})`}
                                    </TableCell>
                                    <TableCell align="center">{Web3.utils.fromWei(row.balance, 'ether')}</TableCell>
                                    <TableCell align="center">
                                        {
                                            <LoadingButton
                                                loading={loading}
                                                variant="outlined"
                                                onClick={() => handleApproveToken(row)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                토큰 접근허용
                                            </LoadingButton>
                                        }
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            <Button
                                                disabled={loading}
                                                variant="outlined"
                                                onClick={() => handleDepositOpen(row)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                입금하기
                                            </Button>
                                        }
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            <Button
                                                disabled={loading}
                                                variant="outlined"
                                                onClick={() => handleWithdrawOpen(row)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                출금하기
                                            </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" colSpan={5} align="center">
                                    {`등록되어있는 Token 자산이 없습니다.`}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack direction="row" sx={{ paddingTop: 2 }}>
                <Button variant="outlined" onClick={handleSourceCodeOpen} sx={{ textTransform: 'none' }}>
                    Open SimpleBank.sol
                </Button>
            </Stack>
            <Dialog open={openSourceCode} onClose={handleSourceCodeClose} maxWidth={'xl'} fullWidth={true}>
                <DialogTitle>Source Code (SimpleBank.sol)</DialogTitle>
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
            <Dialog open={openRegistToken} onClose={handleRegistTokenOpen} sx={{ paddingBottom: 0 }}>
                <DialogTitle>Regist Token</DialogTitle>
                <DialogContent>
                    <TextField
                        id="standard-basic"
                        label="Token Name"
                        variant="standard"
                        sx={{ minWidth: '450px' }}
                        value={tokenName}
                        disabled={true}
                        onChange={handleTokenNameChange}
                    />
                    <TextField
                        id="standard-basic"
                        label="Token Symbol"
                        variant="standard"
                        sx={{ minWidth: '450px' }}
                        value={tokenSymbol}
                        disabled={true}
                        onChange={handleTokenSymbolChange}
                    />
                    <TextField
                        id="standard-basic"
                        label="Token Address"
                        variant="standard"
                        sx={{ minWidth: '450px' }}
                        value={tokenAddress}
                        disabled={loading}
                        onChange={handleTokenAddressChange}
                    />
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <LoadingButton
                        variant="contained"
                        onClick={handleRegistTokenSubmit}
                        loading={loading}
                        disabled={tokenAddress.length === 0 || tokenName.length === 0 || tokenSymbol.length === 0}
                    >
                        Regist
                    </LoadingButton>
                    <Button variant="contained" onClick={handleRegistTokenClose} disabled={loading}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeposit} onClose={handleDepositClose} sx={{ paddingBottom: 0 }}>
                <DialogTitle>Token Deposit</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                        {selectedToken &&
                            `${selectedToken.tokenName} (${selectedToken.tokenSymbol}): ${selectedToken.balance}`}
                    </Typography>
                    <TextField
                        id="standard-basic"
                        label="Token Balance"
                        variant="standard"
                        sx={{ minWidth: '450px' }}
                        value={tokenAmount}
                        disabled={loading}
                        onChange={handleChangeTokenAmount}
                    />
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <LoadingButton
                        variant="contained"
                        onClick={handleDepositSubmit}
                        loading={loading}
                        disabled={Number(tokenAmount) < 1}
                    >
                        Deposit
                    </LoadingButton>
                    <Button variant="contained" onClick={handleDepositClose} disabled={loading}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openWithdraw} onClose={handleWithdrawClose} sx={{ paddingBottom: 0 }}>
                <DialogTitle>Token Withdraw</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                        {selectedToken &&
                            `${selectedToken.tokenName} (${selectedToken.tokenSymbol}): ${selectedToken.balance}`}
                    </Typography>
                    <TextField
                        id="standard-basic"
                        label="Token Balance"
                        variant="standard"
                        sx={{ minWidth: '450px' }}
                        value={tokenAmount}
                        onChange={handleChangeTokenAmount}
                        disabled={loading}
                    />
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <LoadingButton
                        variant="contained"
                        onClick={handleWithdrawSubmit}
                        loading={loading}
                        disabled={Number(tokenAmount) < 1}
                    >
                        Deposit
                    </LoadingButton>
                    <Button variant="contained" onClick={handleWithdrawClose} disabled={loading}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SimpleCounter;
