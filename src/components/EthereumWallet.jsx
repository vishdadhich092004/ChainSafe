/* eslint-disable react/prop-types */
import { mnemonicToSeed } from "bip39";
import { useState } from "react";
import { Wallet, HDNodeWallet, formatEther } from "ethers";
import { Plus, Copy, Wallet as WalletIcon } from "lucide-react";

const EthereumWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleWalletGeneration = async () => {
    setLoading(true);
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0/0`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);

      const newWallet = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        balance: null,
      };

      setWallets([...wallets, newWallet]);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error("Failed to generate wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletDetails = async (walletIndex) => {
    const wallet = wallets[walletIndex];
    try {
      const response = await fetch(
        "https://eth-mainnet.g.alchemy.com/v2/693UQqQ8MPn0zkPeQTDcjh6Rl3oidMKd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBalance",
            params: [wallet.address, "latest"],
          }),
        }
      );

      const data = await response.json();
      const balance = data.result ? formatEther(data.result) : "0";

      const updatedWallets = [...wallets];
      updatedWallets[walletIndex] = {
        ...wallet,
        balance,
      };

      setWallets(updatedWallets);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900  rounded-xl border border-blue-500/20 p-4 md:p-8 shadow-xl transition-all duration-300 hover:shadow-blue-500/10 w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <WalletIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-white">
            Ethereum Wallet
          </h2>
        </div>

        <button
          onClick={handleWalletGeneration}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r to-blue-500 from-gray-600 text-white font-semibold rounded-xl px-4 md:px-6 py-2 md:py-3
                   transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50
                   focus:outline-none focus:ring-4 focus:ring-blue-500/50 group"
        >
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm md:text-base">
              {loading ? "Generating..." : "Create New Wallet"}
            </span>
          </div>
        </button>
      </div>

      <div className="space-y-4 md:space-y-6">
        {wallets.length === 0 ? (
          <div className="text-center py-8 md:py-12 text-gray-400 bg-gray-800/20 rounded-xl border border-blue-500/20">
            <div className="flex flex-col items-center gap-4">
              <WalletIcon className="w-12 h-12 md:w-16 md:h-16 text-blue-400/50" />
              <p className="text-base md:text-lg text-blue-300">
                Create a new wallet to get started
              </p>
            </div>
          </div>
        ) : (
          wallets.map((wallet, index) => (
            <div
              key={index}
              className="bg-gray-800/20 rounded-xl p-4 md:p-6 border border-blue-500/20 transition-all duration-300 hover:border-blue-500/40"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
                <span className="text-lg md:text-xl font-semibold text-blue-300">
                  Wallet {index + 1}
                </span>
                {wallet.balance === null ? (
                  <button
                    onClick={() => handleWalletDetails(index)}
                    className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-blue-500 text-white px-3 md:px-4 py-2 rounded-lg
                             transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                             focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  >
                    <span className="text-sm md:text-base">Fetch Balance</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm text-gray-400">
                      Balance:
                    </span>
                    <span className="text-base md:text-lg font-semibold text-blue-300">
                      {parseFloat(wallet.balance).toFixed(4)} ETH
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-gray-900/40 rounded-lg p-3 md:p-4 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm font-medium text-blue-300">
                      Public Address
                    </span>
                    <button
                      onClick={() => copyToClipboard(wallet.address)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Copy className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-300 break-all bg-gray-900/40 p-2 md:p-3 rounded-lg">
                    {wallet.address}
                  </div>
                </div>

                <div className="bg-gray-900/40 rounded-lg p-3 md:p-4 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm font-medium text-blue-300">
                      Private Key
                    </span>
                    <button
                      onClick={() => copyToClipboard(wallet.privateKey)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Copy className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs md:text-sm text-gray-300 break-all bg-gray-900/40 p-2 md:p-3 rounded-lg">
                    {wallet.privateKey}
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

export default EthereumWallet;
