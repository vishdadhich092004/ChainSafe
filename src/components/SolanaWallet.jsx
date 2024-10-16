/* eslint-disable react/prop-types */
// SolanaWallet.js
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { mnemonicToSeed } from "bip39";
import { useState } from "react";
import bs58 from "bs58";

function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);

  const handleWalletGeneration = async () => {
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keyPair = Keypair.fromSecretKey(secret);

    const wallet = {
      publicKey: keyPair.publicKey.toBase58(),
      secretKey: bs58.encode(secret),
      balance: null, // Placeholder for balance
    };

    setWallets([...wallets, wallet]);
    setCurrentIndex(currentIndex + 1);
  };

  const handleWalletDetails = async (walletIndex) => {
    const wallet = wallets[walletIndex];
    const response = await fetch(
      "https://solana-mainnet.g.alchemy.com/v2/693UQqQ8MPn0zkPeQTDcjh6Rl3oidMKd",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [`${wallet.publicKey}`],
        }),
      }
    );

    const data = await response.json();
    const balance = data.result?.value || 0; // Default to 0 if no balance

    // Update the wallet balance
    const updatedWallets = [...wallets];
    updatedWallets[walletIndex] = {
      ...wallet,
      balance,
    };

    setWallets(updatedWallets);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-purple-600">Solana Wallet</h2>
      <button
        onClick={handleWalletGeneration}
        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full px-8 py-4 mb-8 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-md"
      >
        Add New Solana Wallet
      </button>

      <section className="w-full bg-gray-50 p-6 rounded-lg shadow-inner">
        {wallets.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No wallets added yet.
          </div>
        ) : (
          wallets.map((wallet, index) => (
            <div
              key={index}
              className="flex flex-col items-start justify-between border-b border-gray-200 py-6 text-gray-700 mb-6 last:border-b-0 last:mb-0"
            >
              <div className="w-full flex justify-between items-center mb-4">
                <span className="font-semibold text-lg text-purple-600">
                  Wallet {index + 1}
                </span>
                <button
                  onClick={() => handleWalletDetails(index)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-4 py-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-md"
                >
                  View Details
                </button>
              </div>
              <div className="w-full mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-purple-600">Address:</span>
                  <button
                    onClick={() => copyToClipboard(wallet.publicKey)}
                    className="text-blue-500 hover:text-blue-600 focus:outline-none"
                  >
                    Copy
                  </button>
                </div>
                <span className="font-mono text-sm break-all">
                  {wallet.publicKey}
                </span>
              </div>
              <div className="w-full mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-red-600">Private Key:</span>
                  <button
                    onClick={() => copyToClipboard(wallet.secretKey)}
                    className="text-blue-500 hover:text-blue-600 focus:outline-none"
                  >
                    Copy
                  </button>
                </div>
                <span className="font-mono text-sm break-all">
                  {wallet.secretKey}
                </span>
              </div>
              {wallet.balance !== null && (
                <div className="w-full">
                  <span className="font-medium text-green-600">Balance:</span>
                  <span className="font-mono text-sm ml-2">
                    {wallet.balance / 1000000000} SOL
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default SolanaWallet;
