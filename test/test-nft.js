const {ethers, expect} = require("./base");

const base_url = "https://gateway.pinata.cloud/ipfs/QmSYanvpGw19hP4vWWi5tj51AjaDJmB5sFWHDoBoe8LYVB/";

describe("NFT", function () {
    let nft;
    beforeEach(async function () {
        const Nft = await ethers.getContractFactory("NFT_ERC721");
        nft = await Nft.deploy(base_url);
        await nft.deployed();
    })

    it("deploy contract", async function () {
        expect(await nft.name()).to.equal("Collection");
        expect(await nft.symbol()).to.equal("OZC");
    });

    it("mint one", async function () {
        const [owner, addr1, ...addrs] = await ethers.getSigners();
        nft = nft.connect(addr1);
        await nft.mint();
        expect(await nft.tokenURI(1)).to.equal(base_url + "1.png");
    });

    it("mint first 100", async function () {
        const [owner, addr1, ...addrs] = await ethers.getSigners();
        nft = nft.connect(addr1);
        for (let i = 1; i <= 100; i++) {
            await nft.mint();
        }
        await expect(nft.mint()).to.be.revertedWith("Collection already minted");
    });
});
