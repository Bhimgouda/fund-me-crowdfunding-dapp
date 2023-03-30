require("hardhat-deploy")
// require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.18",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            // gasPrice: 130000000000,
        },
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/NU-UqlzGIQ-MfsZXjzcdhNAbYCCrw3Ip",
            accounts: [
                "aa59251622346e94de1071fa9b6cbccd5ad8a31b7df4e662b7c574e8080d83ab",
            ],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
}
