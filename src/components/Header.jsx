import { Link } from "react-router-dom";

const ChainsawLogo = () => (
  <svg
    width="60" // Reduced size from 100 to 60
    height="60" // Reduced size from 100 to 60
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <defs>
      <linearGradient id="chainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#1e3a8a", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    <circle
      cx="50"
      cy="50"
      r="40"
      stroke="url(#chainGradient)"
      strokeWidth="6"
      fill="none"
    />

    <path
      d="M35,50 A15,15 0 1,1 65,50 A15,15 0 1,1 35,50 Z"
      fill="url(#chainGradient)"
    />

    <line x1="50" y1="35" x2="50" y2="65" stroke="#1e40af" strokeWidth="3" />
    <line x1="35" y1="50" x2="65" y2="50" stroke="#1e40af" strokeWidth="3" />

    <circle cx="50" cy="25" r="4" fill="#3b82f6" />
    <circle cx="50" cy="75" r="4" fill="#3b82f6" />
    <circle cx="25" cy="50" r="4" fill="#3b82f6" />
    <circle cx="75" cy="50" r="4" fill="#3b82f6" />
  </svg>
);

const Header = () => {
  return (
    <header className="text-white py-4 px-6 md:px-8 lg:px-10 shadow-lg ">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <Link to="/" className="flex items-center group">
          <ChainsawLogo />
          <span className=" ml-1 text-2xl font-bold text-transparent bg-clip-text bg-white tracking-widest">
            ChainSafe
          </span>
        </Link>
        <nav className="space-x-6 text-sm">
          <Link
            to="/new-wallet"
            className="text-gray-200 hover:text-blue-400 transition-colors"
          >
            Create Your Own Wallet
          </Link>
          <Link
            to="/wallet-details"
            className="text-gray-200 hover:text-blue-400 transition-colors"
          >
            View Details of Any Wallet
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
