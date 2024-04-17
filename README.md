# Tokenizer: Sucho42 Token Project

The Tokenizer project introduces the Sucho42 Token, offering an educational journey into blockchain technology through the development and deployment of a custom ERC-20 token. Named after the author's unique intra ID at 42, this endeavor serves as a tangible demonstration of tokenization concepts and their practical implications. Utilizing the Ethereum blockchain and Solidity programming language, the project meticulously showcases core token features, robust security measures, and seamless deployment procedures. With an emphasis on user-friendly interaction, individuals can engage with the token through MetaMask and Remix IDE, while future iterations hold promise for ecosystem expansion.

## Prerequisites
- Installation of MetaMask is required.
- Node environment must be deployable for deployment purposes.

## Technologies Utilized
- Solidity v0.8.25
- Hardhat v2.22.2
- OpenZeppelin Contracts v5.x (specifically v5.0.2)
- Create React App v5.0.1
- Remix IDE v0.47.0 (utilized for development)

## Deployment Instructions
In the 'deployment' folder, execute the following shell scripts in sequential order:
```
# For deploying on sepolia network:
./deploy_token.sh # Deploy the token contract on sepolia.
./deploy_faucet.sh # Deploy the token contract on sepolia.
./deploy_multisig.sh # Deploy the token contract on sepolia.
./deply_web.sh # Deploy the web application (faucet, multisig).

# For testing on local blockchain using hardhat
./start_hardhat_node.sh # Deploy Ethereum test blockchain.
./deploy_token.sh localhost # Deploy the token contract on localhost.
./deploy_faucet.sh localhost # Deploy the faucet contract on localhost.
./deploy_multisig.sh localhost # Deploy the multisig contract on localhost.
./deply_web.sh # Deploy the web application (faucet, multisig).
```
Make sure the token values are set correctly on the environment variable.

## References
- [OpenZeppelin | contracts - Solidity Wizard](https://wizard.openzeppelin.com/)
- [What is Blockchain - Ledger Academy](https://www.ledger.com/academy/what-is-blockchain)
- [How Does a Blockchain Transaction Work - Ledger Academy](https://www.ledger.com/academy/how-does-a-blockchain-transaction-work)
- [ERC20 Token Tutorial | Create Your Own Cryptocurrency](https://www.youtube.com/watch?v=gc7e90MHvl8)
- [Faucet Smart Contract Tutorial | Solidity Tutorial](https://www.youtube.com/watch?v=jKW_0PQuIQw)
- [Web3 Tutorial Project | Build a Faucet dApp with Ethersjs & Reactjs](https://www.youtube.com/watch?v=Yecd8UtY8cI)
- For Bonus:
	- [Solidity Applications](https://www.youtube.com/watch?v=Dh7r6Ze-0Bs&list=PLO5VPQH6OWdVfvNOaEhBtA53XHyHo_oJo) (Sections 1, 6, 7, 8, 9 recommended)
	- [Solidity By Example - Multi-Sig Wallet](https://solidity-by-example.org/app/multi-sig-wallet/)
