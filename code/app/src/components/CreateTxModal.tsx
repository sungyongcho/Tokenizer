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

  async function onSubmit() {
    if (pending) {
      return;
    }

    try {
      setPending(true);

      // if (!web3) {
      //   throw new Error("No web3");
      // }

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
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Create Transaction</Modal.Header>
      <Modal.Content>
        {error && <Message error>{error}</Message>}
        <Form onSubmit={onSubmit}>
          <Form.Field>
            <label>To</label>
            <Form.Input
              type="text"
              value={inputs.to}
              onChange={(e) => onChange("to", e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Value</label>
            <Form.Input
              type="number"
              min={0}
              value={inputs.value}
              onChange={(e) => onChange("value", e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Data</label>
            <Form.Input
              value={inputs.data}
              onChange={(e) => onChange("data", e.target.value)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={pending}>
          Cancel
        </Button>
        <Button
          color="green"
          onClick={onSubmit}
          disabled={pending}
          loading={pending}
        >
          Create
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default CreateTxModal;
