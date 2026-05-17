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

import { TypographyH2 } from "@/utils/styles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

function NewSurvey() {
  const navigate = useNavigate();
  const survey = useSelector((state) => state.survey);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem("survey", JSON.stringify(survey));
  }, [survey]);

  const handleSubmit = (type) => {
    console.log(type);

    if (!survey.title || !survey.description || survey.questions.length === 0) {
      toast.error("Всі дані повинні бути заповненні");
      return;
    }

    const hasEmptyOptions = survey.questions.some(
      (q) =>
        q.options.length === 0 ||
        q.options.some((opt) => !opt.text || opt.text.trim() === "")
    );

    if (hasEmptyOptions) {
      toast.error(
        "Будь ласка, заповніть порожні варіанти відповідей у питаннях"
      );
      return;
    }

    const promise = dispatch(saveSurvey({ status: type })).unwrap();

    toast.promise(promise, {
      loading: "Збереження...",
      success: "Опитування успішно збережено",
      error: (err) => {
        return err?.message || "Помилка збереження опитування";
      },
    });
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 px-3">
      <div className="w-full flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-20">
          Назад
        </Button>
        {TypographyH2("Створення нового опитування")}
      </div>
      <Card className="w-full" onSubmit={handleSubmit}>
        <CardHeader className="w-full flex justify-between items-center">
          <CardTitle>Введіть дані опитування та створіть питання</CardTitle>
          <CardAction>
            <Button variant="outline" onClick={() => handleSubmit("save")}>
              Зберегти
            </Button>
          </CardAction>
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
        <CardFooter className="w-full flex justify-center">
          <Button className="w-full" onClick={() => handleSubmit("publish")}>
            Зберегти та опублікувати
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default NewSurvey;
