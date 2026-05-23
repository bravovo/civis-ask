// import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { Toaster } from "@/components/ui/sonner";

function Layout({ children, hasHeader = true }) {
  return (
    <div className="min-h-screen flex flex-col">
      {hasHeader && <Header />}
      <main className="flex-1 flex justify-center m-0">
        <div className="max-w-7xl w-full mx-auto py-6">{children}</div>
      </main>
      <Toaster position="top-center" />
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
