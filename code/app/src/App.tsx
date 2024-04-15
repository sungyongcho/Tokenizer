import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Faucet from "./Faucet";
import MultiSig from "./MultiSig";
import NavBar from './components/NavBar';

function App() {
  return (
    <div>
      <div className='pb-5'>
        <NavBar />
      </div>
      <Routes>
        <Route path="/" element={<Faucet />} />
        <Route path="/multisig" element={<MultiSig />} />
      </Routes>
    </div>
  );
}

export default App;
