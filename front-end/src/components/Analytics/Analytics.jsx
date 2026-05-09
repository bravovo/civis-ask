import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import SurveyChart from "./SurveyChart";
import Loader from "../../components/ui/Loader/Loader";
import { chartColors } from "../../constants/constants";

ChartJS.register(...registerables);

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: "top",
    },
    title: {
      display: true,
      text: "Кількість опитаних користувачів за віковими інтервалами",
    },
  },
  maintainAspectRatio: true,
};

const diagramTypes = [
  { value: "bar", label: "Стовпчаста діаграма" },
  { value: "pie", label: "Кругова діаграма" },
];

function Analytics({ surveyId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSurveyAnalytics() {
      try {
        setLoading(true);
        const response = await api.get(`/surveys/survey/${surveyId}/analytics`);

        if (response.status === 200 && response.data.data.analytics) {
          console.log("ANALYTICS FOUND", response.data.data);
          setAnalytics(response.data.data.analytics);
        }
      } catch (error) {
        console.log(error);
        return "Аналітика опитування недоступна";
      } finally {
        setLoading(false);
      }
    }

    if (Boolean(surveyId) && !Boolean(analytics)) {
      getSurveyAnalytics();
    }
  }, [surveyId, analytics]);

  const formattedData = useMemo(() => {
    if (!analytics) return null;

    const ageLabels = analytics.ageStats.map((s) => s.label);
    const ageCounts = analytics.ageStats.map((s) => s.count);

    const genderLabels = analytics.genderStats.map((s) => s.label);
    const genderCounts = analytics.genderStats.map((s) => s.count);

    const ageChartData = {
      labels: ageLabels,
      datasets: [
        {
          label: "Кількість користувачів",
          data: ageCounts,
          backgroundColor: ageLabels.map((label) => chartColors.age[label]),
          borderColor: "transparent",
          borderWidth: 1,
        },
      ],
    };

    const genderChartData = {
      labels: genderLabels,
      datasets: [
        {
          label: "Кількість користувачів",
          data: genderCounts,
          backgroundColor: genderLabels.map((label) =>
            label === "Чоловік"
              ? chartColors.gender.male
              : chartColors.gender.female
          ),
          borderColor: "transparent",
          borderWidth: 1,
        },
      ],
    };

    const questionsChartData = (analytics.questionStats || []).map(
      (question) => {
        const optionLabels = (question.results || []).map((res) => res.option);

        return {
          title: question.title,
          data: {
            labels: optionLabels,
            datasets: [
              {
                label: "Кількість користувачів",
                data: question.results.map((r) => r.count),
                backgroundColor: genderLabels.map(
                  () =>
                    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
                ),
                borderColor: "transparent",
                borderWidth: 1,
              },
            ],
          },
          genderData: {
            labels: optionLabels,
            datasets: [
              {
                label: "Чоловік",
                data: question.results.map(
                  (res) =>
                    res.genderBreakdown.find((g) => g.label === "Чоловік")
                      ?.count || 0
                ),
                backgroundColor: chartColors.gender.male,
                borderColor: "transparent",
                borderWidth: 1,
              },
              {
                label: "Жінка",
                data: question.results.map(
                  (res) =>
                    res.genderBreakdown.find((g) => g.label === "Жінка")
                      ?.count || 0
                ),
                backgroundColor: chartColors.gender.female,
                borderColor: "transparent",
                borderWidth: 1,
              },
            ],
          },
          ageData: {
            labels: optionLabels,
            datasets: [
              ...new Set(
                question.results.flatMap((r) =>
                  r.ageBreakdown.map((a) => a.label)
                )
              ),
            ].map((ageLabel) => ({
              label: ageLabel,
              data: question.results.map(
                (res) =>
                  res.ageBreakdown.find((a) => a.label === ageLabel)?.count || 0
              ),
              backgroundColor: chartColors.age[ageLabel],
              borderColor: "transparent",
              borderWidth: 1,
            })),
          },
        };
      }
    );

    return { ageChartData, genderChartData, questionsChartData };
  }, [analytics]);

  if (loading) return <Loader />;
  if (!analytics) return <h4>Дані аналітики недоступні</h4>;

  return (
    <div>
      <h3>
        Загальна кількість опитаних користувачів: {analytics.totalParticipants}
      </h3>
      <div className="flex flex-row gap-4">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            width: "100%",
            maxWidth: "800px",
            margin: "20px auto",
          }}
        >
          <Bar options={options} data={formattedData.ageChartData} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            width: "100%",
            maxWidth: "800px",
            margin: "20px auto",
          }}
        >
          <Bar
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: {
                  ...options.plugins.title,
                  text: "Кількість опитаних користувачів за статтю",
                },
              },
            }}
            data={formattedData.genderChartData}
          />
        </div>
      </div>
      <h3>Статистика по питанням:</h3>
      {formattedData.questionsChartData.map((questionData, index) => (
        <SurveyChart
          key={index}
          data={questionData}
          title={questionData.title}
        />
      ))}
    </div>
  );
}

export default Analytics;
