import { useMemo, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      display: false,
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
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0].value);
  const [selectedDiagramType, setSelectedDiagramType] = useState(
    diagramTypes[0].value
  );

  const chartData = useMemo(() => {
    if (!data) return null;
    return data[selectedDataType] || null;
  }, [data, selectedDataType]);

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
        <div className="w-full flex flex-col md:flex-row gap-4 justify-start my-4">
          <div className="grid gap-2">
            <Label htmlFor="diagramType">Вид діаграми</Label>
            <Select
              value={selectedDiagramType}
              onValueChange={(value) => setSelectedDiagramType(value)}
              disabled={selectedDataType !== "data"}
            >
              <SelectTrigger id="diagramType">
                <SelectValue placeholder="Оберіть вид діаграми" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {diagramTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="data">Дані діаграми</Label>
            <Select
              value={selectedDataType}
              onValueChange={(value) => {
                setSelectedDataType(value);
                if (value !== "data") {
                  setSelectedDiagramType(diagramTypes[0].value);
                }
              }}
            >
              <SelectTrigger id="data">
                <SelectValue placeholder="Оберіть дані діаграми" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {dataTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedDiagramType === "bar" ? (
          <div className="w-full max-w-2xs md:max-w-3xl flex justify-center items-center md:h-[300px] mx-auto md:my-5">
            <Bar
              options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  legend: {
                    ...options.plugins.legend,
                    display: selectedDataType !== "data",
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
          <div className="w-full flex justify-center md:h-[400px]">
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
