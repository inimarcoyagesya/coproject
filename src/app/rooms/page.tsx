
"use client";

import React, { useState, useEffect } from 'react';


interface Room {
  id: number;
  name: string;
  capacity: number;
  amenities: string[];
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Room; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetch('/rooms.json')
      .then((response) => response.json())
      .then((data: Room[]) => setRooms(data))
      .catch((error) => console.error('Error fetching rooms:', error));
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const searchTerm = filter.toLowerCase();
    return (
      room.id.toString().includes(searchTerm) ||
      room.name.toLowerCase().includes(searchTerm) ||
      room.capacity.toString().includes(searchTerm) ||
      room.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm))
    );
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortConfig) {
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Room) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRooms.slice(indexOfFirstItem, indexOfLastItem);

  const Navbar = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Rooms Management</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter rooms..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <table className="min-w-full">
          <thead>
            <tr>
              <th onClick={() => requestSort('id')} 
                  className="py-2 px-4 border-b cursor-pointer">
                ID {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('name')}
                  className="py-2 px-4 border-b cursor-pointer">
                Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('capacity')}
                  className="py-2 px-4 border-b cursor-pointer">
                Capacity {sortConfig?.key === 'capacity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Amenities</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{room.id}</td>
                <td className="py-2 px-4 border-b">{room.name}</td>
                <td className="py-2 px-4 border-b text-center">{room.capacity}</td>
                <td className="py-2 px-4 border-b">
                  {room.amenities.map(amenity => (
                    <span key={amenity} className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1">
                      {amenity}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(sortedRooms.length / itemsPerPage)}
        </span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={indexOfLastItem >= sortedRooms.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};
}

export default RoomsPage;