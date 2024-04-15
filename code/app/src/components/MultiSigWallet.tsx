import React, { useState, useEffect } from "react";
import { get, GetResponse, handleConfirmTransaction, handleExecuteTransaction } from "../api/multi-sig-wallet"; // Import your get function and GetResponse type
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


  const [showTransactions, setShowTransactions] = useState(false);

  const toggleTransactions = () => {
    setShowTransactions(!showTransactions);
  };


  return (
    <div>
      {walletData && (
        <>
          <div>Contract: {walletData.address}</div>
          <h3>Balance: {walletData.balance} S42</h3>
          <br />
          <h3>Owners: </h3>
          <div>
            {walletData.owners.map((owner) => (
              <li key={owner}>{owner}</li>
            ))}
          </div>
          <br />
          <div>Confirmations required: {walletData.numConfirmationsRequired}</div>
          <br />
          <h3>Transactions: {walletData.transactionCount}</h3>

          <button
            className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleTransactions}
          >
            {showTransactions ? 'Hide Transactions' : 'Show Transactions'}
          </button>

          {showTransactions && (
            <div>
              {walletData.transactions.map((transaction, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
                  <p className="mb-2">Transaction Index: {transaction.txIndex}</p>
                  <p className="mb-2">To: {transaction.to}</p>
                  <p className="mb-2">Value: {transaction.value.toString()}</p>
                  <p className="mb-2">Data: {transaction.data}</p>
                  <p className="mb-2">Executed: {transaction.executed.toString()}</p>
                  <p className="mb-2">Num Confirmations: {transaction.numConfirmations}</p>
                  <p className="mb-2">Confirmed By Current Account: {transaction.isConfirmedByCurrentAccount.toString()}</p>

                  {/* Buttons */}
                  <div className="flex justify-start space-x-4">
                    {!transaction.isConfirmedByCurrentAccount && walletData.owners.includes(account) && (
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleConfirmTransaction(transaction.txIndex)}>
                        Confirm Transaction
                      </button>
                    )}
                    {!transaction.executed && walletData.owners.includes(account) && transaction.numConfirmations >= walletData.numConfirmationsRequired && (
                      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleExecuteTransaction(transaction.txIndex)}>
                        Execute Transaction
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <br />
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => openModal(true)}>
            Create Transaction
          </button>
          {open && <CreateTxModal open={open} onClose={() => openModal(false)} />}
        </>
      )}
    </div>
  );
}

export default MultiSigWallet;
