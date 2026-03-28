import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="w-full flex justify-center sticky top-0 z-50">
            <div className="max-w-7xl w-full flex items-center justify-between py-4">
                <div className="w-full flex">logo</div>
                <div className="flex flex-col justify-end gap-2">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/profile">Profile</Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
