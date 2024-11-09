/* eslint-disable react/prop-types */
import { useState } from "react";
import { generateMnemonic } from "bip39";
import {
  Shield,
  Copy,
  RefreshCcw,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SolanaWallet from "../components/SolanaWallet";
import EthereumWallet from "../components/EthereumWallet";

const NewWalletCreation = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [step, setStep] = useState(1);
  const [copying, setCopying] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isSolanaVisible, setSolanaVisible] = useState(true);
  const [isEthereumVisible, setEthereumVisible] = useState(true);

  const handleMnemonicGeneration = async () => {
    setGenerating(true);
    const mn = generateMnemonic();
    setMnemonic(mn);
    setTimeout(() => {
      setGenerating(false);
      setStep(2);
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    });
  };

  const handleBack = () => {
    window.history.back();
  };

  const WalletHeader = ({ title, isVisible, setVisible }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 w-full">
      <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
      <button
        onClick={() => setVisible(!isVisible)}
        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-700/50 hover:bg-gray-700 
                 text-gray-300 hover:text-white transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
      >
        <span>{isVisible ? "Hide" : "Show"}</span>
        {isVisible ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-blue-900 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
      {/* Back Button and Header */}
      <div className="relative max-w-4xl mx-auto mb-8 sm:mb-12">
        <button
          onClick={handleBack}
          className="absolute left-0 -top-1 p-2 text-white hover:text-white transition-colors rounded-full hover:bg-gray-800/30"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <div className="text-center pt-12 sm:pt-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text text-white mb-3 sm:mb-4">
            Create Your Wallet
          </h1>
          <p className="text-base sm:text-lg text-gray-300">
            Generate a secure cryptocurrency wallet in moments
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      {!generating && (
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
          <div className="flex justify-between relative mb-4">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -z-10"></div>
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base
                           ${
                             step >= num
                               ? "bg-gradient-to-r to-blue-700 from-gray-900 text-white"
                               : "bg-gradient-to-r to-blue-400 from-gray-600 text-white"
                           } transition-all duration-500 transform ${
                  step === num ? "scale-110 ring-4 ring-blue-200" : ""
                }`}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-400">
            <span>Generate</span>
            <span>Secure</span>
            <span>Details</span>
          </div>
        </div>
      )}

      {/* Step 1: Generate Button */}
      {step === 1 && (
        <div className="max-w-md mx-auto px-4">
          <button
            onClick={handleMnemonicGeneration}
            disabled={generating}
            className="w-full bg-gradient-to-r to-blue-500 from-gray-600 text-white rounded-xl p-6 sm:p-8 
                     transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg 
                     focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-3">
              <RefreshCcw
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  generating ? "animate-spin" : ""
                }`}
              />
              <span className="text-lg sm:text-xl font-semibold">
                {generating ? "Generating Wallet..." : "Generate New Wallet"}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Step 2: Display Mnemonic */}
      {step === 2 && mnemonic && (
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gray-800/50  rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-700">
            <div className="flex items-center mb-4 sm:mb-6">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Secure Your Seed Phrase
              </h2>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 mb-4">
                <span className="text-gray-300 font-medium text-sm sm:text-base">
                  Your Seed Phrase
                </span>
                <button
                  onClick={() => copyToClipboard(mnemonic)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 focus:outline-none text-sm sm:text-base"
                >
                  <Copy className="w-4 h-4" />
                  {copying ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {mnemonic.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-2 text-center border border-gray-700"
                  >
                    <span className="text-gray-500 text-xs">{index + 1}</span>
                    <p className="font-medium text-gray-200 text-sm sm:text-base break-all">
                      {word}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-yellow-900/20 rounded-lg mb-4 sm:mb-6 border border-yellow-700/50">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-yellow-200">
                This seed phrase is the only key to your wallet. Store it
                securely offline and never share it. Loss of this phrase means
                permanent loss of access to your funds.
              </p>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full bg-gradient-to-r to-blue-500 from-gray-600 text-white font-semibold rounded-lg px-4 sm:px-6 py-2 sm:py-3 
                       transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg 
                       focus:outline-none focus:ring-4 focus:ring-purple-500/50 text-sm sm:text-base"
            >
              Continue to Wallet Details
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Wallet Details */}
      {step === 3 && mnemonic && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-800/30  rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
              Your Generated Wallets
            </h2>
            <div className="space-y-4 sm:space-y-8">
              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-gray-600">
                <WalletHeader
                  title="Solana Wallet"
                  isVisible={isSolanaVisible}
                  setVisible={setSolanaVisible}
                />
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isSolanaVisible
                      ? "opacity-100 max-h-screen"
                      : "opacity-0 max-h-0"
                  }`}
                >
                  <SolanaWallet mnemonic={mnemonic} />
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-gray-600">
                <WalletHeader
                  title="Ethereum Wallet"
                  isVisible={isEthereumVisible}
                  setVisible={setEthereumVisible}
                />
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isEthereumVisible
                      ? "opacity-100 max-h-screen"
                      : "opacity-0 max-h-0"
                  }`}
                >
                  <EthereumWallet mnemonic={mnemonic} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewWalletCreation;
