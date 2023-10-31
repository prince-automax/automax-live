import React from 'react'

const SellACarOtp = () => {
    return (


        <div className=' mx-4 sm:max-w-lg rounded-xl sm:mx-auto  h-96 bg-white bg-opacity-75'>
            <div className="space-y-6 flex flex-col justify-center items-center h-full">
              
                <h1 className='w-80  text-center font-extrabold text-xl sm:text-4xl '>Otp Verification</h1>


                 <div className='w-60 sm:w-96 '>   <p className='text-center text-xs sm:text-lg text-[#9B9B9B] font-poppins font-normal '>We will send you a one time password on this number</p></div>


                {/* input and span  */}
                <div className=' flex items-center justify-center text-center border border-slate-200 w-64 sm:w-[380px] sm:h-[60px] rounded-xl bg-[#3071F01A] bg-opacity-75 overflow-hidden'>
                    <span className=" flex items-center   p-2 text-gray-500  bg-[#3071F01A] bg-opacity-100  h-full text-start sm:text-xl  ">+91</span>

                    <input type="text" maxLength={10} className="w-full h-full p-2  border-none focus:ring-0 outline-0 bg-[#3071F01A]  bg-opacity-75 text-base sm:text-xl sm:text-start tracking-widest " />

                </div>
                {/* button */}
                <div className='w-[111px] text-center'>
                    <button
                        btnclass="w-full"
                        type="submit"
                        color="indigo"
                        className='text-white bg-[#135A9E] p-2 rounded-lg font-bold font-poppins text-sm  w-full '>
                        Get Otp
                    </button>
                </div>
            </div>
        </div>

    )
}

export default SellACarOtp