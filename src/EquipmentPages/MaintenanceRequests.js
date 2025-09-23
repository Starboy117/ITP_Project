// MaintenanceRequestsPage.jsx
import React, { useState, useEffect } from 'react';
import ShopKeeperSidebar from './staffSideBar';
import { MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import './MaintenanceRequests.css';

const MaintenanceRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api/maintenance';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      setRequests(data);
      setFilteredRequests(data);
    } catch (err) {
      console.error(err);
      alert('Error fetching maintenance requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = requests.filter(r => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.equipment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, priorityFilter, requests]);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert('Error deleting request.');
    }
  };

  const renderPriorityBadge = (priority) => {
    const base = 'px-2 py-1 rounded text-sm font-medium ';
    if (priority === 'High') return <span className={`${base} bg-red-600`}>{priority}</span>;
    if (priority === 'Medium') return <span className={`${base} bg-yellow-500`}>{priority}</span>;
    return <span className={`${base} bg-green-600`}>{priority}</span>;
  };

  const renderStatusBadge = (status) => {
    const base = 'px-2 py-1 rounded text-sm font-medium ';
    if (status === 'Pending') return <span className={`${base} bg-gray-500`}>{status}</span>;
    if (status === 'In Progress') return <span className={`${base} bg-blue-600`}>{status}</span>;
    return <span className={`${base} bg-green-600`}>{status}</span>;
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    resolved: requests.filter(r => r.status === 'Resolved').length,
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      <ShopKeeperSidebar />
      <div className="flex-1 p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Maintenance Requests</h2>
            <p className="text-gray-400 text-sm">Report and manage equipment maintenance requests</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Download Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-800 p-4 rounded text-center">Total Requests<br /><span className="font-bold text-xl">{stats.total}</span></div>
          <div className="bg-neutral-800 p-4 rounded text-center">Pending<br /><span className="font-bold text-xl text-gray-300">{stats.pending}</span></div>
          <div className="bg-neutral-800 p-4 rounded text-center">In Progress<br /><span className="font-bold text-xl text-blue-400">{stats.inProgress}</span></div>
          <div className="bg-neutral-800 p-4 rounded text-center">Resolved<br /><span className="font-bold text-xl text-green-400">{stats.resolved}</span></div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute top-2 left-2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700">
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700">
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-neutral-800 shadow rounded-md overflow-hidden mt-4">
          <div className="flex font-semibold bg-neutral-700 px-4 py-2">
            <div className="w-1/4">Title</div>
            <div className="w-1/6">Equipment</div>
            <div className="w-1/6">Priority</div>
            <div className="w-1/6">Status</div>
            <div className="w-1/6">Date</div>
            <div className="w-1/6 text-center">Actions</div>
          </div>

          {isLoading ? (
            <div className="px-4 py-6 text-center">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="px-4 py-6 text-center">No requests found</div>
          ) : (
            filteredRequests.map(r => (
              <div key={r.id} className="flex items-center px-4 py-3 border-b border-neutral-700 hover:bg-neutral-700">
                <div className="w-1/4 cursor-pointer" onClick={() => openModal(r)}>{r.title}</div>
                <div className="w-1/6">{r.equipment}</div>
                <div className="w-1/6">{renderPriorityBadge(r.priority)}</div>
                <div className="w-1/6">
                  <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="px-2 py-1 rounded bg-neutral-800 text-white w-full">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div className="w-1/6">{r.date}</div>
                <div className="w-1/6 flex justify-center space-x-2">
                  <button onClick={() => openModal(r)} className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700">View</button>
                  <button onClick={() => deleteRequest(r.id)} className="px-2 py-1 bg-red-600 rounded hover:bg-red-700">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-6 rounded-md w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedRequest.title}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <p><strong>Equipment:</strong> {selectedRequest.equipment}</p>
              <p><strong>Priority:</strong> {selectedRequest.priority}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Date:</strong> {selectedRequest.date}</p>
              {selectedRequest.contactInfo && <p><strong>Contact:</strong> {selectedRequest.contactInfo}</p>}
              <p className="mt-2"><strong>Description:</strong><br />{selectedRequest.description}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MaintenanceRequestsPage;
