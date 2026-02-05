import { useState } from "react";
import "./App.css";

import axios from "axios";

import { SERVER_URL } from "../config/env";

function App() {
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
                    console.log(response.data);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleLoginSubmit}>
                <label htmlFor="user-email">
                    Email
                    <input
                        type="email"
                        required
                        name="user-email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label htmlFor="user-pass">
                    Password
                    <input
                        type="password"
                        required
                        name="user-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default App;
