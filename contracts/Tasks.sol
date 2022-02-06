//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Tasks is Token, AccessControl {
    bytes32 private adminRole = "admin";

    constructor() {}

    struct Task {
        string name;
        uint32 prizerForDone;
        bool done;
    }

    Task[] public allTasks;
    mapping(uint32 => Task) public tasks;
    mapping(address => mapping(uint32 => bool)) public userDone;

    uint256 numberTask;

    function _createTask(string memory _name, uint32 prizerForDone) external {
        allTasks.push(Task(_name, prizerForDone, false));
    }

    function taskDone(address performer) external {
        // our id blind with structs our Task
        uint8 id = uint8(allTasks.length) - 1;
        require(
            userDone[msg.sender][id] == false,
            "You're done with this task!"
        );
        // turn into true which mean, that his done with this task
        userDone[msg.sender][id] = true;
        uint32 prize = uint32(tasks[id].prizerForDone);
        transferFrom(minter, performer, prize);
    }
}
