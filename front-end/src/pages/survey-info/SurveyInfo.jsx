import { Navigate, useNavigate, useParams } from "react-router-dom";
import useSurveyInfo from "../../hooks/useSurveyInfo";
import { useSelector } from "react-redux";
import Loader from "../../components/ui/Loader/Loader";

function SurveyInfo() {
  const { loading } = useSelector((state) => state.loader);
  const { surveyId } = useParams();
  const { survey } = useSurveyInfo(surveyId);

  const navigate = useNavigate();

  const onPassSurveyClick = () => {
    navigate(`/${surveyId}/pass`);
  };

  if (loading) return <Loader />;

  if (survey && survey.status === "draft") {
    return <Navigate to={`/${survey._id}/edit`} replace />;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="w-20">
        Назад
      </button>
      {survey && (
        <div>
          <div className="text-zinc-400 flex flex-col justify-start items-start">
            <p className={`${survey.verified ? "text-[green]" : "text-[red]"}`}>
              {survey.verified ? "Перевірене" : "Не перевірене"}
            </p>
            <h3>Автор: {survey.author.firstName}</h3>
          </div>
          <div className="flex flex-col gap-3 justify-start items-start">
            <p>{survey.title}</p>
            <p>{survey.description}</p>
            <p>Кількість питань: {survey.questions.length}</p>
            <p>
              Дата створення:{" "}
              {new Date(survey.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>
          <div>
            <button onClick={onPassSurveyClick}>Пройти опитування</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SurveyInfo;
