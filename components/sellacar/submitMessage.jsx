import React from "react";
import { MenuIcon, XIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const SubmitMessage = ({setActiveTab,setComponents}) => {

    const handleSetComponents = () => {
        setComponents(3)
        setActiveTab(1)
    };
  

  return (
    <div className=" mx-4 p-10 sm:max-w-lg rounded-xl sm:mx-auto   flex items-center justify-center h-60 sm:h-80 bg-white bg-opacity-90">
      <div className=" w-full h-48 space-y-5 flex flex-col justify-center items-center  ">
        <div className="w-full text-center space-y-3 ">
         
          <div className="w-72 sm:w-full mx-auto text-center font-ubuntu font-medium leading-6 text-[#818181] sm:text-[25px]  sm:py-6 ">
      
            <h1 className="w-[90%] mx-auto  text-center">
               Your Form have been recorded sucessfully
            </h1>
          </div>
        </div>
        <div className="mt-5">
          <button 
          onClick={()=>handleSetComponents()}
          className="bg-[#135A9E] py-1 px-3 sm:py-2 sm:px-8 hover:bg-blue-400  rounded flex space-x-2  items-center justify-center">
            <span className="text-[#FFFFFF] font-poppins sm:text-lg sm:font-bold ">
              {" "}
            Sell Another Truck
            </span>{" "}
         
            <span>
              <ChevronRightIcon className=" w-4 h-5 text-white " />{" "}
            </span>
           
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default SubmitMessage;
