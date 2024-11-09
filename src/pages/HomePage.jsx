/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Search, ArrowRight } from "lucide-react";

const PageTransition = ({ isActive, origin }) => {
  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        transform: `translate(${origin.x}px, ${origin.y}px)`,
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-gray-900 to-blue-900 rounded-full animate-page-transition"
        style={{
          transformOrigin: "50% 50%",
        }}
      />
    </div>
  );
};

function HomePage() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 });

  const handleNavigation = (e, path) => {
    e.preventDefault();

    // Get click coordinates for transition origin
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    setTransitionOrigin(origin);
    setIsTransitioning(true);

    // Navigate after animation
    setTimeout(() => {
      navigate(path);
    }, 500); // Match this with animation duration
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-r from-gray-900 to-blue-900 font-facultyGlyphic">
      <PageTransition isActive={isTransitioning} origin={transitionOrigin} />

      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 -top-10 -left-10 bg-blue-500/20 rounded-full  animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-10 -right-10 bg-purple-500/20 rounded-full  animate-pulse delay-1000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-white">
            Welcome to ChainSafe
          </h1>
          <p className="text-lg md:text-xl mb-12 text-gray-300">
            Your gateway to secure and seamless cryptocurrency wallet management
          </p>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              to="/new-wallet"
              onClick={(e) => handleNavigation(e, "/new-wallet")}
              className="group relative bg-gradient-to-br from-blue-500/10 to-blue-500/5 
                         rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 
                         transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-8 h-8 text-blue-400" />
                <ArrowRight className="w-6 h-6 text-blue-400 transform group-hover:translate-x-2 transition-transform" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Create New Wallet
              </h2>
              <p className="text-gray-400 text-sm">
                Generate a secure wallet with a unique seed phrase
              </p>
            </Link>

            <Link
              to="/wallet-details"
              onClick={(e) => handleNavigation(e, "/wallet-details")}
              className="group relative bg-gradient-to-br from-purple-500/10 to-purple-500/5 
                         rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 
                         transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <Search className="w-8 h-8 text-purple-400" />
                <ArrowRight className="w-6 h-6 text-purple-400 transform group-hover:translate-x-2 transition-transform" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Fetch Wallet Details
              </h2>
              <p className="text-gray-400 text-sm">
                Look up and manage your existing wallet
              </p>
            </Link>
          </div>

          {/* Bottom text */}
          <p className="mt-12 text-sm text-gray-400">
            Secure • Decentralized • User-Friendly
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
