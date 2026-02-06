import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../config/env";

function Dashboard() {
    const [user, setUser] = useState({});

    useEffect(() => {
        async function getUser() {
            try {
                const response = await axios.get(`${SERVER_URL}/user/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    withCredentials: true,
                });

                if (response.status == 200) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.log(error.response || error);
            }
        }

        getUser();
    }, []);

    return (
        <h1>
            Вітаємо у робочій панелі
            {user.firstName ? `, ${user.firstName}` : ""}
        </h1>
    );
}

export default Dashboard;
