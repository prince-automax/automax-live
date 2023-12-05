import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import FormField from "../components/ui/FormField";
import ButtonLoading from "../components/ui/ButtonLoading";
import {
  useAddWorkBookMutation,
  AddWorkBookMutationVariables,
  useGetUserQuery,
  GetUserQuery,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import withPrivateRoute from "../utils/withPrivateRoute";
import Loader from "@components/ui/Loader";

import Router from "next/router";
import toast from "react-hot-toast";

import { useState, useEffect, useRef } from "react";
import { ResizeImage } from "../components/image-Resizing/imageProfile";
import DashboardTemplate from "../components/templates/DashboardTemplate";

import Swal from "sweetalert2";

import storage from "../components/firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

function AddWorkBook() {
  const formikRef = useRef(null);
  const [accessToken, setAccessToken] = useState("");
  const [id, setId] = useState("");
  const [file, setFile] = useState(null); // progress
  const [percent, setPercent] = useState(0); // Handle file upload event and update state
  const [firbaseUrl, setFirbaseUrl] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      setAccessToken(token);
      setId(id);
    }
  }, []);

  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
  ];

  const AddWorkBookMutation =
    useAddWorkBookMutation<AddWorkBookMutationVariables>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` })
    );

  const { data } = useGetUserQuery<GetUserQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    { where: { id } },
    {
      enabled: accessToken !== "",
    }
  );

  const validationSchema = Yup.object().shape({
    RegistrationNo: Yup.string().required(
      "Registration Number is required and must"
    ),
  });

  const handleUpload = async (selectedFile, props, imageField) => {
    if (!selectedFile) {
      alert("Please upload an image first!");
      return;
    } else {
    }

    const storageRef = await ref(storage, `/files/${selectedFile.name + v4()}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          // props.setFieldValue('image1', url);

          if (imageField === "image1") {
            props.setFieldValue("image1", url);
          } else if (imageField === "image2") {
            props.setFieldValue("image2", url);
          } else if (imageField === "image3") {
            props.setFieldValue("image3", url);
          } else if (imageField === "image4") {
            props.setFieldValue("image4", url);
          } else if (imageField === "image5") {
            props.setFieldValue("image5", url);
          }
        });
      }
    );
  };

  const onSubmit = async (values, { resetForm }) => {
    const result = await AddWorkBookMutation.mutateAsync({
      data: {
        registrationNumber: values.RegistrationNo,
        make: values.make,
        model: values.model,
        chassis: values.ChaissNo,
        engineNo: values.EngineNo,
        varient: values.Varient,
        vehicleCondition: values.VehicleConditon,
        image1: values.image1,
        image2: values.image2,
        image3: values.image3,
        image4: values.image4,
        image5: values.image5,
        userDetail: { connect: { id: id } },
      },
    });

    resetForm();
    const fileInputFields = ["image1", "image2", "image3", "image4", "image5"];
    fileInputFields.forEach((fieldName) => {
      const input = document.querySelector(
        `input[name="${fieldName}"]`
      ) as HTMLInputElement;
      if (input) {
        input.value = ""; // Clear the value of the file input
      }
    });
    toast.success(`Submitted successfully`);
    Router.push("/showworkbook");
  };

  return (
    <DashboardTemplate>
      <div className="max-w-full mx-auto my-8 px-4">
        {/* {data && ( */}
        <div className="space-y-8">
          <Formik
            initialValues={{
              RegistrationNo: "",
              make: "",
              model: "",
              ChaissNo: "",
              EngineNo: "",
              Varient: "",
              VehicleConditon: "",
              image1: "",
              image2: "",
              image3: "",
              image4: "",
              image5: "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            innerRef={formikRef}
          >
            {(props) => (
              <Form encType="multipart/form-data">
                <div className="space-y-3 mt-4 pb-4">
                  <div className="mt-6 grid grid-cols-6 gap-6">
                    <div className="space-y-1 col-span-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Work Book
                      </h3>
                      <p className="max-w-2xl text-sm text-gray-500">
                        Enter the Vehicle Details .
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <Field
                        type="input"
                        name="RegistrationNo"
                        label="Registration Number"
                        width="w-full"
                        placeholder="Registration Number"
                        className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 outline-none rounded-md"
                        onChange={(event) => {
                          const newValue = event.target.value
                            .toUpperCase()
                            .replace(/\s/g, "");
                          props.handleChange(event); // Update the Formik state with the transformed value
                          props.setFieldValue("RegistrationNo", newValue); // Manually set the transformed value in the Formik state
                        }}
                      />
                      <div className="mt-2 text-sm text-red-600">
                        <ErrorMessage name="RegistrationNo" component="div" />
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <Field
                        type="input"
                        name="make"
                        label="Make"
                        width="w-full"
                        placeholder="Make"
                        className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6  sm:col-span-3">
                      <Field
                        type="input"
                        name="model"
                        label="Model"
                        width="w-full"
                        placeholder="model"
                        className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border  border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <Field
                        type="input"
                        name="ChaissNo"
                        label="Chaiss No"
                        width="w-full"
                        placeholder="Chaiss No"
                        className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none  border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <Field
                        type="input"
                        name="EngineNo"
                        label="Engine No"
                        width="w-full"
                        placeholder="Engine No"
                        className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none  border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <Field
                        type="input"
                        name="Varient"
                        label="Varient"
                        width="w-full"
                        placeholder="Varient"
                        className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <Field
                        as="textarea"
                        name="VehicleConditon"
                        label="VehicleCondition"
                        width="w-full"
                        placeholder="Vehiclle condition"
                        className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                        aria-describedby="message-max"
                        rows={4}
                      />
                    </div>
                    {/* IMAGES */}
                    <div className="space-y-1 col-span-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        IMAGES
                      </h3>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                        Image 1
                      </p>
                      <input
                        type="file"
                        name="image1"
                        width="w-full"
                        placeholder="Front image"
                        className="py-2 px-2 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                        onChange={(event) => {
                          const selectedFile = event.target.files[0];
                          handleUpload(selectedFile, props, "image1"); //
                        }}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                        Image 2
                      </p>
                      <input
                        type="file"
                        name="image2"
                        width="w-full"
                        placeholder="Back image"
                        className="py-2 px-2 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                        onChange={(event) => {
                          // const selectedFile = event.target.files[0];
                          // setFile(selectedFile);

                          const selectedFile = event.target.files[0];
                          handleUpload(selectedFile, props, "image2"); //
                        }}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                        Image 3
                      </p>
                      <input
                        type="file"
                        name="image3"
                        width="w-full"
                        placeholder="Left image"
                        className="py-2 px-2 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                        onChange={(event) => {
                          // const selectedFile = event.target.files[0];
                          // setFile(selectedFile);

                          const selectedFile = event.target.files[0];
                          handleUpload(selectedFile, props, "image3"); //
                        }}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                        Image 4
                      </p>
                      <input
                        type="file"
                        name="image4"
                        width="w-full"
                        placeholder="Select an image to upload"
                        className="py-2 px-2 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                        onChange={(event) => {
                          // const selectedFile = event.target.files[0];
                          // setFile(selectedFile);

                          const selectedFile = event.target.files[0];
                          handleUpload(selectedFile, props, "image4"); //
                        }}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                        Image 5
                      </p>
                      <input
                        type="file"
                        name="image5"
                        width="w-full"
                        placeholder="Select an image to upload"
                        className="py-2 px-2 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                        onChange={(event) => {
                          // const selectedFile = event.target.files[0];
                          // setFile(selectedFile);

                          const selectedFile = event.target.files[0];
                          handleUpload(selectedFile, props, "image5"); //
                        }}
                      />
                    </div>
                    {/* <div className="col-span-6 sm:col-span-3"></div> */}
                  </div>

                  <div className="my-8 flex justify-between">
                    <button
                      type="submit"
                      className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:w-auto"
                      disabled={props.isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </DashboardTemplate>
  );
}

export default withPrivateRoute(AddWorkBook);

// function ImageUpload() {
//   // State to store uploaded file

//   return (
//     <div className="w-full flex justify-center flex-col space-y-5 m-10">

//    <h1 className="font-bold text-lg flex text-center  ">Choose  Image</h1>
//       <input type="file"  className="w-fit py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" onChange={handleChange} accept="/image/*" />
//       {file &&
//        <>
//        <button className="btn w-fit bg-red-500" onClick={handleUpload}>Upload to Firebase</button>

//     <p>{percent} "% done"</p>
//     </>}
//     {firbaseUrl &&
//     <>

//     <p>URL   :</p>
//     <textarea className="w-full border-2 border-solid border-black h-36 p-1"  value={firbaseUrl}></textarea>
//     <img className="w-2/5" src={firbaseUrl} alt="firbaase url"/>
//     </>
//     }

//     </div>
//   );
// }
