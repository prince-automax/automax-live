import React from "react";
import * as Yup from "yup";

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
import storage from "../components/firebase/firebaseConfig";
import { HandleUpload } from "../components/firebase/firebaseHandleupload";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import WelcomePage from "../components/sellacar/WelcomePage";
import SubmitMessage from "../components/sellacar/submitMessage";
import { Formik, Form, ErrorMessage } from "formik";
import graphQLClient from "@utils/useGQLQuery";
import {
  useCreateSellACarMutation,
  CreateSellACarMutationVariables,
  useUpdateUserMutation,
  UpdateUserMutationVariables,
} from "@utils/graphql";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
const years = Array.from({ length: 44 }, (_, index) => 1980 + index);

const SellACar = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [components, setComponents] = useState(1);
  const [accessToken, setAccessToken] = useState("");
  const [Interorimage, setInteriorImage] = useState([]);
  const [Exterorimage, setEXteriorImage] = useState([]);
  const [firebaseInteriorImage, setFirebaseInteriorImage] = useState("");
  const [firebaseExteriorImage, setFirebaseExteriorImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [count, setcount] = useState(0);
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
    interiorImages: "",
    exteriorImages: "",
    expectToSell: "",
    clientContactPerson: "",
    clientContactNo: "",
    address: "",
    landmark: "",
    pincode: "",
  });
  const scrollContainerRef = useRef();
  let container;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dataContains = JSON.parse(localStorage.getItem("sellacar")) || {};
      console.log("dataContains", dataContains);

      const token = localStorage.getItem("token");
      if (
        token &&
        dataContains?.registrationNumber !== "" &&
        dataContains?.registrationNumber !== undefined
      ) {
        console.log("entered here in with only token and form");
        setComponents(3);
      } else if (token) {
        console.log("entered here in with only token");
        setComponents(2);
      }

      // token && setComponents(2);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // console.log('entered useeffect when component changes');

      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      setAccessToken(token);
      setUserId(id);
    }
  }, [components]);

  console.log("userid00007", userId);
  console.log("access00007", accessToken);

  const handleInteriorImage = (file) => {
    // console.log('file from inter',file);

    setInteriorImage([...Interorimage, file]);
  };

  const handleExteriorImage = (file) => {
    setEXteriorImage([...Exterorimage, file]);
  };

  useEffect(() => {
    if (formData.registrationNumber !== "") {
      const formDataString = JSON.stringify(formData);
      const activeString=JSON.stringify(activeTab);
      localStorage.setItem("sellacar", formDataString);
     
    }
  }, [formData]);

  useEffect(()=>{
    const activeString=JSON.stringify(activeTab);
    localStorage.setItem('activetab',activeString)
  },[activeTab])

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("sellacar")) || {};

    setFormData(savedFormData);
  }, [activeTab]);

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("sellacar")) || {};
    setFormData(savedFormData);
  }, []);

  useEffect(() => {
    if (success) {
      toast.success(success.text ? success.text : "Success");
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    }
    if (error) {
      toast.error(
        error.text ? error.text : "Something went wrong. Please contact support"
      );
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  }, [success, error]);

  const AddSellACarMutation =
    useCreateSellACarMutation<CreateSellACarMutationVariables>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` })
    );

  const UpdateUserMutation = useUpdateUserMutation<UpdateUserMutationVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` })
  );

  async function SubmitFiles(values, { resetForm }) {
    console.log("values from onSubmitFiles000000000000000000000000");

    try {
      setIsLoading(true);
      const interiorImages = Interorimage || []; // Assuming values.interiorImage is an array
      const ExteriorImages = Exterorimage || [];

      try {
        const interiorImageUrl = await HandleUpload(
          interiorImages,
          "interiorImage",
          "interior"
        );
        console.log("interiorImageUrl from onSubmit", interiorImageUrl);
        setFirebaseInteriorImage(interiorImageUrl);
      } catch (ex) {
        // console.log("interiorImageUrl uploading Error", ex);

        return ""; // Handle error, you may want to log or handle differently
      }

      try {
        const ExteriorImageUrl = await HandleUpload(
          ExteriorImages,
          "exteriorImages",
          "exterior"
        );
        console.log("ExteriorImageUrl from onSubmit", ExteriorImageUrl);
        setFirebaseExteriorImage(ExteriorImageUrl);

        console.log("firebaseInteriorImage", firebaseInteriorImage);
        console.log("firebaseExteriorImage", firebaseExteriorImage);

      
      } catch (error) {
        console.log("Exteriro image uploading error", error);
      }

      const result = await AddSellACarMutation.mutateAsync({
        data: {
          registrationNumber: values?.registrationNumber,
          make: values?.make,
          yearOfManufacture: values?.yearOfManufacture,
          model: values?.model,
          body: values?.body,
          state: values?.state,
          rtoCode: values?.rtoCode,
          kmReading: values?.kmReading,
          fuel: values?.fuel,
          vehicleCondition: values?.vehicleCondition,
          veicleLocation: values?.veicleLocation,
          interiorImages: firebaseInteriorImage,
          exteriorImages: firebaseExteriorImage,
          expectToSell: new Date(values?.expectToSell).toISOString(),
          address: values?.address,
          landmark: values?.landmark,
          pincode: values?.pincode,
          user:{connect:{id:userId}}
        },
      });

      console.log("result of sellacarform submission", result);

      if (result) {
        console.log("USERID", userId);
        const userUpdate = await UpdateUserMutation.mutateAsync({
          where: { id: userId },
          data: { firstName: values?.clientContactPerson },
         
        });
        console.log("result of sellacarform userupdate", userUpdate);

        if (userUpdate) {
          setComponents(4);
          setSuccess({
            text: "Form has been successfully submitted",
          });
        }
      }
      setIsLoading(false);
    } catch (error) {
      setError({
        text: `Form submission Failed ${error}`,
      });
    } finally {
      setIsLoading(false);
    }

    // console.log("From ONSubmit of sell a car ", values);
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
      interiorImages: "",
      exteriorImages: "",
      expectToSell: "",
      clientContactPerson: "",
      clientContactNo: "",
      address: "",
      landmark: "",
      pincode: "",
    });
    resetForm();
    localStorage.removeItem("sellacar");
  }

  const handleScroll = (direction) => {
    container = scrollContainerRef.current;
    const scrollAmount = 100;

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
      interiorImages: "",
      exteriorImages: "",
      expectToSell: "",
      clientContactPerson: "",
      clientContactNo: "",
      address: "",
      landmark: "",
      pincode: "",
    });
  };

  const handleTabClick = (tabNo) => {
    setActiveTab(tabNo);
    if (activeTab < tabNo) {
      handleScroll("right");
    } else {
      handleScroll("left");
    }
  };

  const validationSchema = Yup.object().shape({
    clientContactPerson: Yup.string().required(
      "clientContactPerson is required"
    ),
    address: Yup.string().required("address is required"),
    landmark: Yup.string().required("landmark is required"),
    pincode: Yup.string().required("pincode is required"),
    // Add other validations for other fields here
    // ...
  });
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
      <div className="w-full h-full flex items-center justify-center relative  px-10  ">
        {isLoading && (
          <div className=" absolute z-10">
<PulseLoader
  color="#010101"
  size={20}
/>
          </div>
        )}
        {components === 1 && <SellACarOtp index={setComponents} />}

        {components === 2 && <WelcomePage index={setComponents} />}
        <div className="max-md:w-96 md:max-w-lg m-3 md:m-0  rounded-xl bg-opacity md:relative bg-white bg-opacity-90">
          {components === 3 && (
            <div
              onClick={handleClose}
              className="hidden md:block md:absolute top-4 left-4 cursor-pointer text-lg text-[#989898] font-semibold"
            >
              X
            </div>
          )}

          {components === 3 && (
            <div className="w-full h-full ">
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
                    }   `}
                    onClick={() => handleTabClick(tab.tabIndex)}
                  >
                    {tab.tabName}
                  </button>
                ))}
              </div>

              <Formik
                initialValues={formData}
                onSubmit={SubmitFiles}
                enableReinitialize={true}
                // validationSchema={validationSchema}
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
                          isValid={props.isValid}
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
                          handleImage={handleInteriorImage}
                          Interorimage={Interorimage}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 12 && (
                        <ImageExterior
                          name="image"
                          setActiveTab={setActiveTab}
                          handleScroll={handleScroll}
                          handleImage={handleExteriorImage}
                          Exterorimage={Exterorimage}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 13 && (
                        <PlanningToSell
                          name="expectToSell"
                          setActiveTab={setActiveTab}
                          handleScroll={handleScroll}
                          setFormData={setFormData}
                          formData={formData}
                        />
                      )}
                      {activeTab === 14 && (
                        <div className="py-4 w-full flex flex-col items-center ">
                          <UserDetails
                            setFormData={setFormData}
                            formData={formData}
                          />

                          <button
                            type="submit"
                            disabled={props.isSubmitting}
                            className="bg-[#135A9E] py-1  w-52 rounded-md md:w-96  px-4 sm:py-2 sm:px-8 hover:bg-[#264b6d]  font-poppins text-white "
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
        {components === 4 && (
          <SubmitMessage
            setActiveTab={setActiveTab}
            setComponents={setComponents}
          />
        )}
      </div>
    </div>
  );
};

export default SellACar;
