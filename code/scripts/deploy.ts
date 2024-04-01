import { ethers } from "hardhat";
import { Sucho42, Sucho42__factory } from "../typechain-types";

async function main(): Promise<void> {
  const Sucho42Token = await ethers.getContractFactory("Sucho42");
  const sucho42token = await Sucho42Token.deploy(100000000, 50);

  await sucho42token.waitForDeployment();

  console.log("Sucho42 Token deployed: ", await sucho42token.getAddress());
}

main().catch((error: Error) => {
  console.error(error);
  process.exitCode = 1;
});
