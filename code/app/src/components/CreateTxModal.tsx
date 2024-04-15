import React, { useState } from "react";
import { Button, Modal, Form, Message } from "semantic-ui-react";
import { submitTx } from "../api/multi-sig-wallet";

interface Props {
  open: boolean;
  onClose: (event?: any) => void;
}

interface SubmitTxParams {
  to: string;
  value: string;
  data: string;
}

const CreateTxModal: React.FC<Props> = ({ open, onClose }) => {
  // const {
  //   state: { web3, account },
  // } = useWeb3Context();

  const [inputs, setInputs] = useState<SubmitTxParams>({
    to: "",
    value: "0",
    data: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);

  function onChange(name: keyof SubmitTxParams, value: string) {
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior

    if (pending) {
      return;
    }

    try {
      setPending(true);

      // if (!web3) {
      //   throw new Error("No web3");
      // }

      console.log(inputs)
      await submitTx(inputs);
      setError(null);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={open ? "block" : "hidden"}>
      <div className="text-lg font-bold mb-4">Create Transaction</div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={onSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block mb-2">To</label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            type="text"
            value={inputs.to}
            onChange={(e) => onChange("to", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Value</label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            type="number"
            min={0}
            value={inputs.value}
            onChange={(e) => onChange("value", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Data</label>
          <input
            className="border border-gray-300 rounded-md p-2 w-full"
            value={inputs.data}
            onChange={(e) => onChange("data", e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={pending}
          >
            Create
          </button>
        </div>
      </form>
    </div>

  );
};

export default CreateTxModal;
