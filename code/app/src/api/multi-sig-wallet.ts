import { ethers } from "ethers";
import multiSigContract from "../ethereum/multiSigWallet";

interface Transaction {
  txIndex: number;
  to: string;
  value: number;
  data: string;
  executed: boolean;
  numConfirmations: number;
  isConfirmedByCurrentAccount: boolean;
}

export interface GetResponse {
  address: string;
  balance: string;
  owners: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
  transactions: Transaction[];
}

export async function get(): Promise<GetResponse> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const multiSig = await multiSigContract(provider);

  const balance = await multiSig.getBalance();
  const owners = await multiSig.getOwners();
  const numConfirmationsRequired = await multiSig.numConfirmationsRequired();
  const transactionCount = await multiSig.getTransactionCount();

  // get 10 most recent tx
  const count = Number(transactionCount);
  const transactions: Transaction[] = [];
  for (let i = 0; i < 10; i++) {
    const txIndex = count - 1 - i;
    if (txIndex < 0) {
      break;
    }

    const tx = await multiSig.getTransaction(txIndex);
    const isConfirmed = await multiSig.isConfirmed(txIndex, (await provider.getSigner()).getAddress());

    transactions.push({
      txIndex,
      to: tx.to,
      value: tx.value,
      data: tx.data,
      executed: tx.executed,
      numConfirmations: Number(tx.numConfirmations),
      isConfirmedByCurrentAccount: isConfirmed,
    });
  }

  return {
    address: await multiSig.getAddress(),
    balance: (balance / BigInt(10 ** 18)).toString(),
    owners,
    numConfirmationsRequired: Number(numConfirmationsRequired),
    transactionCount: count,
    transactions,
  };
}

export async function handleConfirmTransaction(txNumber: number) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const multiSig = await multiSigContract(provider);

  const multiSigContractWithSigner = multiSig.connect(await provider.getSigner());

  const result = await (multiSigContractWithSigner as any)['confirmTransaction'](txNumber);

  console.log(result);

  // setWithdrawSuccess(`Current balance: ${balance.toString()} tokens`);
};


export async function handleExecuteTransaction(txNumber: number) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const multiSig = await multiSigContract(provider);

  const multiSigContractWithSigner = multiSig.connect(await provider.getSigner());

  const result = await (multiSigContractWithSigner as any)['executeTransaction'](txNumber);

  console.log(result);

  // setWithdrawSuccess(`Current balance: ${balance.toString()} tokens`);
};


export async function submitTx(
  params: {
    to: string;
    // NOTE: error when passing BN type, so pass string
    value: string;
    data: string;
  }
) {
  const { to, value, data } = params;


  const provider = new ethers.BrowserProvider(window.ethereum);
  const multiSig = await multiSigContract(provider);

  const multiSigContractWithSigner = multiSig.connect(await provider.getSigner());

  const result = await (multiSigContractWithSigner as any)['submitTransaction'](to, value, data, { from: await provider.getSigner() });


  console.log(result)

  // await multiSig.submitTransaction(to, value, data, {
  //   from: account,
  // });
}
