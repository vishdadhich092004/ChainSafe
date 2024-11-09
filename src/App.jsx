import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewWalletCreation from "./pages/NewWalletCreation";
import FetchWalletDetails from "./pages/FetchWalletDetails";
import Layout from "./layouts/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/new-wallet"
          element={
            <Layout>
              <NewWalletCreation />
            </Layout>
          }
        />
        <Route
          path="/wallet-details"
          element={
            <Layout>
              <FetchWalletDetails />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
