import { useState } from "react";

import axios from "axios";

import { SERVER_URL } from "../../config/env.js";
import FormInput from "../../components/FormInput/FormInput.jsx";
import { Link } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        try {
            if (
                !email ||
                !password ||
                !confirmPassword ||
                !firstName ||
                !lastName
            ) {
                alert("Потрібно ввести всі дані реєстрації");
                return;
            }

            if (password !== confirmPassword) {
                alert("Паролі у полях не співпадають");
                return;
            }

            const response = await axios.post(
                `${SERVER_URL}/auth/register`,
                {
                    email,
                    password,
                    firstName,
                    lastName,
                },
                {
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                alert("Акаунт створено!");
            }
        } catch (error) {
            console.error(error.response);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-6">
            <h2 className="font-bold text-2xl md:text-4xl">
                Створення акаунта
            </h2>
            <form
                onSubmit={handleRegisterSubmit}
                className="w-2xs md:w-[450px] flex flex-col justify-center items-center gap-3 py-5 px-3 border-[1.5px] border-b-gray-400 rounded-[8px]"
            >
                <FormInput
                    title="Електронна пошта"
                    name="userEmail"
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                />
                <FormInput
                    title="Ім'я"
                    name="userFirstName"
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                />
                <FormInput
                    title="Прізвище"
                    name="userLastName"
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                />
                <FormInput
                    title="Пароль"
                    name="userPassword"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                />
                <FormInput
                    title="Підтвердження паролю"
                    name="userConfirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                />
                <button type="submit">Зареєструватись</button>
                <Link to="/login">Вже маєте акаунт?</Link>
            </form>
        </div>
    );
}

export default Register;
