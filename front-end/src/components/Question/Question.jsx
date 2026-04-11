import { useDispatch } from "react-redux";
import { addOption, editOption, editQuestion } from "../../state/surveySlice";

function Question({ question }) {
  const dispatch = useDispatch();

  const changeQuestionType = (newType) => {
    dispatch(
      editQuestion({
        id: question._id,
        changes: { type: newType },
      })
    );
  };

  const editQuestionTitle = (newTitle) => {
    dispatch(
      editQuestion({
        id: question._id,
        changes: { title: newTitle },
      })
    );
  };

  return (
    <div className="border-[1px] rounded-2xl border-zinc-400 py-6 px-5 w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <div className="w-full flex flex-col gap-1 justify-start m-0">
            <label htmlFor="question-title" className="text-[16px]">
              Текст питання
            </label>
            <input
              type="text"
              required
              name="question-title"
              value={question.title}
              onChange={(e) => editQuestionTitle(e.target.value)}
              className="border-[1px] rounded-[4px] border-zinc-400 py-1.5 px-3"
            />
          </div>
        </div>
        <div>
          <div className="w-full flex flex-col gap-1 justify-start m-0">
            Тип відповіді
            <div className="flex flex-row justify-center items-center gap-6">
              <label htmlFor="answer-type" className="flex flex-row gap-1.5">
                Одинарний вибір
                <input
                  type="radio"
                  name={`${question._id}-answer-type`}
                  onChange={() => changeQuestionType("radio")}
                  checked={question.type === "radio"}
                  className="border-[1px] rounded-[4px] border-zinc-400 py-1.5 px-3"
                />
              </label>
              <label htmlFor="answer-type" className="flex flex-row gap-1.5">
                Множинний вибір
                <input
                  type="radio"
                  name={`${question._id}-answer-type`}
                  onChange={() => changeQuestionType("check")}
                  checked={question.type === "check"}
                  className="border-[1px] rounded-[4px] border-zinc-400 py-1.5 px-3"
                />
              </label>
            </div>
          </div>
        </div>
        <div>
          {question.type !== "text" && (
            <div className="flex flex-col gap-2">
              Варіанти відповіді
              <div className="flex flex-col gap-1 w-full">
                {question.options.length > 0 &&
                  question.options.map((opt) => {
                    return (
                      <label
                        className="w-full"
                        htmlFor="answer-option"
                        key={opt._id}
                      >
                        <input
                          className="w-full"
                          type="text"
                          name="answer-option"
                          value={opt.text || opt.value}
                          onChange={(e) => {
                            dispatch(
                              editOption({
                                questionId: question._id,
                                optionId: opt._id,
                                text: e.target.value,
                              })
                            );
                          }}
                        />
                      </label>
                    );
                  })}
              </div>
              <button
                type="button"
                onClick={() => dispatch(addOption(question._id))}
              >
                Додати ще
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Question;
