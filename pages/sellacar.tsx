import React from "react";
import Image from "next/image";
import bck from "../public/assets/Sell a car/bck2.jpg";
import { useState, useRef, useEffect } from "react";
import {
  fuel,
  mileageRanges,
  registrationStateAndCode,
  truckBody,
  vehicleCondition,
  vehicleLocation,
} from "../utils/sellacar/sellACarData";
import {
  RegistrationNumber,
  BodyComponent,
  SearchBrandComponent,
  ModelComponent,
  RegistrationStateComponent,
  ImageInterior,
  ImageExterior,
  PlanningToSell,
  UserDetails,
} from "../components/sellcarcomponents/components";
import { Tabs } from "../utils/sellacar/sellACarTab";
import SellACarOtp from "../components/sellacar/sellACarOtp";
import SellACarOtpVerification from "../components/sellacar/SellACarOtpVerification";
import WelcomePage from "../components/sellacar/WelcomePage";
import { Formik, Form } from "formik";
const years = Array.from({ length: 44 }, (_, index) => 1980 + index);

const SellACar = () => {
  const [activeTab, setActiveTab] = useState(14);
  const [components, setComponents] = useState(4);
  const [accessToken, setAccessToken] = useState("");
  const [formData, setFormData] = useState({
    registrationNumber: "",
    make: "",
    yearOfManufacture: "",
    model: "",
    body: "",
    state: "",
    rtocode: "",
    kmReading: "",
    fuel: "",
    vehicleCondition: "",
    veicleLocation: "",
    images: "",
    expectToSell: "",
    clientContactPerson: "",
    clientContactNo: "",
    address: "",
    landmark: "",
    pincode: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      token && setComponents(4);
      setAccessToken(token);
    
    }
  }, []);


  // useEffect(() => {
  //   // console.log('hit one');
  //   console.log('formdata t',formData);

  //   // if (formData?.registrationNumber !== "") {
  //   //   localStorage.setItem("sellacar", JSON.stringify(formData));
  //   // }

  //   // if(!formData.registrationNumber || formData.registrationNumber == ''){
  //   //   console.log('tab 1')
  //   //   setActiveTab(1);
  //   // }
  //   // else if(!formData.yearOfManufacture ||formData.yearOfManufacture == '' ){
  //   //   console.log('tab 2')
  //   //   setActiveTab(2);
  //   // }
  //   // else if(!formData.model ||formData.model == '' ){
  //   //   console.log('tab 2')
  //   //   setActiveTab(3);
  //   // }
  //   // else if(!formData.body ||formData.body == '' ){
  //   //   console.log('tab 2')
  //   //   setActiveTab(4);
  //   // }
  //   // else if(!formData.rtocode ||formData.rtocode == '' ){
  //   //   console.log('tab 2')
  //   //   setActiveTab(5);
  //   // }
  //   // else if(!formData.kmReading ||formData.kmReading == '' ){
  //   //   console.log('tab 2')
  //   //   setActiveTab(6);
  //   // }
  // }, [formData]);

  useEffect(() => {
    if (formData.registrationNumber !== '') {
      // Convert formData to a string using JSON.stringify
      const formDataString = JSON.stringify(formData);
  
      // Store the string in localStorage
      localStorage.setItem('sellacar', formDataString);
    }
  }, [formData]);
  
  



  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("sellacar")) || {};
    // console.log('log from useeffect taking data from Lc when active tab is changing');
    
    setFormData(savedFormData);
  }, [activeTab]);

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("sellacar")) || {};
    setFormData(savedFormData);
    
    // console.log('log from useeffect taking data from Lc when initial rendering  tab is changing');

    
  }, []);
  

  const scrollContainerRef = useRef();
  let container;

  const onSubmit = async (values, { resetForm }) => {
    console.log("From ONSubmit of sell a car ", values);
    setFormData({
      registrationNumber: "",
      make: "",
      yearOfManufacture: "",
      model: "",
      body: "",
      state: "",
      rtocode: "",
      kmReading: "",
      fuel: "",
      vehicleCondition: "",
      veicleLocation: "",
      images: "",
      expectToSell: "",
      clientContactPerson: "",
      clientContactNo: "",
      address: "",
      landmark: "",
      pincode: "",
    })
    resetForm()
    localStorage.removeItem('sellacar')
  };

  const handleScroll = (direction) => {
    container = scrollContainerRef.current;
    const scrollAmount = 120;

    if (direction === "right") {
      container.scrollLeft += scrollAmount;
    } else if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft = direction;
    }
  };

  const handleClose = () => {
    setActiveTab(1);
    handleScroll(0);
    console.log("remove local");

    localStorage.removeItem("sellacar");
    setFormData({
      registrationNumber: "",
      make: "",
      yearOfManufacture: "",
      model: "",
      body: "",
      state: "",
      rtocode: "",
      kmReading: "",
      fuel: "",
      vehicleCondition: "",
      veicleLocation: "",
      images: "",
      expectToSell: "",
      clientContactPerson: "",
      clientContactNo: "",
      address: "",
      landmark: "",
      pincode: "",
    })
  };

  const handleTabClick = (tabNo) => {
    setActiveTab(tabNo);
    if (activeTab < tabNo) {
      handleScroll("right");
    } else {
      handleScroll("left");
    }
  };


  return (
    <div className="w-full min-h-screen relative flex items-center justify-center sm:p-10  ">
      <div className="w-full h-full absolute  z-[-1] ">
        <Image
          src={bck}
          alt="key"
          layout="fill"
          objectFit="cover"
          className="bg-opacity-50 "
        />
      </div>
      <div className="w-full h-full flex items-center justify-center  ">
        {components === 1 && <SellACarOtp index={setComponents} />}
        {components === 2 && <SellACarOtpVerification index={setComponents} />}
        {components === 3 && <WelcomePage index={setComponents} />}

        <div className="max-md:w-96 md:max-w-lg m-3 md:m-0  rounded-xl bg-opacity md:relative bg-white bg-opacity-90">
          <div
            onClick={handleClose}
            className="hidden md:block md:absolute top-4 left-4 cursor-pointer text-lg text-[#989898] font-semibold"
          >
            X
          </div>
          {/* <div>
            <button onClick={removeLocal}>REMOVE</button>
          </div> */}
          {components === 4 && (
            <div className="w-full h-full ">
              {/* Render the tabs outside of Formik */}
              <div
                ref={scrollContainerRef}
                style={{ whiteSpace: "nowrap" }}
                className="hidden space-x-4 md:flex overflow-scroll scroll mt-12 h-20 items-center px-6 scroll-smooth"
              >
                {Tabs.map((tab) => (
                  <button
                    key={tab.tabIndex}
                    className={`h-9 px-6 min-w-fit border border-[#A5A5A5] rounded-md font-poppins font-semibold text-xs p-2 ${
                      activeTab === tab.tabIndex
                        ? "text-white bg-blue-500 "
                        : "bg-white"
                    } `}
                    onClick={() => handleTabClick(tab.tabIndex)}
                  >
                    {tab.tabName}
                  </button>
                ))}
              </div>

              <Formik
                initialValues={formData}
                onSubmit={onSubmit}
                // enableReinitialize={true}
              >
                {(props) => (
                  <Form>
                    <div>
                      {activeTab === 1 && (
                        <RegistrationNumber
                          setActiveTab={setActiveTab}
                          name="registrationNumber"
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 2 && (
                        <BodyComponent
                          name="yearOfManufacture"
                          setActiveTab={setActiveTab}
                          constData={years}
                          label="Select Car Manufacturing Year"
                          placeholder=" Enter Car Manufacturing Year"
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 3 && (
                        <SearchBrandComponent
                          setActiveTab={setActiveTab}
                          name="make"
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 4 && (
                        <ModelComponent
                          name="model"
                          setActiveTab={setActiveTab}
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 5 && (
                        <BodyComponent
                          name="body"
                          setActiveTab={setActiveTab}
                          constData={truckBody}
                          label="Select Vehicle Body Type"
                          placeholder=" Enter Vehicle Body Type"
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 6 && (
                        <RegistrationStateComponent
                          state="state"
                          rtocode="rtocode"
                          setActiveTab={setActiveTab}
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 7 && (
                        <BodyComponent
                          name="kmReading"
                          setActiveTab={setActiveTab}
                          constData={mileageRanges}
                          label=" Select kilometers Driven"
                          placeholder="Enter kilometers Driven"
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 8 && (
                        <BodyComponent
                          name="fuel"
                          setActiveTab={setActiveTab}
                          constData={fuel}
                          label="Select FuelType"
                          placeholder=" Enter Fuel Type"
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 9 && (
                        <BodyComponent
                          name="vehicleCondition"
                          setActiveTab={setActiveTab}
                          constData={vehicleCondition}
                          label="Select Vehicle condition"
                          placeholder="Enter Vehicle condition"
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 10 && (
                        <BodyComponent
                          name="veicleLocation"
                          setActiveTab={setActiveTab}
                          constData={vehicleLocation}
                          label="Select Vehicle Location"
                          placeholder="Enter Vehicle Location"
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 11 && (
                        <ImageInterior
                          name="image"
                          setActiveTab={setActiveTab}
                          handleScroll={handleScroll}
                        />
                      )}
                      {activeTab === 12 && (
                        <ImageExterior
                          name="image"
                          setActiveTab={setActiveTab}
                          handleScroll={handleScroll}
                        />
                      )}
                      {activeTab === 13 && (
                        <PlanningToSell
                          name="expectToSell"
                          setActiveTab={setActiveTab}
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                        />
                      )}
                      {activeTab === 14 && (
                        <div>
                          <UserDetails
                       



                           setFormData={setFormData} 
                           formData={formData}
                           

                          />
                            
 
                          <button
                            type="submit"
                            className="bg-[#135A9E] py-1 w-full px-3 sm:py-2 sm:px-8 hover:bg-[#264b6d] rounded-lg sm:rounded-lg font-poppins text-white "
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellACar;
