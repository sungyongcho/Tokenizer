import { ethers } from "ethers";
import BN from "bn.js";
import multiSigWallet from "../build/contracts/MultiSigWallet.json"
import multiSigContract from "../ethereum/multi";

interface Transaction {
  txIndex: number;
  to: string;
  value: BN;
  data: string;
  executed: boolean;
  numConfirmations: number;
  isConfirmedByCurrentAccount: boolean;
}

interface GetResponse {
  address: string;
  balance: BN;
  owners: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
  transactions: Transaction[];
}


export async function get(provider: any, account: string): Promise<GetResponse> {
  // Initialize your ethers.js provider
  const ethersProvider = new ethers.providers.JsonRpcProvider(provider);

  // Get an instance of your contract
  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  const contractInstance = multiSigContract(ethersProvider, contractAddress);

  const balance = await ethersProvider.getBalance(contractAddress);
  const owners = await contractInstance.getOwners();
  const numConfirmationsRequired = await contractInstance.numConfirmationsRequired();
  const transactionCount = await contractInstance.getTransactionCount();

  // Get 10 most recent transactions
  const count = transactionCount.toNumber();
  const transactions: Transaction[] = [];
  for (let i = 1; i <= 10; i++) {
    const txIndex = count - i;
    if (txIndex < 0) {
      break;
    }

    const tx = await contractInstance.getTransaction(txIndex);
    const isConfirmed = await contractInstance.isConfirmed(txIndex, account);

    transactions.push({
      txIndex,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      executed: tx.executed,
      numConfirmations: tx.numConfirmations.toNumber(),
      isConfirmedByCurrentAccount: isConfirmed,
    });
  }

  return {
    address: contractAddress,
    balance: balance.toString(),
    owners,
    numConfirmationsRequired: numConfirmationsRequired.toNumber(),
    transactionCount: count,
    transactions,
  };
}

// export async function get(account: string): Promise<GetResponse> {
//   const MultiSigWalletFactory: ethers.ContractFactory = await ethers.getContractFactory("MultiSigWallet");
//   const multiSig: ethers.Contract = await MultiSigWalletFactory.deploy();

//   const balance: BN = new BN(await multiSig.provider.getBalance(multiSig.address));
//   const owners: string[] = await multiSig.getOwners();
//   const numConfirmationsRequired: number = await multiSig.numConfirmationsRequired();
//   const transactionCount: number = await multiSig.getTransactionCount();

//   const count = transactionCount.toNumber();
//   const transactions: Transaction[] = [];
//   for (let i = 1; i <= 10; i++) {
//     const txIndex = count - i;
//     if (txIndex < 0) {
//       break;
//     }

//     const tx = await multiSig.getTransaction(txIndex);
//     const isConfirmed = await multiSig.isConfirmed(txIndex, account);

//     transactions.push({
//       txIndex,
//       to: tx.to,
//       value: new BN(tx.value),
//       data: tx.data,
//       executed: tx.executed,
//       numConfirmations: tx.numConfirmations.toNumber(),
//       isConfirmedByCurrentAccount: isConfirmed,
//     });
//   }

//   return {
//     address: multiSig.address,
//     balance,
//     owners,
//     numConfirmationsRequired,
//     transactionCount: count,
//     transactions,
//   };
// }

// export async function deposit(account: string, value: BN) {
//   const MultiSigWalletFactory: ethers.ContractFactory = await ethers.getContractFactory("MultiSigWallet");
//   const multiSig: ethers.Contract = await MultiSigWalletFactory.deploy();

//   await multiSig.sendTransaction({ from: account, value: ethers.utils.hexlify(value) });
// }

// export async function submitTx(account: string, params: { to: string; value: string; data: string }) {
//   const { to, value, data } = params;

//   const MultiSigWalletFactory: ethers.ContractFactory = await ethers.getContractFactory("MultiSigWallet");
//   const multiSig: ethers.Contract = await MultiSigWalletFactory.deploy();

//   await multiSig.submitTransaction(to, ethers.utils.hexlify(value), data, {
//     from: account,
//   });
// }

// export async function confirmTx(account: string, params: { txIndex: number }) {
//   const { txIndex } = params;

//   const MultiSigWalletFactory: ethers.ContractFactory = await ethers.getContractFactory("MultiSigWallet");
//   const multiSig: ethers.Contract = await MultiSigWalletFactory.deploy();

//   await multiSig.confirmTransaction(txIndex, {
//     from: account,
//   });
// }

// export async function revokeConfirmation(account: string, params: { txIndex: number }) {
//   const { txIndex } = params;

//   const MultiSigWalletFactory: ethers.ContractFactory = await ethers.getContractFactory("MultiSigWallet");
//   const multiSig: ethers.Contract = await MultiSigWalletFactory.deploy();

//   await multiSig.revokeConfirmation(txIndex, {
//     from: account,
//   });
// }

// export async function executeTx(account: string, params: { txIndex: number }) {
//   const { txIndex } = params;

//   const MultiSigWalletFactory: ethers.ContractFactory = await ethers.getContractFactory("MultiSigWallet");
//   const multiSig: ethers.Contract = await MultiSigWalletFactory.deploy();

//   await multiSig.executeTransaction(txIndex, {
//     from: account,
//   });
// }

// export function async subscribe(address: string, callback: (error: Error | null, log: ethers.Event | null) => void) {
//   const MultiSigWalletFactory: ethers.ContractFactory = await ethers.getContractFactory("MultiSigWallet");
//   const multiSig: ethers.Contract = await MultiSigWalletFactory.deploy();

//   const res = multiSig.on("allEvents", (error: Error, log: ethers.Event) => {
//     if (error) {
//       callback(error, null);
//     } else if (log) {
//       callback(null, log);
//     }
//   });

//   return () => res.removeListener();
// }
