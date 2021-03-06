# Solidity 연습

solidity를 공부하면서 만드는 간단한 dapp들 실습한다.

## How to set this project

```
    git clone git@github.com:pumpkinzomb/solidity-study.git
    cd '..your project foldername'
    yarn install
```

## How to set hardhat(solidity compile & deploy template)

```
    cd hardhat
    yarn install

    yarn hardhat compile  // if you want compile your contracts
    yarn deploy '.. your deploy.js' // package.json에서 ropsten network로 설정함
```

## 실습중인 Chapter

1. Counter dapp

-   0으로 등록된 store 상태값을 트랜잭션으로 1을 가산, 감산할 수 있는 간단한 dapp
-   [deployed smart-contract](https://ropsten.etherscan.io/address/0xb991770cB1526526fC88Adb8ee22683d79b41328)

2. Bank dapp

-   ERC20 기반의 토큰을 등록하고 입금, 출금을 할 수 있는 간단한 dapp
-   [deployed smart-contract](https://ropsten.etherscan.io/address/0x84076D69fECD111d441f8c49b3b336BA2D84f213)

3. Single Uniswap(P, Z Token)

-   ERC20 기반 토큰 두개를 서로 스왑할 수 있는 dex pool dapp
-   [deployed smart-contract](https://ropsten.etherscan.io/address/0xC05F75dfC2C0c356BCC4320f84e72a9D90CB0A11)

4. Single Uniswap(Eth with P)

-   ERC20 토큰과 native token인 eth를 서로 스왑할 수 있는 dex pool dapp
-   [deployed smart-contract](https://ropsten.etherscan.io/address/0x46835eCF8e2048fdfe29127886ADbd4781d33E85)

5. BrowserSolc를 이용하여 간단한 solidity 컴파일러 & deploy 로직 구현

-   간단한 solidity IDE

6. Clone Uniswap v2

-   Uniswap v2에서 blocktimestamp로 가격정보 oracle연동하는 부분제외하고 multipool부분만 구현
-   핵심은 Router 컨트랙트로 Factory-Pair 컨트랙트로 multipool과 liquidity token을 제어하는 것.
-   어려운 부분은 주석을 달아놓았음.
-   [deployed Uni2_Router](https://ropsten.etherscan.io/address/0x535bEc5966748bA34371664E914227B786F20999)
-   [deployed Uni2_Factory](https://ropsten.etherscan.io/address/0x1265A95a383Ea034E0b0149EA21660422A750893)

[Check all this on Web](https://master.d23zmmhxqo18no.amplifyapp.com)

-   metamask에서는 ropsten network로 바꿔서 테스트하세요.
