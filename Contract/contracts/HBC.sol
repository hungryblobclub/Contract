// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./extensions/ContextMixin.sol";

contract HBC is ERC1155Supply, Ownable, ContextMixin {

    uint256 private _highestMintableTokenID = 1500;
    string private _baseTierUri = "ipfs://QmUgTHU4LmDpJXzLEfmBraaD3uAqwd1jecsV15DJc8GURJ/metadata/";
    uint private _tier = 1;

    struct TierMap {
        uint minTokenID;
        uint maxTokenID;
        string uri;
    }

    TierMap[] private _tierArray;

    constructor() ERC1155(_baseTierUri) {
        _tierArray.push(TierMap(1, _highestMintableTokenID, _baseTierUri));
    }

    // MARK: Mint

    function mint(uint256 tokenID) public {
        require(!exists(tokenID), 'Token is already minted.');
        require(tokenID >= 0x0000000000000001 && tokenID <= _highestMintableTokenID, 'Token ID is out of bounds.');
        
        _mint(msg.sender, tokenID, 1, "");
    }

    function batchMint(uint256[] calldata tokenIds) public {
        uint length = tokenIds.length;
        uint256[] memory amounts = new uint256[](length);
        for (uint i = 0; i < length; i++) {
            amounts[i] = 1;
        }

        _mintBatch(msg.sender, tokenIds, amounts, "");
    }

    function addTier(uint256 maxTokenID, string memory metaUri) public onlyOwner {
        require(maxTokenID > _highestMintableTokenID, 'Max tokenID must be larger than the existing one.');

        _tierArray.push(TierMap(_highestMintableTokenID+1, maxTokenID, metaUri));
        _highestMintableTokenID = maxTokenID;
        _tier++;
    }

    /**
    * Override isApprovedForAll to auto-approve OS's proxy contract
    */
    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
        // if OpenSea's ERC1155 Proxy Address is detected, auto-return true
       if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        }
        // otherwise, use the default ERC1155.isApprovedForAll()
        return ERC1155.isApprovedForAll(_owner, _operator);
    }

    /**
     * This is used instead of msg.sender as transactions won't be sent by the original token owner, but by OpenSea.
     * Enabling meta-transactions by adding support for gass-less transaction on the polygon network.
     * See ./extensions/ContextMixin.sol
     */
    function _msgSender()
        internal
        override
        view
        returns (address sender)
    {
        return ContextMixin.msgSender();
    }

    // MARK: Info

    function uri(uint256 _tokenID) override public view returns (string memory) {
        require(exists(_tokenID), 'URI query for nonexsistent token.');

        return string(
            abi.encodePacked(
                getTierUri(_tokenID),
                Strings.toString(_tokenID),
                ".json"
            )
        );
    }

    function getTierUri(uint256 tokenID) private view returns (string memory) {
        string memory _uri;
        for (uint i = 0; i != _tierArray.length; i++) {
            TierMap memory map = _tierArray[i];
            if (tokenID >= map.minTokenID && tokenID <= map.maxTokenID) {
                _uri = map.uri;
                break;
            }
        }
        return _uri;
    }

    function getHighestMintableTokenID() public view returns (uint256) {
        return _highestMintableTokenID;
    }

    function getLatestTier() public view returns (uint) {
        return _tier;
    }
}