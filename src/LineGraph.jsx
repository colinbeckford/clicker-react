import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

function LineGraph({ data, onLineClick }) {
  const chartData = useMemo(() => ({
    datasets: Object.keys(data).map((judgeName) => ({
      label: judgeName,
      data: data[judgeName].map((item) => ({
        x: item.second,
        y: item.score,
      })),
      fill: false,
      borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
    })),
  }), [data]);

  const options = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const judgeName = chartData.datasets[datasetIndex].label;
        const clickedPoint = chartData.datasets[datasetIndex].data[index];
        onLineClick(clickedPoint.x, judgeName); // Pass both time and judge name
      }
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Time (seconds)",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Score",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default LineGraph;
