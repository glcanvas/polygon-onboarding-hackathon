const hre = require("hardhat");
const {waffle} = require("hardhat");

async function deployNft() {
    let accounts = await hre.ethers.getSigners();
    let provider = waffle.provider;
    console.log("addresses & balances");
    for (const acc of accounts) {
        console.log(await acc.getAddress() + " " + await provider.getBalance(await acc.getAddress()));
    }
    const owner = accounts[0];
    console.log("=================================");
    const nftContract = (await hre.ethers.getContractFactory("RabbitsCollection")).connect(owner);
    const nftDeployed = await nftContract.deploy(this.config.nftDirPath);
    console.log("nft contract address: " + nftDeployed.address);
    console.log("owner balance: " + await provider.getBalance(await owner.getAddress()));
    console.log("Contract name: " + await  nftDeployed.name());
}

deployNft()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
