import React from 'react';
import {
  CalendarDaysIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  HomeIcon,
  ChatBubbleLeftIcon, // new icon for Inquiries
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', icon: HomeIcon, path: '/ReceptionistDashboard' },
    { name: 'Bookings', icon: CalendarDaysIcon, path: '/ReceptionistDashboard/bookings' },
    { name: 'Courts', icon: BuildingOfficeIcon, path: '/ReceptionistDashboard/courts' },
    { name: 'Payment', icon: CreditCardIcon, path: '/ReceptionistDashboard/payments' },
    { name: 'Inquiries', icon: ChatBubbleLeftIcon, path: '/manageInquiry' }, 
    { name: 'Reports', icon: ChartBarIcon, path: '/ReceptionistDashboard/reports' },
    // changed icon
  ];

  return (
    <div className="bg-neutral-900 w-64 min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-8">Orion Dashboard</h2>
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
    </div>
  );
};

export default Sidebar;
