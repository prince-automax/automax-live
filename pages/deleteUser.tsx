import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/solid";
import graphQLClient from "@utils/useGQLQuery";
import { IsValidValue, IsValidMobile } from "../utils/validations";
import useStore from "../utils/store";
import Swal from "sweetalert2";
import DeleteUsermodal from "../components/deleteUser/deleteUserModal"
import Image from "next/image";
import deleteImage from "../public/assets/del4.jpg";

import {
  CreateUserMutationVariables,
  SendOtpMutationVariables,
  useCreateUserMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  VerifyOtpMutationVariables,
  UserStatusType,
} from "@utils/graphql";
const DeleteUser = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(null);
  const [count, setCount] = useState(0);
  const [verificationMode, setVerificationMode] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [otpVerification, setOtpVerification] = useState(true );
  const [isModalOpen, setModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [usrid, setUsrid] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      console.log("token from local",token);
      

      setAccessToken(token);
      setUserId(id);
      setUsrid(id);

      if(token){
        console.log('inside if condition');
        
        console.log('access',accessToken);
         
        setOtpVerification(false)
        setDeleteMessage(true);
      }
    }
  }, []);


  useEffect(()=>{
 console.log('in useseffect');
 
    if(accessToken){
      console.log('inside if condition');
      
      console.log('access',accessToken);
       
      setOtpVerification(false)
      setDeleteMessage(true);
    }

  },[])

  const handleDeleteButtonClick = () => {
    setModalOpen(true);
  };

  const { setToken } = useStore((state) => ({
    setToken: (token) => state.setToken(token),
  }));


  const handleCancel = () => {
   
    router.push('/')
  };







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

  async function CallOTP() {
    let isValid = true;
    if (!IsValidValue(mobile) || !IsValidMobile(mobile)) {
      setError({ text: "Please enter a valid Mobile Number" });
      isValid = false;
    }
    if (isValid) {
      const result = await callOTPMutation.mutateAsync({ mobile });

      if (result.sendUserMagicAuthLink) {
        setVerificationMode(true);
        setSuccess({
          text: "Please enter the OTP received on your registered mobile number.",
        });
      } else {
        alert("no such user exsist");
      }
      //   else {

      //     const result2 = await callCreateUserMutation.mutateAsync({
      //       data: {
      //         mobile,
      //         username: "sellacar" + mobile,
      //         status: UserStatusType.Pending,
      //       },
      //     });

      //     if (!result2.createUser?.id) {
      //       setVerificationMode(false);
      //       setError({
      //         text: "Unable to send OTP. Please contact the support team.",
      //       });
      //     }

      //     const result3 = await callOTPMutation.mutateAsync({ mobile });
      //     if (result3.sendUserMagicAuthLink) {
      //       setVerificationMode(true);
      //       setSuccess({
      //         text: "Please enter the OTP received on your registered mobile number.",
      //       });
      //     } else {
      //       setVerificationMode(false);
      //       setError({
      //         text: "Unable to send OTP. Please contact the support team.",
      //       });
      //     }
      //   }
    }
  }

  async function CallOTPVerify() {
    console.log("enetred for otp verify   01");

    let isValid = true;
    if (!IsValidValue(otp)) {
      setError({ text: "Please enter a valid OTP." });
      isValid = false;
    }
    if (isValid) {
      const result = await callVerifyOTP.mutateAsync({ mobile, token: otp });

      if (result.redeemUserMagicAuthToken["token"] === undefined) {
        console.log("otp is no valid");

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
        setOtpVerification(false)
        setDeleteMessage(true);
        setSuccess({
          text: "You have been successfully Verified",
        });
      } else {
        setError({
          text: "OTP verification failed. Please contact the support team.",
        });
      }
    }
  }

  return (
    <>
      {otpVerification && (
        <div className="w-full h-screen flex justify-center items-center bg-gray-200 ">
     
          {!verificationMode && (
            <div className="p-6 flex items-center justify-center  border sm:my-auto  max-sm:ml-6  sm:max-w-lg rounded-xl sm:mx-auto  shadow-xl mt-6 bg-white bg-opacity-75">
            <div>
            <div className="space-y-6 flex flex-col justify-center items-center h-full">
                <h1 className="w-80  text-center font-extrabold text-xl sm:text-4xl ">
                  OTP Verification
                </h1>

                <div className="w-60 sm:w-96 ">
                  {" "}
                  <p className="text-center text-xs sm:text-lg text-[#9B9B9B] font-poppins font-normal ">
                    We will send you a one time password on this number
                  </p>
                </div>

                {/* input and span  */}
                <div className=" flex items-center justify-center text-center border border-slate-200 w-64 sm:w-[380px] sm:h-[60px] rounded-xl bg-[#3071F01A] bg-opacity-75 overflow-hidden">
                  <span className=" flex items-center   p-2 text-gray-500  bg-[#3071F01A] bg-opacity-100  h-full text-start sm:text-xl  ">
                    +91
                  </span>

                  <input
                    type="text"
                    name="mobile"
                    placeholder="Please enter your mobile number"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                    }}
                    maxLength={10}
                    className="w-full h-full p-2  border-none focus:ring-0 outline-0 bg-[#3071F01A]  bg-opacity-75 text-base sm:text-xl sm:text-start tracking-widest  placeholder:text-base"
                  />
                </div>
                {/* button */}
                <div className="w-[111px] text-center">
                  <button
                    type="submit"
                    color="indigo"
                    onClick={CallOTP}
                    className="text-white bg-[#135A9E] p-2 rounded-lg font-bold font-poppins text-sm  w-full "
                  >
                    Get Otp
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}

          {verificationMode && (
            <div className=" p-6 mx-4 max-sm:ml-10 sm:max-w-lg rounded-xl sm:mx-auto  h-96 bg-white bg-opacity-75">
              <div className="space-y-6 flex flex-col justify-center items-center h-full">
                <h1 className="w-80 sm:w-96  text-center font-extrabold text-xl sm:text-3xl ">
                  Enter Verification Code
                </h1>

                <div className="w-60 sm:w-96 ">
                  {" "}
                  <p className="text-center text-xs sm:text-lg text-[#9B9B9B] font-poppins font-normal ">
                    We have send you a OTP Verification to your mobile Number
                  </p>
                </div>

                {/* input and span  */}
                <div className=" flex items-center justify-center text-center border border-slate-200 w-64 sm:w-[380px] sm:h-[55px] rounded-xl bg-[#3071F01A] bg-opacity-75 overflow-hidden">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Please enter otp"
                    value={otp}
                    onChange={(e) => {
                      setOTP(e.target.value);
                    }}
                    className="w-full h-full p-2  border-none focus:ring-0 outline-0 bg-[#3071F01A]  bg-opacity-75 text-base sm:text-xl text-center  tracking-widest "
                  />
                </div>
                <div className="w-[111px] text-center mb-6 bg-slate-600">
                  <button
                    onClick={CallOTPVerify}
                    type="submit"
                    color="indigo"
                    className="text-white bg-[#135A9E]  hover:bg-[#6693e6]  p-2  shadow-md cursor-pointer font-bold font-poppins text-sm  w-full  "
                  >
                    Verify
                  </button>
                </div>

                <div className="w-60 sm:w-96 flex gap-2 pt-2 justify-center items-center  ">
                  <p className="text-center text-xs sm:text-lg text-black font-inter font-normal ">
                    Not Received the code ?
                  </p>
                  <button
                    className="text-center text-xs sm:text-lg  font-inter font-normal text-[#135A9E] "
                    onClick={CallOTP}
                  >
                    Resend
                  </button>
                </div>

                {/* button */}
              </div>
            </div>
          )}
        </div>
      )}

      {deleteMessage && (
        
          // <div><DeleteUsermodal/></div>
          <>
            <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Delete Your Account</h1>
        <p className="text-gray-700 mb-4">
       Deleting your account
          will result in the following consequences:
        </p>
        <ul className="list-disc pl-5">
          <li className="mb-2">Loss of all account data and information.</li>
          <li className="mb-2">
            Inability to access your account in the future.
          </li>
          <li className="mb-2">
            Termination of any active subscriptions or services associated with
            your account.
          </li>
        </ul>
        <p className="text-red-500 mt-4">
          This action is irreversible. Please consider the consequences before
          proceeding.
        </p>
        <div className="mt-6 space-x-4 ">
          <button onClick={handleDeleteButtonClick} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete My Account
          </button>
          <button onClick={handleCancel} className="bg-green-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
        {isModalOpen && <DeleteUsermodal isModalOpend={isModalOpen}  closeModals={() => setModalOpen(false)} />}
      </div>
    </div></>
        
      )}
    </>
  );
};

export default DeleteUser;
