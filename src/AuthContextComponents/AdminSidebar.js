import React from 'react';
import { UsersIcon, UserGroupIcon, ChartBarIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Users', icon: UsersIcon, path: '/AdminDashboard' },
    { name: 'Staff', icon: UserGroupIcon, path: '/StaffManagement' },
    { name: 'Reports', icon: ChartBarIcon, path: '/admin/reports' },
  ];

  return (
    <div className="bg-neutral-900 w-64 min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h2>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded-lg text-white hover:bg-neutral-800 ${
                isActive ? 'bg-neutral-800 font-semibold' : ''
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto text-gray-400 text-sm">
        © 2025 Orion Sports
      </div>
    </div>
  );
};

export default AdminSidebar;
