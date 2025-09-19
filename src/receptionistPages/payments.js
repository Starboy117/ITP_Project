import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  const [payments] = useState([
    {
      id: 'PAY-001',
      bookingId: 'BK-001',
      customerName: 'John Smith',
      email: 'john@email.com',
      amount: 25.00,
      method: 'Credit Card',
      status: 'Completed',
      transactionId: 'TXN123456789',
      date: '2024-01-15',
      time: '10:30 AM',
      court: 'Badminton Court 1',
      refundAmount: 0
    },
    {
      id: 'PAY-002',
      bookingId: 'BK-002',
      customerName: 'Sarah Johnson',
      email: 'sarah@email.com',
      amount: 45.00,
      method: 'Debit Card',
      status: 'Pending',
      transactionId: 'TXN987654321',
      date: '2024-01-15',
      time: '11:45 AM',
      court: 'Tennis Court 2',
      refundAmount: 0
    },
    {
      id: 'PAY-003',
      bookingId: 'BK-003',
      customerName: 'Mike Brown',
      email: 'mike@email.com',
      amount: 60.00,
      method: 'Cash',
      status: 'Completed',
      transactionId: 'CASH001',
      date: '2024-01-15',
      time: '2:15 PM',
      court: 'Basketball Court',
      refundAmount: 0
    },
    {
      id: 'PAY-004',
      bookingId: 'BK-004',
      customerName: 'Lisa Davis',
      email: 'lisa@email.com',
      amount: 25.00,
      method: 'Credit Card',
      status: 'Completed',
      transactionId: 'TXN456789123',
      date: '2024-01-16',
      time: '3:30 PM',
      court: 'Badminton Court 2',
      refundAmount: 0
    },
    {
      id: 'PAY-005',
      bookingId: 'BK-005',
      customerName: 'Tom Wilson',
      email: 'tom@email.com',
      amount: 30.00,
      method: 'Credit Card',
      status: 'Refunded',
      transactionId: 'TXN789123456',
      date: '2024-01-16',
      time: '5:00 PM',
      court: 'Squash Court 1',
      refundAmount: 30.00
    },
    {
      id: 'PAY-006',
      bookingId: 'BK-006',
      customerName: 'Emma White',
      email: 'emma@email.com',
      amount: 35.00,
      method: 'Digital Wallet',
      status: 'Failed',
      transactionId: 'TXN321654987',
      date: '2024-01-16',
      time: '6:30 PM',
      court: 'Volleyball Court',
      refundAmount: 0
    }
  ]);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status.toLowerCase() === filterStatus;
    const matchesMethod = filterMethod === 'all' || payment.method.toLowerCase().includes(filterMethod.toLowerCase());
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Failed': 'bg-red-100 text-red-800',
      'Refunded': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getMethodIcon = (method) => {
    const icons = {
      'Credit Card': '💳',
      'Debit Card': '💳',
      'Cash': '💰',
      'Digital Wallet': '📱',
      'Bank Transfer': '🏦'
    };
    return icons[method] || '💳';
  };

  const totalRevenue = filteredPayments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = filteredPayments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const refundedAmount = filteredPayments
    .filter(p => p.status === 'Refunded')
    .reduce((sum, p) => sum + p.refundAmount, 0);

  const handleProcessPayment = (paymentId) => {
    console.log('Processing payment:', paymentId);
    // Add payment processing logic here
  };

  const handleRefund = (paymentId) => {
    console.log('Processing refund:', paymentId);
    // Add refund processing logic here
  };

  const exportPayments = () => {
    console.log('Exporting payments data');
    // Add export logic here
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
          <p className="mt-1 text-sm text-gray-600">Track and manage all payment transactions</p>
        </div>
        <button
          onClick={exportPayments}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 font-semibold">$</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">${totalRevenue.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">${pendingAmount.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">↩</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Refunded</dt>
                  <dd className="text-lg font-medium text-gray-900">${refundedAmount.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">#</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Transactions</dt>
                  <dd className="text-lg font-medium text-gray-900">{payments.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <option value="all">All Methods</option>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="cash">Cash</option>
                <option value="digital">Digital Wallet</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                  <div className="text-sm text-gray-500">Booking: {payment.bookingId}</div>
                  <div className="text-sm text-gray-500">TXN: {payment.transactionId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {payment.customerName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                      <div className="text-sm text-gray-500">{payment.email}</div>
                      <div className="text-sm text-gray-500">{payment.court}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                  {payment.refundAmount > 0 && (
                    <div className="text-sm text-red-600">Refunded: ${payment.refundAmount.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">{getMethodIcon(payment.method)}</span>
                    <span className="text-sm text-gray-900">{payment.method}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.date}</div>
                  <div className="text-sm text-gray-500">{payment.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {payment.status === 'Pending' && (
                    <button
                      onClick={() => handleProcessPayment(payment.id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Process
                    </button>
                  )}
                  {payment.status === 'Completed' && (
                    <button
                      onClick={() => handleRefund(payment.id)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Refund
                    </button>
                  )}
                  <button className="text-blue-600 hover:text-blue-900">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of{' '}
              <span className="font-medium">{payments.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;