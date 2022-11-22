# Permit-Phishing

This is the implementation of the fake signature scam that is potentially could be used by hackers to steal ERC20 tokens.
Exclusivelly for my article: [link (click)](https://medium.com/@romanrakhlin/the-dark-side-of-permits-eip2612-c66ff71bf635?source=friends_link&sk=45b59c5e461386fc3526e762b4610c16)

**This is only for educational purposes!!**

## Permit1

The first scam is the fake EIP2612 signature that is working with ERC20 tokens that have Permit functionality implemented in their smart-contract.
Here's the full list of ERC20 tokens that could be stolen with that code: [full list (click)](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2Fyashnaman%2FtokensWithPermitFunctionList)

## Permit2

This scam is created for the new Uniswap's smart-contract: [Permit2](https://github.com/Uniswap/permit2)
With the code you can find in permit2 folder, you can steal any ERC20 token that is approved to the [Permit2 smart-contract](https://etherscan.io/address/0x000000000022D473030F116dDEE9F6B43aC78BA3)

The implementation is really basic because it's a quick demo that I made for my article. However I think that scammers will create a much better solution in the near future.

## Have any questions?

If you don't understand something about the implementation or how to run it on your own machine, go see the article or reach me out in telegram: [@romanrakhlin](https://t.me/romanrakhlin)

Hope you like this repo and my article. I would really appreciate if you leave a start on this repo!