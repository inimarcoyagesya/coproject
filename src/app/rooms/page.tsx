"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@app/components/sidebar";
import Navbar from "@app/components/navbar";

interface Room {
  id: number;
  name: string;
  capacity: number;
  description: string;
  categoryId: number;
  price: number;
  status: string;
}

interface Category {
  id: number;
  name: string;
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof Room; 
    direction: "asc" | "desc" 
  } | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
    description: "",
    categoryId: "",
    price: "",
  });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Fungsi untuk mengambil data ruangan
  const handleGet = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://simaru.amisbudi.cloud/api/rooms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result && result.data) {
        setRooms(result.data);
        setTotalPages(Math.ceil(result.data.length / itemsPerPage));
      }
    } catch (err) {
      setError('Gagal mengambil data ruangan');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk mengambil data kategori
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://simaru.amisbudi.cloud/api/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result && result.data) {
        setCategories(result.data);
      }
    } catch (err) {
      setError('Gagal mengambil data kategori');
    }
  };

  // Fungsi untuk menambah ruangan
  const handleAddRoom = async () => {
    try {
      const payload = {
        name: newRoom.name,
        categoryId: parseInt(newRoom.categoryId),
        price: parseInt(newRoom.price) || 0,
        capacity: parseInt(newRoom.capacity),
        description: newRoom.description,
      };

      const response = await fetch("https://simaru.amisbudi.cloud/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambah ruangan");
      }

      const result = await response.json();
      setMessage(result.message || "Ruangan berhasil ditambahkan");
      setIsSuccess(true);
      setShowAddModal(false);
      setTimeout(() => setIsSuccess(false), 3000);
      handleGet();
      
      // Reset form
      setNewRoom({
        name: "",
        capacity: "",
        description: "",
        categoryId: "",
        price: "",
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menambah ruangan');
    }
  };

  // Fungsi untuk mengedit ruangan
  const handleEditRoom = async () => {
    if (!editingRoom) return;
    
    try {
      const payload = {
        name: editingRoom.name,
        categoryId: editingRoom.categoryId,
        price: editingRoom.price,
        capacity: editingRoom.capacity,
        description: editingRoom.description,
      };

      const response = await fetch(`https://simaru.amisbudi.cloud/api/rooms/${editingRoom.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengupdate ruangan");
      }

      const result = await response.json();
      setMessage(result.message || "Ruangan berhasil diupdate");
      setIsSuccess(true);
      setShowEditModal(false);
      setTimeout(() => setIsSuccess(false), 3000);
      handleGet();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupdate ruangan');
    }
  };

  // Fungsi untuk menghapus ruangan
  const handleDeleteRoom = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus ruangan ini?")) return;
    
    try {
      const response = await fetch(`https://simaru.amisbudi.cloud/api/rooms/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus ruangan");
      }

      setMessage("Ruangan berhasil dihapus");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      handleGet();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menghapus ruangan');
    }
  };

  useEffect(() => {
    if (accessToken) {
      handleGet();
      fetchCategories();
    } else {
      setError("Token akses tidak ditemukan");
    }
  }, []);

  // Fungsi untuk sorting
  const requestSort = (key: keyof Room) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Fungsi untuk mendapatkan nomor halaman
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // Fungsi untuk membuka modal edit
  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setShowEditModal(true);
  };

  // Proses sorting dan filtering
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(filter.toLowerCase()) ||
    room.description.toLowerCase().includes(filter.toLowerCase()) ||
    room.capacity.toString().includes(filter) ||
    room.id.toString().includes(filter)
  );

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key;
    if (a[key] < b[key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRooms.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <Sidebar
        isMinimized={isMinimized}
        isOpen={isSidebarOpen}
        toggleMinimize={() => setIsMinimized(!isMinimized)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? (isMinimized ? "ml-16" : "ml-64") : "ml-0"}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} user={null} onLogout={() => {}} />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Ruangan</h1>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Tambah Ruangan
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
          )}

          {isSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center justify-between">
              <span>{message}</span>
              <button onClick={() => setIsSuccess(false)} className="text-green-700 hover:text-green-900">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari ruangan..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-gray-700 dark:text-gray-300">
                      <th 
                        onClick={() => requestSort("id")} 
                        className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          ID 
                          {sortConfig?.key === "id" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => requestSort("name")} 
                        className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          Nama 
                          {sortConfig?.key === "name" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => requestSort("capacity")} 
                        className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          Kapasitas 
                          {sortConfig?.key === "capacity" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="py-2 px-4 border-b dark:border-gray-700">Deskripsi</th>
                      <th className="py-2 px-4 border-b dark:border-gray-700">Status</th>
                      <th className="py-2 px-4 border-b dark:border-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((room) => (
                        <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                          <td className="py-2 px-4 border-b dark:border-gray-700">{room.id}</td>
                          <td className="py-2 px-4 border-b dark:border-gray-700">{room.name}</td>
                          <td className="py-2 px-4 border-b dark:border-gray-700 text-center">{room.capacity}</td>
                          <td className="py-2 px-4 border-b dark:border-gray-700">
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                              {room.description}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b dark:border-gray-700">
                            <span className={`px-2 py-1 rounded text-sm ${
                              room.status === 'available' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {room.status === 'available' ? 'Tersedia' : 'Terpakai'}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b dark:border-gray-700">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openEditModal(room)} 
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteRoom(room.id)} 
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-gray-500 dark:text-gray-400">
                          Tidak ada data ruangan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 mb-4">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
                  >
                    Sebelumnya
                  </button>
                  {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded transition-colors ${
                          currentPage === page 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className="px-3 py-1">{page}</span>
                    )
                  )}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </>
          )}

          {/* Modal Tambah Ruangan */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Tambah Ruangan Baru</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Ruangan
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Ruangan"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kapasitas
                    </label>
                    <input
                      type="number"
                      placeholder="Kapasitas"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deskripsi
                    </label>
                    <input
                      type="text"
                      placeholder="Deskripsi"
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Harga
                    </label>
                    <input
                      type="number"
                      placeholder="Harga"
                      value={newRoom.price}
                      onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kategori
                    </label>
                    <select
                      value={newRoom.categoryId}
                      onChange={(e) => setNewRoom({ ...newRoom, categoryId: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button 
                    onClick={() => setShowAddModal(false)} 
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleAddRoom} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Edit Ruangan */}
          {showEditModal && editingRoom && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Edit Ruangan</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Ruangan
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Ruangan"
                      value={editingRoom.name}
                      onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kapasitas
                    </label>
                    <input
                      type="number"
                      placeholder="Kapasitas"
                      value={editingRoom.capacity}
                      onChange={(e) => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deskripsi
                    </label>
                    <input
                      type="text"
                      placeholder="Deskripsi"
                      value={editingRoom.description}
                      onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Harga
                    </label>
                    <input
                      type="number"
                      placeholder="Harga"
                      value={editingRoom.price}
                      onChange={(e) => setEditingRoom({ ...editingRoom, price: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Kategori
                    </label>
                    <select
                      value={editingRoom.categoryId}
                      onChange={(e) => setEditingRoom({ ...editingRoom, categoryId: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button 
                    onClick={() => setShowEditModal(false)} 
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleEditRoom} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

export default RoomsPage;