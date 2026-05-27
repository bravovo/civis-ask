import { Link } from "react-router-dom";
import logo from "../../assets/icons/logo.png";

function Header({ isAdmin = false }) {
  return (
    <header className="w-full bg-black flex justify-center sticky top-0 z-50 border-b border-b-gray-200 border-border">
      <div className="max-w-7xl w-full flex items-center justify-between px-2 md:px-0 ">
        <div className="w-full">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-20" />
          </Link>
        </div>
        <div className="w-full flex justify-end gap-2 md:gap-4 ">
          {isAdmin && (
            <Link to="/admin/users" className="hover:underline">
              Користувачі
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/surveys" className="hover:underline">
              Опитування
            </Link>
          )}
          <Link to="/profile" className="hover:underline">
            Профіль
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
