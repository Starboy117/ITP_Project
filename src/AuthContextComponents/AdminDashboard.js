import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { CheckIcon, XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    isActive: true,
    phone: '',
    membershipType: 'basic'
  });

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Notification helper
  const showNotification = (message, type = 'info') => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/getUsers');
        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError('Failed to load users. Please check if the server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Edit handlers
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      isActive: user.isActive !== undefined ? user.isActive : true,
      phone: user.phone || '',
      membershipType: user.membershipType || 'basic'
    });
  };

  const handleEditChange = (e) => {
    let { name, value, type, checked } = e.target;

    // Only allow numbers for phone and limit to 10 digits
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setEditForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/editUsers/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!data.success) {
        showNotification(data.message || 'Failed to update user.', 'error');
        return;
      }

      setUsers(prev => prev.map(u => (u._id === userId ? { ...u, ...data.user } : u)));
      setEditingUser(null);
      showNotification('User updated successfully!', 'success');
    } catch (err) {
      console.error('Edit error:', err);
      showNotification('Server error while updating user.', 'error');
    }
  };

  // Delete handlers
  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/deleteUser/${userToDelete._id}`,
        { method: 'DELETE' }
      );
      const data = await response.json();

      if (response.ok) {
        setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
        showNotification(data.message || 'User deleted successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to delete user.', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('Server error while deleting user.', 'error');
    } finally {
      setUserToDelete(null);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Loading users...</div>;

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <AdminSidebar />

      <div className="flex-1 pt-20 px-6 pb-6">
        {error && <div className="mb-6 p-4 rounded bg-red-900 text-red-300">{error}</div>}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Management</h2>
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
                <th className="px-6 py-3">Membership</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-neutral-700">
                  <td className="px-6 py-4">
                    {editingUser === user._id ? (
                      <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white"/>
                    ) : user.name}
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === user._id ? (
                      <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white"/>
                    ) : user.email}
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === user._id ? (
                      <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white"/>
                    ) : user.phone}
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === user._id ? (
                      <select name="membershipType" value={editForm.membershipType} onChange={handleEditChange} className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white">
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                      </select>
                    ) : user.membershipType}
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === user._id ? (
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" name="isActive" checked={editForm.isActive} onChange={handleEditChange} className="rounded border-neutral-600 bg-neutral-700"/>
                        <span>Active</span>
                      </label>
                    ) : user.isActive !== false ? 'Active' : 'Inactive'}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {editingUser === user._id ? (
                      <>
                        <button onClick={() => handleSave(user._id)} className="bg-green-600 px-2 py-1 rounded"><CheckIcon className="h-4 w-4 text-white"/></button>
                        <button onClick={() => setEditingUser(null)} className="bg-gray-600 px-2 py-1 rounded"><XMarkIcon className="h-4 w-4 text-white"/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(user)} className="bg-blue-600 px-2 py-1 rounded"><PencilIcon className="h-4 w-4 text-white"/></button>
                        <button onClick={() => confirmDeleteUser(user)} className="bg-red-600 px-2 py-1 rounded"><TrashIcon className="h-4 w-4 text-white"/></button>
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
            <p>Are you sure you want to delete {userToDelete?.name}?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handleDelete} className="bg-red-600 px-4 py-2 rounded text-white">Delete</button>
              <button onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }} className="bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
