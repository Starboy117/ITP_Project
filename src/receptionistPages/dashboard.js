import React from 'react';
import Sidebar from '../staffPageComponents/sideBar'; // the Sidebar component we'll include below
import { CalendarDaysIcon, CreditCardIcon, BuildingOfficeIcon, UsersIcon, BarChartIcon } from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats] = React.useState({
    todayBookings: 15,
    weeklyRevenue: 12500,
    activeCourts: 8,
    totalCustomers: 245
  });

  const weeklyData = [
    { day: 'Mon', bookings: 12, revenue: 2400 },
    { day: 'Tue', bookings: 19, revenue: 3800 },
    { day: 'Wed', bookings: 15, revenue: 3000 },
    { day: 'Thu', bookings: 22, revenue: 4400 },
    { day: 'Fri', bookings: 28, revenue: 5600 },
    { day: 'Sat', bookings: 35, revenue: 7000 },
    { day: 'Sun', bookings: 32, revenue: 6400 }
  ];

  const courtUsage = [
    { name: 'Badminton', value: 35, color: '#3B82F6' },
    { name: 'Tennis', value: 25, color: '#10B981' },
    { name: 'Basketball', value: 20, color: '#F59E0B' },
    { name: 'Squash', value: 15, color: '#EF4444' },
    { name: 'Volleyball', value: 5, color: '#8B5CF6' }
  ];

  const recentBookings = [
    { id: 1, customer: 'John Smith', court: 'Badminton Court 1', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, customer: 'Sarah Johnson', court: 'Tennis Court 2', time: '11:30 AM', status: 'Pending' },
    { id: 3, customer: 'Mike Brown', court: 'Basketball Court', time: '2:00 PM', status: 'Confirmed' },
    { id: 4, customer: 'Lisa Davis', court: 'Badminton Court 2', time: '3:30 PM', status: 'Confirmed' },
    { id: 5, customer: 'Tom Wilson', court: 'Squash Court 1', time: '5:00 PM', status: 'Pending' }
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-neutral-800 shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">{title}</dt>
              <dd className="text-lg font-semibold text-white">{value}</dd>
            </dl>
          </div>
        </div>
        {change && (
          <div className="mt-4">
            <span className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change > 0 ? '+' : ''}{change}% from last week
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-900">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 text-white">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="mt-1 text-sm text-gray-400">Overview</p>
          </div>
         
          
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Today's Bookings" value={stats.todayBookings} icon={CalendarDaysIcon} color="text-blue-400" change={12} />
          <StatCard title="Weekly Revenue" value={`$${stats.weeklyRevenue.toLocaleString()}`} icon={CreditCardIcon} color="text-green-400" change={8} />
          <StatCard title="Active Courts" value={`${stats.activeCourts}/10`} icon={BuildingOfficeIcon} color="text-amber-400" change={0} />
          <StatCard title="Total Customers" value={stats.totalCustomers} icon={UsersIcon} color="text-purple-400" change={15} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Bookings Chart */}
          <div className="bg-neutral-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-white mb-4">Weekly Bookings</h3>
            <BarChart width={400} height={250} data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="day" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
              <Bar dataKey="bookings" fill="#3B82F6" />
            </BarChart>
          </div>

          {/* Court Usage Chart */}
          <div className="bg-neutral-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-white mb-4">Court Usage Distribution</h3>
            <PieChart width={400} height={250}>
              <Pie
                data={courtUsage}
                cx={200}
                cy={125}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {courtUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
            </PieChart>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-neutral-800 shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-white">Recent Bookings</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-400">Latest booking activities</p>
          </div>
          <ul className="divide-y divide-gray-700">
            {recentBookings.map((booking) => (
              <li key={booking.id} className="px-4 py-4 hover:bg-neutral-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-neutral-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-200">
                          {booking.customer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{booking.customer}</div>
                      <div className="text-sm text-gray-400">{booking.court} • {booking.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'Confirmed' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-neutral-700 px-4 py-3 text-right">
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
              View all bookings →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
