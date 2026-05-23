import { Navigate, useNavigate, useParams } from "react-router-dom";
import useSurveyInfo from "../../hooks/useSurveyInfo";
import { useSelector } from "react-redux";
import Loader from "../../components/ui/Loader/Loader";
import Tabs from "../../components/Tabs/Tabs";
import Analytics from "../../components/Analytics/Analytics";

import { Button } from "@/components/ui/button";
import { TypographyLarge, TypographyP, TypographyLead } from "@/utils/styles";
import { Badge } from "@/components/ui/badge";
import { formatUserFullName } from "../../utils/utils.js";
import { toast } from "sonner";
import EmptyComponent from "@/components/EmptyComponent/EmptyComponent";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SurveyInfo() {
  const { loading } = useSelector((state) => state.loader);
  const profile = useSelector((state) => state.profile);
  const { surveyId } = useParams();
  const { survey } = useSurveyInfo(surveyId);

  const navigate = useNavigate();

  const onPassSurveyClick = () => {
    if (profile.status === "success" && survey) {
      if (!profile.age || !profile.gender) {
        toast.error("Будь ласка, заповніть дані про вік та стать у профілі");
        return;
      }
      navigate(`/${surveyId}/pass`);
    }
  };

  if (loading) return <Loader />;

  if (survey && survey.status === "draft") {
    return <Navigate to={`/${survey._id}/edit`} replace />;
  }

  const surveyInfo = survey ? (
    <div className="w-full h-full pt-3">
      <Card className="h-full flex hover:border-primary/80">
        <CardHeader>
          <CardTitle>
            {TypographyP(
              `Автор: ${formatUserFullName({
                firstName: survey.author.firstName,
                lastName: survey.author.lastName,
              })}`
            )}
          </CardTitle>
          <CardAction>
            {TypographyP(`Кількість питань: ${survey.questions.length}`)}
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          {survey.isPassed && <Badge>Це опитування вже пройдено вами</Badge>}
          {TypographyLead(survey.description)}
        </CardContent>
        <CardFooter>
          {TypographyP(
            `Дата створення: ${new Date(survey.createdAt).toLocaleDateString("en-GB")}`
          )}
        </CardFooter>
      </Card>
    </div>
  ) : null;

  const surveyAnalytics = <Analytics surveyId={surveyId} />;

  const tabs = [
    {
      id: "survey_data",
      label: "Інформація про опитування",
      children: surveyInfo,
    },
    {
      id: "survey_analytics",
      label: "Аналітика",
      children: surveyAnalytics,
    },
  ];

  return survey ? (
    <div className="w-full h-full flex flex-col gap-6 px-3">
      <div className="w-full flex gap-2 justify-between items-center">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-20">
          Назад
        </Button>
        <div className="flex flex-col md:flex-row gap-2 items-end md:items-center">
          {TypographyLarge(survey.title)}
          {survey.verified ? (
            <Badge className="bg-green-950 text-green-300">Перевірене</Badge>
          ) : (
            <Badge className="bg-red-950 text-red-300">Не перевірене</Badge>
          )}
        </div>
      </div>
      {!survey.isPassed && (
        <Button onClick={onPassSurveyClick}>Пройти опитування</Button>
      )}
      <div className="w-full h-full">
        <Tabs tabs={tabs} />
      </div>
    </div>
  ) : (
    <EmptyComponent
      title="Опитування не знайдено"
      description="Опитування, яке ви шукаєте, не існує або було видалено."
      buttonText="На головну"
      buttonLink="/"
    />
  );
}

export default SurveyInfo;
