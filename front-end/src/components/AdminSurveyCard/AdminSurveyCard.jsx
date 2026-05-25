import { formatUserFullName } from "../../utils/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteSurvey, patchSurveyVerification } from "../../state/adminSlice";

const verificationOptions = [
  { value: "verified", label: "Перевірене" },
  { value: "not-verified", label: "Не перевірене" },
];

export default function AdminSurveyCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verified, setVerified] = useState(
    data.verified ? "verified" : "not-verified"
  );
  const link = `/survey-info/${data._id}`;

  async function handleSurveyDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const promise = dispatch(deleteSurvey(data._id)).unwrap();

      toast.promise(promise, {
        loading: "Видалення опитування...",
        success: () => {
          setDeleteDialogOpen(false);
          return "Опитування успішно видалено";
        },
        error: (err) => {
          return err.message || err || "Не вдалось видалити опитування";
        },
      });

      await promise;

      setDeleteDialogOpen(false);
    } catch (err) {
      // error is handled in toast
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSurveyVerifiedEdit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) return;

    if (data.verified === verified) {
      toast.info("Немає змін для збереження");
      setEditDialogOpen(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const promise = dispatch(
        patchSurveyVerification({
          surveyId: data._id,
          isVerified: verified === "verified" ? true : false,
        })
      ).unwrap();

      toast.promise(promise, {
        loading: "Оновлення даних опитування...",
        success: () => {
          setEditDialogOpen(false);
          return "Дані опитування успішно оновлені";
        },
        error: (err) => {
          return err.message || err || "Не вдалось оновити дані опитування";
        },
      });

      await promise;

      setEditDialogOpen(false);
    } catch (err) {
      // error is handled in toast
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCardClick = (targetLink) => {
    if (deleteDialogOpen) return;
    navigate(targetLink);
  };

  return (
    <div
      onClick={() => handleCardClick(link)}
      className="w-full border border-transparent rounded-xl hover:border-border transition-colors duration-300 cursor-pointer"
    >
      <Card className="h-[200px] flex">
        <CardHeader className="flex justify-between items-start w-full">
          <div>
            <CardTitle>{data.title}</CardTitle>
            <CardDescription>
              Автор:{" "}
              {data.isAuthor || fromProfile
                ? "Ви"
                : formatUserFullName({
                    firstName: data.author.firstName,
                    lastName: data.author.lastName,
                  })}
            </CardDescription>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer flex"
                    onSelect={() => {
                      setEditDialogOpen(true);
                    }}
                  >
                    Редагувати
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer flex"
                    onSelect={() => {
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Видалити
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                  <form
                    onSubmit={handleSurveyVerifiedEdit}
                    className="space-y-6"
                  >
                    <DialogHeader>
                      <DialogTitle>Редагувати опитування</DialogTitle>
                      <DialogDescription>
                        Тут ви можете змінити дані про верифікацію опитування
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label htmlFor="verification">Перевірка</Label>
                        <Select
                          value={verified}
                          onValueChange={(value) => setVerified(value)}
                        >
                          <SelectTrigger id="verification">
                            <SelectValue placeholder="Оберіть стан перевірки" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectGroup>
                              {verificationOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Скасувати
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting}>
                        Зберегти зміни
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Ви впевнені, що хочете видалити це опитування?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Опитування та всі зібрані відповіді будуть назавжди
                    видалені.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Скасувати</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSurveyDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isSubmitting}
                  >
                    Видалити
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center">
          <p>Кількість питань: {data.questions.length}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p>
            Дата створення:{" "}
            {new Date(data.createdAt).toLocaleDateString("en-GB")}
          </p>
          <div className={`${data.verified ? "text-[green]" : "text-[red]"}`}>
            {data.verified ? "Перевірене" : "Не перевірене"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
