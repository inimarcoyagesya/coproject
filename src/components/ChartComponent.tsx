import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Data Penjualan Bulanan",
    },
  },
};

const labels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];

const data = {
  labels,
  datasets: [
    {
      label: "Penjualan",
      data: [10, 20, 30, 40, 50, 60],
      backgroundColor: "rgba(76, 175, 80, 0.5)", // warna hijau rumput
    },
  ],
};

export default function ChartComponent() {
  return <Bar options={options} data={data} />;
}
