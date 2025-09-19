import React, { useState } from 'react';
import { DocumentArrowDownIcon, PrinterIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');

  // Sample data for different reports
  const revenueData = [
    { month: 'Jan', revenue: 12500, bookings: 145 },
    { month: 'Feb', revenue: 15200, bookings: 168 },
    { month: 'Mar', revenue: 18700, bookings: 195 },
    { month: 'Apr', revenue: 16400, bookings: 178 },
    { month: 'May', revenue: 20100, bookings: 225 },
    { month: 'Jun', revenue: 22800, bookings: 248 }
  ];

  const courtUsageData = [
    { name: 'Badminton Court 1', hours: 320, revenue: 8000, utilization: 89 },
    { name: 'Badminton Court 2', hours: 298, revenue: 7450, utilization: 83 },
    { name: 'Tennis Court 1', hours: 245, revenue: 7350, utilization: 68 },
    { name: 'Tennis Court 2', hours: 189, revenue: 5670, utilization: 53 },
    { name: 'Basketball Court', hours: 156, revenue: 4680, utilization: 43 },
    { name: 'Squash Court 1', hours: 234, revenue: 7020, utilization: 65 }
  ];

  const customerData = [
    { category: 'Regular Members', count: 125, percentage: 45 },
    { category: 'Casual Players', count: 98, percentage: 35 },
    { category: 'Corporate Clients', count: 34, percentage: 12 },
    { category: 'Tournaments', count: 22, percentage: 8 }
  ];

  const hourlyUsageData = [
    { hour: '06:00', bookings: 2 },
    { hour: '08:00', bookings: 8 },
    { hour: '10:00', bookings: 15 },
    { hour: '12:00', bookings: 22 },
    { hour: '14:00', bookings: 18 },
    { hour: '16:00', bookings: 25 },
    { hour: '18:00', bookings: 32 },
    { hour: '20:00', bookings: 28 },
    { hour: '22:00', bookings: 12 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const reportTypes = [
    { id: 'revenue', name: 'Revenue Analysis', icon: '💰' },
    { id: 'courts', name: 'Court Utilization', icon: '🏟️' },
    { id: 'customers', name: 'Customer Analytics', icon: '👥' },
    { id: 'usage', name: 'Usage Patterns', icon: '📊' }
  ];

  const handleExport = (format) => {
    console.log(`Exporting report as ${format}`);
    // Add export logic here
  };

  const handlePrint = () => {
    window.print();
  };

  const RevenueReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <AreaChart width={400} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
          </AreaChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bookings vs Revenue</h3>
          <LineChart width={400} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="bookings" fill="#10B981" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$105,700</div>
            <div className="text-sm text-gray-600">Total Revenue (6M)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">$22,800</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">$17,617</div>
            <div className="text-sm text-gray-600">Average Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">+15.2%</div>
            <div className="text-sm text-gray-600">Growth Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  const CourtReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Court Utilization Rate</h3>
          <BarChart width={400} height={300} data={courtUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
            <Bar dataKey="utilization" fill="#3B82F6" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hours Booked vs Revenue</h3>
          <BarChart width={400} height={300} data={courtUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="hours" fill="#10B981" />
            <Bar yAxisId="right" dataKey="revenue" fill="#F59E0B" />
          </BarChart>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Court Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Court</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours Booked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courtUsageData.map((court, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{court.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{court.hours}h</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${court.revenue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${court.utilization}%` }}
                        ></div>
                      </div>
                      <span>{court.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      court.utilization >= 80 ? 'bg-green-100 text-green-800' :
                      court.utilization >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {court.utilization >= 80 ? 'High' : court.utilization >= 60 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CustomerReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={customerData}
              cx={200}
              cy={150}
              outerRadius={80}
              dataKey="count"
              label={({ name, percentage }) => `${name}: ${percentage}%`}
            >
              {customerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Growth</h3>
          <div className="space-y-4">
            {customerData.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">{customer.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{customer.count}</div>
                  <div className="text-sm text-gray-500">{customer.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">279</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">125</div>
            <div className="text-sm text-gray-600">Regular Members</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">45</div>
            <div className="text-sm text-gray-600">New This Month</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">92%</div>
            <div className="text-sm text-gray-600">Retention Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  const UsageReport = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Peak Hours Analysis</h3>
        <AreaChart width={800} height={300} data={hourlyUsageData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="bookings" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
        </AreaChart>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Patterns</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Peak Hours</span>
              <span className="text-sm text-green-600 font-semibold">6PM - 8PM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Off-Peak Hours</span>
              <span className="text-sm text-yellow-600 font-semibold">6AM - 10AM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Average Session</span>
              <span className="text-sm text-blue-600 font-semibold">1.5 hours</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Busiest Day</span>
              <span className="text-sm text-purple-600 font-semibold">Saturday</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Trends</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Advance Bookings</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Same-day Bookings</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm font-medium">20%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Walk-in Bookings</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (selectedReport) {
      case 'revenue':
        return <RevenueReport />;
      case 'courts':
        return <CourtReport />;
      case 'customers':
        return <CustomerReport />;
      case 'usage':
        return <UsageReport />;
      default:
        return <RevenueReport />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="mt-1 text-sm text-gray-600">Comprehensive business insights and analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </button>
          <div className="relative">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-lg text-left transition-colors ${
                selectedReport === report.id
                  ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="text-2xl mb-2">{report.icon}</div>
              <div className="font-medium">{report.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      {renderReport()}
    </div>
  );
};

export default Reports;