import { Link, Route, Routes } from "react-router-dom";
import Faucet from "./Faucet";
import MultiSigApp from "./MultiSigApp";

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Faucet</Link>  {/* Link 컴포넌트를 이용하여 경로를 연결한다 */}
          </li>
          <li>
            <Link to="/multisig">MultiSig</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Faucet />} />
        <Route path="/multisig" element={<MultiSigApp />} />
      </Routes>
    </div>
  );
}

export default App;
