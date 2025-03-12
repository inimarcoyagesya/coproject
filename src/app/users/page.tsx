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
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' }); // State untuk input user baru

  // Fetch data dari users.json
  useEffect(() => {
    fetch('/users.json')
      .then((response) => response.json())
      .then((data: User[]) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Fungsi untuk menambahkan user baru
  const handleAddUser = () => {
    const newId = users.length ? users[users.length - 1].id + 1 : 1;
    const userToAdd = { id: newId, ...newUser };
    setUsers([...users, userToAdd]);
    setIsOpen(false);
    setNewUser({ name: '', email: '', role: '' });
  };

  // Fungsi untuk memfilter users berdasarkan kata kunci
  const filteredUsers = users.filter((user) => {
    const searchTerm = filter.toLowerCase();
    return (
      user.id.toString().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
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

  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <button onClick={() => setIsOpen(true)} className='bg-green-600 hover:bg-gray-600 text-white px-4 py-4 rounded-md'>Tambah Data</button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tambah User</h3>
            <input
              type="text"
              placeholder="Nama"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4">
              <button onClick={handleAddUser} className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 mr-2">Tambah</button>
              <button onClick={() => setIsOpen(false)} className="bg-gray-200 text-gray-900 px-5 py-2 rounded-lg hover:bg-gray-300">Batal</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by ID, name, email, or role..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('id')}>ID</th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('name')}>Name</th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('email')}>Email</th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('role')}>Role</th>
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
    </div>
  );
};

export default UsersPage;
