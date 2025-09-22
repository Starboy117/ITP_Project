import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../Images/view-soccer-ball.jpg";

function HeroImage() {
  return (
    <div className="relative w-full h-[100vh] font-['Inter']">
      {/* Background image */}
      <img
        src={heroImage}
        alt="Soccer field with ball"
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Text + Button */}
      <div className="absolute top-40 left-40 text-white z-10 max-w-6xl">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
          WELCOME TO ORION SPORTS COMPLEX
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl mb-6">
          PLAY. COMPETE. CONNECT. - YOUR GAMES STARTS HERE.
        </p>

        {/* Book Button as a Link */}
        <Link
          to="/available"
          className="px-8 py-3 text-2xl font-semibold shadow-lg transition duration-300"
          style={{
            backgroundColor: "#0097B2",
            color: "white",
          }}
        >
          Book
        </Link>
      </div>
    </div>
  );
}

export default HeroImage;
