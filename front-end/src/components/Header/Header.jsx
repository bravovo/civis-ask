import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="w-full bg-black flex justify-center sticky top-0 z-50 border-b border-b-gray-200 border-border">
      <div className="max-w-7xl w-full flex items-center justify-between py-4 px-2 md:px-0 ">
        <div className="w-full">
          <Link to="/" className="text-xl font-bold text-white tracking-wider">
            Logo
          </Link>
        </div>
        <div className="w-full flex justify-end gap-4">
          <div>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          </div>
          <div>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
