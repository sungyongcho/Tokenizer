import { useEffect, useState } from "react";
import MultiSigWallet from "./components/MultiSigWallet";
import web3 from "web3"

function MultiSig() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, []);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("accounts", accounts)
        if (accounts.length > 0) {
          setWalletAddress(web3.utils.toChecksumAddress(accounts[0]));
        } else {
          console.log("No account available");
        }
      } catch (err: any) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(web3.utils.toChecksumAddress(accounts[0]));
        } else {
          console.log("No account available");
        }
      } catch (err: any) {
        console.error(err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(web3.utils.toChecksumAddress(accounts[0]));
      });
    } else {
      console.log("Please install MetaMask");
    }
  };

  return (
    <div>
      <h1>Multi Sig Wallet</h1>
      {walletAddress ? (
        <>
          <div>Account: {walletAddress}</div>
          <MultiSigWallet account={walletAddress} />
        </>
      ) : (
        <>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            Metamask is not connected
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
            onClick={() => connectWallet()}
          >
            Connect to Metamask
          </button>
        </>
      )}
    </div>
  );
}

export default MultiSig;
