"use client"
import { useState } from "react";
import Sidebar from "@app/components/sidebar";
import Navbar from "@app/components/navbar";
import ChartComponent from "@app/components/ChartComponent";
import DraggableTable from "@app/components/DraggableTable";

export default function AdminDashboard() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isMinimized={isMinimized}
        isOpen={isSidebarOpen}
        toggleMinimize={() => setIsMinimized(!isMinimized)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? (isMinimized ? "ml-16" : "ml-64") : "ml-0"}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-700">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kartu Informasi */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
              <p className="text-3xl font-bold text-green-600 mt-4">1,234</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700">Revenue</h2>
              <p className="text-3xl font-bold text-green-600 mt-4">$56,789</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700">Active Sessions</h2>
              <p className="text-3xl font-bold text-green-600 mt-4">345</p>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6">
            <div className="bg-white shadow rounded-lg p-6">
              <ChartComponent />
            </div>
          </div>

          {/* Tabel dengan Kolom yang Dapat Di-Drag and Drop */}
          <div className="mt-6">
            <div className="bg-white shadow rounded-lg p-6">
              <DraggableTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
