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

export default function SurveyCard({
  data,
  isSurveyTake = false,
  fromProfile = false,
}) {
  const link =
    data.status === "draft" ? `/${data._id}/edit` : `/survey-info/${data._id}`;

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
            {formatUserFullName({
              firstName: data.survey.author.firstName,
              lastName: data.survey.author.lastName,
            })}
          </CardDescription>
          <CardAction
            className={`${data.survey.verified ? "text-[green]" : "text-[red]"}`}
          >
            {data.survey.verified ? "Перевірене" : "Не перевірене"}
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 flex items-center">
          <p>Кількість питань: {data.survey.questions.length}</p>
        </CardContent>
        <CardFooter>
          <p>
            Дата проходження:{" "}
            {new Date(data.createdAt).toLocaleDateString("en-GB")}
          </p>
        </CardFooter>
      </Card>
    </Link>
  ) : (
    <Link
      to={link}
      key={data._id}
      className="w-full border border-transparent rounded-xl hover:border-border transition-colors duration-300"
    >
      <Card className="h-[200px] flex">
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
          <CardDescription>
            Автор:{" "}
            {formatUserFullName({
              firstName: data.author.firstName,
              lastName: data.author.lastName,
            })}
          </CardDescription>
          <CardAction
            className={`${data.verified ? "text-[green]" : "text-[red]"}`}
          >
            {data.verified ? "Перевірене" : "Не перевірене"}
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 flex items-center">
          <p>Кількість питань: {data.questions.length}</p>
        </CardContent>
        <CardFooter>
          <p>
            Дата створення:{" "}
            {new Date(data.createdAt).toLocaleDateString("en-GB")}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
