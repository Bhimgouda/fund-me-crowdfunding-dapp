const { developmentChains, newtorkConfig } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")

// hre = hardhat runtime environment
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(chainId)) {
        // Getting the most recent deployments with contrat name
        // Getting the mock contract that we just deployed
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = newtorkConfig[chainId].ethUsdPriceFeed
    }

    const args = [ethUsdPriceFeedAddress]

    // Deploying
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1,
    })
    log("-----------------------------------")

    // Auto verify of deployed smart contracts on mainnet and test-net
    if (!developmentChains.includes(chainId)) {
        await verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundme"]
