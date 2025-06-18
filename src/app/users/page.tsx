"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@app/components/sidebar";
import Navbar from "@app/components/navbar";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // State untuk edit user
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/users.json")
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const filteredUsers = users.filter((user) => {
    const term = filter.toLowerCase();
    return (
      user.id.toString().includes(term) ||
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig) {
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof User) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk menghitung nomor halaman yang akan ditampilkan
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

  const handleAddUser = () => {
    const newId = users.length ? users[users.length - 1].id + 1 : 1;
    setUsers([...users, { id: newId, ...newUser }]);
    setNewUser({ name: "", email: "", role: "" });
    setIsModalOpen(false);
  };

  const handleEditUser = () => {
    if (editingUser) {
      setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
      setEditingUser(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
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
      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? (isMinimized ? "ml-16" : "ml-64") : "ml-0"}`}
      >
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} user={null} onLogout={() => {}} />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Users Management</h1>

          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Filter users..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full max-w-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Add User
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th onClick={() => requestSort("id")} className="py-2 px-4 border-b cursor-pointer text-gray-800 dark:text-gray-100">
                    ID {sortConfig?.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => requestSort("name")} className="py-2 px-4 border-b cursor-pointer text-gray-800 dark:text-gray-100">
                    Name {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => requestSort("email")} className="py-2 px-4 border-b cursor-pointer text-gray-800 dark:text-gray-100">
                    Email {sortConfig?.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => requestSort("role")} className="py-2 px-4 border-b cursor-pointer text-gray-800 dark:text-gray-100">
                    Role {sortConfig?.key === "role" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="py-2 px-4 border-b text-gray-800 dark:text-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-100">{user.id}</td>
                    <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-100">{user.name}</td>
                    <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-100">{user.email}</td>
                    <td className="py-2 px-4 border-b text-gray-800 dark:text-gray-100">{user.role}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setIsEditModalOpen(true);
                        }}
                        className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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

          {/* Pagination: Previous, numeric, Next */}
          <div className="flex items-center justify-center gap-2 mb-4">
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

          {/* Modal Add User */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Add New User</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-2 mb-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2 mb-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddUser}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Edit User */}
          {isEditModalOpen && editingUser && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Edit User</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full p-2 mb-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full p-2 mb-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full p-2 mb-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setIsEditModalOpen(false);
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditUser}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
