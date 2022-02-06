const {ethers, expect} = require("./base");

const base_url = "https://gateway.pinata.cloud/ipfs/QmSYanvpGw19hP4vWWi5tj51AjaDJmB5sFWHDoBoe8LYVB/";

describe("NFT", function () {
    let nft;
    let token;
    beforeEach(async function () {
        const Token = await ethers.getContractFactory("OnboardToken");
        token = await Token.deploy();
        const Nft = await ethers.getContractFactory("RabbitsCollection");
        nft = await Nft.deploy(token.address, base_url);

        const [owner] = await ethers.getSigners();
        let balance = await token.balanceOf(await owner.getAddress());
        expect(ethers.utils.formatEther(balance)).to.equal("1000000.0");
    })

    it("deploy contract", async function () {
        expect(await nft.name()).to.equal("Rabbits");
        expect(await nft.symbol()).to.equal("RBT");
    });

    it("mint one", async function () {
        const [owner, addr1] = await ethers.getSigners();
        await token.transfer(await addr1.getAddress(), 1_000);
        token = token.connect(addr1);
        await token.approve(nft.address, 1_000);
        nft = nft.connect(addr1);
        await nft.mint();
        expect(await nft.tokenURI(1)).to.equal(base_url + "1.png");
    });

    it("mint first 840", async function () {
        const [owner, addr1] = await ethers.getSigners();
        await token.transfer(await addr1.getAddress(), 841 * 1_000);
        token = token.connect(addr1);
        await token.approve(nft.address, 841 * 1_000);
        nft = nft.connect(addr1);
        for (let i = 1; i <= 840; i++) {
            await nft.mint();
        }
        await expect(nft.mint()).to.be.revertedWith("Collection already minted");
    });

    it("show minted", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();
        await token.transfer(await addr1.getAddress(), 10 * 1_000);
        await token.approve(nft.address, 10 * 1_000);

        token = token.connect(addr1);
        await token.approve(nft.address, 10 * 1_000);

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

        minted = await nft.mintedForUser(await addr2.getAddress());
        expect(minted).deep.be.eq([]);
    });
});
