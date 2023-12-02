import React from "react";

;

const SellACarOtpVerification = ({index}) => {
  console.log("reached here in sellacarotp comp");
  const handleSetComponents = () => {
      console.log("reached here");
    // You can call the setComponents function here
    index(3);
  };

  return (
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
            className="w-full h-full p-2  border-none focus:ring-0 outline-0 bg-[#3071F01A]  bg-opacity-75 text-base sm:text-xl text-center  tracking-widest "
          />
        </div>
        <div className="w-[111px] text-center mb-6 bg-slate-600">
          <button
          onClick={()=>handleSetComponents()}
            btnclass="w-full"
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
          <a
            className="text-center text-xs sm:text-lg  font-inter font-normal text-[#135A9E] "
            href=""
          >
            Resend
          </a>
        </div>

        {/* button */}
      </div>
    </div>
  );
};

export default SellACarOtpVerification;
