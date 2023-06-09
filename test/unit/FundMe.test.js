const { assert, expect } = require("chai")
const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const {
    developmentChains,
    newtorkConfig,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.config.chainId)
    ? describe.skip
    : describe("Fundme", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async function () {
              // Deploying our fundMe Contract
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) // Using tags we set in deploy script to deploy contract

              // Getting the deployed contract from the chain by uing contract name and deployer address assuming the contract is deployed
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constructor", async function () {
              it("sets the aggregator addresses correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("Fails if you don't send enough ETH", async () => {
                  // This fails and breaks but waffle overwrites chai and the test passes/Because we want it to fail
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Didn't send enough"
                  )
              })

              it("To get all the funders", async function () {
                  await fundMe.getAllFunders()

                  const response = await fundMe.getAllFunders()

                  assert.equal(response.length, 1)
              })

              it("Adds funder to array of getFunder", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0) // Adding optional index
                  assert.equal(funder.funderAddress, deployer)
              })
          })

          // We have used add,mul as the numbers we get are bigNumber
          describe("withdraw", () => {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw eth from a single funder", async function () {
                  // Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const totalGasCostForWithdraw = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  //Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance
                          .add(totalGasCostForWithdraw)
                          .toString()
                  )
              })

              it("Allows us to withdraw with multiple funders", async function () {
                  const accounts = await ethers.getSigners()

                  // Arrange
                  // As 0 is deployers account
                  for (let i = 1; i < 6; i++) {
                      // Here we want other accounts to sign the transcation
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)

                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const totalGasCostForWithdraw = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  //Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance
                          .add(totalGasCostForWithdraw)
                          .toString()
                  )
              })

              it("Only Allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner")
              })
          })
      })
