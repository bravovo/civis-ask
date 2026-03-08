import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "../../config/env";
import { useState } from "react";

function SurveyInfo() {
  const { surveyId } = useParams();

  const [survey, setSurvey] = useState({});

  useEffect(() => {
    async function fetchSurvey() {
      try {
        if (!surveyId) {
          throw new Error("ID опитування не знайдено");
        }

        const response = await axios.get(
          `${SERVER_URL}/surveys/survey/${surveyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          },
        );

        if (response.data.success) {
          console.log(response.data.survey);
          setSurvey(response.data.survey);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchSurvey();
  }, [surveyId]);

  return (
    <div>
      {survey.title && (
        <div>
          <div className="text-zinc-400 flex flex-col justify-start items-start">
            <p className={`${survey.verified ? "text-[green]" : "text-[red]"}`}>
              {survey.verified ? "Перевірене" : "Не перевірене"}
            </p>
            <h3>Автор: {survey.author.firstName}</h3>
          </div>
          <div className="flex flex-col gap-3 justify-start items-start">
            <p>{survey.title}</p>
            <p>{survey.description}</p>
            <p>Кількість питань: {survey.questions.length}</p>
            <p>Дата створення: {survey.createdAt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyInfo;
