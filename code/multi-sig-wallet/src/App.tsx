import React from 'react';
import logo from './logo.svg';
import { Message, Button } from 'semantic-ui-react';
import { useWeb3Context } from './contexts/Web3';
import { unlockAccount } from './api/web3';
import './App.css';
import useAsync from './components/useAsync';

function App() {
  const {
    state: { account }, updateAccount } = useWeb3Context();

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multi sig wallet</h1>
        <div>Account: {account}</div>

        <Message warning>Metamask is not connected</Message>
        <Button color="green"
          onClick={() => onClickConnect()}
          disabled={pending}
          loading={pending}>Connect to metamask</Button>
      </header>
    </div>
  );
}

export default App;
