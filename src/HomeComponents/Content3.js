import React from "react";
import ContentImage1 from "../Images/ct3im1.jpg";
import ContentImage2 from "../Images/ct3im2.jpg";
import ContentImage3 from "../Images/ct3im3.jpeg";
import { FiArrowRight } from "react-icons/fi";

function Content3() {
  return (
    <div className="relative bg-black rounded-2xl max-w-7xl mx-auto p-24 overflow-hidden transition duration-300 hover:shadow-2xl hover:shadow-black hover:scale-105">
      {/* Watermark */}
      <div className="absolute inset-0 flex top-1/10 pointer-events-none">
        <span className="text-[8rem] md:text-[10rem] font-bold text-white opacity-10 tracking-widest select-none">
          SWING
        </span>
      </div>

      {/* Content */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Text Section */}
        <div className="flex-1 space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-[#BFAE5F]">
            GALLERY
          </h2>

          <h1 className="text-3xl md:text-4xl font-normal text-[#0097B2]">
            Moments of Action & Fun
          </h1>

          <hr className="border-t-2 border-[#0097B2] w-60" />

          <p className="text-white leading-relaxed w-full text-lg font-light">
            Step into our Gallery and relive the best moments at our Indoor
            Sports Complex! From thrilling matches and training sessions to
            community events and celebrations, our gallery showcases the energy,
            passion, and joy of sports.
          </p>

          <a
            href="#book"
            className="inline-flex items-center text-sm gap-1 text-[#0097B2]"
          >
            VIEW <FiArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Image Section */}
        <div className="flex-1 grid grid-cols-2 gap-3">
         
          <div className="flex flex-col gap-3">
            <img
              src={ContentImage1}
              alt="Gallery 1"
              className="w-full h-48 object-cover"
            />
            <img
              src={ContentImage2}
              alt="Gallery 2"
              className="w-full h-48 object-cover "
            />
          </div>

          {/* Right column with one tall image */}
          <div>
            <img
              src={ContentImage3}
              alt="Gallery 3"
              className="w-full h-full object-cover "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content3;

