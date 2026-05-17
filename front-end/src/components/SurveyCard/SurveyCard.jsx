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
      className={`${fromProfile ? "border-b-[1px] last:border-none rounded-none" : "border-[1px] rounded-2xl"} !font-normal border-zinc-400 py-6 px-5 w-full flex flex-col gap-2`}
    >
      <div className="text-zinc-400 flex flex-col justify-start items-start">
        <p
          className={`${data.survey.verified ? "text-[green]" : "text-[red]"}`}
        >
          {data.verified ? "Перевірене" : "Не перевірене"}
        </p>
        <h3>
          Автор:{" "}
          {formatUserFullName({
            firstName: data.survey.author.firstName,
            lastName: data.survey.author.lastName,
          })}
        </h3>
      </div>
      <div className="flex flex-col gap-3 justify-start items-start">
        <p>{data.survey.title}</p>
        <p>Кількість питань: {data.survey.questions.length}</p>
        <p>
          Дата проходження:{" "}
          {new Date(data.createdAt).toLocaleDateString("en-GB")}
        </p>
      </div>
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
