pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {

    uint256 constant oneItem = 10 ** 18;

    constructor () ERC20 ("TestToken", "TT") {
    }

    function mint() public onlyOwner() {
        ERC20._mint(Ownable.owner(), 1_000_000 * oneItem);
    }

}
