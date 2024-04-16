#!/bin/sh

# Change directory to your Hardhat project directory
cd ../code/token

# Run each Hardhat script to deploy smart contracts with the specified network
npx hardhat run --network localhost scripts/deploy.ts
npx hardhat run --network localhost scripts/deployFaucet.ts
npx hardhat run --network localhost scripts/deployMultiSigWallet.ts
