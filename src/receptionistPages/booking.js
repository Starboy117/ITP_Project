import React, { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import BookingModal from '../staffPageComponents/BookingModel';
import Sidebar from '../staffPageComponents/sideBar';

const Bookings = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookings] = useState([
    // ... your bookings array
  ]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.court.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleNewBooking = () => {
    setSelectedBooking(null);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Confirmed': 'bg-green-900 text-green-300',
      'Pending': 'bg-yellow-900 text-yellow-300',
      'Cancelled': 'bg-red-900 text-red-300'
    };
    return colors[status] || 'bg-gray-700 text-gray-300';
  };

  const getPaymentBadge = (status) => {
    const colors = {
      'Paid': 'bg-green-900 text-green-300',
      'Pending': 'bg-yellow-900 text-yellow-300',
      'Refunded': 'bg-blue-900 text-blue-300',
      'Failed': 'bg-red-900 text-red-300'
    };
    return colors[status] || 'bg-gray-700 text-gray-300';
  };

  return (
    <div className="flex min-h-screen bg-neutral-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold">Bookings Management</h2>
            <p className="mt-1 text-sm text-gray-400">Manage all court bookings and reservations</p>
          </div>
          <button
            onClick={handleNewBooking}
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Booking
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-neutral-800 p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 rounded-md leading-5 bg-neutral-900 border border-neutral-700 placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base bg-neutral-900 text-white border border-neutral-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-neutral-800 shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-neutral-700">
            {/* ... table content (same as your original code) */}
          </table>
        </div>

        {/* Pagination */}
        {/* ... pagination code (same as your original code) */}

        {/* Booking Modal */}
        {showModal && (
          <BookingModal
            booking={selectedBooking}
            onClose={() => setShowModal(false)}
            onSave={(bookingData) => {
              console.log('Saving booking:', bookingData);
              setShowModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Bookings;
