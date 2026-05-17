import { useDispatch } from "react-redux";
import { addOption, editOption, editQuestion } from "../../state/surveySlice";

import { Item, ItemContent, ItemDescription } from "@/components/ui/item";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

function Question({ question, variant }) {
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
    <Item variant={variant}>
      <ItemContent>
        <ItemDescription>
          <div className="flex flex-col gap-4">
            <div>
              <div className="w-full flex flex-col gap-1 justify-start m-0">
                <div className="grid gap-2">
                  <Label htmlFor="surveyTitle">Текст питання</Label>
                  <Input
                    id="question-title"
                    type="text"
                    value={question.title}
                    placeholder="Введіть питання"
                    onChange={(e) => editQuestionTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div>
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
            </div>
            <div>
              <div className="flex flex-col gap-2">
                <Label>Варіанти відповіді</Label>
                <div className="flex flex-col gap-1 w-full">
                  {question.options.length > 0 &&
                    question.options.map((opt) => {
                      return (
                        <Input
                          key={opt._id}
                          id={`answer-option-${opt._id}`}
                          type="text"
                          placeholder="Введіть варіант відповіді"
                          value={opt.text ?? ""}
                          onChange={(e) => {
                            dispatch(
                              editOption({
                                questionId: question._id,
                                optionId: opt._id,
                                text: e.target.value,
                              })
                            );
                          }}
                          required
                        />
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
          </div>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

export default Question;
