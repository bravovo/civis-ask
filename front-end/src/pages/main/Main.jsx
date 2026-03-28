import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getPublishedSurveys } from "../../state/surveysSlice";
import Popup from "../../components/ui/Popup/Popup";
import Loader from "../../components/ui/Loader/Loader";
import SurveyCard from "../../components/SurveyCard/SurveyCard";

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile);

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
            return <SurveyCard key={s._id} data={s} />;
          })
        )}
      </div>
    </div>
  );
}

export default Main;
