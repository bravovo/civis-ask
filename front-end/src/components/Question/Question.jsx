import { useDispatch } from "react-redux";
import {
  addOption,
  editOption,
  editQuestion,
  removeQuestion,
  removeOption,
} from "../../state/surveySlice";

import { Item, ItemContent, ItemDescription } from "@/components/ui/item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ellipsis, Trash } from "lucide-react";
import { toast } from "sonner";
import { Oval } from "react-loader-spinner";
import { useState } from "react";

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { AlertTriangleIcon, CircleCheck, Ban } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import api from "@/api/api";

function Question({ question, variant }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [analysis, setAnalysis] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleRemoveQuestion = () => {
    dispatch(removeQuestion({ id: question._id }));
  };

  const handleRemoveOption = (optionId) => {
    dispatch(removeOption({ questionId: question._id, optionId }));
  };

  const handleAnalysisClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await api.post(`/surveys/survey/analysis`, {
        title: question.title,
        type: question.type,
        options: question.options,
      });

      if (response.data.success) {
        setAnalysis(response.data.analysis);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Помилка при аналізі питання");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    if (analysis.score >= 8) {
      return (
        <Alert className="max-w border-green-900 bg-green-950 text-green-50">
          <CircleCheck />
          <AlertTitle className="flex justify-between">
            <p>Аналіз питання</p>
            <p>{analysis.score}/10</p>
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-white">Коментар</h4>
              {analysis.comment}
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-white">Рекомендації</h4>
              <div className="flex flex-col gap-1">
                {(analysis.recommendations ?? []).map((rec, index) => (
                  <p key={index} className="mb-0!">
                    {index + 1}: {rec}
                  </p>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    if (analysis.score >= 5) {
      return (
        <Alert className="max-w border-amber-900 bg-amber-950 text-amber-50">
          <AlertTriangleIcon />
          <AlertTitle className="flex justify-between">
            <p>Аналіз питання</p>
            <p>{analysis.score}/10</p>
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <div className="flex flex-col ">
              <h4 className="font-semibold text-white mb-0">Коментар</h4>
              {analysis.comment}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <h4 className="font-semibold text-white mb-0">Рекомендації</h4>
                <div className="flex flex-col">
                  {(analysis.recommendations ?? []).map((rec, index) => (
                    <p key={index} className="mb-0!">
                      {index + 1}: {rec}
                    </p>
                  ))}
                </div>
              </div>
              {(analysis.suggestedOptions ?? []).length > 0 && (
                <div className="flex flex-col">
                  <h4 className="font-semibold text-white mb-0">
                    Пропоновані варіанти відповіді:
                  </h4>
                  <div className="flex flex-col">
                    {(analysis.suggestedOptions ?? []).map((opt, index) => (
                      <p key={index} className="mb-0!">
                        {index + 1}: {opt}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="max-w border-red-900 bg-red-950 text-red-50 ">
        <Ban />
        <AlertTitle className="flex justify-between">
          <p>Аналіз питання</p>
          <p>{analysis.score}/10</p>
        </AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <div className="flex flex-col ">
            <h4 className="font-semibold text-white mb-0">Коментар</h4>
            {analysis.comment}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <h4 className="font-semibold text-white mb-0">Рекомендації</h4>
              <div className="flex flex-col">
                {(analysis.recommendations ?? []).map((rec, index) => (
                  <p key={index} className="mb-0!">
                    {index + 1}: {rec}
                  </p>
                ))}
              </div>
            </div>
            {(analysis.suggestedOptions ?? []).length > 0 && (
              <div className="flex flex-col">
                <h4 className="font-semibold text-white mb-0">
                  Пропоновані варіанти відповіді:
                </h4>
                <div className="flex flex-col">
                  {(analysis.suggestedOptions ?? []).map((opt, index) => (
                    <p key={index} className="mb-0!">
                      {index + 1}: {opt}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Item variant={variant}>
      {isSubmitting && (
        <div className="loader-overlay flex flex-col gap-4">
          <Oval
            visible={true}
            height="100"
            width="100"
            color="#000"
            secondaryColor="gray"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
          <h4>
            Штучний інтелект аналізує питання. Це може зайняти деякий час...
          </h4>
        </div>
      )}
      <ItemContent>
        <ItemDescription>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="grid gap-2 flex-grow-1">
                <Label htmlFor={`question-title-${question._id}`}>
                  Текст питання
                </Label>
                <Input
                  id={`question-title-${question._id}`}
                  type="text"
                  value={question.title || ""}
                  placeholder="Введіть питання"
                  onChange={(e) => editQuestionTitle(e.target.value)}
                  required
                />
              </div>
              <AlertDialog open={open} onOpenChange={setOpen}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isSubmitting}>
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer flex justify-center"
                      onSelect={() => {
                        handleAnalysisClick();
                      }}
                    >
                      Аналіз питання
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer flex justify-center"
                      onSelect={() => {
                        setOpen(true);
                      }}
                    >
                      Видалити питання
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Ви впевнені, що хочете видалити це питання?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Питання буде видалено назавжди
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Скасувати</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleRemoveQuestion}
                      disabled={isSubmitting}
                    >
                      Видалити
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {renderAnalysis()}
            <div className="w-full flex flex-col gap-1 justify-start m-0">
              <Label htmlFor="surveyTitle">Тип відповіді</Label>
              <RadioGroup
                value={question.type || "radio"}
                onValueChange={(value) => changeQuestionType(value)}
                className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <FieldLabel
                  htmlFor={`radio-${question._id}`}
                  className="cursor-pointer"
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Одинарний вибір</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem
                      value="radio"
                      id={`radio-${question._id}`}
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel
                  htmlFor={`check-${question._id}`}
                  className="cursor-pointer"
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Множинний вибір</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem
                      value="check"
                      id={`check-${question._id}`}
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Варіанти відповіді</Label>
              <div className="flex flex-col gap-1 w-full">
                {question.options.length > 0 &&
                  question.options.map((opt) => {
                    return (
                      <div
                        key={opt._id}
                        className="flex items-center gap-2 w-full"
                      >
                        <Input
                          id={`answer-option-${opt._id}`}
                          type="text"
                          placeholder="Введіть варіант відповіді"
                          value={opt.value ?? ""}
                          onChange={(e) => {
                            dispatch(
                              editOption({
                                questionId: question._id,
                                optionId: opt._id,
                                value: e.target.value,
                              })
                            );
                          }}
                          required
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          disabled={isSubmitting}
                          onClick={() => handleRemoveOption(opt._id)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    );
                  })}
              </div>
              <Button
                type="button"
                variant="contrast"
                disabled={isSubmitting}
                onClick={() => dispatch(addOption(question._id))}
              >
                Додати варіант відповіді
              </Button>
            </div>
          </div>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

export default Question;
