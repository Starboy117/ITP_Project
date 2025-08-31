import React from "react";
import ContentImage1 from "../Images/ct2im1.jpeg";
import ContentImage2 from "../Images/ct2im2.avif";
import { FiArrowRight } from "react-icons/fi";

function Content2() {
  return (
    <div className="relative bg-black rounded-2xl max-w-7xl mx-auto p-24 overflow-hidden transition duration-300 hover:shadow-2xl hover:shadow-black hover:scale-105">
      {/* Content */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
        
        {/* Image Section (first) */}
        <div className="flex-1 w-1/2 relative">
          {/* Main Image */}
          <img
            src={ContentImage1}
            alt="Soccer field with ball"
            className="w-full h-full object-cover block"
          />

          {/* Small overlay image */}
          <img
            src={ContentImage2}
            alt="Small preview"
            className="w-64 h-64 object-cover absolute top-40 left-72 border-8 border-black"
          />
        </div>

        {/* Text Section (second) */}
        <div className="flex-1 space-y-4 pl-20">
          <h2 className="text-sm font-semibold tracking-wide text-[#BFAE5F]">
            PRO SHOP
          </h2>

          <h1 className="text-3xl md:text-4xl font-normal text-[#0097B2]">
            Buy & Rent Sports Gear
          </h1>

          <hr className="border-t-2 border-[#0097B2] w-60" />

          <p className="text-white leading-relaxed w-3/4 text-lg font-light">
            Step into our Pro Shop and gear up for your game! From premium
            rackets and balls to protective gear and apparel, we’ve got
            everything you need. You can buy your own equipment or rent
            high-quality gear for the day — perfect for spontaneous games.
          </p>

          <a
            href="#book"
            className="inline-flex items-center text-sm gap-1 text-[#0097B2]"
          >
            SHOP <FiArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Content2;
