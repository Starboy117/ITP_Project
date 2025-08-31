import React from "react";
import Image1 from "../Images/default.jpg";
function InstaImage() {
  const Images = [Image1,Image1,Image1,Image1,Image1,Image1,Image1,Image1];

  return (
    <div >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Image ${i}`}  
            className="w-full h-full object-cover rounded-md transition duration-300 hover:shadow-2xl hover:shadow-black hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
}


export default InstaImage;
