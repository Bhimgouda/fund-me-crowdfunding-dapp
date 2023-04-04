// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "hardhat/console.sol";
import "./PriceConverter.sol";

// Error Class
error FundMe__NotOwner(); // Following the error naming convention

/** @title A contract for crowd funding
 * @author Bhimgouda Patil
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */

struct Funder {
    address funderAddress;
    uint amountFunded;
    string timeStamp;
}

struct Withdraw {
    uint withdrawAmount;
    string timeStamp;
}

contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    uint public s_minUsd = 50 * 1e18;
    address payable private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;
    Funder[] private s_funders;
    Withdraw[] private s_withdraws;

    // Events and Modifiers

    event FundingSuccessful(address funderAddress, uint funderAmount);
    event WithdrawSuccessful(address withdrawAddress, uint withdrawAmount);

    modifier onlyOwner() {
        // require(msg.sender == i_owner); (We are using if for sending custom error)
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = payable(msg.sender);
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund("");
    }

    fallback() external payable {
        fund("");
    }

    function setMinUsd(uint _minUsd) external onlyOwner {
        s_minUsd = _minUsd * 1e18;
    }

    /**
     * @notice This function funds this contract
     * @dev This implements price feeds as our library
     */
    function fund(string memory timeStamp) public payable {
        // Here we want minimum 50 usd but the users will send the value in ether
        // Now we have to know how much ether === 50 usd, and ether's price keeps changing every second in the market
        // Here we use chainlink's price feed to get real time value of ether in terms of usd (ether/usd)
        // Want to be able to set a minimum fund amount in USD
        // msg.value is in wei we have to convert eth usd value to wei as well
        require(
            msg.value >= s_minUsd.requiredEth(s_priceFeed),
            "Didn't send enough"
        );
        Funder memory funder = Funder(msg.sender, msg.value, timeStamp);
        s_funders.push(funder);
        emit FundingSuccessful(msg.sender, msg.value);
    }

    function withdraw(string memory timeStamp) public onlyOwner {
        uint contractBalance = address(this).balance;
        i_owner.transfer(contractBalance);
        s_withdraws.push(Withdraw(contractBalance, timeStamp));
        emit WithdrawSuccessful(i_owner, contractBalance);
    }

    // We changed every state variable to private
    // 1. We don't want people to get confused by such variable names such as s_owner
    // 2. And reading from private varibale in our functions is a little cheaper

    // Now we are making getter functions for the variable
    // that we want people to call these API's that make sense

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (Funder memory) {
        return s_funders[index];
    }

    function getAllFunders() public view returns (Funder[] memory) {
        return s_funders;
    }

    function getAllWithdraws() public view returns (Withdraw[] memory) {
        return s_withdraws;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
