pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RabbitsCollection is ERC721 {
    using Strings for uint256;

    uint256 tokenOffset = 1; // due to transaction might fail lets start with 1
    uint256 constant maxCollectionSize = 840;
    uint256 mintPrice = 1_000;
    IERC20 immutable token;
    string constant extension = ".png";
    string baseUrl;

    constructor (address _tokenAddress, string memory _baseUrl) ERC721("Rabbits", "RBT") {
        baseUrl = _baseUrl;
        token = IERC20(_tokenAddress);
    }

    function mint() public {
        require(tokenOffset <= maxCollectionSize, "Collection already minted");
        require(token.transferFrom(msg.sender, address(this), mintPrice), "Failed to transfer");
        ERC721._safeMint(msg.sender, tokenOffset); // because transaction may fail
        tokenOffset++;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseUrl;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), extension)) : "";
    }

    function mintedForUser(address _address) public view returns (uint256[] memory) {
        uint256 cnt = 0;
        uint256 offset = tokenOffset;
        for (uint256 i = 1; i < offset; i++) {
            if (ownerOf(i) == _address) {
                cnt++;
            }
        }
        uint256 ptr = 0;
        uint256[] memory result = new uint256[](cnt);
        for (uint256 i = 1; i < offset; i++) {
            if (ownerOf(i) == _address) {
                result[ptr] = i;
                ptr++;
            }
        }
        return result;
    }

}
