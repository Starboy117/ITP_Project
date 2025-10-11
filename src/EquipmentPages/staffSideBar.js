// ShopKeeperSidebar.jsx
import React from 'react';
import { Squares2X2Icon, ShoppingCartIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const ShopKeeperSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Equipment Management', icon: Squares2X2Icon, path: '/equipment-management' },
    { name: 'Shop Management', icon: ShoppingCartIcon, path: '/shop-management' },
    { name: 'Equipment Maintenance', icon: WrenchScrewdriverIcon, path: '/maintenance-requests' },
  ];

  return (
    <div className="bg-neutral-900 w-64 min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-8">Shop Dashboard</h2>
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

export default ShopKeeperSidebar;
