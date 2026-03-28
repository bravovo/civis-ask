import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="w-full flex justify-center sticky top-0 z-50">
            <div className="max-w-7xl w-full flex items-center justify-between py-4">
                <div className="w-full">logo</div>
                <div className="w-full flex justify-center">
                    <div>
                        <Link to="/dashboard">Dashboard</Link>
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <Link to="/profile">Profile</Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
