import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/ui/Loader/Loader";

import { TypographyH2 } from "../../../utils/styles.jsx";
import EmptyComponent from "@/components/EmptyComponent/EmptyComponent";
import { getPublishedSurveys } from "@/state/surveysSlice";
import AdminSurveyCard from "@/components/AdminSurveyCard/AdminSurveyCard";

function Surveys() {
  const dispatch = useDispatch();

  const state = useSelector((state) => state.surveyList);

  useEffect(() => {
    if (!state.items || state.items.length === 0) {
      dispatch(getPublishedSurveys());
    }
  }, [dispatch, state.items]);

  if (state.status === "loading") {
    return <Loader />;
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 px-3">
      {TypographyH2("Список опитувань")}
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        {state.status === "success" &&
        (!state.items || state.items.length === 0) ? (
          <EmptyComponent
            title="Опитувань не знайдено"
            description="Створіть нове опитування, щоб воно з'явилось у цьому списку"
            buttonText="Створити опитування"
            buttonLink="/new-survey"
          />
        ) : (
          <div className="w-full h-full flex flex-col gap-2 pt-3">
            {state.items.map((survey) => {
              return <AdminSurveyCard key={survey._id} data={survey} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Surveys;
