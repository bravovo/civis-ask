import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../state/loaderSlice";
import api from "../../api/api";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import SurveyChart from "./SurveyChart";

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
  const dispatch = useDispatch();
  const [analytics, setAnalytics] = useState(null);

  const [selectedDiagramType, setSelectedDiagramType] = useState(
    diagramTypes[0]
  );
  const [diagramDropdownOpen, setDiagramDropdownOpen] = useState(false);

  useEffect(() => {
    async function getSurveyAnalytics() {
      try {
        const response = await api.get(`surveys/survey/${surveyId}/analytics`);

        if (response.status === 200 && response.data.data.analytics) {
          console.log("ANALYTICS FOUND", response.data.data);
          setAnalytics(response.data.data.analytics);
        }
      } catch (error) {
        console.log(error);
        return "Аналітика опитування недоступна";
      }
    }

    if (Boolean(surveyId) && !Boolean(analytics)) {
      getSurveyAnalytics();
    }
  }, [surveyId, analytics]);

  let ageData = {};
  let genderData = {};
  let questionsData = [];
  if (analytics) {
    const ageLabels = analytics.ageStats.map((question) => question.label);
    const ageCounts = analytics.ageStats.map((question) => question.count);

    ageData = {
      labels: ageLabels,
      datasets: [
        {
          label: "Кількість користувачів",
          data: ageCounts,
          backgroundColor: ageLabels.map(
            () =>
              `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
          ),
          borderColor: "transparent",
          borderWidth: 1,
        },
      ],
    };

    const genderLabels = analytics.genderStats.map(
      (question) => question.label
    );
    const genderCounts = analytics.genderStats.map(
      (question) => question.count
    );

    genderData = {
      labels: genderLabels,
      datasets: [
        {
          label: "Кількість користувачів",
          data: genderCounts,
          backgroundColor: genderLabels.map(
            () =>
              `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
          ),
          borderColor: "transparent",
          borderWidth: 1,
        },
      ],
    };

    questionsData = analytics.questionStats.map((question) => {
      const optionLabels = question.results.map((res) => res.option);
      const optionCounts = question.results.map((res) => res.count);

      const questionData = {
        labels: optionLabels,
        datasets: [
          {
            label: "Кількість користувачів",
            data: optionCounts,
            backgroundColor: optionLabels.map(
              () =>
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
            ),
            borderColor: "transparent",
            borderWidth: 1,
          },
        ],
      };
      return { data: questionData, title: question.title };
    });
  } else {
    return <h4>Дані аналітики недоступні</h4>;
  }

  return (
    analytics && (
      <div>
        <h3>
          Загальна кількість опитаних користувачів:{" "}
          {analytics.totalParticipants}
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
            <Bar options={options} data={ageData} />
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
              data={genderData}
            />
          </div>
        </div>
        <h3>Статистика по питанням:</h3>
        {questionsData &&
          questionsData.map((questionData, index) => (
            <SurveyChart
              key={index}
              data={questionData.data}
              title={questionData.title}
            />
          ))}
      </div>
    )
  );
}

export default Analytics;
