import * as Yup from "yup";
import { Formik, Form, ErrorMessage } from "formik";
import FormField from "../components/ui/FormField";
import ButtonLoading from "../components/ui/ButtonLoading";
import {
  useGetUserQuery,
  GetUserQueryVariables,
  useUpdateUserMutation,
  UpdateUserMutationVariables,
  UserStatusType,
  useUsersQuery,
  useDuplicateDataCheckQuery,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import withPrivateRoute from "../utils/withPrivateRoute";
import Loader from "@components/ui/Loader";
import { UserCircleIcon } from "@heroicons/react/outline";
import Router from "next/router";
import toast from "react-hot-toast";
import { cities } from "../utils/cities";
import { states } from "../utils/states";
import { countries } from "../utils/countries";
import { useState, useEffect } from "react";
import { ResizeImage } from "../components/image-Resizing/imageProfile";
// import {welcomeMessage} from "../components/alerts/welcomeMessage"
import Swal from "sweetalert2";

const userIdProofTypes = [
  { label: "Aadhar Number", value: "aadhar" },
  { label: "Passport Number", value: "passport" },
  { label: "Driving License Number", value: "drivingLicense" },
];

const renderingCities = cities.map((city, index) => {
  return {
    label: city.city,
    value: `${city.city}-${city.state}`,
  };
});

const renderingStates = states.map((state) => {
  return { label: state.state, value: state.state };
});

const renderingCountries = countries.map((country) => {
  return { label: country.name, value: country.name };
});

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

function welcomeMessage(props) {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: props.name,
    showConfirmButton: false,
    timer: 1500,
  });
}

function ProfileUpdate() {
  const id = localStorage.getItem("id");
  // console.log("this id from localstorage", id);

  // const token = localStorage.getItem("token");
  const [emailCheckData, setEmailCheckData] = useState("");
  const [panCheckData, setPanCheckData] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [panEnabled, setPanEnabled] = useState(false);

  const [accessToken, setAccessToken] = useState("");
  const [selectedState, setSelectedState] = useState("Kerala");
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
   
    console.log(selectedState)
    if(selectedState != null && selectedState != "")
    {
      
      // filter cities and fill in cities object

      const filteredC = cities.filter(c => c.state  ===  selectedState)

      console.log("cities",cities)
      console.log("filteredC",filteredC)
      setFilteredCities(filteredC.map((city, index) => {
        return {
          label: city.city,
          value: `${city.city}-${city.state}`,
        };
      }));

    }
  }, [selectedState])
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAccessToken(token);
    }
  }, []);

  const { data: data, isLoading: isLoadingGetUser } =
    useGetUserQuery<GetUserQueryVariables>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` }),
      { where: { id } },  
      {
        enabled: accessToken !== "",
      }
    );

    console.log("data from profiel updarte0",data);
    

  const { data: duplicateEmailCheckData } = useDuplicateDataCheckQuery(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      where: {
        email: {
          equals: emailCheckData,
        },
        id: {
          not: {
            equals: id,
          },
        },
      },
    },
    {
      enabled: emailEnabled && accessToken != "",
    }
  );

  const { data: duplicatePanCheckData } = useDuplicateDataCheckQuery(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      where: {
        pancardNo: {
          equals: panCheckData,
        },
        id: {
          not: {
            equals: id,
          },
        },
      },
    },
    {
      enabled: panEnabled && accessToken != "",
    }
  );

  useEffect(() => {
    if (duplicateEmailCheckData?.sudoUsersCount > 0 && emailEnabled) {
      alert(
        "The Email you have entered has already been connected with another account."
      );
      setEmailEnabled(false);
    }
  }, [duplicateEmailCheckData, emailEnabled]);

  useEffect(() => {
    if (duplicatePanCheckData?.sudoUsersCount > 0 && panEnabled) {
      alert(
        "The Pan you have entered has already been connected with another account."
      );
      setPanEnabled(false);
    }
  }, [duplicatePanCheckData, panEnabled]);

  const callUpdateUserMutation =
    useUpdateUserMutation<UpdateUserMutationVariables>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` })
    );

  if (isLoadingGetUser) {
    return <Loader />;
  }



  const validationSchema = Yup.object({
    id: Yup.string().required(),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .matches(/^(?=.{6,})/, "Password must contain at least 8 characters"),
    passwordConfirmation: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    idProofType: Yup.string().required("Id proof type is required"),
    idProofNo: Yup.string().required("Id proof number is required"),
    pancardNo: Yup.string()
      .required("Pan Card number is required")
      .max(10, "Invalid Pan Card number")
      .min(10, "Invalid Pan Card number"),
    pancard: Yup.mixed()
      .required("Pancard is required")
      .test(
        "fileFormat",
        "Unsupported Format. Please upload a file with one of the following formats: " +
          SUPPORTED_FORMATS.join(", "),
        (value) => value && SUPPORTED_FORMATS.includes(value.type)
      ),
    idProof: Yup.mixed()
      .required("ID proof is required")
      .test(
        "fileFormat",
        "Unsupported Format. Please upload a file with one of the following formats: " +
          SUPPORTED_FORMATS.join(", "),
        (value) => value && SUPPORTED_FORMATS.includes(value.type)
      ),
    idProofBack: Yup.mixed()
      .required("ID proof is required")
      .test(
        "fileFormat",
        "Unsupported Format. Please upload a file with one of the following formats: " +
          SUPPORTED_FORMATS.join(", "),
        (value) => value && SUPPORTED_FORMATS.includes(value.type)
      ),
    mobile: Yup.string().required("Mobile number is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
  });

  const onSubmit = async (values) => {
    console.log("value on submit", values);

    const result = await callUpdateUserMutation.mutateAsync({
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        city: values.city,
        state: values.state,
        country: values.country,
        password: values.password,
        pancardNo: values.pancardNo,
        pancard: {
          upload: values.pancard,
        },
        idProofType: values.idProofType,
        idProofNo: values.idProofNo,
        idProof: {
          upload: values.idProof,
        },
        idProofBack: {
          upload: values.idProofBack,
        },
        status: UserStatusType.Active,
      },
      where: { id: values.id },
    });
    localStorage.setItem("status", "active");
    localStorage.setItem("name", `${values.firstName}`);
    // localStorage.setItem("username", `${values.firstName}`);
    let name = values.firstName;
    // console.log("name form profile updation",name);
    // welcomeMessage(name)
    Router.push("/dashboard");
    toast.success(`Welcome ${name}`);
  };

  const getIdProofPlaceholder = (idProofSelected) => {
    switch (idProofSelected) {
      case "aadhar":
        return "Enter your Aadhar Number";
      case "passport":
        return "Enter your Passport Number";
      case "drivingLicense":
        return "Enter your Driving License Number";
      default:
        return "Enter your Aadhar Number";
    }
  };

  const getIdProofLabel = (idProofSelected) => {
    switch (idProofSelected) {
      case "aadhar":
        return "Aadhar ";
      case "passport":
        return "Passport ";
      case "drivingLicense":
        return "Driving License ";
      default:
        return "Aadhar ";
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-16 px-4">
      {data && (
        <div className="space-y-8">
          <div className="py-8 bg-gray-100 rounded px-4 sm:px-6 flex items-center justify-between">
            <h2 className="text-xl leading-6 font-medium text-gray-900">
              Please update your profile
            </h2>
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
          </div>

          <Formik
            initialValues={{
              id: data["user"]["id"],
              firstName: data["user"]["firstName"],
              lastName: data["user"]["lastName"],
              email: data["user"]["email"],
              city: data["user"]["city"]
                ? data["user"]["city"]
                : "Kochi-Kerala",
              state: data["user"]["state"] ? data["user"]["state"] : "Kerala",
              country: data["user"]["country"]
                ? data["user"]["country"]
                : "India",
              password: "",
              passwordConfirmation: "",
              mobile: data["user"]["mobile"],
              idProofType: "aadhar",
              idProofNo: data["user"]["idProofNo"],
              pancardNo: data["user"]["pancardNo"],
              pancard: null,
              idProof: null,
              idProofBack: null,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              if (duplicateEmailCheckData?.sudoUsersCount > 0) {
                alert(
                  "The Email you have entered has already been connected with another account."
                );
                setEmailEnabled(false);
              } else if (duplicatePanCheckData?.sudoUsersCount > 0) {
                alert(
                  "The Pan you have entered has already been connected with another account."
                );
                setPanEnabled(false);
              } else {
                onSubmit(values);
              }
            }}
          >
            {(props) => (
              // console.log("this is props", props),
              (
                <Form>
                  <div className="space-y-3 mt-4 pb-4">
                    <div className="mt-6 grid grid-cols-6 gap-6">
                      <div className="space-y-1 col-span-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Basic Details
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500">
                          Please update your basic details.
                        </p>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <FormField
                          field="input"
                          required
                          name="firstName"
                          label="First Name"
                          width="w-full"
                          placeholder="First Name"
                          disabled
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <FormField
                          field="input"
                          name="lastName"
                          required
                          label="Last Name"
                          width="w-full"
                          placeholder="Last Name"
                          disabled
                        />
                      </div>

                      <div className="col-span-6  sm:col-span-3">
                        <FormField
                          field="input"
                          required
                          name="email"
                          label="Email Address"
                          width="w-full"
                          placeholder="Please enter email address here"
                          custom
                          onBlur={(e) => {
                            setEmailCheckData(e.target.value);
                            setEmailEnabled(e.target.value != "");
                          }}
                        />
                      </div>

                      <div className="col-span-6  sm:col-span-3">
                        <FormField
                          field="input"
                          required
                          disabled
                          name="mobile"
                          label="Mobile Number"
                          width="w-full"
                          className="bg-gray-50 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        {/* <FormField
                          field="select"
                          required
                          name="country"
                          label="Country"
                          width="w-full"
                          placeholder="Country"
                          options={renderingCountries}
                        /> */}
                        <FormField
                          field="select"
                          required
                          name="country"
                          label="Country"
                          width="w-full"
                          placeholder="Country"
                          options={renderingCountries}
                          defaultValue="India"
                          onChange={async e => {
                            const { value } = e.target;
                            props.setFieldValue("country", value);
                          }}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <FormField
                          field="select"
                          required
                          name="state"
                          label="State"
                          width="w-full"
                          placeholder="State"
                          options={renderingStates}
                          onChange={async e => {
                            const { value } = e.target;
                            props.setFieldValue("state", value);
                            setSelectedState(value);
                          }}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <FormField
                          field="select"
                          required
                          name="city"
                          label="City"
                          width="w-full"
                          placeholder="City"
                          options={filteredCities}
                          onChange={async e => {
                            const { value } = e.target;
                            props.setFieldValue("city", value);
                          }}
                        />
                      </div>

                      <div className="space-y-1 col-span-6 border-t border-gray-200 pt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Your Id Proof
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500">
                          Please enter your Id Proof details.
                        </p>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <FormField
                          field="select"
                          name="idProofType"
                          label="ID Proof Type"
                          options={userIdProofTypes}
                          required
                          width="w-full"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <FormField
                          field="input"
                          name="idProofNo"
                          label={`${getIdProofLabel(
                            props?.values?.idProofType
                          )} Number `}
                          placeholder={getIdProofPlaceholder(
                            props?.values?.idProofType
                          )}
                          required
                          width="w-full"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <FormField
                          field="input"
                          name="pancardNo"
                          label="PAN Card Number"
                          placeholder="Enter your PAN Card Number"
                          required
                          maxLength="10"
                          width="w-full"
                          onBlur={(e) => {
                            setPanCheckData(e.target.value);
                            setPanEnabled(e.target.value != "");
                          }}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3"></div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="idProof"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Upload {getIdProofLabel(props?.values?.idProofType)}{" "}
                          Document Front Side
                        </label>
                        <input
                          onChange={async (event) => {
                            try {
                              const file = event.target.files[0];
                              const image = await ResizeImage(file);
                              props.setFieldValue("idProof", image);
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                          id="idProof"
                          type="file"
                          name="idProof"
                          className="text-sm text-grey-500
                                                file:mr-5 file:py-2 file:px-6
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-medium
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:cursor-pointer hover:file:bg-amber-50
                                                hover:file:text-amber-700
                                                block w-full border border-gray-300 rounded-md
                                                "
                        />
                        <div className="mt-2 text-xs text-red-600">
                          <ErrorMessage name="idProof" />
                        </div>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="idProofBack"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Upload {getIdProofLabel(props?.values?.idProofType)}{" "}
                          Document Back Side
                        </label>
                        <input
                          onChange={async (event) => {
                            try {
                              const file = event.target.files[0];
                              const image = await ResizeImage(file);
                              props.setFieldValue("idProofBack", image);
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                          id="idProofBack"
                          type="file"
                          name="idProofBack"
                          className="text-sm text-grey-500
                                                file:mr-5 file:py-2 file:px-6
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-medium
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:cursor-pointer hover:file:bg-amber-50
                                                hover:file:text-amber-700
                                                block w-full border border-gray-300 rounded-md
                                                "
                        />
                        <div className="mt-2 text-xs text-red-600">
                          <ErrorMessage name="idProofBack" />
                        </div>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="pancard"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Upload Pan Card
                        </label>
                        <input
                          onChange={async (event) => {
                            try {
                              const file = event.target.files[0];
                              const image = await ResizeImage(file);
                              props.setFieldValue("pancard", image);
                            } catch (err) {
                              console.log(err);
                            }
                          }}
                          name="pancard"
                          id="pancard"
                          type="file"
                          className="text-sm text-grey-500
                                                file:mr-5 file:py-2 file:px-6
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-medium
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:cursor-pointer hover:file:bg-amber-50
                                                hover:file:text-amber-700
                                                block w-full border border-gray-300 rounded-md
                                                "
                        />
                        <div className="mt-2 text-xs text-red-600">
                          <ErrorMessage name="pancard" />
                        </div>
                      </div>

                      <div className="space-y-1 col-span-6 border-t border-gray-200 pt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Set Your Password
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500">
                          Required to login to your account.
                        </p>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <FormField
                          field="input"
                          required
                          id="password"
                          label="Password"
                          name="password"
                          type="password"
                          width="w-full"
                          placeholder="********"
                          showTogglePasswordButton
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <FormField
                          field="input"
                          id="passwordConfirmation"
                          label="Confirm Password"
                          name="passwordConfirmation"
                          type="password"
                          placeholder="********"
                          width="w-full"
                          showTogglePasswordButton
                        />
                      </div>
                    </div>

                    <div className="my-8 flex justify-between">
                      <ButtonLoading
                        loading={callUpdateUserMutation.isLoading ? 1 : 0}
                        type="submit"
                        color="indigo"
                      >
                        Submit{" "}
                      </ButtonLoading>
                    </div>
                  </div>
                </Form>
              )
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}

export default withPrivateRoute(ProfileUpdate);