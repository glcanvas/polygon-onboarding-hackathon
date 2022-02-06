require("@nomiclabs/hardhat-waffle");
require("@float-capital/solidity-coverage");
require("hardhat-deploy")

require('dotenv').config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
const NFT_DIR_PATH = process.env.NFT_DIR_PATH

module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  nftDirPath: NFT_DIR_PATH
};