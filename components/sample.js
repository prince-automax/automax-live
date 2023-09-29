import { Popover } from "@headlessui/react";
import Link from "next/link";
import { XIcon } from "@heroicons/react/solid";

function YourComponent({ navigation, token, logout }) {
  return (
    // <Popover>
    //   {({ open }) => (
    //     <>
    //       <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
    //         <div className="px-5 pt-4 flex items-center justify-between">
    //           {/* <Logo /> */}
    //           <div className="-mr-2">
    //             <Popover.Button
    //               onClick={() => open(false)} // Close the popover on button click
    //               className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
    //             >
    //               <span className="sr-only">Close menu</span>
    //               <XIcon className="h-6 w-6" aria-hidden="true" />
    //             </Popover.Button>
    //           </div>
    //         </div>
    //         <div className="px-2 pt-2 pb-3 space-y-1">
    //           {navigation.map((item) => (
    //             <Link href={item.href} key={item.name}>
    //               <a
    //                 onClick={() => open(false)} // Close the popover on item click
    //                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    //               >
    //                 {item.name}
    //               </a>
    //             </Link>
    //           ))}
    //         </div>
    //         <div className="flex justify-between">
    //           {token ? (
    //             <button
    //               onClick={() => {
    //                 open(false); // Close the popover on button click
    //                 logout();
    //               }}
    //               className="block w-full px-5 py-3 text-center text-sm font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
    //             >
    //               Logout
    //             </button>
    //           ) : (
    //             <>
    //               <Link href="/register">
    //                 <a
    //                   onClick={() => open(false)} // Close the popover on item click
    //                   className="block w-full px-5 py-3 text-center text-sm font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100 "
    //                 >
    //                   Become a dealer
    //                 </a>
    //               </Link>
    //               <Link href="/login">
    //                 <a
    //                   onClick={() => open(false)} // Close the popover on item click
    //                   className="block w-full px-5 py-3 text-center text-sm font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100 "
    //                 >
    //                   Log in
    //                 </a>
    //               </Link>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </>
    //   )}
    // </Popover>

    <>
    <div className="col-span-3 border border-gray-400 text-center">
            <div className=" max-w-xl border border-sky-300 my-4 mx-4 sm:mx-auto  bg-slate-100 h-60 space-y-4 pb-2 flex flex-col justify-center items-center">
          <div className="">
          <h1 className="text-base sm:text-lg m-2">
                Only subscriber can view Auction Details and Documents. If you
                are a Subscriber
              </h1>
              <button className="py-1 px-4 bg-sky-600 text-white border">
                Log In
              </button>
              <div className="flex justify-center items-center space-x-4 mt-5">
                <div className=" w-20 sm:w-60 h-px bg-slate-300" />
                <div className="items-baseline">OR</div>
                <div className="w-20 sm:w-60 h-px bg-slate-300" />
              </div>
              <button className="py-1 px-4  bg-teal-500 text-white border ">
                Register
              </button>
          </div>
          </div>
          </div>
    </>
  );
}

export default YourComponent;
