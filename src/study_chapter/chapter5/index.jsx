import * as React from 'react';
import { useEffect, useState } from 'react';
import 'browser-solc';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogContent from '@mui/material/DialogContent';
import Link from '@mui/material/Link';

const EthereumTx = require('ethereumjs-tx').Transaction;

const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'https://ropsten.infura.io/v3/a07cd96ad0bb435f9e750c8faa672052');
let BrowserSolc;
let timeout;
export const StyledDialogContent = styled(DialogContent)(
    (props) => `
    & pre { margin: 0; }
  `,
);

const SimpleRemix = (props) => {
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState('');
    const [gasLimit, setGasLimit] = useState('3000000');
    const [gasPrice, setGasPrice] = useState('0');
    const [sourceCode, setSourceCode] = useState(
        `// SPDX-License-Identifier: MIT\npragma solidity ^0.4.26;\ncontract x { uint value1 = 1; function g() public view returns(uint){ return value1; } }`,
    );
    const [compiler, setCompiler] = useState(null);
    const [compiledSourceCode, setCompiledSourceCode] = useState(null);
    const [deployed, setDeployed] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        getAccounts();
        checkLoadedBrowserSolc();
    }, []);

    const getAccounts = async () => {
        try {
            // await window.ethereum.enable();
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const _account = await web3.eth.getAccounts();
            // console.log('check', _account);
            setAccount(_account[0]);
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const checkLoadedBrowserSolc = () => {
        // console.log('check', window.BrowserSolc);
        setLoading(true);
        timeout = setTimeout(() => {
            if (window.BrowserSolc) {
                BrowserSolc = window.BrowserSolc;
                clearTimeout(timeout);
                getAndSetCompiler();
                setLoading(false);
            } else {
                checkLoadedBrowserSolc();
            }
        }, 1000);
    };

    const getAndSetCompiler = async () => {
        // const { releaseVersion, allVersion } = await getCompilerVersion();
        // console.log('releaseVersion', releaseVersion);
        const compiler = await getCompiler();
        setCompiler(compiler);
    };

    const getCompilerVersion = () => {
        return new Promise((resolve, reject) => {
            BrowserSolc.getVersions((allVersion, releaseVersion) => {
                resolve({ allVersion, releaseVersion });
            });
        });
    };

    const getCompiler = (version) => {
        return new Promise((resolve, reject) => {
            // 현재 BrowerSolc로 컴파일러 버전 0.4.26 보다 상위를 로드할 경우 제대로된 컴파일러를 불러오지 못함
            // 제대로된 마이그레이션을 해야할 필요성이 보여 컴파일러 수정은 스톱, 0.4.26으로 fix함
            BrowserSolc.loadVersion('soljson-v0.4.26+commit.4563c3fc.js', function (compiler) {
                resolve(compiler);
            });
        });
    };

    const handleChangeAccount = (event) => {
        setAccount(event.target.value);
    };
    const handleChangeGasLimit = (event) => {
        setGasLimit(event.target.value);
    };
    const handleChangeGasPrice = (event) => {
        setGasPrice(event.target.value);
    };

    const handleChangeSourceCode = (event) => {
        if (compiledSourceCode) {
            setCompiledSourceCode(null);
        }
        if (deployed) {
            setDeployed(null);
        }
        setErrors([]);
        setSourceCode(event.target.value);
    };

    const handleCompileSubmit = async (event) => {
        if (deployed) {
            setDeployed(null);
        }
        if (compiler) {
            const compiledCode = compiler.compile(sourceCode, 1);
            console.log('check compile', compiledCode);
            if (compiledCode.errors) {
                setErrors(compiledCode.errors);
                setCompiledSourceCode(null);
            } else {
                compiledCode.contractName = Object.keys(compiledCode.contracts).map((item) => item)[0];
                setCompiledSourceCode(compiledCode);
            }
        } else {
            setCompiledSourceCode(null);
        }
    };

    const handleDeploySubmit = async (event) => {
        setLoading(true);
        try {
            const { interface: abi, bytecode } = compiledSourceCode.contracts[compiledSourceCode.contractName];
            // console.log('abi', abi);
            // console.log('bytecode', bytecode);
            const Contract = new web3.eth.Contract(JSON.parse(abi.toString()));
            const deployContract = new Promise((resolve, reject) => {
                const returnValue = {
                    transactionHash: '',
                    deployedAddress: '',
                };
                Contract.deploy({
                    data: `0x${bytecode}`,
                    arguments: ['genesis'],
                })
                    .send({ from: account, gas: gasLimit }, (error, transactionHash) => {
                        if (error) {
                            reject(error);
                        }
                        returnValue.transactionHash = transactionHash;
                        // console.log('transactionHash: ', transactionHash);
                    })
                    .then((newContractInstance) => {
                        // console.log('deployedAddress: ', newContractInstance.options.address);
                        returnValue.deployedAddress = newContractInstance.options.address;
                        resolve(returnValue);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
            const { transactionHash, deployedAddress } = await deployContract;
            setDeployed(transactionHash);
            // console.log('transactionHash', transactionHash);
            // console.log('deployedAddress', deployedAddress);
        } catch (error) {
            console.log('error', error);
        }

        setLoading(false);
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
        }
    };

    return (
        <Box p={2}>
            <Paper sx={{ padding: 2, width: '100%', maxWidth: '900px' }} elevation={3}>
                <Stack spacing={2} direction="row">
                    <TextField
                        id="outlined-multiline-static"
                        label="Solidity Code"
                        sx={{ width: '50%' }}
                        multiline
                        rows={20}
                        value={sourceCode}
                        onChange={handleChangeSourceCode}
                        onKeyDown={handleKeyPress}
                        error={errors.length > 0 ? true : false}
                    />
                    <Stack spacing={2} direction="column" sx={{ width: '50%' }}>
                        <Typography variant="subtitle">Contract Name:</Typography>
                        <Typography variant="body2">
                            {compiledSourceCode && compiledSourceCode.contractName.slice(1)}
                        </Typography>
                        <Typography variant="subtitle">Contract ByteCode:</Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {compiledSourceCode &&
                                compiledSourceCode.contracts[compiledSourceCode.contractName].bytecode}
                        </Typography>
                        <Typography variant="subtitle">Contract abi:</Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {compiledSourceCode &&
                                compiledSourceCode.contracts[compiledSourceCode.contractName].interface}
                        </Typography>
                        {errors.length > 0 && (
                            <React.Fragment>
                                <Typography variant="subtitle">Errors:</Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                    {errors.map((item) => {
                                        return item;
                                    })}
                                </Typography>
                            </React.Fragment>
                        )}
                    </Stack>
                </Stack>

                <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
                    <TextField
                        id="outlined-basic"
                        label="Account"
                        variant="outlined"
                        value={account}
                        disabled={true}
                        onChange={handleChangeAccount}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Gas Limit"
                        variant="outlined"
                        value={gasLimit}
                        onChange={handleChangeGasLimit}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Gas Price"
                        variant="outlined"
                        value={gasPrice}
                        onChange={handleChangeGasPrice}
                    />
                </Stack>
                <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
                    <LoadingButton
                        variant="outlined"
                        onClick={handleCompileSubmit}
                        loading={loading}
                        disabled={loading || compiledSourceCode}
                    >
                        Compile
                    </LoadingButton>
                    <LoadingButton
                        variant="outlined"
                        onClick={handleDeploySubmit}
                        loading={loading}
                        disabled={loading || !compiledSourceCode}
                    >
                        Deploy
                    </LoadingButton>
                    {deployed && (
                        <Link href={`https://ropsten.etherscan.io/tx/${deployed}`} target={'_blank'}>
                            <Typography variant="body2">{`Deployed: ${deployed}`}</Typography>
                        </Link>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
};

export default SimpleRemix;
