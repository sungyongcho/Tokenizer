import { useEffect, useState } from "react";
import "./App.css";
import { Contract, JsonRpcSigner, ethers } from "ethers"
import faucetContract from "./ethereum/faucet";

declare global {
  interface Window {
    ethereum?: any; // Adjust the type as needed
  }
}



function App() {
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
        const accounts = await provider.send("eth_requestAccounts", []);
        const signerPromise = provider.getSigner();
        const faucetContractInstance = faucetContract(provider);

        // Wait for the promise to resolve
        const signerResult = await signerPromise;
        setSigner(signerResult);
        setFcContract(faucetContractInstance);

        /* MetaMask is installed */
        const metaMaskAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }) as string[];
        setWalletAddress(metaMaskAccounts[0]);
        console.log(metaMaskAccounts[0]);
      } catch (err: any) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

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
          setWalletAddress(accounts[0]);
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
        setWalletAddress(accounts[0]);
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

      await tx.wait();
      const receipt = await signer.provider.getTransactionReceipt(tx.hash);

      // Call the requestTokens function of the contract

      // Wait for transaction confirmation
      // Check if the transaction was successful
      if (receipt && receipt.status === 1) {
        setWithdrawSuccess("Operation Succeeded - enjoy your tokens!");
        console.log(tx)
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
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Ocean Token (OCT)</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
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
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Faucet</h1>
            <p>Fast and reliable. 50 OCT/day.</p>
            <div className="mt-5">
              {withdrawError && (
                <div className="withdraw-error">
                  {withdrawError}
                </div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-success">
                  {withdrawSuccess}
                </div>
              )}{" "}
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                  />
                </div>
                <div className="column">
                  <button className="button is-link is-medium" onClick={getS42Handler}>
                    GET TOKENS
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  <p> {transactionData ? `Transaction hash: ${transactionData}` : "--"}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
