import { Link, Route, Routes } from "react-router-dom";
import Faucet from "./Faucet";
import MultiSigApp from "./MultiSigApp";
import NavBar from "./components/NavBar";

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
      <h1 className="text-3xl font-bold underline">
        Hello world!
        <NavBar></NavBar>
      </h1>
    </div>
  );
}

export default App;
