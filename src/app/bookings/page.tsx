"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@app/components/sidebar";
import Navbar from "@app/components/navbar";

interface Booking {
  id: number;
  bookingDate: string;
  roomId: number;
  userId: number;
  status: string;
  roomName: string;
  userName: string;
}

interface Room {
  id: number;
  name: string;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof Booking; 
    direction: "asc" | "desc" 
  } | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [newBooking, setNewBooking] = useState({
    bookingDate: "",
    roomId: "",
  });
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Fungsi untuk mengambil data booking
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://simaru.amisbudi.cloud/api/bookings", {
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
        setBookings(result.data);
        setTotalPages(Math.ceil(result.data.length / itemsPerPage));
      }
    } catch (err) {
      setError('Gagal mengambil data booking');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk mengambil data ruangan
  const fetchRooms = async () => {
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
      }
    } catch (err) {
      setError('Gagal mengambil data ruangan');
    }
  };

  // Fungsi untuk menambah booking
  const handleAddBooking = async () => {
    try {
      const payload = {
        bookingDate: newBooking.bookingDate,
        roomId: parseInt(newBooking.roomId),
      };

      const response = await fetch("https://simaru.amisbudi.cloud/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menambah booking");
      }

      const result = await response.json();
      setMessage(result.message || "Booking berhasil ditambahkan");
      setIsSuccess(true);
      setShowAddModal(false);
      setTimeout(() => setIsSuccess(false), 3000);
      fetchBookings();
      
      // Reset form
      setNewBooking({
        bookingDate: "",
        roomId: "",
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menambah booking');
    }
  };

  // Fungsi untuk mengedit booking
  const handleEditBooking = async () => {
    if (!editingBooking) return;
    
    try {
      const payload = {
        bookingDate: editingBooking.bookingDate,
        roomId: editingBooking.roomId,
      };

      const response = await fetch(`https://simaru.amisbudi.cloud/api/bookings/${editingBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengupdate booking");
      }

      const result = await response.json();
      setMessage(result.message || "Booking berhasil diupdate");
      setIsSuccess(true);
      setShowEditModal(false);
      setTimeout(() => setIsSuccess(false), 3000);
      fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupdate booking');
    }
  };

  // Fungsi untuk menghapus booking
  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus booking ini?")) return;
    
    try {
      const response = await fetch(`https://simaru.amisbudi.cloud/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus booking");
      }

      setMessage("Booking berhasil dihapus");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menghapus booking');
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchBookings();
      fetchRooms();
    } else {
      setError("Token akses tidak ditemukan");
    }
  }, [accessToken]);

  // Fungsi untuk sorting
  const requestSort = (key: keyof Booking) => {
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
  const openEditModal = (booking: Booking) => {
    setEditingBooking(booking);
    setShowEditModal(true);
  };

  // Proses sorting dan filtering
  const filteredBookings = bookings.filter(booking => 
    booking.bookingDate.includes(filter) ||
    booking.roomName.toLowerCase().includes(filter.toLowerCase()) ||
    booking.id.toString().includes(filter) ||
    booking.status.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key;
    
    // Handle perbandingan tanggal
    if (key === "bookingDate") {
      const dateA = new Date(a.bookingDate);
      const dateB = new Date(b.bookingDate);
      return sortConfig.direction === "asc" 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    }
    
    // Handle perbandingan string/angka biasa
    if (a[key] < b[key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBookings.slice(indexOfFirstItem, indexOfLastItem);

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Booking</h1>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Tambah Booking
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
              placeholder="Cari booking..."
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
                        onClick={() => requestSort("bookingDate")} 
                        className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          Tanggal Booking 
                          {sortConfig?.key === "bookingDate" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="py-2 px-4 border-b dark:border-gray-700"
                      >
                        Ruangan
                      </th>
                      <th 
                        onClick={() => requestSort("status")} 
                        className="py-2 px-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          Status 
                          {sortConfig?.key === "status" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className="py-2 px-4 border-b dark:border-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">
                          <td className="py-2 px-4 border-b dark:border-gray-700">{booking.id}</td>
                          <td className="py-2 px-4 border-b dark:border-gray-700">
                            {new Date(booking.bookingDate).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-2 px-4 border-b dark:border-gray-700">{booking.roomName}</td>
                          <td className="py-2 px-4 border-b dark:border-gray-700">
                            <span className={`px-2 py-1 rounded text-sm ${
                              booking.status === 'approved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {booking.status === 'approved' 
                                ? 'Disetujui' 
                                : booking.status === 'pending'
                                  ? 'Menunggu'
                                  : 'Ditolak'}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b dark:border-gray-700">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openEditModal(booking)} 
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteBooking(booking.id)} 
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
                        <td colSpan={5} className="py-4 text-center text-gray-500 dark:text-gray-400">
                          Tidak ada data booking
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

          {/* Modal Tambah Booking */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Tambah Booking Baru</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tanggal Booking
                    </label>
                    <input
                      type="date"
                      value={newBooking.bookingDate}
                      onChange={(e) => setNewBooking({ ...newBooking, bookingDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ruangan
                    </label>
                    <select
                      value={newBooking.roomId}
                      onChange={(e) => setNewBooking({ ...newBooking, roomId: e.target.value })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Pilih Ruangan</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
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
                    onClick={handleAddBooking} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Edit Booking */}
          {showEditModal && editingBooking && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Edit Booking</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tanggal Booking
                    </label>
                    <input
                      type="date"
                      value={editingBooking.bookingDate.split('T')[0]}
                      onChange={(e) => setEditingBooking({ 
                        ...editingBooking, 
                        bookingDate: e.target.value 
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ruangan
                    </label>
                    <select
                      value={editingBooking.roomId}
                      onChange={(e) => setEditingBooking({ 
                        ...editingBooking, 
                        roomId: parseInt(e.target.value) 
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
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
                    onClick={handleEditBooking} 
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

export default BookingsPage;