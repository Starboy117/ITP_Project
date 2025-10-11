import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { CheckIcon, XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const StaffDashboard = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStaff, setEditingStaff] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'staff',
    isActive: true,
    phone: '',
    position: ''
  });

  // Delete modal
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Notification helper
  const showNotification = (message, type = 'info') => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  // Fetch staff members
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/staff/getStaffs');
        const data = await response.json();
        setStaffs(data.staffs || []);
      } catch (err) {
        setError('Failed to load staff. Make sure server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, []);

  // Edit handlers
  const handleEdit = (staff) => {
    setEditingStaff(staff._id);
    setEditForm({
      name: staff.name,
      email: staff.email,
      role: staff.role || 'staff',
      isActive: staff.isActive !== undefined ? staff.isActive : true,
      phone: staff.phone || '',
      position: staff.position || ''
    });
  };

  const handleEditChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (name === 'phone') value = value.replace(/\D/g, '').slice(0, 10);

    setEditForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (staffId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/staff/editStaff/${staffId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!data.success) {
        showNotification(data.message || 'Failed to update staff.', 'error');
        return;
      }

      setStaffs(prev => prev.map(s => (s._id === staffId ? { ...s, ...data.staff } : s)));
      setEditingStaff(null);
      showNotification('Staff updated successfully!', 'success');
    } catch (err) {
      console.error('Edit error:', err);
      showNotification('Server error while updating staff.', 'error');
    }
  };

  // Delete handlers
  const confirmDeleteStaff = (staff) => {
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/staff/deleteStaff/${staffToDelete._id}`,
        { method: 'DELETE' }
      );
      const data = await response.json();

      if (response.ok) {
        setStaffs(prev => prev.filter(s => s._id !== staffToDelete._id));
        showNotification(data.message || 'Staff deleted successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to delete staff.', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('Server error while deleting staff.', 'error');
    } finally {
      setStaffToDelete(null);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Loading staff...</div>;

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <AdminSidebar />

      <div className="flex-1 pt-20 px-6 pb-6">
        {error && <div className="mb-6 p-4 rounded bg-red-900 text-red-300">{error}</div>}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto bg-neutral-800 shadow rounded-lg">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Position</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {staffs.map(staff => (
                <tr key={staff._id} className="hover:bg-neutral-700">
                  <td className="px-6 py-4">
                    {editingStaff === staff._id ? (
                      <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white"/>
                    ) : staff.name}
                  </td>
                  <td className="px-6 py-4">
                    {editingStaff === staff._id ? (
                      <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white"/>
                    ) : staff.email}
                  </td>
                  <td className="px-6 py-4">
                    {editingStaff === staff._id ? (
                      <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white"/>
                    ) : staff.phone}
                  </td>
                  <td className="px-6 py-4">
                    {editingStaff === staff._id ? (
                      <input type="text" name="position" value={editForm.position} onChange={handleEditChange} className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white"/>
                    ) : staff.position}
                  </td>
                  <td className="px-6 py-4">{staff.role}</td>
                  <td className="px-6 py-4">
                    {editingStaff === staff._id ? (
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="isActive" checked={editForm.isActive} onChange={handleEditChange} className="rounded border-neutral-600 bg-neutral-700"/>
                        <span>Active</span>
                      </label>
                    ) : staff.isActive !== false ? 'Active' : 'Inactive'}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {editingStaff === staff._id ? (
                      <>
                        <button onClick={() => handleSave(staff._id)} className="bg-green-600 px-2 py-1 rounded"><CheckIcon className="h-4 w-4 text-white"/></button>
                        <button onClick={() => setEditingStaff(null)} className="bg-gray-600 px-2 py-1 rounded"><XMarkIcon className="h-4 w-4 text-white"/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(staff)} className="bg-blue-600 px-2 py-1 rounded"><PencilIcon className="h-4 w-4 text-white"/></button>
                        <button onClick={() => confirmDeleteStaff(staff)} className="bg-red-600 px-2 py-1 rounded"><TrashIcon className="h-4 w-4 text-white"/></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-neutral-900 p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete {staffToDelete?.name}?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handleDelete} className="bg-red-600 px-4 py-2 rounded text-white">Delete</button>
              <button onClick={() => { setShowDeleteModal(false); setStaffToDelete(null); }} className="bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
