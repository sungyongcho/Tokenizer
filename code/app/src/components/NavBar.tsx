// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className='relative text-center'>
      <ul className='inline-block'>
        <li className='inline-block mx-4'>
          <Link to="/">Faucet</Link>
        </li>
        <li className='inline-block mx-4'>
          <Link to="/multisig">MultiSig</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
