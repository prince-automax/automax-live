import React from "react";
import { useState, useEffect } from "react";
import {
  fuel,
  mileageRanges,
  popularCities,
  registrationStateAndCode,
  planning,
  truckBody,
  truckBrands,
  vehicleCondition,
  vehicleLocation,
  InteriorImage,
  ExteriorImage,
} from "../../utils/sellacar/sellACarData";
import sample from "../../public/assets/makers/kia.jpg";
import SearchableComponent from "./searchableComponent";
import { ImageComponent } from "./imageComponent";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useField,
  useFormikContext,
} from "formik";
import { SearchIcon, PencilIcon } from "@heroicons/react/outline";

const years = Array.from({ length: 44 }, (_, index) => 1980 + index);

//BRAND COMPONENT
export const SearchBrandComponent = ({
  setActiveTab,
  name,
  handleScroll,
  setFormData,
  formData,
}) => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [searchTermLocal, setSearchTermLocal] = useState(
    formData !== null && formData !== undefined && formData[name]
      ? formData[name]
      : ""
  );
  const [field, meta, helpers] = useField(name);

  const handleBrandClick = (brandName) => {
    setSelectedBrand(brandName);
    setActiveTab(4);
    helpers.setValue(brandName);
    handleScroll("right");
    setFormData((prevData) => ({
      ...prevData,
      [name]: brandName,
    }));
  };

  // useEffect(() => {
  //   console.log('test',formData !== null && formData !== undefined && formData[name]?formData[name]:'')
  //   setSelectedItems(formData !== null && formData !== undefined && formData[name]?formData[name]:'');

  // }, [formData])

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTermLocal(value);
  };

  // VISIBLE BRANDS
  const visibleBrands = showAllBrands ? truckBrands : truckBrands.slice(0, 12);

  let filteredData = visibleBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTermLocal.toLowerCase())
  );

  return (
    <div>
      {/* search component  */}
      <div className="  flex flex-col items-start px-4 md:px-10  py-2 md:py-4 space-y-2  ">
        <p className="text-[#000000] font-poppins font-semibold text-base">
          Select your car brand
        </p>
        {/* input component */}
        <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2 border-[#9C9C9C] flex items-center justify-center ">
          <span className="">
            <SearchIcon className="md:w-6 md:h-5 w-4 h-4 text-[#F09720] m-1 " />
          </span>
          <Field name={name}>
            {({ field }) => (
              <div className="w-full">
                {/* Input for search term */}
                <input
                  {...field}
                  type="text"
                  value={searchTermLocal}
                  onChange={handleSearch}
                  placeholder="Search the company logo"
                  className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center md:placeholder:text-start placeholder:font-poppins placeholder:font-normal"
                />
              </div>
            )}
          </Field>
        </div>
      </div>

      {/* Company's Logo */}
      <div className=" mx-2 px-2  md:max-w-2xl  sm:mx-auto  relative  flex flex-col py-6 sm:py-8  items-center justify-center h-fit sm:min-h-fit   bg-opacity-90">
        <div className="grid grid-cols-4 gap-6 sm:gap-4 	   ">
          {filteredData.map((brand, index) => (
            <div
              key={index}
              className="p-2  sm:p-4"
              onClick={() => handleBrandClick(brand.name)}
            >
              <div
                className={` text-center shadow-md p-2   rounded-xl w-11 sm:w-16 ${
                  selectedBrand === brand.name ? "border-2 border-blue-500" : ""
                }`}
              >
                {brand.image}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

//MODEL COMPONENT
export const ModelComponent = ({
  name,
  setActiveTab,
  handleScroll,
  formData,
  setFormData,
}) => {
  const [model, setModel] = useState(formData?.model);
  const [isValue, setIsValue] = useState();
  const [field, meta, helpers] = useField(name);
  useEffect(() => {
    model ? setIsValue(true) : setIsValue(false);
  }, [model]);

  useEffect(() => {
    setModel(formData?.model);
  }, [formData]);

  const handleSubmit = () => {
    setActiveTab(5);
    helpers.setValue(model);
    setFormData((prevData) => ({
      ...prevData,
      [name]: model,
    }));
    // console.log("fdsfdasf", model);
    handleScroll("right");
  };

  return (
    <div className="  flex flex-col items-start px-4 md:px-10  py-2 md:py-4 space-y-4  ">
      <p className="text-[#000000] font-poppins font-semibold text-base">
        Enter your Truck Model
      </p>

      <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2  border-[#9C9C9C] flex items-center justify-center ">
        <Field name={name}>
          {({ field }) => (
            <div className="w-full">
              {/* Input for search term */}
              <input
                {...field}
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Enter Your Truck Model"
                className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center md:placeholder:text-start placeholder:font-poppins placeholder:font-normal"
              />
            </div>
          )}
        </Field>
      </div>
      {isValue && (
        <button
          onClick={handleSubmit}
          className="bg-[#135A9E] py-1 px-3 sm:py-2 sm:px-8 hover:bg-blue-400  rounded-lg   self-center space-x-2  "
        >
          <span className="text-[#FFFFFF] font-poppins sm:text-lg sm:font-medium ">
            {" "}
            continue
          </span>{" "}
        </button>
      )}
    </div>
  );
};

//BODY COMPONENT
export const BodyComponent = ({
  name,
  setActiveTab,
  constData,
  label,
  placeholder,
  handleScroll,
  setFormData,
  formData,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div>
      <SearchableComponent
        data={constData}
        onSelect={(value) => helpers.setValue(value)}
        setActiveTab={setActiveTab}
        name={name}
        label={label}
        placeholder={placeholder}
        handleScroll={handleScroll}
        setFormData={setFormData}
        formData={formData}
      />
    </div>
  );
};

//REGISTRATION NUMBER OR BRAND
export const RegistrationNumber = ({
  setActiveTab,
  name,
  handleScroll,
  setFormData,
  formData,
  isValid,
}) => {
  const [searchTermLocal, setSearchTermLocal] = useState(
    formData?.registrationNumber
  );

  const [isValue, setIsValue] = useState(false);

  useEffect(() => {
    searchTermLocal ? setIsValue(true) : setIsValue(false);
  }, [searchTermLocal]);

  console.log("isvalid from REG", isValid);

  const [field, meta, helpers] = useField(name);

  useEffect(() => {
    setSearchTermLocal(formData?.registrationNumber);
  }, [formData]);

  const handleClick = () => {
    helpers.setValue(searchTermLocal);

    setFormData((prevData) => ({
      ...prevData,
      [name]: searchTermLocal,
    }));
    handleScroll("right");
    setActiveTab(2);
  };

  return (
    <>
      <div className=" w-full  h-full  "></div>

      <div className="m-7 md:m-5 flex flex-col items-center  px-4 md:px-10  py-2 md:py-4 space-y-4  ">
        <p className="text-[#000000] font-poppins w-full text-center text-sm font-semibold md:text-lg">
          Enter Your Vehicle Number
        </p>
        <div className="text-center w-full  max-sm:h-9 rounded-md border-2 overflow-hidden  border-[#9C9C9C] flex items-center justify-center ">
          <span className=" flex items-center p-2 text-[#135A9E] font-bold  bg-[#b8b5b5] bg-opacity-100  h-full text-start sm:text-xl  ">
            IND
          </span>

          <div className="w-full">
            <input
              {...field}
              type="text"
              name="registrationNumber"
              value={searchTermLocal}
              maxLength={10}
              onChange={(e) =>
                setSearchTermLocal(
                  e.target.value.toUpperCase().replace(/\s/g, "")
                )
              }
              placeholder="KL07XX00XX"
              className="  w-full h-full p-2 border-none bg-inherit focus:ring-0 outline-0  bg-opacity-75 text-base sm:text-xl sm:text-center  max-md:placeholder:text-xs max-md:placeholder:text-center md:placeholder:text-center placeholder:font-poppins placeholder:font-normal "
            />
            {/* <ErrorMessage name="registrationNumber"  /> */}
          </div>
        </div>

        {isValue && (
          <button
            onClick={handleClick}
            // disabled={isValid}
            className="bg-[#135A9E] py-1 px-5 sm:py-2 sm:px-8 hover:bg-blue-400  rounded-lg   self-center space-x-2  "
          >
            <span className="text-[#FFFFFF] font-poppins sm:text-lg sm:font-medium ">
              {" "}
              Next
            </span>{" "}
          </button>
        )}
      </div>
    </>
  );
};

//PLANNING TO SELL
export const PlanningToSell = ({
  name,
  setActiveTab,
  handleScroll,
  setFormData,
  formData,
}) => {
  const [field, meta, helpers] = useField(name);

  const [date, setDate] = useState("");
  const handleSelect = () => {
    helpers.setValue(date);
    setActiveTab(14);
    handleScroll("right");
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  return (
    <div className="  flex flex-col items-center px-4 md:px-10  py-8  space-y-0 text-center  ">
      <p className="text-[#000000] font-poppins font-semibold text-sm md:text-base w-full ">
        When are you planning to sell vehicle
      </p>

      <div className=" p-2 md:p-4 h-32  w-full">
        <div className="   flex flex-col space-y-4 justify-center items-center">
          <input
            {...field}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="focus:outline-none  border "
          />

          {date && (
            <button
              onClick={handleSelect}
              className="bg-[#135A9E] py-1 px-3 sm:py-2 sm:px-8 hover:bg-blue-400  rounded-lg   self-center space-x-2  "
            >
              <span className="text-[#FFFFFF] font-poppins sm:text-lg sm:font-medium ">
                {" "}
                Next{" "}
              </span>{" "}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

//REGISTRATION STATE AND RTO CODE COMPONENT
export const RegistrationStateComponent = ({
  state,
  rtocode,
  setActiveTab,
  handleScroll,
  setFormData,
  formData,
}) => {
  const [searchState, setSearchState] = useState("");
  const [selectedState, setSelectedState] = useState(
    formData !== null && formData !== undefined && formData[state]
      ? formData[state]
      : ""
  );
  const [selectedRto, setSelectedRto] = useState(
    formData !== null && formData !== undefined && formData[rtocode]
      ? formData[rtocode]
      : ""
  );
  const [searchRtoTerm, setSearchRtoTerm] = useState("");
  const [stateBoolean, setStateBoolean] = useState();
  const [rtoBoolean, setRtoBoolean] = useState();
  const [rtoSection, setRtoSection] = useState(false);

  const [statefield, statemeta, statehelpers] = useField("state");
  const [rtofield, rtometa, rtohelpers] = useField("rtocode");

  useEffect(() => {
    setSelectedState(
      formData !== null && formData !== undefined && formData[state]
        ? formData[state]
        : ""
    );
    setSelectedRto(
      formData !== null && formData !== undefined && formData[rtocode]
        ? formData[rtocode]
        : ""
    );
  }, [formData]);

  useEffect(() => {
    // console.log("entereed boolean values");
    if (selectedState) {
      // console.log("data from boolean state", selectedState);
      setStateBoolean(true);
    }

    if (selectedRto) {
      // console.log("data from boolean rto", selectedRto);
      setRtoBoolean(true);
    }
    // else{
    //   setRtoBoolean(false);
    // }
  }, []);

  const handleStateSelect = (selectedItem) => {
    // console.log("001", selectedItem);
    setSelectedState(selectedItem);

    statehelpers.setValue(selectedItem.name);
    setFormData((prevData) => ({
      ...prevData,
      [state]: selectedItem.name,
    }));
    setStateBoolean(true);
    setRtoSection(true);
  };

  const handleStateEdit = () => {
    setStateBoolean(false);
    setRtoBoolean(false);
  };

  const handleRTOEdit = () => {
    setRtoBoolean(false);
  };

  const handleRtoSelect = (selectedItem) => {
    setSelectedRto(selectedItem);
    setActiveTab(7);
    rtohelpers.setValue(selectedItem);
    handleScroll("right");
    setFormData((prevData) => ({
      ...prevData,
      [rtocode]: selectedItem,
    }));
    setRtoBoolean(true);
  };

  const handleSearchState = (event) => {
    const { value } = event.target;
    setSearchState(value);
  };

  const handleSearchRtoTerm = (value) => {
    // console.log("RTO Term:", value);
    setSearchRtoTerm(value); // Step 2
  };

  let filteredState = registrationStateAndCode.filter((item) =>
    item?.name?.toLowerCase().includes(searchState?.toLowerCase())
  );

  const filteredStateRto = registrationStateAndCode?.filter((item) =>
    item?.name?.toLowerCase()
      .includes(
        selectedState?.name?.toLowerCase() || selectedState.toLowerCase()
      )
  );

  // console.log("filteredStateRto111",filteredStateRto);

  return (
    <div className="flex flex-col items-start px-4 md:px-10  py-2 md:py-4 space-y-4  ">
      {stateBoolean ? (
        <div className="w-full  p-2 rounded-lg px-6  border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit bg-sky-200">
          <div className="w-full flex items-center justify-between">
            <p>{selectedState?.name ? selectedState.name : formData?.state} </p>
            <PencilIcon
              onClick={handleStateEdit}
              className="md:w-6 md:h-5 w-4 h-4 text-slate-500 m-1 "
            />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <p className="text-[#000000] font-poppins font-semibold text-base">
            Select Registration State
          </p>

          <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2 border-[#9C9C9C] flex items-center justify-center ">
            <span className="">
              <SearchIcon className="md:w-6 md:h-5 w-4 h-4 text-[#F09720] m-1 " />
            </span>
            <Field name="state">
              {({ field }) => (
                <div className="w-full">
                  <input
                    {...field}
                    type="text"
                    value={searchState}
                    onChange={handleSearchState}
                    placeholder="Enter Registration Date"
                    className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center md:placeholder:text-start placeholder:font-poppins placeholder:font-normal"
                  />
                </div>
              )}
            </Field>
          </div>

          <div className=" p-2 md:p-4 h-96 mfgScroll overflow-y-scroll w-full">
            <div className="mt-4 w-full">
              <ul className="space-y-4 text-center w-full ">
                {filteredState.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleStateSelect(item)}
                    className={`cursor-pointer ${
                      selectedState === item?.name
                        ? "bg-blue-100 "
                        : "text-[#8C8C8C] bg-[#FFFFFFE8]"
                    } p-1 md:p-2  rounded-xl border border-[#DADADA] w-full  `}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {rtoBoolean ? (
        <div className="w-full  p-2 rounded-lg px-6  border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit bg-sky-200">
          <div className="w-full flex items-center justify-between">
            <p>{selectedRto ? selectedRto : formData?.rtocode} </p>
            <PencilIcon
              onClick={handleRTOEdit}
              className="md:w-6 md:h-5 w-4 h-4 text-slate-500 m-1 "
            />
          </div>
        </div>
      ) : (
        <div className="w-full ">
          <p className="text-[#000000] font-poppins font-semibold text-base">
            Select Rto State
          </p>

          <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2 border-[#9C9C9C] flex items-center justify-center ">
            <span className="">
              <SearchIcon className="md:w-6 md:h-5 w-4 h-4 text-[#F09720] m-1 " />
            </span>
            <Field name="rtocode">
              {({ field }) => (
                <div className="w-full">
                  {/* Input for search term */}
                  <input
                    {...field}
                    type="text"
                    value={searchRtoTerm}
                    onChange={(e) =>
                      handleSearchRtoTerm(e.target.value.toUpperCase())
                    }
                    placeholder="Select Rto Code"
                    toUpperCase
                    className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center md:placeholder:text-start placeholder:font-poppins placeholder:font-normal"
                  />
                </div>
              )}
            </Field>
          </div>
          <div className="mt-4 w-full h-56 mfgScroll overflow-y-scroll">
            {filteredStateRto?.map((item) => {
              const selectedNumber = item?.number?.find(
                (number) => number === selectedRto
              );

              const remainingNumbers = item?.number?.filter(
                (number) => number !== selectedRto
              );

              const sortedNumbers = selectedNumber
                ? [selectedNumber, ...remainingNumbers]
                : remainingNumbers;

              return (
                <ul key={item.id} className="space-y-4 text-center w-full">
                  {sortedNumbers?.map((filteredNumber) => (
                    <li
                      onClick={() => handleRtoSelect(filteredNumber)}
                      className={`cursor-pointer ${
                        selectedRto === filteredNumber
                          ? "bg-blue-100"
                          : "text-[#8C8C8C] bg-[#FFFFFFE8]"
                      } p-1 md:p-2 rounded-xl border border-[#DADADA] w-full`}
                      key={filteredNumber}
                    >
                      {filteredNumber}
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        </div>
      )}

      {/* RTO CODES */}
    </div>
  );
};

// export const RegistrationStateComponent = ({
//   state,
//   rtocode,
//   setActiveTab,
//   handleScroll,
//   setFormData,
//   formData,
//   registrationStateAndCode, // Assuming this is an array of objects with 'id', 'name', and 'number' properties
// }) => {
//   const [searchState, setSearchState] = useState("");
//   const [selectedState, setSelectedState] = useState(
//     formData !== null && formData !== undefined && formData[state]
//       ? formData[state]
//       : ""
//   );
//   const [selectedRto, setSelectedRto] = useState(
//     formData !== null && formData !== undefined && formData[rtocode]
//       ? formData[rtocode]
//       : ""
//   );
//   const [searchRtoTerm, setSearchRtoTerm] = useState("");
//   const [stateBoolean, setStateBoolean] = useState(false);
//   const [rtoBoolean, setRtoBoolean] = useState(false);
//   const [rtoSection, setRtoSection] = useState(false);

//   useEffect(() => {
//     setSelectedState(
//       formData !== null && formData !== undefined && formData[state]
//         ? formData[state]
//         : ""
//     );
//     setSelectedRto(
//       formData !== null && formData !== undefined && formData[rtocode]
//         ? formData[rtocode]
//         : ""
//     );
//   }, [formData]);

//   useEffect(() => {
//     if (selectedState) {
//       setStateBoolean(true);
//     }

//     if (selectedRto) {
//       setRtoBoolean(true);
//     }
//   }, [selectedState, selectedRto]);

//   const handleStateSelect = (selectedItem) => {
//     setSelectedState(selectedItem);
//     setFormData((prevData) => ({
//       ...prevData,
//       [state]: selectedItem.name,
//     }));
//     setStateBoolean(true);
//     setRtoSection(true);
//   };

//   const handleStateEdit = () => {
//     setStateBoolean(false);
//     setRtoBoolean(false);
//   };

//   const handleRTOEdit = () => {
//     setRtoBoolean(false);
//   };

//   const handleRtoSelect = (selectedItem) => {
//     setSelectedRto(selectedItem);
//     setActiveTab(7);
//     handleScroll("right");
//     setFormData((prevData) => ({
//       ...prevData,
//       [rtocode]: selectedItem,
//     }));
//     setRtoBoolean(true);
//   };

//   const handleSearchState = (event) => {
//     const { value } = event.target;
//     setSearchState(value);
//   };

//   const handleSearchRtoTerm = (value) => {
//     setSearchRtoTerm(value);
//   };

//   let filteredState = registrationStateAndCode.filter((item) =>
//     item.name.toLowerCase().includes(searchState?.toLowerCase())
//   );

//   const filteredStateRto = registrationStateAndCode.filter((item) =>
//     item.name
//       .toLowerCase()
//       .includes(
//         selectedState?.name?.toLowerCase() || selectedState.toLowerCase()
//       )
//   );

//   return (
//     <div className="flex flex-col items-start px-4 md:px-10 py-2 md:py-4 space-y-4">
//       {stateBoolean ? (
//         <div className="w-full p-2 rounded-lg px-6 border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit bg-sky-200">
//           <div className="w-full flex items-center justify-between">
//             <p>{selectedState?.name ? selectedState.name : formData?.state}</p>
//             <PencilIcon
//               onClick={handleStateEdit}
//               className="md:w-6 md:h-5 w-4 h-4 text-slate-500 m-1"
//             />
//           </div>
//         </div>
//       ) : (
//         <div className="w-full">
//           <p className="text-[#000000] font-poppins font-semibold text-base">
//             Select Registration State
//           </p>

//           <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2 border-[#9C9C9C] flex items-center justify-center">
//             <span className="">
//               <SearchIcon className="md:w-6 md:h-5 w-4 h-4 text-[#F09720] m-1" />
//             </span>
//             <Field name="state">
//               {({ field }) => (
//                 <div className="w-full">
//                   <input
//                     {...field}
//                     type="text"
//                     value={searchState}
//                     onChange={handleSearchState}
//                     placeholder="Enter Registration Date"
//                     className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center md:placeholder:text-start placeholder:font-poppins placeholder:font-normal"
//                   />
//                 </div>
//               )}
//             </Field>
//           </div>

//           <div className="p-2 md:p-4 h-96 mfgScroll overflow-y-scroll w-full">
//             <div className="mt-4 w-full">
//               <ul className="space-y-4 text-center w-full">
//                 {filteredState.map((item) => (
//                   <li
//                     key={item.id}
//                     onClick={() => handleStateSelect(item)}
//                     className={`cursor-pointer ${
//                       selectedState === item?.name
//                         ? "bg-blue-100"
//                         : "text-[#8C8C8C] bg-[#FFFFFFE8]"
//                     } p-1 md:p-2 rounded-xl border border-[#DADADA] w-full`}
//                   >
//                     {item.name}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}

//       {rtoSection && (
//         rtoBoolean ? (
//           <div className="w-full p-2 rounded-lg px-6 border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit bg-sky-200">
//             <div className="w-full flex items-center justify-between">
//               <p>{selectedRto ? selectedRto : formData?.rtocode}</p>
//               <PencilIcon
//                 onClick={handleRTOEdit}
//                 className="md:w-6 md:h-5 w-4 h-4 text-slate-500 m-1"
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="w-full">
//             <p className="text-[#000000] font-poppins font-semibold text-base">
//               Select Rto State
//             </p>

//             <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2 border-[#9C9C9C] flex items-center justify-center">
//               <span className="">
//                 <SearchIcon className="md:w-6 md:h-5 w-4 h-4 text-[#F09720] m-1" />
//               </span>
//               <Field name="rtocode">
//                 {({ field }) => (
//                   <div className="w-full">
//                     <input
//                       {...field}
//                       type="text"
//                       value={searchRtoTerm}
//                       onChange={(e) =>
//                         handleSearchRtoTerm(e.target.value.toUpperCase())
//                       }
//                       placeholder="Select Rto Code"
//                       className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center md:placeholder:text-start placeholder:font-poppins placeholder:font-normal"
//                     />
//                   </div>
//                 )}
//               </Field>
//             </div>
//             <div className="mt-4 w-full h-56 mfgScroll overflow-y-scroll">
//               {filteredStateRto.map((item) => {
//                 const selectedNumber = item.number.find(
//                   (number) => number === selectedRto
//                 );

//                 const remainingNumbers = item.number.filter(
//                   (number) => number !== selectedRto
//                 );

//                 const sortedNumbers = selectedNumber
//                   ? [selectedNumber, ...remainingNumbers]
//                   : remainingNumbers;

//                 return (
//                   <ul key={item.id} className="space-y-4 text-center w-full">
//                     {sortedNumbers.map((filteredNumber) => (
//                       <li
//                         onClick={() => handleRtoSelect(filteredNumber)}
//                         className={`cursor-pointer ${
//                           selectedRto === filteredNumber
//                             ? "bg-blue-100"
//                             : "text-[#8C8C8C] bg-[#FFFFFFE8]"
//                         } p-1 md:p-2 rounded-xl border border-[#DADADA] w-full`}
//                         key={filteredNumber}
//                       >
//                         {filteredNumber}
//                       </li>
//                     ))}
//                   </ul>
//                 );
//               })}
//             </div>
//           </div>
//         )
//       )}
//     </div>
//   );
// };

//USER DETAILS COMPONENT

export const UserDetails = ({ setFormData, formData }) => {
  const formik = useFormikContext();

  const handleChange = (e) => {
    formik.setFieldValue(e.target.name, e.target.value);
    // console.log("userDetails", e.target.name);
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-start px-4 md:px-10 py-2 md:py-4 space-y-4">
        <div className="w-full space-y-4">
          <label className="text-[#000000] font-poppins font-semibold text-base">
            Enter Your Name
          </label>

          <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2 border-[#9C9C9C] flex flex-col items-center justify-center">
            <Field
              type="input"
              name="clientContactPerson"
              value={formik.values.clientContactPerson}
              className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center placeholder:font-poppins placeholder:font-normal"
              placeholder="  Enter Your Name"
              required
              onChange={handleChange}
            />
            <ErrorMessage name="clientContactPerson" component="div" />
          </div>
        </div>

        <div className="w-full space-y-4">
          <label className="text-[#000000] font-poppins font-semibold text-base">
            Enter Your Pincode
          </label>

          <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2 border-[#9C9C9C] flex flex-col  items-center justify-center">
            <Field
              name="pincode"
              type="number"
              inputMode="numeric"
              value={formik.values.pincode}
              className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center placeholder:font-poppins placeholder:font-normal"
              placeholder="Enter Your pincode"
              onChange={handleChange}
              maxLength={6}
              required
            />
            <ErrorMessage name="pincode" component="div" />
          </div>
        </div>

        <div className="w-full space-y-4">
          <label className="text-[#000000] font-poppins font-semibold text-base">
            Enter Your Landmark
          </label>

          <div className="text-center w-full md:p-1 max-sm:h-9 rounded-md border-2 border-[#9C9C9C] flex flex-col  items-center justify-center">
            <Field
              type="input"
              className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center placeholder:font-poppins placeholder:font-normal"
              placeholder="  Enter Your Landmark"
              name="landmark"
              value={formik.values.landmark}
              onChange={handleChange}
              required
            />
            <ErrorMessage name="landmark" component="div" />
          </div>
        </div>

        <div className="w-full space-y-4">
          <label className="text-[#000000] font-poppins font-semibold text-base">
            Enter Your Address
          </label>

          <div className="text-center w-full md:p-1 max-md:h-20 rounded-md border-2 border-[#9C9C9C] flex flex-col  items-center justify-center">
            <Field
              as="textarea"
              className="focus:outline-none w-full border-none max-md:tracking-tight focus:ring-0 outline-0 bg-inherit max-sm:placeholder:text-sm max-md:placeholder:text-center max-md:placeholder:pt-4  placeholder:font-poppins placeholder:font-normal"
              placeholder="  Enter Your Address"
              name="address"
              value={formik.values.address}
              onChange={handleChange}
              required
            />
            <ErrorMessage name="address" component="div" />
          </div>
        </div>

        <div className="text-center w-full pb-4">
          {/* ... (other components or content) ... */}
        </div>
      </div>
    </div>
  );
};

//IMAGE INTERIOR COMPONENT
export const ImageInterior = ({
  name,
  setActiveTab,
  handleScroll,
  handleImage,
  Interorimage,
  setFormData,
  formData,
}) => {
  console.log("interior from componrnr", Interorimage);

  const handleSelect = () => {
    // setFormData((prevData) => ({
    //   ...prevData,
    //  InteriorImage:Interorimage,
    // }));
    setActiveTab(12);
    handleScroll("right");
  };
  return (
    <div className="  flex flex-col items-start px-4 md:px-10  py-2 md:py-4 space-y-2  ">
      <p className="text-[#000000] font-poppins font-semibold text-base">
        Upload Vehicle interior Photos
      </p>

      <div className=" grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-4 w-full overflow-hidden max-md:h-96  max-md:overflow-y-scroll text-center ">
        <ImageComponent
          label="Front"
          handleImage={handleImage}
          Interorimage={Interorimage}
        />

        <ImageComponent
          label="Back"
          handleImage={handleImage}
          Interorimage={Interorimage}
        />

        <ImageComponent
          label="Right"
          handleImage={handleImage}
          Interorimage={Interorimage}
        />

        <ImageComponent
          label="Left"
          handleImage={handleImage}
          Interorimage={Interorimage}
        />

        <div className="text-center w-full md:grid-cols-1 md:col-span-2 ">
          {Interorimage.length >= 2 ? (
            <button
              onClick={handleSelect}
              className="bg-[#135A9E] py-1 px-3 sm:py-2 sm:px-8 hover:bg-[#356795] rounded-lg sm:rounded-lg font-poppins text-white "
            >
              continue
            </button>
          ) : (
            <p className="w-full text-lg font-poppins  font-semibold">
              {" "}
              Upload atleast 2 images
            </p>
         )} 
        </div>
      </div>
    </div>
  );
};

//IMAGE INTERIOR
export const ImageExterior = ({
  name,
  setActiveTab,
  handleScroll,
  handleImage,
  Exterorimage,
  setFormData,
  formData,
}) => {
  const handleSelect = () => {
    // setFormData((prevData) => ({
    //   ...prevData,
    //  InteriorImage:[Interorimage],
    // }));
    setActiveTab(13);

    handleScroll("right");
  };

  return (
    <div className="  flex flex-col items-start px-4 md:px-10  py-2 md:py-4 space-y-2  ">
      <p className="text-[#000000] font-poppins font-semibold text-base">
        Upload Vehicle Exterior Photos
      </p>

      <div className=" grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full overflow-hidden max-md:h-96  max-md:overflow-y-scroll ">
        <ImageComponent label="Front" handleImage={handleImage} />
        <ImageComponent label="Back" handleImage={handleImage} />
        <ImageComponent label="Right" handleImage={handleImage} />
        <ImageComponent label="Left" handleImage={handleImage} />

        <div className="text-center w-full md:col-span-2">
          {Exterorimage.length >= 2 ? (
            <button
              onClick={handleSelect}
              className="bg-[#135A9E] py-1 px-3 sm:py-2 sm:px-8 hover:bg-[#356795] rounded-lg sm:rounded-lg font-poppins text-white "
            >
              continue
            </button>
          ) : (
            <p className="w-full text-lg font-poppins  font-semibold">
              {" "}
              Upload atleast 2 images
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


