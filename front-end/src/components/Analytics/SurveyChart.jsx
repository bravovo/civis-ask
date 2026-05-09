import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../state/loaderSlice";
import api from "../../api/api";
import { Bar, Pie } from "react-chartjs-2";

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

function SurveyChart({ data, title }) {
  const [selectedDiagramType, setSelectedDiagramType] = useState(
    diagramTypes[0]
  );
  const [diagramDropdownOpen, setDiagramDropdownOpen] = useState(false);

  if (!data) {
    return <h4>Дані аналітики недоступні</h4>;
  }

  return (
    data && (
      <div>
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
        {selectedDiagramType.value === "bar" ? (
          <div className="w-full flex justify-center h-[400px]">
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
                    text: title,
                  },
                },
              }}
              data={data}
            />
          </div>
        ) : (
          <div className="w-full flex justify-center h-[400px]">
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
                    text: title,
                  },
                },
              }}
              data={data}
            />
          </div>
        )}
      </div>
    )
  );
}

export default SurveyChart;
