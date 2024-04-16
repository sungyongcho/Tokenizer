import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "@nomiclabs/hardhat-truffle5";
import "@nomiclabs/hardhat-ganache";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.25",
  networks: {
    sepolia: {
      url: process.env.INFURA_SEPOLIA_ENDPOINT,
      accounts: [process.env.PRIVATE_KEY || '']
    },
  }
};

export default config;
