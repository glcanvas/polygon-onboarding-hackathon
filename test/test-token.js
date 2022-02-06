const {ethers, expect} = require("./base");

describe("Token", function () {
    let token;
    beforeEach(async function () {
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deployed();
    })

    it("deploy contract", async function () {
        expect(await token.name()).to.equal("TestToken");
        expect(await token.symbol()).to.equal("TT");
    });

    it("mint tokens", async function () {
        const [owner, ...addrs] = await ethers.getSigners();
        token = token.connect(owner);
        await token.mint();
        let balance = await token.balanceOf(await owner.getAddress());

        expect(ethers.utils.formatEther(balance)).to.equal("1000000.0");
    });
});
