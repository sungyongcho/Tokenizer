import { expect } from "chai";
import { ethers } from "hardhat";
import { formatEther } from "ethers";
import { GLDToken, GLDToken__factory } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("GLDToken contract", () => {
  let Token: GLDToken__factory;
  let gldToken: GLDToken;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;
  const TOKEN_CAP: number = 100_000_000;
  const TOKEN_BLOCK_REWARD: number = 50;
  const DECIMALS: bigint = 10n ** 18n;

  beforeEach(async () => {
    Token = await ethers.getContractFactory("Sucho42");
    [owner, addr1, addr2] = await ethers.getSigners();
    gldToken = await Token.deploy(TOKEN_CAP, TOKEN_BLOCK_REWARD);
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await gldToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await gldToken.balanceOf(owner.address);
      expect(await gldToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async () => {
      const cap = await gldToken.cap();
      expect(Number(formatEther(cap))).to.equal(TOKEN_CAP);
    });

    it("Should set the blockReward to the argument provided during deployment", async () => {
      const blockReward = await gldToken.blockReward();
      expect(Number(formatEther(blockReward))).to.equal(TOKEN_BLOCK_REWARD);
    });
  });

  describe("Transactions", () => {
    it("Should transfer tokens between accounts", async () => {
      // Transfer 50 tokens from owner to addr1
      await gldToken.transfer(addr1.address, 50);
      const addr1Balance = await gldToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await gldToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await gldToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async () => {
      const initialOwnerBalance = await gldToken.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      await expect(
        gldToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError;

      // Owner balance shouldn't have changed.
      expect(await gldToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async () => {
      const initialOwnerBalance: bigint = await gldToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await gldToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await gldToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await gldToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150n);

      const addr1Balance = await gldToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await gldToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Test miner reward", async () => {
      await gldToken.transfer(addr1.address, 100);
      const blockCoinbaseAddress: string = "0xc014ba5ec014ba5ec014ba5ec014ba5ec014ba5e"; // The address used as coinbase in new blocks in HardHat https://hardhat.org/hardhat-network/docs/reference#:~:text=%23-,coinbase,-The%20address%20used
      const blockCoinbaseBalance: bigint = await gldToken.balanceOf(blockCoinbaseAddress);
      expect(blockCoinbaseBalance).to.equal(BigInt(TOKEN_BLOCK_REWARD) * DECIMALS);
    })
  });

  describe("Burning tokens", () => {
    it("Should burn tokens from the owner's address", async () => {
      await gldToken.burn(25_000_000n * DECIMALS);
      const ownerBalance: bigint = await gldToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(45_000_000n * DECIMALS);
    });
  });
});
