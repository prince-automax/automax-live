import React from "react";
import Image from "next/image";
export const ImageComponent = ({ label, handleImage,Interorimage  }) => {
  return (
    <div className="flex flex-col border border-[#a3a7aa] bg-white rounded-lg p-2  shadow-xl  space-y-3">
      <p className="text-sm font-poppins font-semibold tracking-wider">
        {label}
      </p>

      <div className="">
     
        <input
          className="text-sm w-full font-normal border p-px"
          type="file"
        //   defaultValue={}
          onChange={(e) => {
            const file = e.target.files[0];
            handleImage(file);
          }}
          
        />
      </div>
    </div>
  );
};
