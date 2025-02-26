// pages/users/page.tsx
"use client"; // Pastikan menggunakan client-side rendering untuk interaktivitas

import React, { useState, useEffect } from 'react';

// Interface untuk data user
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]); // State untuk menyimpan data users
  const [filter, setFilter] = useState(''); // State untuk menyimpan kata kunci filter
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null); // State untuk menyimpan konfigurasi sorting
  const [currentPage, setCurrentPage] = useState(1); // State untuk menyimpan halaman yang aktif
  const [itemsPerPage] = useState(20); // Jumlah baris per halaman

  // Fetch data dari users.json
  useEffect(() => {
    fetch('/users.json')
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Fungsi untuk memfilter users berdasarkan kata kunci
  const filteredUsers = users.filter((user) => {
    const searchTerm = filter.toLowerCase();
    return (
      user.id.toString().includes(searchTerm) || // Filter berdasarkan ID
      user.name.toLowerCase().includes(searchTerm) || // Filter berdasarkan nama
      user.email.toLowerCase().includes(searchTerm) || // Filter berdasarkan email
      user.role.toLowerCase().includes(searchTerm) // Filter berdasarkan role
    );
  });

  // Fungsi untuk mengurutkan data
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Fungsi untuk mengubah konfigurasi sorting
  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Menghitung indeks data yang ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk berpindah halaman
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Menghitung total halaman
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Input Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by ID, name, email, or role..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('id')}>
                ID {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('name')}>
                Name {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('email')}>
                Email {sortConfig?.key === 'email' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('role')}>
                Role {sortConfig?.key === 'role' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;