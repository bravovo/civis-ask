import { useState } from "react";

import axios from "axios";

import { SERVER_URL } from "../../config/env.js";
import FormInput from "../../components/FormInput/FormInput.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setCreds } from "../../features/auth/authSlice.js";
import { useDispatch } from "react-redux";

function Login() {
    const dispatch = useDispatch();
    const location = useLocation();
    const isRegistered = location.state?.registered;
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            if (email && password) {
                const response = await axios.post(
                    `${SERVER_URL}/auth/login`,
                    {
                        email,
                        password,
                    },
                    {
                        withCredentials: true,
                    }
                );

                if (response.status === 200) {
                    dispatch(
                        setCreds({
                            user: response.data.user,
                            token: response.data.accessToken,
                        })
                    );
                    navigate("/dashboard");
                }
            }
        } catch (error) {
            console.error(error.response);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-6">
            <h2 className="font-bold text-2xl md:text-4xl">Авторизація</h2>
            <p>{isRegistered && "Користувача створено"}</p>
            <form
                onSubmit={handleLoginSubmit}
                className="w-2xs md:w-[450px] flex flex-col justify-center items-center gap-3 py-5 px-3 border-[1.5px] border-b-gray-400 rounded-[8px]"
            >
                <FormInput
                    title="Електронна пошта"
                    name="userEmail"
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                />
                <FormInput
                    title="Пароль"
                    name="userPassword"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                />
                <button type="submit">Увійти</button>
                {!isRegistered && (
                    <Link to="/register">Ще не маєте акаунта?</Link>
                )}
            </form>
        </div>
    );
}

export default Login;
