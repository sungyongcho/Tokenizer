# Sucho42 token contracts

Hardhat project for the Sucho42 (S42) ERC-20 token, the faucet and the multi-signature wallet.
Copy `env.example` to `.env` and set `PRIVATE_KEY` and `INFURA_SEPOLIA_ENDPOINT` before deploying to Sepolia.

```shell
npm install
npx hardhat test                                              # run the token tests
npx hardhat node                                              # local test chain
npx hardhat run --network localhost scripts/deploy.ts         # token
npx hardhat run --network localhost scripts/deployFaucet.ts   # faucet
npx hardhat run --network localhost scripts/deployMultiSigWallet.ts  # multisig wallet
```

Use `--network sepolia` to deploy to the Sepolia testnet. The scripts in `../../deployment` wrap these commands.
