import { useEffect, useState } from "react";
import { Contract, JsonRpcSigner, ethers } from "ethers"
import faucetContract from "./ethereum/faucet";
import web3 from "web3"

declare global {
  interface Window {
    ethereum?: any; // Adjust the type as needed
  }
}

function Faucet() {

  const [walletAddress, setWalletAddress] = useState<string>("");
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [fcContract, setFcContract] = useState<Contract | undefined>(undefined);
  const [withdrawError, setWithdrawError] = useState<string>("");
  const [withdrawSuccess, setWithdrawSuccess] = useState<string>("");
  const [transactionData, setTransactionData] = useState<string>("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        /* get provider */
        const provider = new ethers.BrowserProvider(window.ethereum);
        /* get accounts */
        const signerResult = await provider.getSigner();
        const faucetContractInstance = faucetContract(provider);

        // Wait for the promise to resolve
        setSigner(signerResult);
        setFcContract(faucetContractInstance);

        /* MetaMask is installed */
        const metaMaskAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }) as string[];
        setWalletAddress(web3.utils.toChecksumAddress(metaMaskAccounts[0]));
        console.log("meta mast connected", metaMaskAccounts[0]);
      } catch (err: any) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  }

  const getCurrentWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        /* get accounts */
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          const signerResult = await provider.getSigner();
          const faucetContractInstance = faucetContract(provider);

          // Wait for the promise to resolve
          setSigner(signerResult);
          setFcContract(faucetContractInstance);
          setWalletAddress(web3.utils.toChecksumAddress(accounts[0]));
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err: any) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(web3.utils.toChecksumAddress(accounts[0]));
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getS42Handler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      if (!fcContract || !signer) {
        throw new Error("Faucet contract or signer is not available");
      }
      const fcContractWithSigner = fcContract.connect(signer);

      const tx = await (fcContractWithSigner as any)['requestTokens'](); // Type assertion to 'any'

      console.log(tx);
      // Wait for transaction receipt
      const receipt = await tx.wait(); // This will wait until the transaction is mined and return the receipt

      console.log(receipt);
      if (receipt && receipt.status === 1) {
        setWithdrawSuccess("Operation Succeeded - enjoy your tokens!");
        setTransactionData(tx.hash)
      } else {
        throw new Error("Transaction failed");
      }
      // setTransactionData(res.transactionHash);
    } catch (err: any) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  return (
    <div className="relative text-center">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={connectWallet}
      >
        <span className="is-link has-text-weight-bold">
          {walletAddress && walletAddress.length > 0
            ? `Connected: ${walletAddress.substring(
              0,
              6
            )}...${walletAddress.substring(38)}`
            : "Connect Wallet"}
        </span>
      </button>
      <div>
        <div>
          Faucet smart contract address: {process.env.REACT_APP_FAUCET_ADDRESS}
        </div>
        <section className="min-h-screen flex items-center justify-center">
          <div className="faucet-hero-body">
            <div className="container mx-auto text-center main-content">
              <h1 className="text-4xl font-bold mb-4">Faucet</h1>
              <p className="text-lg mb-4">Fast and reliable. 50 S42/minute.</p>
              <div className="mt-5">
                {withdrawError && (
                  <div className="text-red-500">
                    {withdrawError}
                  </div>
                )}
                {withdrawSuccess && (
                  <div className="text-green-500">
                    {withdrawSuccess}
                  </div>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md mt-8">
                <div className="flex items-center">
                  <input
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-400"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                  />
                  {/* Button disabled since there's no getS42Handler */}
                  <div className="ml-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md" onClick={getS42Handler}>
                      GET TOKENS
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">Transaction Data</p>
                  <div className="bg-gray-200 rounded-md p-2 mt-2">
                    <p>{transactionData ? `Transaction hash: ${transactionData}` : "--"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div >
    </div >
  )
}

export default Faucet
