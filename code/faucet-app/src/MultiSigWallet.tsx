import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { get, GetResponse, handleConfirmTransaction, handleExecuteTransaction } from "./api/multi-sig-wallet"; // Import your get function and GetResponse type
import CreateTxModal from "./CreateTxModal";
declare global {
  interface Window {
    ethereum?: any; // Adjust the type as needed
  }
}

function MultiSigWallet({ account }: any) {
  const [walletData, setWalletData] = useState<GetResponse | null>(null); // State to store wallet data
  const [open, openModal] = useState(false);

  useEffect(() => {
    // Function to fetch wallet data
    async function fetchWalletData() {
      try {
        // Assuming 'web3' and 'account' are provided as props or obtained elsewhere
        const response = await get();
        setWalletData(response);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    }

    fetchWalletData(); // Call the fetchWalletData function when component mounts
  }, []); // Empty dependency array to run effect only once when component mounts
  console.log(walletData?.numConfirmationsRequired, walletData?.owners.includes(account), account,
    walletData?.transactions[0].numConfirmations, walletData?.transactions[0].executed)
  return (
    <div>
      {walletData && ( // Check if walletData is available before rendering
        <>
          <div>Contract: {walletData.address}</div>
          <h3>Balance: {walletData.balance} S42</h3>
          <h3>Owners: </h3>
          <div>
            {walletData.owners.map((owner) => (
              <p>{owner}</p>
            ))}
          </div>
          <div>Confirmations required: {walletData.numConfirmationsRequired}</div>
          <h3>Transactions ({walletData.transactionCount})</h3>
          <div>
            {/* Map through transactions array and render each transaction */}
            {walletData.transactions.map((transaction, index) => (
              <div key={index}>
                <p>Transaction Index: {transaction.txIndex}</p>
                <p>To: {transaction.to}</p>
                <p>Value: {transaction.value.toString()}</p>
                <p>Data: {transaction.data}</p>
                <p>Executed: {transaction.executed.toString()}</p>
                <p>Num Confirmations: {transaction.numConfirmations}</p>
                <p>Confirmed By Current Account: {transaction.isConfirmedByCurrentAccount.toString()}</p>
                {/* Conditionally render confirm transaction message */}
                {!transaction.isConfirmedByCurrentAccount && (
                  <>
                    {walletData.owners.includes(account) && ( // Check if account is one of the owners
                      <Button onClick={() => handleConfirmTransaction(transaction.txIndex)}>
                        Confirm Transaction
                      </Button>
                    )}
                  </>
                )}
                {!transaction.executed && walletData.owners.includes(account) && transaction.numConfirmations >= walletData.numConfirmationsRequired && (
                  <Button onClick={() => handleExecuteTransaction(transaction.txIndex)}>
                    Execute Transaction
                  </Button>)}
              </div>
            ))}
          </div>
          {/* Render transactions here */}
          <Button color="green" onClick={() => openModal(true)}>
            Create Transaction
          </Button>
          {open && <CreateTxModal open={open} onClose={() => openModal(false)} />}
        </>
      )}
    </div>
  );
}

export default MultiSigWallet;
