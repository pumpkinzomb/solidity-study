const hre = require("hardhat");

async function main() {
  const SimpleCounter = hre.ethers.getContractFactory("SimpleCounter");
  const simpleCounter = (await SimpleCounter).deploy();
  (await simpleCounter).deployed();
  console.log(`Deployed: ${(await simpleCounter).address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
