// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20Token is ERC20{
    constructor(string memory name_, string memory symblo_) ERC20(name_,symblo_){
        _mint(msg.sender,10000*10**18);
    }
}