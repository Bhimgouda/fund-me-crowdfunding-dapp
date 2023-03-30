// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

/** @title A contract for crowd funding
 * @author Bhimgouda Patil
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */

contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    uint public minUsd = 50 * 1e18;
    address payable private owner;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    AggregatorV3Interface public priceFeed;

    // Events and Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address priceFeedAddress) {
        owner = payable(msg.sender);
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund()
    }

    fallback() external payable {
        fund()
    }

    function setMinUsd(uint _minUsd) external onlyOwner {
        minUsd = _minUsd * 1e18;
    }

    /**
     * @notice This function funds this contract
     * @dev This implements price feeds as our library 
     */
    function fund() public payable {
        // Here we want minimum 50 usd but the users will send the value in ether
        // Now we have to know how much ether === 50 usd, and ether's price keeps changing every second in the market
        // Here we use chainlink's price feed to get real time value of ether in terms of usd (ether/usd)
        // Want to be able to set a minimum fund amount in USD
        // msg.value is in wei we have to convert eth usd value to wei as well
        require(
            msg.value >= minUsd.requiredEth(priceFeed),
            "Didn't send enough"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }
}
