import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
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
  const [showModal, setShowModal] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courtToDelete, setCourtToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ Notification state
  const [notification, setNotification] = useState({ message: "", type: "" });

  // ✅ Notification component
  const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    return (
      <div
        className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg z-50 transition-all duration-300 ${
          type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}
      >
        <span>{message}</span>
        <button className="ml-4 font-bold" onClick={onClose}>
          X
        </button>
      </div>
    );
  };

  // Helper to show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // ✅ Fetch courts from backend
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courts/getAllCourts");
        if (!res.ok) throw new Error("Failed to fetch courts");
        const data = await res.json();
        setCourts(data.courts || []);
      } catch (err) {
        showNotification("Error fetching courts", "error");
      }
    };
    fetchCourts();
  }, []);

  // ✅ Add or Edit Court
  const handleSaveCourt = async (courtData) => {
    try {
      if (selectedCourt) {
        // Edit court
        const res = await fetch(
          `http://localhost:5000/api/courts/updateCourt/${selectedCourt.courtId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(courtData),
          }
        );
        const data = await res.json();
        if (res.ok) {
          setCourts(
            courts.map((c) =>
              c.courtId === selectedCourt.courtId ? data.court : c
            )
          );
          showNotification("Court updated successfully!", "success");
        } else {
          showNotification(data.message || "Failed to update court", "error");
        }
      } else {
        // Add new court
        const res = await fetch("http://localhost:5000/api/courts/addCourt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courtData),
        });
        const data = await res.json();
        if (res.ok) {
          setCourts([...courts, data.court]);
          showNotification("Court added successfully!", "success");
        } else {
          showNotification(data.message || "Failed to add court", "error");
        }
      }
      setShowModal(false);
      setSelectedCourt(null);
    } catch (err) {
      showNotification("Error saving court", "error");
    }
  };

  // Edit court
  const handleEditCourt = (court) => {
    setSelectedCourt(court);
    setShowModal(true);
  };

  // New court
  const handleNewCourt = () => {
    setSelectedCourt(null);
    setShowModal(true);
  };

  // Confirm delete
  const confirmDeleteCourt = (court) => {
    setCourtToDelete(court);
    setShowDeleteModal(true);
  };

  // ✅ Delete court
  const handleDeleteConfirmed = async () => {
    if (!courtToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/courts/deleteCourt/${courtToDelete.courtId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        setCourts(courts.filter((c) => c.courtId !== courtToDelete.courtId));
        showNotification("Court deleted successfully!", "success");
      } else {
        showNotification(data.message || "Failed to delete court", "error");
      }
      setShowDeleteModal(false);
      setCourtToDelete(null);
    } catch (err) {
      showNotification("Error deleting court", "error");
    }
  };

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
    const icons = {
      football: "⚽",
      volleyball: "🏐",
      beachVolley: "🏖️",
      badminton: "🏸",
      basketball: "🏀",
      tableTennis: "🏓",
    };
    return icons[type] || "🏟️";
  };

  const CourtCard = ({ court }) => (
    <div className="bg-neutral-800 rounded-xl shadow-lg p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{getTypeIcon(court.courtType)}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{court.courtName}</h3>
            <p className="text-sm text-gray-400">{court.courtType}</p>
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

      <div className="space-y-2 mb-4 text-gray-300 text-sm">
        <div className="flex justify-between">
          <span>Hourly Rate:</span>
          <span className="font-medium">LKR {court.hourlyRate}</span>
        </div>
        <div className="flex justify-between">
          <span>Capacity:</span>
          <span className="font-medium">{court.capacity} players</span>
        </div>
        {court.description && (
          <p className="text-gray-400 text-xs mt-1">{court.description}</p>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
        <div className="space-x-2">
          <button
            className="p-1 text-gray-400 hover:text-gray-200"
            onClick={() => handleEditCourt(court)}
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-red-500 hover:text-red-400"
            onClick={() => confirmDeleteCourt(court)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      {/* ✅ Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Court Management</h2>
          <button
            onClick={handleNewCourt}
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Court
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <CourtCard key={court.courtId} court={court} />
          ))}
        </div>

        {showModal && (
          <CourtModal
            court={selectedCourt}
            onClose={() => {
              setShowModal(false);
              setSelectedCourt(null);
            }}
            onSave={handleSaveCourt}
          />
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-neutral-800 p-6 rounded-lg shadow-lg text-white w-96">
              <h3 className="text-lg font-bold mb-4">
                Are you sure you want to delete "{courtToDelete?.courtName}"?
              </h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courts;
