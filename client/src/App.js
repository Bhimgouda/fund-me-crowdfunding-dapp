import { ethers } from "ethers"
import { useState, useEffect } from "react"
import { abi, contractAddress } from "./constants"
import Overlay from "./components/Overlay"
import FundersList from "./components/FundersList"
import WithdrawsList from "./components/WithdrawsList"

function App() {
    const [provider, setProvider] = useState()
    const [contract, setContract] = useState()
    const [funders, setFunders] = useState([])
    const [withdraws, setWithdraws] = useState([])
    const [signerAddress, setSignerAddress] = useState()
    const [loading, setLoading] = useState(false)
    const [owner, setOwner] = useState()
    const [priceFeed, setPriceFeed] = useState()
    const [connected, setConnected] = useState()
    const [balance, setBalance] = useState()

    useEffect(() => {
        if (!window.ethereum) return
        try {
            getWeb3Provider()
        } catch (e) {
            console.log("Needs to connect wallet")
        }
    }, [])

    async function getWeb3Provider() {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = newProvider.getSigner()

        let address
        try {
            address = await signer.getAddress()
        } catch (e) {
            address = undefined
            console.log("User wallet Not connected")
        }

        if (!address) return

        const newContract = new ethers.Contract(contractAddress, abi, signer)

        setSignerAddress(address)
        setProvider(newProvider)
        setContract(newContract)
        setConnected(true)
    }

    useEffect(() => {
        if (!contract) return
        getContractData(contract)
        getFundersList(contract)
        getWithdrawsList(contract)
    }, [contract])

    useEffect(() => {
        if (!contract) return

        contract.on("FundingSuccessful", () => {
            getFundersList(contract)
            setLoading(false)
            console.log("Funding Successful")
        })

        contract.on("WithdrawSuccessful", () => {
            getWithdrawsList(contract)
            setLoading(false)
            console.log("Withdraw Successful")
        })
    }, [contract])

    async function getContractData(contract) {
        const ownerAddress = await contract.getOwner()
        const newPriceFeed = await contract.getPriceFeed()

        setOwner(ownerAddress)
        setPriceFeed(newPriceFeed)
    }

    async function getFundersList(contract) {
        const newFunders = await contract.getAllFunders()
        setFunders(newFunders)
    }

    async function getWithdrawsList(contract) {
        const newWithdraws = await contract.getAllWithdraws()
        setWithdraws(newWithdraws)
    }

    const getBalance = async () => {
        if (typeof window.ethereum != "undefined") {
            const balance = await provider.getBalance(contractAddress)
            setBalance(ethers.utils.formatEther(balance))
        }
    }

    async function handleConnect() {
        if (!window.ethereum) {
            return console.log(
                "Please get metamask to interact with this website"
            )
        }
        await window.ethereum.request({
            method: "eth_requestAccounts",
        })

        getWeb3Provider()
    }

    const handleWithdraw = async () => {
        if (!contract) return

        // Adding a timestamp as well
        let time = new Date().toUTCString()
        time = time.slice(5)

        setLoading(true)
        try {
            const transactionResponse = await contract.withdraw(time)
            // await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const handleFund = async () => {
        if (!contract) return

        setLoading(true)

        const ethAmount = document.querySelector("#eth-amount").value
        if (!window.ethereum || !ethAmount) return
        console.log(`Funding with ${ethAmount}`)

        // Adding a timestamp as well
        let time = new Date().toUTCString()
        time = time.slice(5)

        try {
            const transactionResponse = await contract.fund(time, {
                value: ethers.utils.parseEther(ethAmount),
            })
        } catch (e) {
            setLoading(false)
            console.log(e)
        }
    }

    console.log(loading)

    return connected ? (
        !loading ? (
            <>
                <div className="container">
                    <div className="connect-wallet-container">
                        <div className="wallet-status">
                            <span>Connected wallet: </span>
                            <span className="wallet-address">
                                {signerAddress}
                            </span>
                        </div>
                        {!connected && (
                            <button
                                onClick={handleConnect}
                                className="button-connect-wallet"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                    <div className="main">
                        <div className="hero">
                            <h1 className="title">Fund Me</h1>
                        </div>
                        <div className="actions">
                            <div className="withdraw-fund-container">
                                {owner === signerAddress ? (
                                    <button
                                        onClick={handleWithdraw}
                                        id="withdraw-btn"
                                    >
                                        Withdraw
                                    </button>
                                ) : null}
                                <div className="input-container">
                                    <input
                                        name="eth-amount"
                                        id="eth-amount"
                                        placeholder="0.1"
                                        type="text"
                                        className="input-eth-amount"
                                    />
                                    <button
                                        onClick={handleFund}
                                        id="fund-btn"
                                        className="button-fund"
                                    >
                                        Fund
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 style={{ textAlign: "center" }}>
                        {balance ? `${balance} Eth` : null}{" "}
                    </h1>
                    <button onClick={getBalance} id="balance-btn">
                        Get Balance
                    </button>
                </div>
                <div className="lists">
                    <FundersList funders={funders} />
                    <WithdrawsList withdraws={withdraws} owner={owner} />
                </div>
            </>
        ) : (
            <Overlay loading={loading} />
        )
    ) : (
        <Overlay handleConnect={handleConnect} />
    )
}

export default App
