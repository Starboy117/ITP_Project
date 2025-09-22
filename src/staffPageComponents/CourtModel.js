import React, { useState, useEffect } from "react";

const CourtModal = ({ court, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    courtId: "",
    courtName: "",
    courtType: "",
    hourlyRate: "",
    capacity: "",
    location: "",
    description: "",
    imageUrl: "",
    status: "Available",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (court) {
      setFormData({
        courtId: court.courtId || "",
        courtName: court.courtName || "",
        courtType: court.courtType || "",
        hourlyRate: court.hourlyRate || "",
        capacity: court.capacity || "",
        location: court.location || "",
        description: court.description || "",
        imageUrl: court.imageUrl || "",
        status: court.status || "Available",
      });
    }
  }, [court]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const validateForm = () => {
    const newErrors = {};

    if (!formData.courtName || formData.courtName.trim() === "") {
      newErrors.courtName = "Court name is required.";
    }
    if (!formData.courtType || formData.courtType.trim() === "") {
      newErrors.courtType = "Court type is required.";
    }
    if (formData.hourlyRate === "" || isNaN(formData.hourlyRate) || Number(formData.hourlyRate) <= 0) {
      newErrors.hourlyRate = "Hourly rate must be a positive number.";
    }
    if (formData.capacity === "" || isNaN(formData.capacity) || Number(formData.capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number.";
    }
    if (!formData.location || formData.location.trim() === "") {
      newErrors.location = "Location is required.";
    }
   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{court ? "Edit Court" : "New Court"}</h2>

        <div className="space-y-3">
          <input
            hidden
            className="w-full p-2 rounded bg-neutral-800 text-white"
            placeholder="Court ID"
            name="courtId"
            value={formData.courtId}
            onChange={handleChange}
            disabled={!!court}
          />

          {/* Court Name */}
          <div>
            <input
              className={`w-full p-2 rounded bg-neutral-800 text-white border ${
                errors.courtName ? "border-red-500" : "border-transparent"
              }`}
              placeholder="Court Name"
              name="courtName"
              value={formData.courtName}
              onChange={handleChange}
            />
            {errors.courtName && <p className="text-red-500 text-sm mt-1">{errors.courtName}</p>}
          </div>

          {/* Court Type */}
          <div>
            <select
              name="courtType"
              value={formData.courtType}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-neutral-800 text-white border ${
                errors.courtType ? "border-red-500" : "border-transparent"
              }`}
            >
              <option value="">Select Court Type</option>
              {[
                "football",
                "volleyball",
                "beachVolley",
                "badminton",
                "basketball",
                "tableTennis",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.courtType && <p className="text-red-500 text-sm mt-1">{errors.courtType}</p>}
          </div>

          {/* Hourly Rate */}
          <div>
            <input
              type="number"
              className={`w-full p-2 rounded bg-neutral-800 text-white border ${
                errors.hourlyRate ? "border-red-500" : "border-transparent"
              }`}
              placeholder="Hourly Rate"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
            />
            {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
          </div>

          {/* Capacity */}
          <div>
            <input
              type="number"
              className={`w-full p-2 rounded bg-neutral-800 text-white border ${
                errors.capacity ? "border-red-500" : "border-transparent"
              }`}
              placeholder="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
            />
            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
          </div>

          {/* Location */}
          <div>
            <input
              className={`w-full p-2 rounded bg-neutral-800 text-white border ${
                errors.location ? "border-red-500" : "border-transparent"
              }`}
              placeholder="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Description */}
          <div>
            <textarea
              className={`w-full p-2 rounded bg-neutral-800 text-white border ${
                errors.description ? "border-red-500" : "border-transparent"
              }`}
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div>
            <input
              className={`w-full p-2 rounded bg-neutral-800 text-white border ${
                errors.imageUrl ? "border-red-500" : "border-transparent"
              }`}
              placeholder="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
          </div>

          {/* Status */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          >
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtModal;
