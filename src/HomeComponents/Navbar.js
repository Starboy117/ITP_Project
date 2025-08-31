import React from "react";
import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="bg-black bg-opacity-70 text-white font-['Inter'] shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Use mx-auto to center the container */}
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-white">
              LOGO
            </a>
          </div>

          {/* Middle: Navigation Menu - ADDED flex-1 AND justify-center */}
          <div className="hidden md:flex flex-1 justify-center items-center"> 
            <ul className="flex space-x-8">
                {" "}
                {/* Flex to make list horizontal */}
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 px-3 py-2 text-sm font-normal transition-colors relative group"
                  >
                    HOME
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-300 transition-all group-hover:w-full"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 px-3 py-2 text-sm font-normal transition-colors relative group"
                  >
                    ABOUT US
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-300 transition-all group-hover:w-full"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 px-3 py-2 text-sm font-normal transition-colors relative group"
                  >
                    CONTACT US
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-300 transition-all group-hover:w-full"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 px-3 py-2 text-sm font-normal transition-colors relative group"
                  >
                    GALLERY
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-300 transition-all group-hover:w-full"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white hover:text-gray-300 px-3 py-2 text-sm font-normal transition-colors relative group"
                  >
                    SHOP
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-300 transition-all group-hover:w-full"></span>
                  </a>
                </li>
              </ul>
          </div>

          {/* Right: Icon - This will now be pushed to the far right */}
          <div className="flex items-center space-x-4"> 
            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
