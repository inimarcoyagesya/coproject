'use client'
import { useState } from "react";
import Sidebar from "@app/components/sidebar";
import Navbar from "@app/components/navbar";
import ChartComponent from "@app/components/ChartComponent";
import { Users, DollarSign, Activity } from "lucide-react";
import dynamic from "next/dynamic";

const DraggableTable = dynamic(() => import('@app/components/DraggableTable'), { ssr: false });

export default function AdminDashboard() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors overflow-x-hidden">
      <Sidebar
        isMinimized={isMinimized}
        isOpen={isSidebarOpen}
        toggleMinimize={() => setIsMinimized(!isMinimized)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? (isMinimized ? "ml-16" : "ml-64") : "ml-0"
        }`}
      >
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} user={null} onLogout={() => {}} />
        <main className="p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 transition-colors">
            Admin Dashboard
          </h1>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg border border-blue-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transform hover:-translate-y-1 transition">
              <div className="flex items-center mb-4">
                <Users className="w-10 h-10 text-teal-900 bg-teal-100 dark:text-teal-100 dark:bg-teal-900 p-2 rounded-full transition-colors" />
                <h2 className="ml-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Total Users
                </h2>
              </div>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-400">1,234</p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg border border-blue-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transform hover:-translate-y-1 transition">
              <div className="flex items-center mb-4">
                <DollarSign className="w-10 h-10 text-teal-900 bg-teal-100 dark:text-teal-100 dark:bg-teal-900 p-2 rounded-full transition-colors" />
                <h2 className="ml-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Revenue
                </h2>
              </div>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-400">$56,789</p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg border border-blue-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl transform hover:-translate-y-1 transition">
              <div className="flex items-center mb-4">
                <Activity className="w-10 h-10 text-teal-900 bg-teal-100 dark:text-teal-100 dark:bg-teal-900 p-2 rounded-full transition-colors" />
                <h2 className="ml-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                  Active Sessions
                </h2>
              </div>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-400">345</p>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl p-6 shadow-md transition-colors">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Analytics Overview
              </h2>
              <ChartComponent />
            </div>
          </div>

          {/* Table */}
          <div className="mt-8 mb-16">
            <div className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl p-6 shadow-md transition-colors">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                User Data
              </h2>
              <DraggableTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
