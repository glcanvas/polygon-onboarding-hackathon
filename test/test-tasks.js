const {ethers, expect} = require("./base");

describe("Tasks", function () {
    let tasks;
    let token;
    let owner;

    beforeEach(async function () {
        const signers = await ethers.getSigners();
        owner = signers[0];

        const Token = await ethers.getContractFactory("OnboardToken");
        token = await Token.deploy();
        const Tasks = await ethers.getContractFactory("Tasks");
        tasks = await Tasks.deploy(token.address);

        let balance = await token.balanceOf(await owner.getAddress());
        expect(ethers.utils.formatEther(balance)).to.equal("1000000.0");
    })

    it("test create task", async function () {
        await tasks.createTask("task1", 100);
    });

    it("test create task by non ownable", async function () {
        const [o, addr1] = await ethers.getSigners();
        tasks = tasks.connect(addr1);
        await expect(tasks.createTask("task1", 100)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("test finish task", async function () {
        const [o, addr1] = await ethers.getSigners();
        await token.approve(tasks.address, 1_000_000);
        await tasks.createTask("task1", 100);


        tasks = tasks.connect(addr1);
        await tasks.taskDone(0);
        expect(await token.balanceOf(await addr1.getAddress())).to.be.eq(100);
    });

    it("test check task done", async function () {
        const [o, addr1] = await ethers.getSigners();
        await token.approve(tasks.address, 1_000_000);
        await tasks.createTask("task1", 100);

        expect(await tasks.checkEligibility(await addr1.getAddress(), 0)).to.be.eq(false);

        tasks = tasks.connect(addr1);
        await tasks.taskDone(0);
        expect(await tasks.checkEligibility(await addr1.getAddress(), 0)).to.be.eq(true);
    });

    it("test fail to do task twice", async function () {
        const [o, addr1] = await ethers.getSigners();
        await token.approve(tasks.address, 1_000_000);
        await tasks.createTask("task1", 100);

        tasks = tasks.connect(addr1);
        await tasks.taskDone(0);
        await expect(tasks.taskDone(0)).to.be.revertedWith("Task has been done");
    });

});