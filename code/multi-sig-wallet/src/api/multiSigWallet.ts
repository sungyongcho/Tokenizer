import { ethers } from "ethers"
import * as multiSigAbi from "../build/contracts/MultiSigWallet.json"

const multiSigContract = (provider: any) => {
  return new ethers.Contract(
    process.env.REACT_APP_MULTISIG_ADDRESS || "",
    multiSigAbi.abi,
    provider
  )

}

export default multiSigContract;
