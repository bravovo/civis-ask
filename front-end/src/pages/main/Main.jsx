import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config/env";
import { useState } from "react";

function Main() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    async function fetchPublishedSurveys() {
      try {
        const response = await axios.get(`${SERVER_URL}/surveys`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setSurveys(response.data.surveys);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchPublishedSurveys();
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      <h2>Ласкаво просимо на головну сторінку, {user.firstName}</h2>
      <button onClick={() => navigate("/new-survey")}>
        Створити опитування
      </button>
      <div className="flex flex-col items-center justify-center gap-2">
        {surveys.length === 0 ? (
          <h2>Опитувань не знайдено</h2>
        ) : (
          surveys.map((s) => {
            return (
              <Link
                to={`/survey-info/${s._id}`}
                key={s.id}
                className="border-[1px] !font-normal rounded-2xl border-zinc-400 py-6 px-5 w-full flex flex-col gap-2"
              >
                <div className="text-zinc-400 flex flex-col justify-start items-start">
                  <p
                    className={`${s.verified ? "text-[green]" : "text-[red]"}`}
                  >
                    {s.verified ? "Перевірене" : "Не перевірене"}
                  </p>
                  <h3>Автор: {s.author.firstName}</h3>
                </div>
                <div className="flex flex-col gap-3 justify-start items-start">
                  <p>{s.title}</p>
                  <p>Кількість питань: {s.questions.length}</p>
                  <p>Дата створення: {s.createdAt}</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Main;
