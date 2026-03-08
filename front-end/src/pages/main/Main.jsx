import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    return (
        <div className="w-full flex flex-col gap-2">
            <h2>Ласкаво просимо на головну сторінку, {user.firstName}</h2>
            <button onClick={() => navigate("/new-survey")}>
                Створити опитування
            </button>
        </div>
    );
}

export default Main;
