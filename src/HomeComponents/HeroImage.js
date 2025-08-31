import React from "react";
import heroImage from "../Images/view-soccer-ball.jpg";

function HeroImage() {
  return (
    // This container holds the image and acts as the positioning context
    <div className="relative w-full h-[100vh] font-['Inter']"> 
      
      {/* The image, set to cover the container */}
      <img
        src={heroImage}
        alt="Soccer field with ball"
        className="w-full h-full object-cover"
      />

      {/* Overlay to make text more readable (optional but recommended) */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Text Container - positioned absolutely in the top-left */}
      <div className="absolute top-40 left-40 text-white z-10 max-w-6xl">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
          WELCOME TO ORION SPORTS COMPLEX
        </h1>
        {/* Subheading */}
        <p className="text-lg md:text-xl lg:text-2xl">
          PLAY.COMPETE.CONNECT. - YOUR GAMES STARTS HERE.
        </p>
      </div>

    </div>
  );
}

export default HeroImage;
