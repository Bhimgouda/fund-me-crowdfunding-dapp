// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    uint public minUsd = 50 * 1e18;
    address payable private owner;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        owner = payable(msg.sender);
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Here we want minimum 50 usd but the users will send the value in ether
    // Now we have to know how much ether === 50 usd, and ether's price keeps changing every second in the market
    // Here we use chainlink's price feed to get real time value of ether in terms of usd (ether/usd)

    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // msg.value is in wei we have to convert eth usd value to wei as well
        require(
            msg.value >= minUsd.requiredEth(priceFeed),
            "Didn't send enough"
        );
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function setMinUsd(uint _minUsd) external onlyOwner {
        minUsd = _minUsd * 1e18;
    }

    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }
}
