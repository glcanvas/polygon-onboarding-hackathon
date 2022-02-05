const {ethers, expect} = require("./base");
const {BigNumber} = require("ethers");
const {min} = require("mocha/lib/reporters");

const base_url = "https://gateway.pinata.cloud/ipfs/QmSYanvpGw19hP4vWWi5tj51AjaDJmB5sFWHDoBoe8LYVB/";

describe("NFT", function () {
    let nft;
    beforeEach(async function () {
        const Nft = await ethers.getContractFactory("RabbitsCollection");
        nft = await Nft.deploy(base_url);
        await nft.deployed();
    })

    it("deploy contract", async function () {
        expect(await nft.name()).to.equal("Rabbits");
        expect(await nft.symbol()).to.equal("RBT");
    });

    it("mint one", async function () {
        const [owner, addr1, ...addrs] = await ethers.getSigners();
        nft = nft.connect(addr1);
        await nft.mint();
        expect(await nft.tokenURI(1)).to.equal(base_url + "1.png");
    });

    it("mint first 840", async function () {
        const [owner, addr1, ...addrs] = await ethers.getSigners();
        nft = nft.connect(addr1);
        for (let i = 1; i <= 840; i++) {
            await nft.mint();
        }
        await expect(nft.mint()).to.be.revertedWith("Collection already minted");
    });

    it("show minted", async function () {
        const [owner, addr1, ...addrs] = await ethers.getSigners();
        nft = nft.connect(addr1);
        for (let i = 1; i <= 5; i++) {
            await nft.mint();
        }
        nft = nft.connect(owner);
        await nft.mint();
        await nft.mint();
        nft = nft.connect(addr1);
        await nft.mint();
        let minted = await nft.mintedForUser(await owner.getAddress());
        minted = minted.map(x => x.toNumber());
        expect(minted).deep.be.eq([6, 7]);
    });
});
