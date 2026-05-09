import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
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

const dataTypes = [
  { value: "data", label: "Загальні дані" },
  { value: "genderData", label: "За статтю" },
  { value: "ageData", label: "За віком" },
];

function SurveyChart({ data, title }) {
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);
  const [dataDropdownOpen, setDataDropdownOpen] = useState(false);

  const [selectedDiagramType, setSelectedDiagramType] = useState(
    diagramTypes[0]
  );
  const [diagramDropdownOpen, setDiagramDropdownOpen] = useState(false);

  const chartData = useMemo(() => {
    if (!data) return null;
    return data[selectedDataType.value] || null;
  }, [data, selectedDataType.value]);

  if (!data) {
    return (
      <h4 className="text-center p-4">
        Дані аналітики недоступні або завантажуються...
      </h4>
    );
  }

  return (
    data && (
      <div>
        <div className="w-full flex gap-4 justify-center mb-4">
          <div className="w-full flex flex-col gap-1 justify-start m-0">
            Вид діаграми
            <button
              type="button"
              onClick={() => setDiagramDropdownOpen((prev) => !prev)}
              disabled={selectedDataType.value !== "data"}
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
          <div className="w-full flex flex-col gap-1 justify-start m-0">
            Дані діаграми
            <button
              type="button"
              onClick={() => setDataDropdownOpen((prev) => !prev)}
            >
              {selectedDataType.label}
            </button>
            {dataDropdownOpen && (
              <div className="flex flex-col gap-1">
                {dataTypes.map((option) => {
                  return (
                    <button
                      key={option.value}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => {
                        setSelectedDataType(option);
                        setDataDropdownOpen(false);
                        if (option.value !== "data") {
                          setSelectedDiagramType(diagramTypes[0]);
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
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
                    display: selectedDataType.value !== "data",
                  },
                  title: {
                    ...options.plugins.title,
                    text: title,
                  },
                },
              }}
              data={chartData}
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
              data={chartData}
            />
          </div>
        )}
      </div>
    )
  );
}

export default SurveyChart;
