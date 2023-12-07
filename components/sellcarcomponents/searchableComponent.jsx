import React from "react";
import Image from "next/image";
import { useState,useEffect } from "react";
import {
  fuel,
  mileageRanges,
  popularCities,
  registrationNumber,
  planning,
  truckBody,
  truckBrands,
  vehicleCondition,
  vehicleLocation,
} from "../../utils/sellacar/sellACarData";
import sample from "../../public/assets/makers/kia.jpg";

// import SellACarOtp from "../components/sellacar/sellACarOtp";
// import SellACarOtpVerification from "../components/sellacar/SellACarOtpVerification";
// import WelcomePage from "../components/sellacar/WelcomePage";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  MenuIcon,
  XIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@heroicons/react/outline";
const years = Array.from({ length: 44 }, (_, index) => 1980 + index);

const SearchableComponent = ({
  data,
  onSelect,
  label,
  placeholder,
  setActiveTab,
  name,
  handleScroll,
  setFormData,
  formData
}) => {
  
  const [searchTermLocal, setSearchTermLocal] = useState(formData !== null && formData !== undefined && formData[name]?formData[name]:'');
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    console.log('test',formData !== null && formData !== undefined && formData[name]?formData[name]:'')
    setSelectedItems(formData !== null && formData !== undefined && formData[name]?formData[name]:'');
   
  }, [formData])

  // Function to handle item selection
  const handleSelect = (selectedItem) => {
    console.log("selectedItem00001", selectedItem);

     onSelect(selectedItem); // Call the onSelect prop with the selected item
     setSearchTermLocal(''); // Clear local search term after selection
    setSelectedItems(selectedItem);
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedItem,
    }));


    switch (name) {
      case "yearOfManufacture":
        setActiveTab(3);
        console.log("yearOfManufacture");
        break;
      case "body":
        setActiveTab(6);
        console.log("reached body");
        break;
      case "kmReading":
        setActiveTab(8);
        console.log("reached kmReading");
        break;
      case "fuel":
        setActiveTab(9);
        console.log("reached fuel");
        break;
      case "vehicleCondition":
        setActiveTab(10);
        console.log("reached vehicleCondition");
        break;
      case "veicleLocation":
        setActiveTab(11);
        console.log("reached vehicleLocation");
        break;
      default:
    }

    handleScroll('right')
  };

  const isDataArrayOfNumbers = data.every(
    (elem) => typeof elem === "number" && Number.isInteger(elem)
  );

  let filteredData;
  if (isDataArrayOfNumbers) {
    filteredData = data.filter((year) =>
      year.toString().includes(searchTermLocal)
    );
  } else {
    // Filter data based on the search term
    filteredData = data.filter((item) =>
      item.toLowerCase().includes(searchTermLocal.toLowerCase())
    );
  }

  return (
    <div className="  flex flex-col items-start px-4 md:px-10  py-2 md:py-4 space-y-2  ">
      <p className="text-[#000000] font-poppins font-semibold text-base">
        {label}
      </p>

      <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2 border-[#9C9C9C] flex items-center ">
        <span className="">
          <SearchIcon className="md:w-6 md:h-5 w-4 h-4 text-[#F09720] m-1 " />
        </span>
        {/* <Field
          type="text"
          className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center placeholder:font-poppins placeholder:font-normal"
          placeholder="  Select Car Manufacturing Year"
          value={searchYear}
          onChange={handleSearch}
        /> */}
        <Field name="searchTerm">
          {({ field }) => (
            <div className="w-full">
              {/* Input for search term */}
              <input
                {...field}
                type="text"
                value={searchTermLocal}
                onChange={(e) => setSearchTermLocal(e.target.value)}
                placeholder={placeholder ? placeholder : ""}
                className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center md:placeholder:text-start placeholder:font-poppins placeholder:font-normal"
              />
            </div>
          )}
        </Field>
      </div>

      <div className=" p-2 md:p-4 h-96 mfgScroll overflow-y-scroll w-full">
        <div className="mt-4 w-full">
          <ul className="space-y-4 text-center w-full ">
            {filteredData.map((data) => (
              <li
                key={data}
                onClick={() => handleSelect(data)}
                className={`cursor-pointer ${
                  selectedItems === data
                    ? "bg-blue-100 "
                    : "text-[#8C8C8C] bg-[#FFFFFFE8]"
                } p-1 md:p-2  rounded-xl border border-[#DADADA] w-full  `}
              >
                {data}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchableComponent;
