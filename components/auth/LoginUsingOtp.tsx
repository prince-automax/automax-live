import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { IsValidValue, IsValidMobile } from "../../utils/validations";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { CheckCircleIcon } from "@heroicons/react/solid";
import useStore from "../../utils/store";

import graphQLClient from "@utils/useGQLQuery";
import {
  CreateUserMutationVariables,
  SendOtpMutationVariables,
  useCreateUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  VerifyOtpMutationVariables,
  UserStatusType,
} from "@utils/graphql";

export default function LoginUsingOtp() {
  const router = useRouter();
  const [success, setSuccess] = useState(null);
  const [verificationMode, setVerificationMode] = useState(false);
  const [mobile, setMobile] = useState("");
  const [firstName,setFirstName]=useState("")
  const [lastName,setLastName]=useState("")
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(null);

  const { setToken } = useStore((state) => ({
    setToken: (token) => state.setToken(token),
  }));


   console.log('first name',firstName);
   console.log('Last name',lastName);
   
  const callOTPMutation = useSendOtpMutation<SendOtpMutationVariables>(
    graphQLClient()
  );

  const callCreateUserMutation =
    useCreateUserMutation<CreateUserMutationVariables>(graphQLClient());

  const callVerifyOTP = useVerifyOtpMutation<VerifyOtpMutationVariables>(
    graphQLClient()
  );

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

  //This function, CallOTP, is an asynchronous function that handles the logic when the user clicks on the "Send OTP" button.
  async function CallOTP() {
    if ( (router.pathname === "/register" && (!firstName || !lastName))) {
        // Handle invalid form data
       
            return toast.error("Enter the first Name and last name")
      
       
      }
    let isValid = true;
    if (!IsValidValue(mobile) || !IsValidMobile(mobile)) {
      setError({ text: "Please enter a valid Mobile Number" });
      isValid = false;
    }
    // the callOTPMutation to send the OTP &&  passing the mobile value as a parameter
    if (isValid) {
      const result = await callOTPMutation.mutateAsync({ mobile });

      if (result.sendUserMagicAuthLink) {
        // user with the provided mobile number exists.
        setVerificationMode(true);
        setSuccess({
          text: "Please enter the OTP received on your registered mobile number.",
        });
      } else {
        // user with the provided mobile number does not exist. It proceeds to create a new user using the callCreateUserMutation with the provided number
        const result2 = await callCreateUserMutation.mutateAsync({
          data: {
            mobile,
            username: "auto" + mobile,
            status: UserStatusType.Pending,
            firstName:firstName,
            lastName :lastName
          },
        });

        // console.log("user created using callcreateusermutation");

        if (!result2.createUser?.id) {
          setVerificationMode(false);
          setError({
            text: "Unable to send OTP. Please contact the support team.",
          });
        }

        const result3 = await callOTPMutation.mutateAsync({ mobile });
        if (result3.sendUserMagicAuthLink) {
          setVerificationMode(true);
          setSuccess({
            text: "Please enter the OTP received on your registered mobile number.",
          });
        } else {
          setVerificationMode(false);
          setError({
            text: "Unable to send OTP. Please contact the support team.",
          });
        }
      }
    }
  }
  // handles the logic when the user clicks on the "Send OTP" button.
  async function CallOTPVerify() {
    let isValid = true;
    if (!IsValidValue(otp)) {
      setError({ text: "Please enter a valid OTP." });
      isValid = false;
    }
    if (isValid) {
      const result = await callVerifyOTP.mutateAsync({ mobile, token: otp });

      if (result.redeemUserMagicAuthToken["token"] === undefined) {
        setError({ text: "Please enter a valid OTP." });
      }

      if (result.redeemUserMagicAuthToken["token"]) {
        localStorage.setItem("token", result.redeemUserMagicAuthToken["token"]);
        localStorage.setItem(
          "id",
          result.redeemUserMagicAuthToken["item"]["id"]
        );
        localStorage.setItem(
          "status",
          result.redeemUserMagicAuthToken["item"]["status"]
        );
        localStorage.setItem(
          "name",
          result.redeemUserMagicAuthToken["item"]["firstName"]
        );

        setToken(result.redeemUserMagicAuthToken["token"]);
        setMobile("");
        setVerificationMode(false);
        setSuccess({
          text: "You have been successfully logged in.",
        });
        router.push(`/dashboard`);
      } else {
        setError({
          text: "OTP verification failed. Please contact the support team.",
        });
      }
    }
  }

  return (
    <>
      <div className="mt-4">
        {!verificationMode && (
          <div className="space-y-6">
            <div>
              
       
               <div className="mt-1 space-y-4">
               {router.pathname == "/register" && (
                  <>
                   <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
                    <input
                      type="text"
                      name="firstname"
                      placeholder="First Name"
                      required
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                     <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
         Last Name
              </label>
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Last Name"
                      required
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </>
                )}
                <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Please enter your mobile number"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                  maxLength={10}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
             
              </div>
          
            </div>

            <Button
              btnclass="w-full"
              type="submit"
              color="indigo"
              onClick={CallOTP}
            >
              Send OTP
            </Button>
          </div>
        )}

        {verificationMode && (
          <div className="space-y-6">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    OTP sent successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Please enter the OTP received on your registered mobile
                      number.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="mobile"
                  placeholder="Please enter otp"
                  value={otp}
                  onChange={(e) => {
                    setOTP(e.target.value);
                  }}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                btnclass="w-full"
                type="submit"
                color="indigo"
                onClick={CallOTPVerify}
              >
                Submit
              </Button>

              <button
                className="w-full text-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 rounded"
                onClick={() => {
                  setVerificationMode(false);
                }}
              >
                Cancel
              </button>
            </div>
            <button
              type="button"
              onClick={CallOTP}
              className="w-full flex items-center justify-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 hover:text-indigo-800 focus:outline-none"
            >
              Click here to resend OTP
            </button>
          </div>
        )}
      </div>
    </>
  );
}
