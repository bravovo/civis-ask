import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

function Layout({ children, hasHeader = true }) {
  return (
    <div className="min-h-screen flex flex-col px-2 md:px-4">
      {hasHeader && <Header />}
      <main className="flex-1 flex justify-center m-0">
        <div className="w-7xl mx-auto py-6">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
