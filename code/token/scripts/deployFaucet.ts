import { ethers } from "hardhat";
import { Faucet, Faucet__factory } from "../typechain-types";

async function main(): Promise<void> {
  const TOKEN_VAL = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // insert token address here
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(TOKEN_VAL);

  await faucet.waitForDeployment();

  console.log("Faucet Token deployed: ", await faucet.getAddress());
}

main().catch((error: Error) => {
  console.error(error);
  process.exitCode = 1;
});
