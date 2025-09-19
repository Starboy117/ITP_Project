import React, { useState } from 'react';
import { PlusIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';

const Courts = () => {
  const [courts] = useState([
    {
      id: 1,
      name: 'Badminton Court 1',
      type: 'Badminton',
      hourlyRate: 25,
      status: 'Available',
      capacity: 4,
      amenities: ['Air Conditioning', 'Sound System', 'LED Lighting'],
      maintenanceDate: '2024-01-10',
      bookingsToday: 6
    },
    {
      id: 2,
      name: 'Badminton Court 2',
      type: 'Badminton',
      hourlyRate: 25,
      status: 'Occupied',
      capacity: 4,
      amenities: ['Air Conditioning', 'LED Lighting'],
      maintenanceDate: '2024-01-08',
      bookingsToday: 8
    },
    {
      id: 3,
      name: 'Tennis Court 1',
      type: 'Tennis',
      hourlyRate: 30,
      status: 'Available',
      capacity: 2,
      amenities: ['Outdoor', 'Flood Lights', 'Seating Area'],
      maintenanceDate: '2024-01-12',
      bookingsToday: 4
    },
    {
      id: 4,
      name: 'Tennis Court 2',
      type: 'Tennis',
      hourlyRate: 30,
      status: 'Maintenance',
      capacity: 2,
      amenities: ['Outdoor', 'Flood Lights'],
      maintenanceDate: '2024-01-15',
      bookingsToday: 0
    },
    {
      id: 5,
      name: 'Basketball Court',
      type: 'Basketball',
      hourlyRate: 30,
      status: 'Available',
      capacity: 10,
      amenities: ['Indoor', 'Air Conditioning', 'Scoreboard', 'Sound System'],
      maintenanceDate: '2024-01-05',
      bookingsToday: 3
    },
    {
      id: 6,
      name: 'Squash Court 1',
      type: 'Squash',
      hourlyRate: 30,
      status: 'Available',
      capacity: 2,
      amenities: ['Air Conditioning', 'Glass Wall', 'Professional Flooring'],
      maintenanceDate: '2024-01-14',
      bookingsToday: 5
    }
  ]);

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-100 text-green-800',
      'Occupied': 'bg-yellow-100 text-yellow-800',
      'Maintenance': 'bg-red-100 text-red-800',
      'Reserved': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Badminton': '🏸',
      'Tennis': '🎾',
      'Basketball': '🏀',
      'Squash': '🎯',
      'Volleyball': '🏐'
    };
    return icons[type] || '🏟️';
  };

  const CourtCard = ({ court }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(court.type)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
              <p className="text-sm text-gray-600">{court.type}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(court.status)}`}>
            {court.status}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hourly Rate:</span>
            <span className="font-medium">${court.hourlyRate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Capacity:</span>
            <span className="font-medium">{court.capacity} players</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Today's Bookings:</span>
            <span className="font-medium">{court.bookingsToday}</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities:</h4>
          <div className="flex flex-wrap gap-1">
            {court.amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Last maintenance: {court.maintenanceDate}
          </span>
          <div className="flex space-x-2">
            <button className="p-1 text-blue-600 hover:text-blue-800">
              <EyeIcon className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-600 hover:text-gray-800">
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CourtListItem = ({ court }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-xl mr-3">{getTypeIcon(court.type)}</span>
          <div>
            <div className="text-sm font-medium text-gray-900">{court.name}</div>
            <div className="text-sm text-gray-500">{court.type}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(court.status)}`}>
          {court.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${court.hourlyRate}/hour
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {court.capacity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {court.bookingsToday}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {court.maintenanceDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-900 mr-3">
          <EyeIcon className="h-4 w-4" />
        </button>
        <button className="text-gray-600 hover:text-gray-900">
          <PencilIcon className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Court Management</h2>
          <p className="mt-1 text-sm text-gray-600">Manage court availability, rates, and maintenance</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              List
            </button>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Court
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Available Courts</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {courts.filter(c => c.status === 'Available').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">●</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Occupied</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {courts.filter(c => c.status === 'Occupied').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                  <span className="text-red-600 font-semibold">⚠</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Maintenance</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {courts.filter(c => c.status === 'Maintenance').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Bookings</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {courts.reduce((sum, court) => sum + court.bookingsToday, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courts Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Court
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Today's Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courts.map((court) => (
                <CourtListItem key={court.id} court={court} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Courts;