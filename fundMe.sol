// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundMe {

    uint public minUsd;
    address payable owner;
    AggregatorV3Interface internal priceFeed;

    constructor(){
        owner = payable(msg.sender);
        priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        minUsd = 50 * 1e18;
    }

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    // Here we want minimum 50 usd but the users will send the value in ether
    // Now we have to know how much ether === 50 usd, and ether's price keeps changing every second in the market
    // Here we use chainlink's price feed to get real time value of ether in terms of usd (ether/usd)

    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // msg.value is in wei we have to convert eth usd value to wei as well
        require(msg.value > requiredEth(), "Didn't send enough");
    }

    function getEthPrice() public view returns(uint256) {
        (,int price,,,) = priceFeed.latestRoundData();
        uint8 decimals = priceFeed.decimals();
        return uint(price)*(10**(18-decimals));
    }

    function requiredEth() internal view returns(uint){
        uint ethPrice = getEthPrice();
        return minUsd / ethPrice;
    }

    function setMinUsd(uint _minUsd) external onlyOwner {
        minUsd = _minUsd;
    }
    

    // function withdraw() public {

    // }
}