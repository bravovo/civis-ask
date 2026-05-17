import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPublishedSurveys } from "../../state/surveysSlice";
import Popup from "../../components/ui/Popup/Popup";
import Loader from "../../components/ui/Loader/Loader";
import SurveyCard from "../../components/SurveyCard/SurveyCard";

import { Button } from "@/components/ui/button";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { TypographyH2 } from "../../utils/styles.jsx";

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const surveys = useSelector((state) => state.surveyList);

  useEffect(() => {
    if (!surveys.items || surveys.items.length === 0) {
      dispatch(getPublishedSurveys());
    }
  }, [dispatch, surveys.items]);

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
        (!surveys.items || surveys.items.length === 0) ? (
          <Empty className="w-full h-full flex justify-center items-center">
            <EmptyHeader>
              <EmptyTitle>Опитувань не знайдено</EmptyTitle>
              <EmptyDescription>
                Створіть нове опитування, щоб побачити його у списку
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => navigate("/new-survey")}>
                Створити опитування
              </Button>
            </EmptyContent>
          </Empty>
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
