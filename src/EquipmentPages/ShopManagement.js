import React, { useState, useEffect } from 'react';
import ShopKeeperSidebar from './staffSideBar';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import './ShopManagement.css';

const ShopManagementPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', quantity: '', category: '', imageURL: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({ total: 0, outOfStock: 0, lowStock: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api/shop';

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setItems(data);
      setFilteredItems(data);
      calculateStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again later.');
    } finally { setIsLoading(false); }
  };

  const calculateStats = (list) => {
    setStats({
      total: list.length,
      outOfStock: list.filter(item => item.status === 'Out of Stock').length,
      lowStock: list.filter(item => item.status === 'Low Stock').length
    });
  };

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
    calculateStats(filtered);
  }, [searchTerm, items]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
    const sorted = [...filteredItems].sort((a, b) => {
      if (key === 'price' || key === 'quantity') return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setFilteredItems(sorted);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name required';
    if (!formData.description.trim()) errors.description = 'Description required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price required';
    if (!formData.quantity || formData.quantity < 0) errors.quantity = 'Valid quantity required';
    if (!formData.category.trim()) errors.category = 'Category required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', quantity: '', category: '', imageURL: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity) };
      let res;
      if (editingItem) {
        res = await fetch(`${API_BASE_URL}/${editingItem._id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      } else {
        res = await fetch(`${API_BASE_URL}/addItem`, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      }
      if (!res.ok) throw new Error('Failed to save item');
      await fetchItems();
      closeModal();
    } catch (err) { console.error(err); alert('Error saving item'); } 
    finally { setIsSubmitting(false); }
  };

  const confirmDelete = (item) => setDeleteConfirm(item);
  const cancelDelete = () => setDeleteConfirm(null);
  const handleDelete = async () => {
    try {
      await fetch(`${API_BASE_URL}/${deleteConfirm._id}`, { method: 'DELETE' });
      await fetchItems();
      cancelDelete();
    } catch (err) { console.error(err); alert('Error deleting item'); }
  };

  const renderStatusBadge = (status) => {
    let cls = 'status-badge ';
    if (status === 'Out of Stock') cls += 'out-of-stock';
    else if (status === 'Low Stock') cls += 'low-stock';
    else cls += 'in-stock';
    return <span className={cls}>{status}</span>;
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <ShopKeeperSidebar />
      <div className="flex-1 p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Shop Management</h2>
            <p className="text-gray-400 text-sm">Manage shop inventory</p>
          </div>
          <button onClick={openAddModal} className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" /> Add Item
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-800 p-4 rounded text-center"><p>Total Items</p><span className="font-bold text-xl">{stats.total}</span></div>
          <div className="bg-neutral-800 p-4 rounded text-center"><p>Out of Stock</p><span className="font-bold text-xl text-red-500">{stats.outOfStock}</span></div>
          <div className="bg-neutral-800 p-4 rounded text-center"><p>Low Stock</p><span className="font-bold text-xl text-yellow-400">{stats.lowStock}</span></div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <MagnifyingGlassIcon className="absolute top-2 left-2 h-5 w-5 text-gray-400" />
          <input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search by name, category, status..." className="w-full pl-10 pr-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none" />
        </div>

        {/* Table */}
        <div className="bg-neutral-800 shadow rounded-md overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-neutral-700 text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 cursor-pointer" onClick={()=>handleSort('name')}>Name</th>
                <th className="px-4 py-2 cursor-pointer" onClick={()=>handleSort('description')}>Description</th>
                <th className="px-4 py-2 cursor-pointer" onClick={()=>handleSort('category')}>Category</th>
                <th className="px-4 py-2 cursor-pointer" onClick={()=>handleSort('price')}>Price</th>
                <th className="px-4 py-2 cursor-pointer" onClick={()=>handleSort('quantity')}>Quantity</th>
                <th className="px-4 py-2 cursor-pointer" onClick={()=>handleSort('status')}>Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? filteredItems.map(item=>(
                <tr key={item._id} className="hover:bg-neutral-700">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{renderStatusBadge(item.status)}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={()=>openEditModal(item)} className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={()=>confirmDelete(item)} className="px-2 py-1 bg-red-600 rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="7" className="px-4 py-4 text-center text-gray-400">No items found</td></tr>}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingItem?'Edit Item':'Add Item'}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" required />
              <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" required />
              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" required />
              <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-white" required />
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">{isSubmitting?'Saving...':(editingItem?'Update':'Add')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-md w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Delete Item?</h2>
            <p className="mb-6">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopManagementPage;
