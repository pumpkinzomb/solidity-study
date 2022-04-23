import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Axios from 'axios';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useStopwatch } from 'react-timer-hook';

import { ABI, CA } from './contract';

// import code2 from '../../../hardhat/contracts/SimpleCounter.sol';
import code from '@/hardhat/contracts/SimpleCounter.sol';

export const StyledDialogContent = styled(DialogContent)(
    (props) => `
    & pre { margin: 0; }
  `,
);

const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'https://ropsten.infura.io/v3/a07cd96ad0bb435f9e750c8faa672052');
let Contract;

const SimpleCounter = (props) => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState([]);
    const [open, setOpen] = useState(false);
    const [sourceCode, setSourceCode] = useState('');

    const { seconds, minutes, hours, days, isRunning, start, pause, reset } = useStopwatch({ autoStart: false });

    useEffect(() => {
        getAccounts();
        getSourceCode();
    }, []);

    const getCounter = async (_account) => {
        setLoading(true);
        try {
            const _count = await Contract.methods.getCount().call({ from: _account || account });
            _count && setCount(_count);
        } catch (error) {
            console.log('error: ', error);
        }
        setLoading(false);
    };

    const getSourceCode = async () => {
        const response = await Axios(code);
        setSourceCode(response.data);
    };

    const getAccounts = async () => {
        try {
            await window.ethereum.enable();
            const _account = await web3.eth.getAccounts();
            // console.log('check', _account);
            Contract = new web3.eth.Contract(ABI, CA);
            setAccount(_account[0]);
            getCounter(_account[0]);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const increase = async () => {
        setLoading(true);
        start();
        try {
            await Contract.methods.increment().send({
                from: account,
            });
        } catch (error) {
            console.log('error: ', error);
        }
        getCounter();
        setLoading(false);
        pause();
        reset();
    };

    const decrease = async () => {
        setLoading(true);
        start();
        try {
            await Contract.methods.decrement().send({
                from: account,
            });
        } catch (error) {
            console.log('error: ', error);
        }
        getCounter();
        setLoading(false);
        pause();
        reset();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box p={2}>
            <Stack direction="row" sx={{ paddingBottom: 2 }} alignItems={'center'}>
                <Typography variant="h4">Simple Using-Tx Counter!</Typography>
                <Button variant="outlined" onClick={handleClickOpen} sx={{ textTransform: 'none', marginLeft: 2 }}>
                    Open SimpleCounter.sol
                </Button>
            </Stack>
            <Stack direction="row" sx={{ paddingBottom: 2 }}>
                {`Count: ${count}`}
                <Box sx={{ marginLeft: 2 }}>
                    {loading && `Loading... (${minutes}:${seconds < 10 ? `0${seconds}` : seconds})`}
                </Box>
            </Stack>
            <Stack spacing={2} direction="row">
                <LoadingButton variant="outlined" onClick={increase} loading={loading} disabled={loading}>
                    +1
                </LoadingButton>
                <LoadingButton variant="outlined" onClick={decrease} loading={loading} disabled={loading}>
                    -1
                </LoadingButton>
            </Stack>
            <Dialog open={open} onClose={handleClose} maxWidth={'xl'} fullWidth={true}>
                <DialogTitle>Source Code (SimpleCounter.sol)</DialogTitle>
                <StyledDialogContent sx={{ padding: 0 }}>
                    <SyntaxHighlighter language="javascript" style={vs2015} showLineNumbers={true}>
                        {sourceCode}
                    </SyntaxHighlighter>
                </StyledDialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant="contained" onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SimpleCounter;
