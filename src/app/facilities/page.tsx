"use client";

import React, { useState, useEffect } from 'react';

interface Facility {
  id: number;
  name: string;
  type: string;
  available: boolean;
}

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Facility; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetch('/facilities.json')
      .then((response) => response.json())
      .then((data: Facility[]) => setFacilities(data))
      .catch((error) => console.error('Error fetching facilities:', error));
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
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Facility) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFacilities.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Facilities Management</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter facilities..."
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
              <th onClick={() => requestSort('type')}
                  className="py-2 px-4 border-b cursor-pointer">
                Type {sortConfig?.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('available')}
                  className="py-2 px-4 border-b cursor-pointer">
                Availability {sortConfig?.key === 'available' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((facility) => (
              <tr key={facility.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{facility.id}</td>
                <td className="py-2 px-4 border-b">{facility.name}</td>
                <td className="py-2 px-4 border-b">{facility.type}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded ${
                    facility.available ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {facility.available ? 'Available' : 'Not Available'}
                  </span>
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
          Page {currentPage} of {Math.ceil(sortedFacilities.length / itemsPerPage)}
        </span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={indexOfLastItem >= sortedFacilities.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FacilitiesPage;