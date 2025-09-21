import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import Sidebar from "../staffPageComponents/sideBar";
import CourtModal from "../staffPageComponents/CourtModel";

const courtTypes = [
  { value: "futsal1", label: "Futsal Court 1" },
  { value: "futsal2", label: "Futsal Court 2" },
  { value: "volleyball", label: "Volleyball Court" },
  { value: "beach", label: "Beach Volleyball Court" },
  { value: "badmintonFamily", label: "Badminton Family Court" },
  { value: "badminton1", label: "Badminton Court 1" },
  { value: "badminton2", label: "Badminton Court 2" },
  { value: "basketball", label: "Basketball Court" },
  { value: "tableTennis", label: "Table Tennis Room" },
];

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  // Load all courts when component mounts
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courts/getAllCourts");
        if (!response.ok) throw new Error("Failed to fetch courts");
        const data = await response.json();
        setCourts(data.courts); // make sure your backend sends { courts: [...] }
      } catch (err) {
        console.error("Error fetching courts:", err);
      }
    };
    fetchCourts();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      Available: "bg-green-900 text-green-300",
      Occupied: "bg-yellow-900 text-yellow-300",
      Maintenance: "bg-red-900 text-red-300",
      Reserved: "bg-blue-900 text-blue-300",
    };
    return colors[status] || "bg-gray-700 text-gray-300";
  };

const getTypeIcon = (type) => {
  if (!type) return "🏟️"; // default icon if type is missing
  const lowerType = type.toLowerCase().replace(/\s/g, "");
  const icons = {
    futsal1: "⚽",
    futsal2: "⚽",
    volleyball: "🏐",
    beachvolleyballcourt: "🏖️",
    badmintonfamily: "🏸",
    badminton1: "🏸",
    badminton2: "🏸",
    basketball: "🏀",
    tabletennisroom: "🏓",
  };
  return icons[lowerType] || "🏟️";
};


const CourtCard = ({ court, onEdit, onDelete }) => (
  <div className="bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between h-full">
    {/* Header: Icon, Name, Type */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <span className="text-4xl">{getTypeIcon(court.courtType)}</span>
        <div>
          <h3 className="text-lg font-bold text-white">{court.courtName}</h3>
          <p className="text-sm text-gray-400">{court.type}</p>
        </div>
      </div>
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
          court.status
        )}`}
      >
        {court.status}
      </span>
    </div>

    {/* Main Details */}
    <div className="space-y-2 mb-4 text-gray-300 text-sm">
      <div className="flex justify-between">
        <span>Hourly Rate:</span>
        <span className="font-medium">${court.hourlyRate}</span>
      </div>
      <div className="flex justify-between">
        <span>Capacity:</span>
        <span className="font-medium">{court.capacity} players</span>
      </div>
      <div className="flex justify-between">
        <span>Today's Bookings:</span>
        <span className="font-medium">{court.bookingsToday || 0}</span>
      </div>
      {court.description && (
        <p className="text-gray-400 text-xs mt-1">{court.description}</p>
      )}
    </div>

    {/* Amenities */}
    {court.amenities && court.amenities.length > 0 && (
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-400 mb-1">Amenities:</h4>
        <div className="flex flex-wrap gap-1">
          {court.amenities.map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-neutral-700 text-gray-200 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Footer: Actions & Maintenance */}
    <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
      <div className="space-x-2">
        <button
          className="p-1 text-gray-400 hover:text-gray-200"
          onClick={() => onEdit(court)}
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          className="p-1 text-red-500 hover:text-red-400"
          onClick={() => onDelete(court.courtId)}
        >
          Delete
        </button>
      </div>
      <div className="text-right">
        Last Maintenance: {court.maintenanceDate || "N/A"}
      </div>
    </div>
  </div>
);

  const handleSaveCourt = async (courtData) => {
    try {
      const response = await fetch("http://localhost:5000/api/courts/addCourt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courtData),
      });
      if (!response.ok) throw new Error("Failed to add court");
      const data = await response.json();
      setCourts([...courts, data.court]);
      setShowModal(false);
      setEditingCourt(null);
    } catch (err) {
      console.error("Error adding court:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <div className="w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold">Court Management</h2>
            <p className="mt-1 text-sm text-gray-400">
              Manage court availability, rates, and maintenance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex border border-gray-600 rounded-md">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400"
                }`}
              >
                List
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Court
            </button>
          </div>
        </div>

        {/* Courts Grid */}
        {viewMode === "grid" ? (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {courts.map((court) => (
      <CourtCard
        key={court.courtId}
        court={court}
        onEdit={(c) => { setEditingCourt(c); setShowModal(true); }}
        onDelete={(id) => setCourts(courts.filter(c => c.courtId !== id))}
      />
    ))}
  </div>
) : (
  <div className="bg-neutral-800 shadow rounded-lg overflow-auto">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-neutral-700">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Court
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Hourly Rate
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Capacity
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Bookings Today
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {courts.map((court) => (
          <tr key={court.courtId} className="hover:bg-neutral-700 text-gray-200">
            <td className="px-6 py-4 flex items-center space-x-2">
              <span className="text-xl">{getTypeIcon(court.courtType)}</span>
              <span>{court.courtName}</span>
            </td>
            <td className="px-6 py-4">{court.courtType}</td>
            <td className="px-6 py-4">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(court.status)}`}>
                {court.status}
              </span>
            </td>
            <td className="px-6 py-4">${court.hourlyRate}</td>
            <td className="px-6 py-4">{court.capacity}</td>
            <td className="px-6 py-4">{court.bookingsToday || 0}</td>
            <td className="px-6 py-4 flex space-x-2">
              <button className="text-gray-400 hover:text-gray-200" onClick={() => { setEditingCourt(court); setShowModal(true); }}>
                <PencilIcon className="h-4 w-4" />
              </button>
              <button className="text-red-500 hover:text-red-400" onClick={() => setCourts(courts.filter(c => c.courtId !== court.courtId))}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


        {showModal && (
          <CourtModal
            court={editingCourt}
            onClose={() => {
              setShowModal(false);
              setEditingCourt(null);
            }}
            onSave={handleSaveCourt}
          />
        )}
      </div>
    </div>
  );
};

export default Courts;
