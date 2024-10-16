import { useState } from "react";
import { generateMnemonic } from "bip39";
import SolanaWallet from "./components/SolanaWallet";
import EthereumWallet from "./components/EthereumWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  const handleMnemonicGeneration = async () => {
    const mn = generateMnemonic();
    setMnemonic(mn);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200 p-6 sm:p-10">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
        WalletMitra
      </h1>
      {!mnemonic && (
        <button
          onClick={handleMnemonicGeneration}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full px-8 py-4 mb-10 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl"
        >
          Start Here
        </button>
      )}

      {mnemonic && (
        <div className="w-full max-w-2xl mb-10 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <label
              htmlFor="mnemonic"
              className="text-xl font-semibold text-gray-700"
            >
              Your Seed Phrase
            </label>
            <button
              onClick={() => copyToClipboard(mnemonic)}
              className="text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              Copy
            </button>
          </div>
          <input
            type="text"
            id="mnemonic"
            value={mnemonic}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 mb-2"
          />
          <p className="text-sm text-gray-600 italic">
            *This is the key to your wallet. Keep it safe and do not share it
            with anyone. Losing it may result in permanent loss of access to
            your funds.
          </p>
        </div>
      )}

      {mnemonic && (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
          <SolanaWallet mnemonic={mnemonic} />
          <EthereumWallet mnemonic={mnemonic} />
        </div>
      )}

      <footer className="text-xl mt-10  bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg">
        Made By Vish
      </footer>
    </div>
  );
}

export default App;
