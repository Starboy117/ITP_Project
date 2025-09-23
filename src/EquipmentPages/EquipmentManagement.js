// EquipmentManagementPage.jsx
import React, { useState, useEffect } from 'react';
import ShopKeeperSidebar from './staffSideBar';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import './EquipmentManagement.css';

const EquipmentManagementPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purchaseDate: '',
    status: 'Available',
    description: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    damaged: 0,
    underMaintenance: 0,
  });

  const API_BASE_URL = 'http://localhost:5000/api/equipments';

  // Load equipment on mount
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setEquipment(data);
      setFilteredEquipment(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const calculateStats = (list) => {
    setStats({
      total: list.length,
      available: list.filter(e => e.status === 'Available').length,
      inUse: list.filter(e => e.status === 'In Use').length,
      damaged: list.filter(e => e.status === 'Damaged').length,
      underMaintenance: list.filter(e => e.status === 'Under Maintenance').length,
    });
  };

  useEffect(() => {
    const filtered = equipment.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipment(filtered);
    calculateStats(filtered);
  }, [searchTerm, equipment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setEditingEquipment(null);
    setFormData({ name: '', category: '', purchaseDate: '', status: 'Available', description: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingEquipment(item);
    setFormData({
      name: item.name,
      category: item.category,
      purchaseDate: item.purchaseDate,
      status: item.status,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res, updatedList;
      if (editingEquipment) {
        // Update
        res = await fetch(`${API_BASE_URL}/${editingEquipment._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const updatedItem = await res.json();
        updatedList = equipment.map((eq) => (eq._id === editingEquipment._id ? updatedItem : eq));
      } else {
        // Create
        res = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const newItem = await res.json();
        updatedList = [...equipment, newItem];
      }
      setEquipment(updatedList);
      setFilteredEquipment(updatedList);
      calculateStats(updatedList);
      closeModal();
    } catch (error) {
      console.error('Error saving equipment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (item) => setDeleteConfirm(item);
  const cancelDelete = () => setDeleteConfirm(null);

  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE_URL}/${deleteConfirm._id}`, { method: 'DELETE' });
      const updatedList = equipment.filter((eq) => eq._id !== deleteConfirm._id);
      setEquipment(updatedList);
      setFilteredEquipment(updatedList);
      calculateStats(updatedList);
      cancelDelete();
    } catch (error) {
      console.error('Error deleting equipment:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });

    const sorted = [...filteredEquipment].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setFilteredEquipment(sorted);
  };

  const renderStatusBadge = (status) => {
    let className = 'status-badge ';
    switch (status) {
      case 'Available': className += 'available'; break;
      case 'In Use': className += 'in-use'; break;
      case 'Damaged': className += 'damaged'; break;
      case 'Under Maintenance': className += 'under-maintenance'; break;
      default: className += 'available';
    }
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <ShopKeeperSidebar />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Equipment Management</h2>
            <p className="text-gray-400 text-sm">Manage all equipment inventory</p>
          </div>
          <button onClick={openAddModal} className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" /> Add Equipment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-neutral-800 p-4 rounded shadow text-center"><p>Total</p><span className="font-bold text-xl">{stats.total}</span></div>
          <div className="bg-neutral-800 p-4 rounded shadow text-center"><p>Available</p><span className="font-bold text-xl text-green-400">{stats.available}</span></div>
          <div className="bg-neutral-800 p-4 rounded shadow text-center"><p>In Use</p><span className="font-bold text-xl text-yellow-400">{stats.inUse}</span></div>
          <div className="bg-neutral-800 p-4 rounded shadow text-center"><p>Under Maintenance</p><span className="font-bold text-xl text-blue-400">{stats.underMaintenance}</span></div>
          <div className="bg-neutral-800 p-4 rounded shadow text-center"><p>Damaged</p><span className="font-bold text-xl text-red-400">{stats.damaged}</span></div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <MagnifyingGlassIcon className="absolute top-2 left-2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-neutral-800 shadow rounded-md overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('name')}>Name</th>
                <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('category')}>Category</th>
                <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('purchaseDate')}>Purchase Date</th>
                <th className="px-6 py-3 text-left cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-neutral-800 divide-y divide-neutral-700">
              {filteredEquipment.map((item) => (
                <tr key={item._id} className="hover:bg-neutral-700">
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{new Date(item.purchaseDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{renderStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEditModal(item)} className="text-blue-400 hover:text-blue-300">Edit</button>
                    <button onClick={() => confirmDelete(item)} className="text-red-500 hover:text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-6 rounded-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{editingEquipment ? 'Edit Equipment' : 'Add Equipment'}</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" required />
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" required>
                  <option value="">Select Category</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Strength">Strength</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other</option>
                </select>
                <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" required />
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" required>
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Damaged">Damaged</option>
                </select>
                <div className="flex justify-end space-x-2 mt-4">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">{isSubmitting ? 'Saving...' : editingEquipment ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-6 rounded-md w-full max-w-sm text-center">
              <h2 className="text-xl font-bold mb-4">Delete Equipment?</h2>
              <p className="mb-6">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
              <div className="flex justify-center gap-4">
                <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentManagementPage;
