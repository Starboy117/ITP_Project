import React from "react";
import ContentImage1 from "../Images/ct1.jpg";
import { FiArrowRight } from "react-icons/fi";

function Content1() {
  return (
    <div className="relative bg-black rounded-2xl max-w-7xl mx-auto p-24 overflow-hidden transition duration-300 hover:shadow-2xl hover:shadow-black hover:scale-105">
      {/* Watermark */}
      <div className="absolute inset-0 flex top-1/2 left-96 pointer-events-none">
        <span className="text-[8rem] md:text-[10rem] font-bold text-white opacity-10 tracking-widest select-none">
          RESERVE
        </span>
      </div>

      {/* Content */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Text Section */}
        <div className="flex-1 space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-[#BFAE5F]">
            OUR COURT
          </h2>

          <h1 className="text-3xl md:text-4xl font-normal text-[#0097B2]">
            Play Your Way
          </h1>

          <hr className="border-t-2 border-[#0097B2] w-60" />

          <p className="text-white leading-relaxed w-full text-lg font-light">
            Whether you’re into badminton, futsal, basketball, table tennis,
            carrom, or 8-ball pool, Orion has you covered. Our courts are
            professionally maintained, well-lit, and ready for action. Book your
            preferred sport, time, and duration with real-time availability at
            your fingertips.
          </p>

          <a href="#book" className="inline-flex items-center text-sm gap-1 text-[#0097B2]">
            BOOK <FiArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Image Section */}
        <div className="flex-1" >
          <img
            src={ContentImage1}
            alt="Soccer field with ball"
            className="w-full h-full object-cover "
          />
        </div>
      </div>
    </div>
  );
}

export default Content1;
