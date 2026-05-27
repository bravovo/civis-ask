// import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { Toaster } from "@/components/ui/sonner";
import { useSelector } from "react-redux";

function Layout({ children, hasHeader = true }) {
  const user = useSelector((state) => state.profile);

  return (
    <div className="min-h-screen flex flex-col">
      {hasHeader && <Header isAdmin={user?.role === "admin"} />}
      <main className="flex-1 flex justify-center m-0">
        <div className="max-w-7xl w-full mx-auto py-6">{children}</div>
      </main>
      <Toaster position="top-center" />
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
