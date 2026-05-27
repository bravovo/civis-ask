import { useNavigate, useParams } from "react-router-dom";
import useSurveyInfo from "../../hooks/useSurveyInfo";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/ui/Loader/Loader";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

import EmptyComponent from "@/components/EmptyComponent/EmptyComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getSurveysPassedByUser } from "@/state/profileSlice";

function PassSurvey() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.loader);
  const { surveyId } = useParams();
  const { survey } = useSurveyInfo(surveyId);

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

  if (loading) return <Loader />;

  if (!survey) {
    return (
      <EmptyComponent
        title="Опитування не знайдено"
        description="Опитування, яке ви шукаєте, не існує або було видалено."
        buttonText="На головну"
        buttonLink="/"
      />
    );
  }

  if (survey?.isPassed) {
    return <Navigate to="/" replace />;
  }

  const handlePassClick = async () => {
    try {
      if (survey.isPassed) {
        toast.error("Ви вже проходили це опитування");
        return;
      }

      const hasUnansweredRequired = survey.questions.some((q) => {
        const userAnswers = surveyTake.find(
          (item) => item.questionId === q._id
        );

        if (!userAnswers) return true;

        if (q.type === "radio") {
          return !userAnswers.answer || userAnswers.answer.trim() === "";
        } else {
          return (
            !Array.isArray(userAnswers.answer) ||
            userAnswers.answer.length === 0
          );
        }
      });

      if (hasUnansweredRequired) {
        toast.error("Дайте відповідь на всі питання");
        return;
      }

      const promise = api.post(`/surveys/survey/${surveyId}/pass`, {
        answers: surveyTake,
      });

      toast.promise(promise, {
        loading: "Збереження відповіді...",
        success: () => {
          navigate("/survey-info/" + surveyId);
          dispatch(getSurveysPassedByUser());
          return "Відповідь успішно збережена";
        },
        error: (err) => {
          return (
            err.response?.data?.message || "Помилка при проходженні опитування"
          );
        },
      });
    } catch (error) {
      toast.error("Помилка при проходженні опитування");
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

  return (
    <div className="w-full h-full flex flex-col gap-6 px-3">
      <div className="fixed z-50 right-0 flex gap-2 items-center justify-end bg-muted backdrop-blur-sm rounded-l-lg p-2">
        <Button onClick={handlePassClick}>Зберегти відповідь</Button>
      </div>
      <div className="w-full flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-20">
          Назад
        </Button>
      </div>
      <Card className="w-full">
        <CardHeader className="w-full flex justify-between items-center">
          <CardTitle>{survey.title}</CardTitle>
        </CardHeader>
        <CardContent className="w-full flex flex-col gap-6">
          {survey.questions &&
            survey.questions.map((q, index) => {
              const currentAnswer = surveyTake?.find(
                (a) => a.questionId === q._id
              );
              return (
                <Item
                  key={q._id}
                  variant={index % 2 === 0 ? "muted" : "contrast"}
                  className="w-full"
                >
                  <ItemContent>
                    <ItemTitle>{q.title}</ItemTitle>
                    <ItemDescription>
                      {q.type === "radio" ? (
                        <RadioGroup
                          value={
                            typeof currentAnswer?.answer === "string"
                              ? currentAnswer.answer
                              : ""
                          }
                          onValueChange={(value) =>
                            changeAnswer(q._id, "radio", value)
                          }
                          className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                        >
                          {(q.options ?? []).map((opt) => (
                            <label
                              key={opt._id}
                              htmlFor={`radio-${opt._id}`}
                              className="flex items-center space-x-3 rounded-md border border-border p-3 hover:bg-accent/50 transition-colors cursor-pointer w-full"
                            >
                              <RadioGroupItem
                                value={opt.value}
                                id={`radio-${opt._id}`}
                              />
                              <span className="text-sm font-medium text-foreground select-none">
                                {opt.value}
                              </span>
                            </label>
                          ))}
                        </RadioGroup>
                      ) : (
                        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {(q.options ?? []).map((opt) => {
                            const isChecked = Array.isArray(
                              currentAnswer?.answer
                            )
                              ? currentAnswer.answer.includes(opt.value)
                              : false;

                            return (
                              <label
                                key={opt._id}
                                htmlFor={`check-${opt._id}`}
                                className="flex items-center space-x-3 rounded-md border border-border p-3 hover:bg-accent/50 transition-colors cursor-pointer w-full"
                              >
                                <Checkbox
                                  id={`check-${opt._id}`}
                                  name={q._id}
                                  onCheckedChange={() =>
                                    changeAnswer(q._id, "check", opt.value)
                                  }
                                  checked={isChecked}
                                />
                                <span className="text-sm font-medium text-foreground select-none">
                                  {opt.value}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}

export default PassSurvey;
