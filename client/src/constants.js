export const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
export const abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "priceFeedAddress",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "FundMe__NotOwner",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "funderAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "funderAmount",
                type: "uint256",
            },
        ],
        name: "FundingSuccessful",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "withdrawAddress",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "withdrawAmount",
                type: "uint256",
            },
        ],
        name: "WithdrawSuccessful",
        type: "event",
    },
    {
        stateMutability: "payable",
        type: "fallback",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "timeStamp",
                type: "string",
            },
        ],
        name: "fund",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllFunders",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "funderAddress",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amountFunded",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "timeStamp",
                        type: "string",
                    },
                ],
                internalType: "struct Funder[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllWithdraws",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "withdrawAmount",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "timeStamp",
                        type: "string",
                    },
                ],
                internalType: "struct Withdraw[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "getFunder",
        outputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "funderAddress",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "amountFunded",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "timeStamp",
                        type: "string",
                    },
                ],
                internalType: "struct Funder",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getOwner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getPriceFeed",
        outputs: [
            {
                internalType: "contract AggregatorV3Interface",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "s_minUsd",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_minUsd",
                type: "uint256",
            },
        ],
        name: "setMinUsd",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "timeStamp",
                type: "string",
            },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
]
