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

    function taskDone(address performer, uint32 _taskId) external {
        // our id blind with structs our Task
        require(
            userDone[msg.sender][_taskId] == false,
            "You're done with this task!"
        );
        // turn into true which mean, that his done with this task
        userDone[msg.sender][_taskId] = true;
        uint32 prize = uint32(tasks[_taskId].prizerForDone);
        transferFrom(minter, performer, prize);
    }
}
