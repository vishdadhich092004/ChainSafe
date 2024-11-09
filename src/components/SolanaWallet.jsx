/* eslint-disable react/prop-types */
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { mnemonicToSeed } from "bip39";
import { useState } from "react";
import bs58 from "bs58";
import { Plus, Copy, Wallet } from "lucide-react";

const SolanaWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleWalletGeneration = async () => {
    setLoading(true);
    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keyPair = Keypair.fromSecretKey(secret);

    const wallet = {
      publicKey: keyPair.publicKey.toBase58(),
      secretKey: bs58.encode(secret),
      balance: null,
    };

    setWallets([...wallets, wallet]);
    setCurrentIndex(currentIndex + 1);
    setLoading(false);
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
    const balance = data.result?.value || 0;

    const updatedWallets = [...wallets];
    updatedWallets[walletIndex] = {
      ...wallet,
      balance,
    };

    setWallets(updatedWallets);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900  rounded-xl border border-blue-500/20 p-4 sm:p-6 lg:p-8 shadow-xl transition-all duration-300 hover:shadow-blue-500/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
        <div className="flex items-center gap-4">
          <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-white">
            Solana Wallet
          </h2>
        </div>

        <button
          onClick={handleWalletGeneration}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r to-blue-500 from-gray-600 text-white font-semibold rounded-xl px-4 sm:px-6 py-2 sm:py-3
                     transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50
                     focus:outline-none focus:ring-4 focus:ring-blue-500/50 group"
        >
          <div className="flex items-center justify-center gap-3">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm sm:text-base">
              {loading ? "Generating..." : "Create New Wallet"}
            </span>
          </div>
        </button>
      </div>

      <div className="space-y-6">
        {wallets.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-400 bg-gray-800/20 rounded-xl border border-blue-500/20">
            <div className="flex flex-col items-center gap-4">
              <Wallet className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400/50" />
              <p className="text-base sm:text-lg text-blue-300">
                Create a new wallet to get started
              </p>
            </div>
          </div>
        ) : (
          wallets.map((wallet, index) => (
            <div
              key={index}
              className="bg-gray-800/20 rounded-xl p-4 sm:p-6 border border-blue-500/20 transition-all duration-300 hover:border-blue-500/40"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
                <span className="text-lg sm:text-xl font-semibold text-blue-300">
                  Wallet {index + 1}
                </span>
                {wallet.balance === null ? (
                  <button
                    onClick={() => handleWalletDetails(index)}
                    className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-blue-500 text-white px-4 py-2 rounded-lg
                               transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                               focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  >
                    <span className="text-sm sm:text-base">Fetch Balance</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-400">
                      Balance:
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-blue-300">
                      {wallet.balance / 1000000000} SOL
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-gray-900/40 rounded-lg p-3 sm:p-4 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-blue-300">
                      Public Address
                    </span>
                    <button
                      onClick={() => copyToClipboard(wallet.publicKey)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-gray-300 break-all bg-gray-900/40 p-2 sm:p-3 rounded-lg">
                    {wallet.publicKey}
                  </div>
                </div>

                <div className="bg-gray-900/40 rounded-lg p-3 sm:p-4 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-blue-300">
                      Private Key
                    </span>
                    <button
                      onClick={() => copyToClipboard(wallet.secretKey)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-gray-300 break-all bg-gray-900/40 p-2 sm:p-3 rounded-lg">
                    {wallet.secretKey}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SolanaWallet;
