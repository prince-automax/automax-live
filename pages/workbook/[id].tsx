import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardTemplate from "../../components/templates/DashboardTemplate";
import Loader from "../../components/ui/Loader";
import withPrivateRoute from "../../utils/withPrivateRoute";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";

import {
  faCar,
  faCashRegister,
  faCog,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import {
  GetUserQueryVariables,
  useGetUserQuery,
  useUserWorkBookQuery,
  UserWorkBookQueryVariables,
  useUniqueuserWorkSheetQuery,
  UniqueuserWorkSheetQueryVariables,
  useWorksheetUpdateMutation,
  WorksheetUpdateMutationVariables,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import Router from "next/router";
import Link from "next/link";
import WorksheetCarsoul from "@components/modals/WorksheetCarsoul";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

function WorkBooks() {
  const router = useRouter();
  const { id } = router.query;
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [usrid, setUsrid] = useState("");
  const [images, setImages] = useState([]);
  const [showImageCarouselModal, setShowImageCarouselModal] = useState(false);
  const [isFieldsDisabled, setFieldsDisabled] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      setAccessToken(token);
      setUserId(id);
      setUsrid(id);
    }
  }, []);

  const HandleEdit = () => {
    // Toggle the disabled state

    // console.log('here in button click');

    setFieldsDisabled(!isFieldsDisabled);
  };

  const { data, isLoading, refetch } =
    useUniqueuserWorkSheetQuery<UniqueuserWorkSheetQueryVariables>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` }),
      { where: { id: id as string } }
    );

  // console.log("data from worksheet", data);



  const updateUserWorksheet =
    useWorksheetUpdateMutation<WorksheetUpdateMutationVariables>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` })
    );

  const make = data ? data["workSheet"]?.registrationNumber : "";

  useEffect(() => {
    refetch();
  }, [data]);

  function BindVehicleImage(vehicle) {
    if (vehicle) {
      const tempImages = [];
      let count = 0;
      if (data && data["workSheet"]?.image1) {
        // alert('image1 is present')
        tempImages.push({
          id: 1,
          name: "Front Image",
          src: data ? data["workSheet"]?.image1 : "Not availabe",
          alt: "Front Image.",
        });
      }
      if (data && data["workSheet"]?.image2) {
        // alert('image 2 is present')
        tempImages.push({
          id: 2,
          name: "Back Image",
          src: data ? data["workSheet"]?.image2 : "Not availabe",
          alt: "Back Image.",
        });
      }
      if (data && data["workSheet"]?.image3) {
        // alert('image 3 is present')
        tempImages.push({
          id: 3,
          name: "Left Image",
          src: data ? data["workSheet"]?.image3 : "Not available",
          alt: "Left Image.",
        });
      }
      if (data && data["workSheet"]?.image4) {
        // alert('image 4 is present')
        tempImages.push({
          id: 4,
          name: "Right Image",
          src: data ? data["workSheet"]?.image4 : "Not available",
          alt: "Right Image.",
        });
      }
      if (data && data["workSheet"]?.image5) {
        // alert('image 5 is present')
        tempImages.push({
          id: 4,
          name: "Right Image",
          src: data ? data["workSheet"]?.image5 : "Not availabe",
          alt: "Right Image.",
        });
      }

      setImages(tempImages);
    } else {
      setImages([]);
    }
  }

  const validationSchema = Yup.object().shape({
    RegistrationNo: Yup.string().required(
      "Registration Number is required and must"
    ),
  });

  const onSubmit = async (values) => {
    console.log("values from workbook edit", values);

    try {
      const result = await updateUserWorksheet.mutateAsync({
        where: { id: id as string },
        data: {
          registrationNumber: values.RegistrationNo,
          make: values.make,
          model: values.model,
          chassis: values.ChaissNo,
          engineNo: values.EngineNo,
          varient: values.Varient,
          vehicleCondition: values.VehicleConditon,
        },
      });
      toast.success('Worksheet successfully  upadated');

      setFieldsDisabled(true)
      
    } catch (error) {
      console.log(error);
    }
  };

  // console.log('data from worksheed', data && data["workSheet"]?.registrationNumber );

  let initialValues = {
    RegistrationNo:
      data && data["workSheet"] ? data["workSheet"].registrationNumber : "",
    make: data && data["workSheet"] ? data["workSheet"].make : "",
    model: data && data["workSheet"] ? data["workSheet"].model : "",
    ChaissNo: data && data["workSheet"] ? data["workSheet"].chassis : "",
    EngineNo: data && data["workSheet"] ? data["workSheet"].engineNo : "",
    Varient: data && data["workSheet"] ? data["workSheet"].varient : "",
    VehicleConditon:
      data && data["workSheet"] ? data["workSheet"].vehicleCondition : "",
  };

  // console.log('initialValues',initialValues);

  return (
    <DashboardTemplate>
      <div className="max-w-full mx-auto my-8 px-4">
        {/* {data && ( */}
        <div className="space-y-8">
          {data && (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
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
                        <p className="text-md leading-6 font-medium text-gray-900">
                          Registration No
                        </p>
                        <Field
                          type="input"
                          name="RegistrationNo"
                          label="Registration Number"
                          width="w-full"
                          placeholder="Registration Number"
                          disabled={isFieldsDisabled}
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 outline-none rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <p className="text-md leading-6 font-medium text-gray-900">
                          Make
                        </p>
                        <Field
                          type="input"
                          name="make"
                          label="Make"
                          width="w-full"
                          placeholder="Make"
                          disabled={isFieldsDisabled}
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6  sm:col-span-3">
                        <p className="text-md leading-6 font-medium text-gray-900">
                          Model
                        </p>
                        <Field
                          type="input"
                          name="model"
                          label="Model"
                          width="w-full"
                          disabled={isFieldsDisabled}
                          placeholder="model"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border  border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <p className="text-md leading-6 font-medium text-gray-900">
                          Chaiss No
                        </p>
                        <Field
                          type="input"
                          name="ChaissNo"
                          label="Chaiss No"
                          width="w-full"
                          placeholder="Chaiss No"
                          disabled={isFieldsDisabled}
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none  border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <p className="text-md leading-6 font-medium text-gray-900">
                          Engine No
                        </p>
                        <Field
                          type="input"
                          name="EngineNo"
                          label="Engine No"
                          width="w-full"
                          placeholder="Engine No"
                          disabled={isFieldsDisabled}
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none  border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <p className="text-md leading-6 font-medium text-gray-900">
                          Varient
                        </p>
                        <Field
                          type="input"
                          name="Varient"
                          label="Varient"
                          disabled={isFieldsDisabled}
                          width="w-full"
                          placeholder="Varient"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <p className="text-md leading-6 font-medium text-gray-900">
                          Vehicle Conditon
                        </p>
                        <Field
                          as="textarea"
                          name="VehicleConditon"
                          label="VehicleCondition"
                          disabled={isFieldsDisabled}
                          width="w-full"
                          placeholder="Vehiclle condition"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                          aria-describedby="message-max"
                          rows={4}
                        />
                      </div>
                      <div className="col-span-6 ">
                        {isFieldsDisabled ? (
                          <p
                            className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:w-auto"
                            onClick={HandleEdit}
                          >
                            {/* {isFieldsDisabled ? 'Enable Fields' : 'Disable Fields'} */}
                            Edit Details
                          </p>
                        ) : (
                          <button
                            type="submit"
                            className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:w-auto"
                            // disabled={props.isSubmitting}
                          >
                            update
                          </button>
                        )}
                      </div>
                      {/* IMAGES */}
                      <div className="space-y-1 col-span-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          IMAGES
                        </h3>
                      </div>
                      {/*  */}
                      <div className="col-span-2 ">
                        {data &&
                          data["workSheet"] &&
                          data["workSheet"]?.image1 && (
                            <div
                              onClick={() => {
                                BindVehicleImage(data ? data : "");
                                setShowImageCarouselModal(true);
                              }}
                              className=" relative col-span-6 sm:col-span-12 text-center border shadow-2xl p-2 "
                            >
                              <p className="text-md leading-6 font-medium text-gray-900 ">
                                {/* <FontAwesomeIcon
                                  className="mr-2 w-28 h-28 "
                                  icon={faImages}
                                /> */}
                                <Image
                                  alt="img"
                                  src={data["workSheet"]?.image1}
                                  width={800}
                                  height={600}
                      
                                />
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
      <WorksheetCarsoul
        color="blue"
        open={showImageCarouselModal}
        close={() => setShowImageCarouselModal(false)}
        images={images}
      />
    </DashboardTemplate>
  );
}

export default withPrivateRoute(WorkBooks);
