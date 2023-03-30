const {
    networkConfig,
    developementChains,
    newtorkConfig,
} = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

// hre = hardhat runtime environment
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeed

    if (developementChains.includes(chainId)) {
        // Getting the most recent deployments with contrat name
        // Getting the mock contract that we just deployed
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = newtorkConfig[chainId].ethUsdPriceFeed
    }

    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmation || 1,
    })
    log("-----------------------------------")

    // Auto verify of deployed smart contracts on mainnet and test-net
    if (!developementChains.includes(chainId)) {
        await verify(fundMe.address, args)
    }
}

module.exports.tags = ["all", "fundme"]
