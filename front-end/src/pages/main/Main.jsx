import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getPublishedSurveys } from "../../state/surveysSlice";
import Popup from "../../components/ui/Popup/Popup";
import Loader from "../../components/ui/Loader/Loader";

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const surveys = useSelector((state) => state.surveyList);

  useEffect(() => {
    dispatch(getPublishedSurveys());
  }, [dispatch]);

  if (surveys.status === "loading") {
    return <Loader />;
  }

  if (surveys.status === "error") {
    return (
      <div className="w-full h-full flex justify-center items-center text-center">
        <Popup text={surveys.error} color={"red"} duration={5000} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <h2>Ласкаво просимо на головну сторінку, {user.firstName}</h2>
      <button onClick={() => navigate("/new-survey")}>
        Створити опитування
      </button>
      <div className="flex flex-col items-center justify-center gap-2">
        {surveys.status === "success" && surveys.items.length === 0 ? (
          <h2>Опитувань не знайдено</h2>
        ) : (
          surveys.items.map((s) => {
            return (
              <Link
                to={`/survey-info/${s._id}`}
                key={s._id}
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
                  <p>
                    Дата створення:{" "}
                    {new Date(s.createdAt).toLocaleDateString("en-GB")}
                  </p>
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
