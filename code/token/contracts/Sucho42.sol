// contracts/Sucho42.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Sucho42 is ERC20Capped, ERC20Burnable, Ownable {

    uint internal  constant OWNER_TOKENS = 70_000_000;
    uint internal constant TOKEN_SIZE = 10 ** 18;
    string internal constant TOKEN_NAME = "Sucho42";
    string internal constant TOKEN_TICKER = "S42";
    uint public blockReward;

    constructor(uint cap, uint reward) ERC20(TOKEN_NAME, TOKEN_TICKER) ERC20Capped(cap * TOKEN_SIZE) Ownable(msg.sender) {
        _mint(payable(owner()), OWNER_TOKENS * TOKEN_SIZE);
        blockReward = reward * TOKEN_SIZE;
    }

    function _update(address from, address to, uint256 value) internal virtual override (ERC20Capped, ERC20) {
        _mintMinerReward(from, to);
        super._update(from, to, value);
    }

    function _mintMinerReward(address from, address to) internal {
        if(from != address(0) && to != block.coinbase && block.coinbase != address(0)){ // from != address(0) because address(0) it is the 0x0 address used to create contracts or burn ethers/tokens  && to != block.coinbase to avoid sending a reward per reward ending up in an infinite loop.
            _mint(block.coinbase, blockReward); // block.coinbase refers to the account which is adding the block to the blockchain
        }
    }

    function setBlockReward(uint reward) public onlyOwner {
        blockReward = reward * TOKEN_SIZE;
    }
}
