import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPublishedSurveys } from "../../state/surveysSlice";
import Loader from "../../components/ui/Loader/Loader";
import SurveyCard from "../../components/SurveyCard/SurveyCard";

import { Button } from "@/components/ui/button";
import { TypographyH2 } from "../../utils/styles.jsx";
import EmptyComponent from "@/components/EmptyComponent/EmptyComponent";

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const surveys = useSelector((state) => state.surveyList);

  useEffect(() => {
    if (surveys.status === "none") {
      dispatch(getPublishedSurveys());
    }
  }, [dispatch, surveys.status]);

  if (surveys.status === "loading") {
    return <Loader />;
  }

  if (surveys.status === "error") {
    return (
      <EmptyComponent
        title="Помилка завантаження опитувань"
        description="Сталася помилка при отриманні списку опитувань. Будь ласка, спробуйте пізніше."
        buttonText="Переглянути профіль"
        buttonLink="/profile"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 px-3">
      {TypographyH2("Почніть створення власних опитувань")}
      <Button
        className="h-10"
        variant="outline"
        onClick={() => navigate("/new-survey")}
      >
        Створити опитування
      </Button>
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        {surveys.status === "success" &&
        (!Array.isArray(surveys.items) || surveys.items.length === 0) ? (
          <EmptyComponent
            title="Опитувань не знайдено"
            description="Створіть нове опитування, щоб побачити його у списку"
            buttonText="Створити опитування"
            buttonLink="/new-survey"
          />
        ) : (
          <div className="w-full h-full flex flex-col gap-2 pt-3">
            {surveys.items.map((s) => {
              return <SurveyCard key={s._id} data={s} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
