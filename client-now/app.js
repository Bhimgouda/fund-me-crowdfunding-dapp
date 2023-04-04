import { ethers } from "../client/src/ethers-5.6.esm.min.js"
import { abi, contractAddress } from "../client/src/constants.js"

console.log(ethers)

const connectBtn = document.querySelector("#connect-btn")
const fundBtn = document.querySelector("#fund-btn")
const balanceBtn = document.querySelector("#balance-btn")
const withdrawBtn = document.querySelector("#withdraw-btn")

connectBtn.addEventListener("click", connect)

fundBtn.addEventListener("click", fund)

balanceBtn.addEventListener("click", getBalance)

withdrawBtn.addEventListener("click", withdraw)

async function connect() {
    if (!window.ethereum) {
        return console.log("Please get metamask to interact with this website")
    }
    // const userAccount = (
    //     await window.ethereum.request({
    //         method: "eth_requestAccounts",
    //     })
    // )[0]
    // console.log(userAccount)
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log(`withdrawing...`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

async function fund() {
    const ethAmount = document.querySelector("#eth-amount").value
    if (!window.ethereum || !ethAmount) return
    console.log(`Funding with ${ethAmount}`)

    // To actually move forward and make API calls to the metamask we need,

    // user's account address (wallet address)
    // contract ABI and Address

    // Getting the node providers RPC url from users metamask instead of having our own
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Also getting signer since our provider is connected to metamask
    const signer = provider.getSigner()

    // Instantiating contract
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        })

        // Listen for the txn to be mined
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done!")
        // or
        // Listen for a event that is emmited by SC if the txn is successful
    } catch (e) {
        console.log(e)
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Minning ${transactionResponse.hash}...`)
    // Listen for this txn to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmed`
            )
            resolve()
        })
    })
}
