// src/staffPageComponents/CourtModal.js
import React, { useState, useEffect } from "react";

const CourtModal = ({ court, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    courtName: "",
    courtType: "",
    hourlyRate: 0,
    status: "Available",
    capacity: 1,
    location: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (court) {
      setFormData({
        courtName: court.courtName || "",
        courtType: court.courtType || "",
        hourlyRate: court.hourlyRate || 0,
        status: court.status || "Available",
        capacity: court.capacity || 1,
        location: court.location || "",
        description: court.description || "",
        imageUrl: court.imageUrl || "",
      });
    }
  }, [court]);

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {court ? "Edit Court" : "Add New Court"}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Court Name"
            value={formData.courtName}
            onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="text"
            placeholder="Court Type"
            value={formData.courtType}
            onChange={(e) => setFormData({ ...formData, courtType: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="number"
            placeholder="Hourly Rate"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />

          <select
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          >
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtModal;
