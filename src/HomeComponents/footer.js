import React from "react";
import { FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <div className="w-full bg-black h-auto p-10">
      <footer className="mx-auto w-2/3 grid grid-cols-1 md:grid-cols-4 gap-x-20 gap-y-10 text-center md:text-left">
        
        {/* Logo */}
        <div>
          <a href="#" className="text-4xl font-bold text-white">
            LOGO
          </a>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            Your tagline or short description goes here.
          </p>
        </div>

        {/* Main Links */}
        <div>
          <legend className="text-sm text-[#0097B2] mb-2">MAIN</legend>
          <ul className="space-y-3 text-white">
            <li><a href="#" className="hover:text-[#0097B2]">HOME</a></li>
            <li><a href="#" className="hover:text-[#0097B2]">ABOUT US</a></li>
            <li><a href="#" className="hover:text-[#0097B2]">CONTACT US</a></li>
            <li><a href="#" className="hover:text-[#0097B2]">GALLERY</a></li>
            <li><a href="#" className="hover:text-[#0097B2]">SHOP</a></li>
          </ul>
        </div>

        {/* Contact Info + Location */}
        <div className="text-white">
          <legend className="text-sm text-[#0097B2] mb-2">CONTACT INFO</legend>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <FaPhone className="text-[#0097B2] w-5 h-5" />
            <span>+94 777 131 313</span>
          </div>
          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
            <FaPhone className="text-[#0097B2] w-5 h-5" />
            <span>+1 (555) 987-6543</span>
          </div>

          <div className="text-white mt-8 break-words leading-relaxed">
            <legend className="text-sm text-[#0097B2] mb-2">LOCATION</legend>
            <div className="flex items-start gap-2 justify-center md:justify-start">
              <FaMapMarkerAlt className="text-[#0097B2] w-5 h-5 mt-1" />
              <span>No. 21/5, Galle Road, Colombo 03, Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="text-white">
          <legend className="text-sm text-[#0097B2] mb-2">HOURS</legend>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <FaClock className="text-[#0097B2] w-5 h-5" />
            <span>Mon – Fri: 7:30 am — 1:00 am</span>
          </div>
          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
            <FaClock className="text-[#0097B2] w-5 h-5" />
            <span>Sat: 4:00 am — 1:00 am</span>
          </div>
          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
            <FaClock className="text-[#0097B2] w-5 h-5" />
            <span>Sun: 3:00 am — 12:30 pm</span>
          </div>
        </div>
      </footer>

      {/* Social Links */}
      <div className="mt-12 flex flex-col items-center">
        <legend className="text-sm text-[#0097B2] mb-3">FOLLOW US</legend>
        <div className="flex gap-8 text-white text-2xl">
          <a href="#" className="hover:text-[#0097B2]"><FaFacebook /></a>
          <a href="#" className="hover:text-[#0097B2]"><FaInstagram /></a>
          <a href="#" className="hover:text-[#0097B2]"><FaTwitter /></a>
          <a href="#" className="hover:text-[#0097B2]"><FaYoutube /></a>
        </div>
        <p className="text-gray-500 text-sm mt-6">
          © 2025 Orion Indoor Sports Complex. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
