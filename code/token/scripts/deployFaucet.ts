import { ethers } from "hardhat";
import dotenv from "dotenv"

dotenv.config()

async function main(): Promise<void> {
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(process.env.TOKEN_ADDRESS || "");

  await faucet.waitForDeployment();

  console.log("Faucet Token deployed: ", await faucet.getAddress());
}

main().catch((error: Error) => {
  console.error(error);
  process.exitCode = 1;
});
