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

function Question({ question, variant }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

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

  return (
    <Item variant={variant}>
      <ItemContent>
        <ItemDescription>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="grid gap-2 w-1/2">
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
                    <Button variant="ghost" size="icon">
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
                    >
                      Видалити
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
