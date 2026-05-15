import { useNavigate, useParams } from "react-router-dom";
import useSurveyInfo from "../../hooks/useSurveyInfo";
import { useSelector } from "react-redux";
import Loader from "../../components/ui/Loader/Loader";
import { useEffect, useState } from "react";
import api from "../../api/api";
import Popup from "../../components/ui/Popup/Popup";
import { Navigate } from "react-router-dom";

function PassSurvey() {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.loader);
  const { surveyId } = useParams();
  const { survey } = useSurveyInfo(surveyId);
  const [message, setMessage] = useState("");

  const [surveyTake, setSurveyTake] = useState([]);

  useEffect(() => {
    if (!loading && survey?.questions) {
      const initialAnswers = survey.questions.map((q) => ({
        questionId: q._id,
        answer: q.type === "radio" ? "" : [],
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSurveyTake(initialAnswers);
    }
  }, [survey, loading]);

  useEffect(() => {
    if (message.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  if (survey?.isPassed) {
    return <Navigate to="/" replace />;
  }

  const handlePassClick = async () => {
    try {
      if (survey.isPassed) {
        setMessage("Ви вже проходили це опитування");
        return;
      }

      const response = await api.post(`/surveys/survey/${surveyId}/pass`, {
        answers: surveyTake,
      });

      if (response.data.success) {
        console.log(response.data);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeAnswer = (questionId, type, option) => {
    setSurveyTake((prev) => {
      return prev.map((item) => {
        if (item.questionId !== questionId) {
          return item;
        }

        if (type === "radio") {
          return { ...item, answer: option };
        } else {
          const answers = Array.isArray(item.answer) ? item.answer : [];
          const updatedAnswer = answers.includes(option)
            ? answers.filter((ans) => ans !== option)
            : [...answers, option];
          return { ...item, answer: updatedAnswer };
        }
      });
    });
  };

  if (loading) return <Loader />;

  return (
    <div>
      {message && (
        <div className="w-full flex justify-center">
          <Popup text={message} color="red" duration={5000} />
        </div>
      )}
      <button onClick={() => navigate(-1)} className="w-20">
        Назад
      </button>
      {survey && (
        <div>
          <h1>{survey.title}</h1>

          {survey.questions &&
            survey.questions.map((q) => {
              const currentAnswer = surveyTake?.find(
                (a) => a.questionId === q._id
              );
              return (
                <div key={q._id}>
                  <h2>{q.title}</h2>
                  <div className="flex flex-col justify-center items-center gap-2">
                    {(q.options ?? []).map((opt) => {
                      return (
                        <label htmlFor={opt._id} key={opt._id}>
                          <input
                            id={opt._id}
                            type={q.type === "radio" ? q.type : "checkbox"}
                            name={q._id}
                            required={q.required}
                            onChange={() =>
                              changeAnswer(q._id, q.type, opt.value)
                            }
                            value={opt.value}
                            checked={
                              q.type === "radio"
                                ? currentAnswer?.answer === opt.value || false
                                : currentAnswer?.answer?.includes(opt.value) ||
                                  false
                            }
                          />
                          {opt.value}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          <button onClick={handlePassClick}>Зберегти відповідь</button>
        </div>
      )}
    </div>
  );
}

export default PassSurvey;
