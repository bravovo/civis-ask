import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../state/loaderSlice";
import api from "../../api/api";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

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
  }

  return (
    analytics && (
      <div>
        <h4>
          Загальна кількість опитаних користувачів:{" "}
          {analytics.totalParticipants}
        </h4>
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
        <h4>Статистика по питанням:</h4>
        <div className="w-full flex flex-col gap-1 justify-start m-0">
          Вид діаграми
          <button
            type="button"
            onClick={() => setDiagramDropdownOpen((prev) => !prev)}
          >
            {selectedDiagramType.label}
          </button>
          {diagramDropdownOpen && (
            <div className="flex flex-col gap-1">
              {diagramTypes.map((option) => {
                if (option.value === selectedDiagramType.value) {
                  return null;
                }
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedDiagramType(option);
                      setDiagramDropdownOpen(false);
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {questionsData &&
          questionsData.map((questionData, index) => (
            <div
              key={index}
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
              {selectedDiagramType.value === "bar" ? (
                <Bar
                  options={{
                    ...options,
                    plugins: {
                      ...options.plugins,
                      legend: {
                        ...options.plugins.legend,
                        display: false,
                      },
                      title: {
                        ...options.plugins.title,
                        text: questionData.title,
                      },
                    },
                  }}
                  data={questionData.data}
                />
              ) : (
                <Pie
                  options={{
                    ...options,
                    plugins: {
                      ...options.plugins,
                      legend: {
                        ...options.plugins.legend,
                        display: true,
                      },
                      title: {
                        ...options.plugins.title,
                        text: questionData.title,
                      },
                    },
                  }}
                  data={questionData.data}
                />
              )}
            </div>
          ))}
        {analytics.questionStats.map((question) => {
          return (
            <div key={question._id}>
              <h3>{question.title}</h3>
              {question.results.map((res) => {
                return (
                  <div key={res.option}>
                    <h3>
                      {res.count} {"->"} {res.option}
                    </h3>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    )
  );
}

export default Analytics;
