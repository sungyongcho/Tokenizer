import { ethers } from "hardhat";
import { Faucet, Faucet__factory } from "../typechain-types";

/**
 *
 * Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (10000 ETH)
Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a

Account #5: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc (10000 ETH)
Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba

 */

async function main(): Promise<void> {
  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const multiSigWallet = await MultiSigWallet.deploy(process.env.TOKEN_ADDRESS || "", [process.env.MULTISIG_ACCOUNT_1 || "",
  process.env.MULTISIG_ACCOUNT_2 || "",
  process.env.MULTISIG_ACCOUNT_3 || "",
  process.env.MULTISIG_ACCOUNT_4 || "",
  process.env.MULTISIG_ACCOUNT_5 || ""], 2);

  await multiSigWallet.waitForDeployment();

  console.log("Multi Signature Wallet deployed: ", await multiSigWallet.getAddress());
}

main().catch((error: Error) => {
  console.error(error);
  process.exitCode = 1;
});
