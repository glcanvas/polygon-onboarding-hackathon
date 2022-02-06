//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OnboardToken is ERC20, Ownable {
    uint8 constant _decimals = 18;

    uint256 constant _totalSupply = 1_000_000 * (10 ** 18); // 1 million ONB


    constructor() ERC20("Onboard", "ONB") Ownable() {
        _mint(Ownable.owner(), _totalSupply);
    }

    function totalSupply() public pure override(ERC20) returns (uint256) {
        return _totalSupply;
    }

    function decimals() public pure override(ERC20) returns (uint8) {
        return _decimals;
    }

}
