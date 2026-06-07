import { useSelector, useDispatch } from "react-redux";
import {
  addQuestion,
  changeDescription,
  changeTitle,
  saveSurvey,
} from "../../state/surveySlice";
import Question from "../../components/Question/Question";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { getDatabaseData } from "../../state/utils";

function NewSurvey() {
  const navigate = useNavigate();
  const survey = useSelector((state) => state.survey);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (type) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!survey.title || !survey.description) {
        toast.error("Назва та опис опитування повинні бути заповнені");
        return;
      }

      if (survey.questions.length === 0) {
        toast.error("Опитування повинно містити хоча б одне питання");
        return;
      }

      let message = "";

      const hasEmptyOptions = survey.questions.some((q) => {
        if (q.title.trim() === "") {
          message = "Будь ласка, заповніть назви питань";
          return true;
        }
        if (
          q.options.length === 0 ||
          q.options.some((opt) => !opt.value || opt.value.trim() === "")
        ) {
          message = `Будь ласка, заповніть порожні варіанти відповідей у питанні "${q.title || "Без назви"}"`;
          return true;
        }
      });

      if (hasEmptyOptions) {
        toast.error(message);
        return;
      }

      const promise = dispatch(saveSurvey({ status: type })).unwrap();

      toast.promise(promise, {
        loading: "Збереження...",
        success: `Опитування успішно ${type === "publish" ? "опубліковано" : "збережено"}`,
        error: (err) => {
          return (
            err?.message ||
            `Помилка ${type === "publish" ? "публікації" : "збереження"} опитування`
          );
        },
      });

      const result = await promise;

      await getDatabaseData(dispatch);
      if (type === "publish") {
        navigate(`/`);
      } else {
        navigate(`/${result.survey._id}/edit`);
      }
    } catch (err) {
      // error is handled in toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 px-3">
      <div className="fixed z-50 right-0 flex gap-2 items-center justify-end bg-muted backdrop-blur-sm rounded-l-lg p-2">
        <Button
          variant="outline"
          onClick={() => handleSubmit("save")}
          disabled={isSubmitting}
        >
          Зберегти
        </Button>
        <Button onClick={() => handleSubmit("publish")} disabled={isSubmitting}>
          Зберегти та опублікувати
        </Button>
      </div>
      <div className="w-full flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-20">
          Назад
        </Button>
      </div>
      <Card className="w-full" onSubmit={handleSubmit}>
        <CardHeader className="w-full flex justify-between items-center">
          <CardTitle>Введіть дані опитування та створіть питання</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="surveyTitle">Назва</Label>
              <Input
                id="surveyTitle"
                type="text"
                value={survey.title}
                placeholder="Введіть назву опитування"
                onChange={(e) => dispatch(changeTitle(e.target.value))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="surveyDesc">Опис</Label>
              <Textarea
                id="surveyDesc"
                type="text"
                value={survey.description}
                placeholder="Введіть опис опитування"
                onChange={(e) => dispatch(changeDescription(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-4 items-center justify-center">
              {survey.questions.map((q, index) => {
                return (
                  <Question
                    key={q._id}
                    question={q}
                    variant={index % 2 === 0 ? "contrast" : "muted"}
                  />
                );
              })}
            </div>
            <Button variant="outline" onClick={() => dispatch(addQuestion())}>
              Додати питання
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewSurvey;
