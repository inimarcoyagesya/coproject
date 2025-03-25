"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@app/components/sidebar";
import Navbar from "@app/components/navbar";

interface Facility {
  id: number;
  name: string;
  type: string;
  available: boolean;
}

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Facility; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State modal untuk add facility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFacility, setNewFacility] = useState({ name: "", type: "", available: true });

  // State modal untuk edit facility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  useEffect(() => {
    fetch("/facilities.json")
      .then((response) => response.json())
      .then((data: Facility[]) => setFacilities(data))
      .catch((error) => console.error("Error fetching facilities:", error));
  }, []);

  const filteredFacilities = facilities.filter((facility) => {
    const searchTerm = filter.toLowerCase();
    return (
      facility.id.toString().includes(searchTerm) ||
      facility.name.toLowerCase().includes(searchTerm) ||
      facility.type.toLowerCase().includes(searchTerm)
    );
  });

  const sortedFacilities = [...filteredFacilities].sort((a, b) => {
    if (sortConfig) {
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Facility) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const totalPages = Math.ceil(sortedFacilities.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFacilities.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk menghasilkan nomor halaman dengan ellipsis jika total halaman > 7
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(currentPage - 1, 2);
      let end = Math.min(currentPage + 9, totalPages - 1);
      if (start > 2) {
        pages.push("...");
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const handleAddFacility = () => {
    const newId = facilities.length ? facilities[facilities.length - 1].id + 1 : 1;
    const newFacilityData: Facility = { id: newId, ...newFacility };
    setFacilities([...facilities, newFacilityData]);
    setNewFacility({ name: "", type: "", available: true });
    setIsAddModalOpen(false);
  };

  const handleEditFacility = () => {
    if (editingFacility) {
      setFacilities(
        facilities.map((facility) =>
          facility.id === editingFacility.id ? editingFacility : facility
        )
      );
      setEditingFacility(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteFacility = (id: number) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      setFacilities(facilities.filter((facility) => facility.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <Sidebar
        isMinimized={isMinimized}
        isOpen={isSidebarOpen}
        toggleMinimize={() => setIsMinimized(!isMinimized)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? (isMinimized ? "ml-16" : "ml-64") : "ml-0"}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Facilities Management</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Facility
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Filter facilities..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 transition-colors">
            <table className="min-w-full">
              <thead>
                <tr className="text-gray-700 dark:text-gray-300">
                  <th onClick={() => requestSort("id")} className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer">
                    ID {sortConfig?.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => requestSort("name")} className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer">
                    Name {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => requestSort("type")} className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer">
                    Type {sortConfig?.key === "type" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => requestSort("available")} className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer">
                    Availability {sortConfig?.key === "available" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((facility) => (
                  <tr key={facility.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                    <td className="py-2 px-4 border-b dark:border-gray-700">{facility.id}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{facility.name}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{facility.type}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">
                      <span className={`px-2 py-1 rounded text-sm ${
                        facility.available
                          ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                          : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"
                      }`}>
                        {facility.available ? "Available" : "Not Available"}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">
                      <button
                        onClick={() => {
                          setEditingFacility(facility);
                          setIsEditModalOpen(true);
                        }}
                        className="px-2 py-1 mr-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFacility(facility.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination: Previous, Numeric, Next */}
          <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 mb-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            {getPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={index}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-3 py-1">
                  {page}
                </span>
              )
            )}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>

      {/* Modal for adding facility */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">Add New Facility</h2>
            <input
              type="text"
              placeholder="Name"
              value={newFacility.name}
              onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Type"
              value={newFacility.type}
              onChange={(e) => setNewFacility({ ...newFacility, type: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={newFacility.available}
                onChange={(e) => setNewFacility({ ...newFacility, available: e.target.checked })}
                className="mr-2"
              />
              <label className="text-gray-700 dark:text-gray-300">Available</label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFacility}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-2 right-2 text-gray-700 dark:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal for editing facility */}
      {isEditModalOpen && editingFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">Edit Facility</h2>
            <input
              type="text"
              placeholder="Name"
              value={editingFacility.name}
              onChange={(e) => setEditingFacility({ ...editingFacility, name: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Type"
              value={editingFacility.type}
              onChange={(e) => setEditingFacility({ ...editingFacility, type: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={editingFacility.available}
                onChange={(e) => setEditingFacility({ ...editingFacility, available: e.target.checked })}
                className="mr-2"
              />
              <label className="text-gray-700 dark:text-gray-300">Available</label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingFacility(null);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEditFacility}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Update
              </button>
            </div>
            <button
              onClick={() => {
                setEditingFacility(null);
                setIsEditModalOpen(false);
              }}
              className="absolute top-2 right-2 text-gray-700 dark:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
