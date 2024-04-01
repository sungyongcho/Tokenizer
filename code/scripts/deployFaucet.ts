import { ethers } from "hardhat";
import { Faucet, Faucet__factory } from "../typechain-types";

async function main(): Promise<void> {
  const TOKEN_VAL = "" // insert token val here
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(TOKEN_VAL);

  await faucet.waitForDeployment();

  console.log("Faucet Token deployed: ", await faucet.getAddress());
}

main().catch((error: Error) => {
  console.error(error);
  process.exitCode = 1;
});
