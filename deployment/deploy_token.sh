#!/bin/sh

# Change directory to your Hardhat project directory
cd ../code/token

# Use the first argument as the network, defaulting to "mainnet" if no argument is provided
network="${1:-sepolia}"

# Run Hardhat script to deploy smart contracts with the specified network
npx hardhat run --network "$network" scripts/deploy.ts
