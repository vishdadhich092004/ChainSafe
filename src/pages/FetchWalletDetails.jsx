import { useState } from "react";
import { formatEther } from "ethers";
import { Search, Wallet, ArrowLeft } from "lucide-react";

function FetchWalletDetails() {
  const [wallet, setWallet] = useState("Solana");
  const [walletId, setWalletId] = useState("");
  const [balance, setBalance] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSolanaWalletDetails = async () => {
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
          params: [`${walletId}`],
        }),
      }
    );
    const data = await response.json();
    setBalance(data.result.value);
  };

  const fetchEthereumWalletDetails = async () => {
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
          params: [walletId, "latest"],
        }),
      }
    );
    const data = await response.json();
    setBalance(formatEther(data.result));
  };

  const handleWalletDetailsFetch = async () => {
    if (!walletId.trim()) return;
    setLoading(true);
    try {
      if (wallet === "Solana") {
        await fetchSolanaWalletDetails();
      } else {
        await fetchEthereumWalletDetails();
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // You can implement your navigation logic here
    window.history.back();
  };

  return (
    <div className="p-8 shadow-xl transition-all duration-300 hover:shadow-blue-500/10">
      <div className="relative flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="absolute left-0 p-2 text-white hover:text-blue-300 transition-colors rounded-full hover:bg-gray-800/30"
          aria-label="Go back"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <div className="flex items-center gap-4 mx-auto">
          <Wallet className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-white">
            Wallet Balance Checker
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800/20 rounded-xl p-6 border border-blue-500/20">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Select Network
              </label>
              <select
                name="wallet"
                id="wallet"
                className="w-full bg-gray-900/40 text-gray-200 rounded-lg p-3 border border-blue-500/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                onChange={(e) => setWallet(e.target.value)}
                value={wallet}
              >
                <option value="Solana">Solana</option>
                <option value="Ethereum">Ethereum</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                placeholder="Enter the wallet address"
                className="w-full bg-gray-900/40 text-gray-200 rounded-lg p-3 border border-blue-500/20 focus:outline-none focus:border-blue-500/40 transition-colors placeholder-gray-500"
                onChange={(e) => setWalletId(e.target.value)}
                value={walletId}
              />
            </div>

            <button
              onClick={handleWalletDetailsFetch}
              disabled={loading || !walletId.trim()}
              className="w-full bg-gradient-to-r to-blue-500 from-gray-600 text-white font-semibold rounded-lg px-6 py-3
                     transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50
                     focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? "Fetching..." : "Check Balance"}</span>
            </button>

            {balance && (
              <div className="bg-gray-900/40 rounded-lg p-4 border border-blue-500/20 mt-4">
                <span className="text-sm font-medium text-blue-300">
                  Balance
                </span>
                <div className="font-mono text-2xl text-gray-200 mt-1">
                  {wallet === "Solana"
                    ? `${(balance / 1000000000).toFixed(4)} SOL`
                    : `${parseFloat(balance).toFixed(4)} ETH`}
                </div>
              </div>
            )}
            {!balance && error && (
              <div className="bg-gray-900/40 rounded-lg p-4 border border-blue-500/20 mt-4">
                <span className="text-sm font-medium text-blue-300">
                  Error Occured
                </span>
                <div className="font-mono text-2xl text-gray-200 mt-1">
                  Please Check Your Wallet Address
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FetchWalletDetails;
