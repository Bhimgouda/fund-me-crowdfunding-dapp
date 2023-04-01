// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// This is just a library without any state variable's and just has some useful functions, that we can use in our main contract

library PriceConverter {
    function getEthPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // Instatiating a smart contract
        (, int price, , , ) = priceFeed.latestRoundData();
        uint8 decimals = priceFeed.decimals();
        return uint(price) * (10 ** (18 - decimals));
    }

    function requiredEth(
        uint _minUsd,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint) {
        return (_minUsd * 1e18) / getEthPrice(priceFeed);
    }
}
