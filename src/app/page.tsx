"use client"
import { useState } from "react";
import Sidebar from "@app/components/sidebar";
import Navbar from "@app/components/navbar";

export default function Dashboard() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isMinimized={isMinimized}
        isOpen={isSidebarOpen}
        toggleMinimize={() => setIsMinimized(!isMinimized)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isMinimized ? "ml-16" : "ml-64"
        }`}
      >
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Selamat Datang di Dashboard
          </h2>
          <p className="text-gray-500 mt-2">
            Kelola UMKM Anda dengan mudah.
          </p>
        </div>
      </div>
    </div>
  );
}
