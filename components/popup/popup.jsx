// components/EventPopup.js
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faHome, faUser,faTimes ,faRupeeSign  } from "@fortawesome/free-solid-svg-icons";

const PaymentPopup = ({  onClose }) => {
    return (
      <div className="fixed w-full inset-0 flex items-center justify-center  bg-black bg-opacity-50">
        <div className=" w-96 p-4 rounded-lg  grid grid-cols-1 ">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="col-span-1 w-full rounded-lg bg-gray-300 p-4 text-center flex flex-col space-y-9 mx-auto justify-center items-center  ">
           <div>
           <h2 className="text-lg font-normal">Subscribe for 3 month @</h2>
            <p className=" text-lg font-bold"> <span>₹</span>1900</p>
           </div>
           {/* <div className="w-full h-fit   "> */}
           {/* <button className="py-2 px-4 rounded-lg text-white bg-blue-400">subscribe</button> */}
           
           <Link href="/payments">
                      <a
                        href="#"
                        className="py-1 space-x-2 rounded-md px-4 bg-sky-600 text-white border outline-none hover:bg-sky-900"
                        aria-describedby="tier-growth"
                      >
                        <span>
                          {" "}
                         
                        </span>{" "}
                        <span> Make Payment</span>
                      </a>
                    </Link>
           {/* </div> */}
        

          </div>
          {/* <h2 className="text-md">3 months</h2> */}
       
       <button
            className="col-span-1 mt-4 rounded-full bg-gray-100 hover:bg-gray-500 text-white px-4 py-2 "
            onClick={onClose}
          >
          <span className="text-zinc-400 "> <FontAwesomeIcon icon={faTimes} /></span>
          </button>
       </div>
        </div>
      </div>
    );
  };
  
  export default PaymentPopup;
  