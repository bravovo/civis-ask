import { useEffect, useRef } from "react";
import FormInput from "../../components/ui/FormInput/FormInput";
import { useSelector, useDispatch } from "react-redux";
import {
  addQuestion,
  changeDescription,
  changeTitle,
  saveSurvey,
} from "../../state/surveySlice";
import Question from "../../components/Question/Question";
import { useNavigate } from "react-router-dom";

function NewSurvey() {
  const navigate = useNavigate();
  const survey = useSelector((state) => state.survey);
  const dispatch = useDispatch();
  const textAreaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("survey", JSON.stringify(survey));
  }, [survey]);

  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleSubmit = (type) => {
    console.log(type);
    if (survey.title && survey.description && survey.questions.length > 0) {
      dispatch(saveSurvey({ status: type }));
    } else {
      alert("Всі дані повинні бути заповненні");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button onClick={() => navigate(-1)} className="w-20">
        Назад
      </button>
      <h2>Створіть нове опитування</h2>
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
        <button onClick={() => dispatch(addQuestion())}>Додати питання</button>
        <div className="flex flex-row gap-2">
          <button onClick={() => handleSubmit("save")}>Зберегти</button>
          <button onClick={() => handleSubmit("publish")}>
            Зберегти та опублікувати
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewSurvey;
