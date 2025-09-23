import React, { useEffect, useState } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../staffPageComponents/sideBar";
import { getAllInquiries, updateInquiry, deleteInquiry } from "../../services/inquiriesService";

const AdminInquiryPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Notification Component
  const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    return (
      <div
        className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg z-50 transition-all duration-300 ${
          type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}
      >
        <span>{message}</span>
        <button className="ml-4 font-bold" onClick={onClose}>X</button>
      </div>
    );
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // Fetch all inquiries
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await getAllInquiries();
      setInquiries(data.inquiries || []);
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Failed to load inquiries.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Edit form
  const startEditInquiry = (inquiry) => {
    setEditingInquiry(inquiry);
    setForm({ name: inquiry.name, email: inquiry.email, message: inquiry.message });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showNotification("Please complete all fields.", "error");
      return;
    }

    try {
      await updateInquiry(editingInquiry._id, form);
      showNotification("Inquiry updated successfully!", "success");
      setEditingInquiry(null);
      setForm({ name: "", email: "", message: "" });
      fetchInquiries();
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Failed to update inquiry.", "error");
    }
  };

  const confirmDeleteInquiry = (inquiry) => {
    setInquiryToDelete(inquiry);
    setShowDeleteModal(true);
  };

  const handleDeleteInquiry = async () => {
    if (!inquiryToDelete) return;
    try {
      await deleteInquiry(inquiryToDelete._id);
      showNotification("Inquiry deleted successfully!", "success");
      fetchInquiries();
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Failed to delete inquiry.", "error");
    } finally {
      setInquiryToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const filteredInquiries = inquiries.filter(
    (i) =>
      i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading inquiries...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <Sidebar />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold">Manage Inquiries</h2>
            <p className="mt-1 text-sm text-gray-400">View and respond to all user inquiries</p>
          </div>
        </div>

        {/* Edit Form Modal */}
        {editingInquiry && (
          <div className="bg-neutral-800 p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-bold mb-4">Edit Inquiry</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  className="input bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded w-full"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                />
                <input
                  className="input bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded w-full"
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <textarea
                className="input bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded w-full"
                name="message"
                placeholder="Message"
                rows={4}
                value={form.message}
                onChange={handleChange}
              />
              <div className="flex gap-4">
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingInquiry(null)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="bg-neutral-800 p-4 rounded-lg shadow mb-4">
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 rounded-md leading-5 bg-neutral-900 border border-neutral-700 placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-neutral-800 shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-neutral-700">
            <tbody className="bg-neutral-800 divide-y divide-neutral-700">
              {filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-gray-400">
                    No inquiries found
                  </td>
                </tr>
              )}
              {filteredInquiries.map((i) => (
                <tr key={i._id} className="hover:bg-neutral-700">
                  <td className="px-6 py-4 text-sm text-gray-400">{i.name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{i.email || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-400" style={{ maxWidth: 420, whiteSpace: "pre-wrap" }}>
                    {i.message || "-"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium flex gap-2 justify-end">
                    <button
                      onClick={() => startEditInquiry(i)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteInquiry(i)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation */}
        {showDeleteModal && inquiryToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-sm text-center">
              <h2 className="text-xl font-bold mb-4 text-white">Delete Inquiry?</h2>
              <p className="mb-6 text-gray-300">
                Are you sure you want to delete inquiry from <strong>{inquiryToDelete.name}</strong>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInquiry}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
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

export default AdminInquiryPage;
