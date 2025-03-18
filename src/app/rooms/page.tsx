"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@app/components/sidebar";
import Navbar from "@app/components/navbar";

interface Room {
  id: number;
  name: string;
  capacity: number;
  amenities: string[];
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Room; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newRoom, setNewRoom] = useState({ name: "", capacity: "", amenities: "" });

  useEffect(() => {
    fetch("/rooms.json")
      .then((response) => response.json())
      .then((data: Room[]) => setRooms(data))
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const searchTerm = filter.toLowerCase();
    return (
      room.id.toString().includes(searchTerm) ||
      room.name.toLowerCase().includes(searchTerm) ||
      room.capacity.toString().includes(searchTerm) ||
      room.amenities.some((amenity) => amenity.toLowerCase().includes(searchTerm))
    );
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortConfig) {
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Room) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRooms.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.capacity) return;

    const id = rooms.length ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
    const amenitiesArray = newRoom.amenities.split(",").map((a) => a.trim()).filter(Boolean);

    const newEntry: Room = {
      id,
      name: newRoom.name,
      capacity: parseInt(newRoom.capacity),
      amenities: amenitiesArray,
    };

    setRooms((prev) => [...prev, newEntry]);
    setNewRoom({ name: "", capacity: "", amenities: "" });
    setShowModal(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
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
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rooms Management</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Add Room
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Filter rooms..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-700 dark:text-gray-300">
                  <th
                    onClick={() => requestSort("id")}
                    className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer"
                  >
                    ID {sortConfig?.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    onClick={() => requestSort("name")}
                    className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer"
                  >
                    Name {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    onClick={() => requestSort("capacity")}
                    className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer"
                  >
                    Capacity {sortConfig?.key === "capacity" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="py-2 px-4 border-b dark:border-gray-700">Amenities</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                    <td className="py-2 px-4 border-b dark:border-gray-700">{room.id}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">{room.name}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700 text-center">{room.capacity}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-700">
                      {room.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mr-1 text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-2 text-gray-700 dark:text-gray-300">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(sortedRooms.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={indexOfLastItem >= sortedRooms.length}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600"
            >
              Next
            </button>
          </div>
        </main>
      </div>

      {/* Modal Add Room */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add New Room</h2>
            <input
              type="text"
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              className="w-full mb-3 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={newRoom.capacity}
              onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
              className="w-full mb-3 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Amenities (comma separated)"
              value={newRoom.amenities}
              onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
              className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoom}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
