import { useSelector } from "react-redux";

function Main() {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className="w-full flex-1">
            Welcome to the main page, {user.firstName}
        </div>
    );
}

export default Main;
