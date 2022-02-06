const hre = require("hardhat");
const {waffle} = require("hardhat");

async function initialize() {
    let accounts = await hre.ethers.getSigners();
    let provider = waffle.provider;
    console.log("addresses & balances");
    for (const acc of accounts) {
        console.log(await acc.getAddress() + " " + await provider.getBalance(await acc.getAddress()));
    }
    const owner = accounts[0];
    console.log("=================================");
    return {"owner": owner, "provider": provider};
}

async function deployToken(owner, provider) {
    const tokenContract = (await hre.ethers.getContractFactory("Token")).connect(owner);
    const tokenDeployed = await tokenContract.deploy();
    console.log("Token contract address: " + tokenDeployed.address);
    console.log("Balance after operation: " + await provider.getBalance(await owner.getAddress()));
    return tokenDeployed.address;
}

async function deployNft(owner, provider, tokenAddress) {
    const nftContract = (await hre.ethers.getContractFactory("RabbitsCollection")).connect(owner);
    const nftDeployed = await nftContract.deploy(tokenAddress, this.config.nftDirPath);
    console.log("NFT contract address: " + nftDeployed.address);
    console.log("Balance after operation: " + await provider.getBalance(await owner.getAddress()));
}

async function deployAll() {
    let res = await initialize();
    let owner = res["owner"];
    let provider = res["provider"];
    let tokenAddress = await deployToken(owner, provider);
    await deployNft(owner, provider, tokenAddress);
}

deployAll().then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });