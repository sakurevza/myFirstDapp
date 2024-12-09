// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract bank {
    mapping(address => uint256) public deposited;

    address public immutable token;

    constructor(address _token) {
        token = _token;
    }

    modifier requireBalance(uint _amonut){
        _amonut = _amonut * 10**18;        
        require(
            deposited[msg.sender] >= _amonut,
            "the amount more than of balance"
        );
        _;
    }

    // view 纯函数不上链 不消耗gas
    function myBalance() public view returns (uint256 balance) {
        // return deposit[msg.sender];
        balance = deposited[msg.sender] / 10**18;
        // 0xb6b55f250000000000000000000000000000000000000000000000000000000000000064
    }

    function deposit(uint256 _amonut) public{
        _amonut = _amonut * 10**18;
        require(IERC20(token).transferFrom(msg.sender, address(this), _amonut));
        deposited[msg.sender] += _amonut;
    }

    //external 外部可条用
    function withdraw(uint256 _amonut) external requireBalance(_amonut){
        _amonut = _amonut * 10**18;
        // require(
        //     deposited[msg.sender] >= _amonut,
        //     "the amount more than of balance"
        // );
        // require(IERC20(token).transfer(msg.sender,_amonut));
        SafeERC20.safeTransfer(IERC20(token), msg.sender, _amonut);
        deposited[msg.sender] -= _amonut;
    }

   function bankTransfer(address to,uint256 _amonut) public requireBalance(_amonut){
        // require(
        //     deposited[msg.sender] >= _amonut,
        //     "the amount more than of balance"
        // );
        _amonut = _amonut * 10**18;
        deposited[msg.sender] -=_amonut;
        deposited[to] +=_amonut;
    }

}
