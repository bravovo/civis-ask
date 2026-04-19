import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../state/loaderSlice";
import api from "../api/api";

const useSurveyInfo = (surveyId) => {
  const cachedSurvey = useSelector((state) => state.surveyList.items).find(
    (s) => s._id === surveyId
  );
  const [survey, setSurvey] = useState(cachedSurvey);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!surveyId) {
      console.warn("ID опитування не знайдено");
      return;
    }

    if (cachedSurvey) {
      setSurvey(cachedSurvey);
      return;
    }

    async function fetchSurvey() {
      dispatch(setLoading(true));
      try {
        const response = await api.get(`/surveys/survey/${surveyId}`);

        if (response.data.success) {
          console.log(response.data.survey);

          setSurvey(response.data.survey);
        }
      } catch (error) {
        console.log(error);
        setSurvey(null);
      } finally {
        dispatch(setLoading(false));
      }
    }

    fetchSurvey();
  }, [surveyId, cachedSurvey, dispatch]);

  return { survey };
};

export default useSurveyInfo;
