import React from "react";
import InstaImage from "./InstaImage";

function InstaContent() {
  return (
    <div className="text-center">
      <div >
        <h1 className="text-[#0097B2] text-normal font-semibold mb-5">FOLLOW US @ORION_COMPLEX</h1>
      </div>

      <div >
        <h2 className="text-[#0097B2] text-5xl font-semibold mb-10">INSTAGRAM</h2>
      </div>

      <div>
        <InstaImage />
      </div>
    </div>
  );
}

export default InstaContent;
