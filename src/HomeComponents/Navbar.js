// src/HomeComponents/Navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaClipboardList, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import "../css/Navbar.css";
import logo1 from "../Images/logo1.png";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-black bg-opacity-70 text-white font-['Inter'] shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logo1} alt="Logo" className="h-40 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex flex-1 justify-center items-center">
            <ul className="flex space-x-8">
              <li>
                <Link
                  to="/"
                  className="text-white hover:text-gray-300 px-3 py-2 text-sm font-normal transition-colors relative group"
                >
                  HOME
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-300 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white hover:text-gray-300 px-3 py-2 text-sm font-normal transition-colors relative group"
                >
                  ABOUT US
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-300 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white hover:text-gray-300 px-3 py-2 text-sm font-normal transition-colors relative group"
                >
                  CONTACT US
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-300 transition-all group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/user-shop"
                  className="text-white hover:text-gray-300 px-3 py-2 text-sm font-normal transition-colors relative group"
                >
                  SHOP
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-300 transition-all group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#0097B2] rounded-full flex items-center justify-center text-white font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline">{currentUser.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-black bg-opacity-90 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>

                    {currentUser.role === "user" && (
                      <Link
                        to="/viewBookings"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaClipboardList className="mr-2" /> View Bookings
                      </Link>
                    )}

                    {(currentUser.role === "admin" ||
                      currentUser.role === "receptionist" ||
                      currentUser.role === "staff") && (
                      <Link
                        to={
                          currentUser.role === "admin"
                            ? "/AdminDashboard"
                            : currentUser.role === "receptionist"
                            ? "/ReceptionistDashboard"
                            : "/equipment-management"
                        }
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FaTachometerAlt className="mr-2" /> Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white hover:text-gray-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-[#0097B2] text-white rounded-md hover:bg-[#0085a1]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
