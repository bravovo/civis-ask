import { Link } from "react-router-dom";
import { formatUserFullName } from "../../utils/utils";

import {
  Card,
  CardAction,
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
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteSurvey } from "../../state/surveysSlice";
import CopyButton from "../CopyButton/CopyButton";

export default function SurveyCard({
  data,
  isSurveyTake = false,
  fromProfile = false,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const link =
    data.status === "draft" ? `/${data._id}/edit` : `/survey-info/${data._id}`;

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

  const handleCardClick = (targetLink) => {
    if (deleteDialogOpen) return;
    navigate(targetLink);
  };

  return isSurveyTake ? (
    <Link
      to={`/survey-info/${data.survey._id}`}
      key={data.survey._id}
      className="w-full border border-transparent rounded-xl hover:border-border transition-colors duration-300"
    >
      <Card className="h-[200px] flex">
        <CardHeader>
          <CardTitle>{data.survey.title}</CardTitle>
          <CardDescription>
            Автор:{" "}
            {data.survey.isAuthor
              ? "Ви"
              : formatUserFullName({
                  firstName: data.survey.author.firstName,
                  lastName: data.survey.author.lastName,
                })}
          </CardDescription>
          <CardAction>
            <CopyButton
              content={
                window.location.origin + `/survey-info/${data.survey._id}`
              }
            />
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 flex items-center">
          <p>Кількість питань: {data.survey.questions.length}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p>
            Дата проходження:{" "}
            {new Date(data.createdAt).toLocaleDateString("en-GB")}
          </p>
          <div className={`${data.verified ? "text-[green]" : "text-[red]"}`}>
            {data.verified ? "Перевірене" : "Не перевірене"}
          </div>
        </CardFooter>
      </Card>
    </Link>
  ) : (
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
            {fromProfile && (
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
                  <DropdownMenuContent align="end" className="w-full">
                    <CopyButton
                      content={
                        window.location.origin + `/survey-info/${data._id}`
                      }
                      text="Скопіювати посилання"
                    />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer flex justify-center"
                      onSelect={() => {
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Видалити
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            )}
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
