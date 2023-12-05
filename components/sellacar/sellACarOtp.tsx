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

const SellACarOtp = ({ index }) => {
  const router = useRouter();
  const [success, setSuccess] = useState(null);
  const [count,setCount]=useState(0)
  const [verificationMode, setVerificationMode] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(null);
  const handleSetComponents = () => {};
  const { setToken } = useStore((state) => ({
    setToken: (token) => state.setToken(token),
  }));

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
    setCount((prev)=>prev+1)
    console.log("COUNT FROM CALLOTP",count);
    
    
    let isValid = true;
    if (!IsValidValue(mobile) || !IsValidMobile(mobile)) {
      setError({ text: "Please enter a valid Mobile Number" });
      isValid = false;
    }
    // the callOTPMutation to send the OTP &&  passing the mobile value as a parameter
    if (isValid) {
      const result = await callOTPMutation.mutateAsync({ mobile });
      console.log("result for otp mutation", result);

      if (result.sendUserMagicAuthLink) {
        console.log("User with this number exisists");
        // user with the provided mobile number exists.
        setVerificationMode(true);
        setSuccess({
          text: "Please enter the OTP received on your registered mobile number.",
        });
      } else {
        // console.log("entered here bcz user with such num doest exsist ");

        // user with the provided mobile number does not exist. It proceeds to create a new user using the callCreateUserMutation with the provided number
        const result2 = await callCreateUserMutation.mutateAsync({
          data: {
            mobile,
            username: "sellacar" + mobile,
            status: UserStatusType.Pending,
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

  async function CallOTPVerify() {
    console.log("enetred for otp verify   01");

    let isValid = true;
    if (!IsValidValue(otp)) {
      setError({ text: "Please enter a valid OTP." });
      isValid = false;
    }
    if (isValid) {
      console.log("enetred for otp verify   02");
      const result = await callVerifyOTP.mutateAsync({ mobile, token: otp });
      console.log("enetred for otp verify   03");
      console.log("result of verify OTP", result);

      if (result.redeemUserMagicAuthToken["token"] === undefined) {
        console.log("otp is no valid");

        setError({ text: "Please enter a valid OTP." });
      }

      if (result.redeemUserMagicAuthToken["token"]) {
        console.log("enetred for otp verify   04");
        localStorage.setItem("token", result.redeemUserMagicAuthToken["token"]);
        // localStorage.setItem(
        //     "id",
        //     result.redeemUserMagicAuthToken["item"]["id"]
        // );
        // localStorage.setItem(
        //     "status",
        //     result.redeemUserMagicAuthToken["item"]["status"]
        // );
        // localStorage.setItem(
        //     "name",
        //     result.redeemUserMagicAuthToken["item"]["firstName"]
        // );

        setToken(result.redeemUserMagicAuthToken["token"]);
        setMobile("");
        setVerificationMode(false);
        setSuccess({
          text: "You have been successfully Verified",
        });
        index(2);
      } else {
        setError({
          text: "OTP verification failed. Please contact the support team.",
        });
      }
    }
  }

  return (
    <>
      {!verificationMode && (
        <div className="p-6 mx-4 sm:max-w-lg rounded-xl sm:mx-auto  h-96 bg-white bg-opacity-75">
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
      )}

      {verificationMode && (
        <div className=" p-6 mx-4 sm:max-w-lg rounded-xl sm:mx-auto  h-96 bg-white bg-opacity-75">
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
    </>
  );
};

export default SellACarOtp;
