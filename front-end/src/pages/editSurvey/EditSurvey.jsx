import { useEffect, useRef } from "react";
import FormInput from "../../components/ui/FormInput/FormInput";
import { useSelector, useDispatch } from "react-redux";
import {
  addQuestion,
  changeDescription,
  changeTitle,
  editSurvey,
  setSurvey,
} from "../../state/surveySlice";
import Question from "../../components/Question/Question";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import useSurveyInfo from "../../hooks/useSurveyInfo";
import Loader from "../../components/ui/Loader/Loader";

function EditSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.loader);
  const { surveyId } = useParams();
  const { survey: data } = useSurveyInfo(surveyId);

  const survey = useSelector((state) => state.survey);

  useEffect(() => {
    if (data) {
      dispatch(setSurvey(data));
    }
  }, [data, dispatch]);

  const textAreaRef = useRef(null);

  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleSubmit = (type) => {
    console.log(type);
    if (survey.title && survey.description && survey.questions.length > 0) {
      dispatch(editSurvey({ status: type }));
    } else {
      alert("Всі дані повинні бути заповнені");
    }
  };

  if (loading) return <Loader />;

  if (survey && survey.status === "published") {
    return <Navigate to={`/survey-info/${survey._id}`} replace />;
  }

  return (
    <div className="flex flex-col gap-3">
      <button onClick={() => navigate(-1)} className="w-20">
        Назад
      </button>
      <h2>Редагувати опитування</h2>
      {survey && (
        <div className="w-full flex flex-col gap-2">
          <FormInput
            title={"Назва"}
            type="text"
            name="surveyTitle"
            value={survey.title}
            onChange={(e) => {
              dispatch(changeTitle(e.target.value));
            }}
          />
          <label
            htmlFor="surveyDesc"
            className="w-full flex flex-col gap-1 justify-start m-0"
          >
            Опис
            <textarea
              ref={textAreaRef}
              required
              onInput={handleInput}
              name="surveyDesc"
              value={survey.description}
              onChange={(e) => {
                dispatch(changeDescription(e.target.value));
              }}
              className="border-[1px] rounded-[4px] border-zinc-400 py-1.5 px-3"
            />
          </label>
          <div className="flex flex-col gap-4 items-center justify-center">
            {survey.questions.map((q) => {
              return <Question key={q._id} question={q} />;
            })}
          </div>
          <button onClick={() => dispatch(addQuestion())}>
            Додати питання
          </button>
          <div className="flex flex-row gap-2">
            <button onClick={() => handleSubmit("save")}>Зберегти</button>
            <button onClick={() => handleSubmit("publish")}>
              Зберегти та опублікувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditSurvey;
