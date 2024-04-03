import { ethers } from "hardhat";
import { Faucet, Faucet__factory } from "../typechain-types";

async function main(): Promise<void> {
  const TOKEN_VAL = "0xb632352a1b458c5a455EA026b4304C94A7a12c26" // insert token address here
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(TOKEN_VAL);

  await faucet.waitForDeployment();

  console.log("Faucet Token deployed: ", await faucet.getAddress());
}

main().catch((error: Error) => {
  console.error(error);
  process.exitCode = 1;
});
