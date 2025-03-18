import React, { useEffect, useState } from "react";
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

const labels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];

const datasetData = [10, 20, 30, 40, 50, 60];

export default function ChartComponent() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Cek apakah ada class 'dark' di html element
    const observer = new MutationObserver(() => {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDark(darkMode);
    });
    observer.observe(document.documentElement, { attributes: true });

    // Initial check
    const initialDark = document.documentElement.classList.contains("dark");
    setIsDark(initialDark);

    return () => observer.disconnect();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDark ? "#E5E7EB" : "#374151", // gray-200 / gray-700
        },
      },
      title: {
        display: true,
        text: "Data Penjualan Bulanan",
        color: isDark ? "#E5E7EB" : "#374151",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#E5E7EB" : "#374151",
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        },
      },
      y: {
        ticks: {
          color: isDark ? "#E5E7EB" : "#374151",
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Penjualan",
        data: datasetData,
        backgroundColor: isDark
          ? "rgba(30, 58, 138, 1)" // blue-900 dark
          : "rgba(30, 58, 138, 1)", // blue-900 light
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow transition-colors">
      <Bar options={options} data={data} />
    </div>
  );
}
