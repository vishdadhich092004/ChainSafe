/* eslint-disable react/prop-types */
import Header from "../components/Header";
// import Footer from "../components/Footer/Footer";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 to-blue-900">
      <Header />
      <main className="flex-grow container mx-auto py-10">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
