// npx hardhat verify --network mumbai --constructor-args ./verify/nft-verify.js 0x42F1cf9BC9cEc7178b054b97eBC91235B0A46146
require('dotenv').config();

module.exports = [
    "0xa4D5C1E9Df153629190A451fA1e361531c0C8184",
    process.env.NFT_DIR_PATH
]