import { useEffect, useState } from "react";
import "./App.css";
import { Contract, JsonRpcSigner, ethers } from "ethers"
import multiSigContract from "./ethereum/multiSigWallet";
import { Button, Message } from "semantic-ui-react"
import { useWeb3Context } from "./contexts/Web3";
import { unlockAccount } from "./api/web3";
import useAsync from "./components/useAsync";
import MultiSigWallet from "./MultiSigWallet";
declare global {
  interface Window {
    ethereum?: any; // Adjust the type as needed
  }
}



function MultiSigApp() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [fcContract, setFcContract] = useState<Contract | undefined>(undefined);
  const [withdrawError, setWithdrawError] = useState<string>("");
  const [withdrawSuccess, setWithdrawSuccess] = useState<string>("");
  const [transactionData, setTransactionData] = useState<string>("");
  const [txNumber, setTransactionNumber] = useState<number>();


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
        const faucetContractInstance = multiSigContract(provider);

        // Wait for the promise to resolve
        setSigner(signerResult);
        setFcContract(faucetContractInstance);

        /* MetaMask is installed */
        const metaMaskAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        }) as string[];
        setWalletAddress(metaMaskAccounts[0]);
        console.log("meta mast connected", metaMaskAccounts[0]);
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
          const faucetContractInstance = multiSigContract(provider);

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


  const checkBalanceHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      if (!fcContract || !signer) {
        throw new Error("Faucet contract or signer is not available");
      }

      // Call the getBalance function of the contract
      const balance = await fcContract.getBalance();

      // await tx.wait();
      console.log(balance);

      // setWithdrawSuccess(`Current balance: ${balance.toString()} tokens`);
    } catch (err: any) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  const checkOwnersHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      if (!fcContract || !signer) {
        throw new Error("Faucet contract or signer is not available");
      }
      // Call the getBalance function of the contract
      const balance = await fcContract.getOwners(); // Type assertion to 'any'

      // await tx.wait();
      console.log(balance);

      // setWithdrawSuccess(`Current balance: ${balance.toString()} tokens`);
    } catch (err: any) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  const checkTokenAddressHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      if (!fcContract || !signer) {
        throw new Error("Faucet contract or signer is not available");
      }
      // Call the getBalance function of the contract
      const balance = await fcContract.token(); // Type assertion to 'any'

      // await tx.wait();
      console.log(balance);

      // setWithdrawSuccess(`Current balance: ${balance.toString()} tokens`);
    } catch (err: any) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  const checkTransactionHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      if (!fcContract || !signer) {
        throw new Error("Faucet contract or signer is not available");
      }

      const transactionCount = await fcContract.getTransactionCount();

      const count = Number(transactionCount);

      const transactions = [];

      for (let i = 1; i <= 10; i++) {
        const txIndex = count - i;
        if (txIndex < 0)
          break;

        const tx = await fcContract.getTransaction(txIndex);
        const isConfirmed = await fcContract.isConfirmed(txIndex, signer.address);
        // const isConfirmed = await multiSig.isConfirmed(txIndex, account);
        transactions.push({ txIndex, to: tx.to, value: tx.value, data: tx.data, executed: tx.executed, numConfirmations: Number(tx.numConfirmations), isConfirmedByCurrentAccount: isConfirmed })

      }

      // await tx.wait();
      console.log(transactions);

      // setWithdrawSuccess(`Current balance: ${balance.toString()} tokens`);
    } catch (err: any) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  const checkNumConfirmationHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      if (!fcContract || !signer) {
        throw new Error("Faucet contract or signer is not available");
      }

      const balance = await fcContract.numConfirmationsRequired();

      // await tx.wait();
      console.log(balance);

    } catch (err: any) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  const confirmTransactionHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      if (!fcContract || !signer) {
        throw new Error("Faucet contract or signer is not available");
      }
      const fcContractWithSigner = fcContract.connect(signer);

      const result = await (fcContractWithSigner as any)['confirmTransaction'](txNumber);

      console.log(result);

      // setWithdrawSuccess(`Current balance: ${balance.toString()} tokens`);
    } catch (err: any) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };

  const executeTransactionHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      if (!fcContract || !signer) {
        throw new Error("Faucet contract or signer is not available");
      }
      const fcContractWithSigner = fcContract.connect(signer);

      const result = await (fcContractWithSigner as any)['executeTransaction'](txNumber);

      console.log(result);

      // setWithdrawSuccess(`Current balance: ${balance.toString()} tokens`);
    } catch (err: any) {
      console.error(err.message);
      setWithdrawError(err.message);
    }
  };


  const {
    state: { account },
    updateAccount,
  } = useWeb3Context();

  const { pending, error, call } = useAsync(unlockAccount);

  async function onClickConnect() {
    const { error, data } = await call(null);

    if (error) {
      console.error(error);
    }
    if (data) {
      updateAccount(data);
    }
  }
  console.log("aaa", account)

  return (
    <div className="App">
      <div className="App-main">

        <h1>Multi Sig Wallet</h1>
        {account ? (
          <>
            <div>Account: {account}</div>
            <MultiSigWallet account={account} />
          </>
        ) : (
          <>
            {error ? (
              <Message error>{error.message}</Message>
            ) : (
              <Message warning>Metamask is not connected</Message>
            )}
            <Button
              color="green"
              onClick={() => onClickConnect()}
              disabled={pending}
              loading={pending}
            >
              Connect to Metamask
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default MultiSigApp;
