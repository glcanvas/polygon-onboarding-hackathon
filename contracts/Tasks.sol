//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./OnboardToken.sol";
import "./IOnboardToken.sol";

contract Tasks is Ownable {

    IOnboardToken private immutable _token;

    constructor(address _tokeAddress) Ownable() {
        _token = IOnboardToken(_tokeAddress);
    }

    struct Task {
        string name;
        uint32 rewardsSize;
    }

    mapping(uint32 => Task) private tasks;
    mapping(address => mapping(uint32 => bool)) private userDone;

    uint32 private taskId = 0;

    function createTask(string memory _name, uint32 _rewardsSize) public onlyOwner() {
        tasks[taskId] = Task(_name, _rewardsSize);
        taskId++;
    }

    function checkEligibility(address _address, uint32 _taskId) public view returns (bool){
        require(_taskId < taskId, "_taskId out of range");
        return userDone[_address][_taskId];
    }

    function taskDone(uint32 _taskId) public {
        // check task finished, and check out of range
        require(!checkEligibility(msg.sender, _taskId), "Task has been done");
        
        userDone[msg.sender][_taskId] = true;
        uint32 prize = uint32(tasks[_taskId].rewardsSize);
        _token.transferFrom(_token.owner(), msg.sender, prize);
    }
}
