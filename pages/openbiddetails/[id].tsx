import React from "react";
import moment from "moment";
import Image from "next/image";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PaymentPopup from "../../components/popup/popup";
import Logo from "../../components/ui/Logo";
import LogoImage from '@assets/logo.png'

import {
  useFindAuctionsQuery,
  FindAuctionsQueryVariables,
  useGetUserQuery,
  GetUserQueryVariables,
  OrderDirection,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
// import Router from "next/router";
import Link from "next/link";
import {
  CalendarIcon,
  DocumentDownloadIcon,
  PrinterIcon,
} from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../utils/store";
import withPrivateRoute from "../../utils/withPrivateRoute";


const OpenBidDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [token, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [openBidPayment, setOpenBidPayment] = useState(false);
  const [openBidPaymentStatus, setOpenBidPaymentStatus] = useState();
  const [hasOpenBidPayment,setHasOpenBidPayment]=useState(false)
  const [showPopup,setShowPopup]=useState(false)
  

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      setAccessToken(token);
      setUserId(id);
    }
  }, []);

 

  const { data: userData, isLoading: loading } =
    useGetUserQuery<GetUserQueryVariables>(
      graphQLClient({ Authorization: `Bearer ${token}` }),
      {
        where: {
          id: userId,
        },
      },
      {
        enabled: token !== "",
      }
    );

  const payment = userData ? userData["user"]?.payments : "";

  
  useEffect(() => {
    if (payment) {
      payment?.map((item) => {
        if (item.paymentFor === "openBids" ) {
          setHasOpenBidPayment(true)
          if (item.status === "success" && new Date().toISOString() <= item.RegistrationExpire) {
            setOpenBidPayment(true);
          } else {
            setOpenBidPaymentStatus(item.status);
           
            
          }

         
        } else {
         
        }
      });
    }
  }, [payment]);



  const { data, isLoading, refetch } =
    useFindAuctionsQuery<FindAuctionsQueryVariables>(graphQLClient(), {
      skip: 0,
    take: 10,
    orderBy: [
      {
        listingId:OrderDirection.Desc,
      },
    ],
    
      where: {
        id: {
          equals: id as string,
        },
      },
    });

  
 
  const listingId = (data as { findAuctions?: any[] })?.findAuctions?.map((item,index)=> item.listingId)






  return (
    <>
      <div className="max-w-4xl md:max-w-5xl mx-auto my-10   ">
        <div className=" mx-4 my-6 ">
          <h2 className="text-2xl font-semibold text-black ">
            Autobse Listing ID {listingId} Details
          </h2>
        </div>
        <div className="w-full h-px bg-gray-300 my-4  " />

        <div className="grid grid-cols-1  mx-4 border ">
          <div>
            {(data as { findAuctions?: any[] })?.findAuctions?.map(
              (item, index) => (
                <div key={index}>
                  <div className="space-y-2 py-3 px-3 md:grid md:grid-cols-2 border  ">
                    <p className="text-base font-semibold tracking-wide">
                      Lisiting ID
                    </p>
                    <p className="text-base font-semibold tracking-wide">
                      {item.listingId}
                    </p>
                  </div>
                  <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border  ">
                    <p className="text-base font-semibold tracking-wide">
                      Institution
                    </p>
                    <p className="text-base font-normal tracking-wide text-gray-800">
                      {item.institution_details.name}
                    </p>
                  </div>
                  <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                    <p className="text-base font-semibold tracking-wide">
                      Asset Type
                    </p>
                    <p className="text-base font-normal tracking-wide text-gray-800">
                      {item.propertyType}
                    </p>
                  </div>
                  <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                    <p className="text-base font-semibold tracking-wide">
                      Asset Location
                    </p>
                    <p className="text-base font-normal tracking-wide text-gray-800">
                      {item.address}
                    </p>
                  </div>
                  <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                    <p className="text-base font-semibold tracking-wide">
                      City
                    </p>
                    <p className="text-base font-normal tracking-wide text-gray-800">
                      {item.city}
                    </p>
                  </div>
   {token &&
                  <div>
                    
                    {hasOpenBidPayment ? openBidPayment ? (
                      <div>
                        <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                          <p className="text-base font-semibold tracking-wide">
                            Reserve Price
                          </p>
                          <p className="text-base font-normal tracking-wide text-gray-800">
                            {item.reservePrice ? item.reservePrice : "-"}
                          </p>
                        </div>
                        <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                          <p className="text-base font-semibold tracking-wide">
                            Auction StartDate
                          </p>
                          <p>{Format(item?.auctionStartDate)}</p>
                        </div>
                        <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                          <p className="text-base font-semibold tracking-wide">
                            Auction StartDate
                          </p>
                          <p>{Format(item?.auctionEndtDate)}</p>
                        </div>
                      
                        <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                          <p className="text-base font-semibold tracking-wide">
                            Contact Details
                          </p>
                          <p className="text-base font-normal tracking-wide text-gray-800">
                            {item.contactDetails ? item.contactDetails : "-"}
                          </p>
                        </div>
                        <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                          <p className="text-base font-semibold tracking-wide">
                            Emd Amount
                          </p>
                          <p className="text-base font-normal tracking-wide text-gray-800">
                            {item.emdAmount ? item.emdAmount : "-"}
                          </p>
                        </div>
                        <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                          <p className="text-base font-semibold tracking-wide">
                            Emd submission Date
                          </p>
                          <p className="text-base font-normal tracking-wide text-gray-800">
                            {Format(item.emdSubmissionDate)}
                          </p>
                        </div>
                        <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
                          <p className="text-base font-semibold tracking-wide">
                            Auction Notice
                          </p>
                          <p className="text-base font-normal tracking-wide text-gray-800">
                            {item.auctionNotice ? DownloadButton(item.auctionNotice) : "-"}
                          </p>
                        </div>
                    
                      </div>
                    ) : (
                      <div className="col-span-1 md:col-span-2 border max-lg:px-2  text-center">
                        <div className=" max-w-4xl  shadow-xl my-4 mx-auto  rounded-lg bg-[#f5f5f5]  h-60 space-y-4 pb-2 flex flex-col justify-center items-center">
                          <div className="space-y-5">
                         <div className="w-72  bg-white rounded-md   mx-auto">
                         <Image
                    src={LogoImage}
                    alt="auto bse"
                    width={200}
                    height={60}
                   
                />
                         </div>
                            <h1
                              id="tier-growth "
                              className="text-base sm:text-lg m-2"
                            >
                              <span className="text-lg text-black font-serif	 uppercase font-semibold">
                                {" "}
                                your Payment for Open Bids Subscription{" "}
                              </span>
                              :{" "}
                              <span className="text-lg animate-pulse font-bold uppercase">
                                {openBidPaymentStatus}
                              </span>
                            </h1>
                          </div>
                        </div>
                      </div>
                    ):( 
                    <div className="col-span-1 md:col-span-2 border max-lg:px-2  text-center ">
                    <div className=" max-w-4xl  my-4 mx-auto   h-60 space-y-4 pb-2 flex flex-col justify-center items-center  bg-[#f5f5f5]">
                      <div className="space-y-5">
                      <div className="shadow-lg max-sm:w-60 w-80 mt-6 bg-white  mx-auto">
                      <Image
                    src={LogoImage}
                    alt="auto bse"
                    width={100}
                    height={60}
                />
                    </div>
                        <h1
                          id="tier-growth "
                          className="text-base sm:text-lg m-2"
                        >
                          <span className="max-sm:text-sm text-lg tracking-wider text-black font-serif uppercase font-semibold ">
                            {" "}
                           please make the payment to see the full details{" "}
                          </span>
                         
                        </h1>
                        <div className="h-full">
                          <button className="bg-green-700 mb-4 hover:bg-slate-600 hover:scale-105 transform transition-transform duration-300 ease-linear text-white px-4 py-2 rounded-lg"
        onClick={togglePopup}>View Payment</button>
        {showPopup && <PaymentPopup onClose={togglePopup} />}
                         </div>
                      </div>
                    </div>
                  </div>)}
                  </div>
            }
                </div>
              )
            )}
          </div>

          {!token && (
            <div className="col-span-1 md:col-span-2 border max-lg:px-2  text-center">
              <div className=" max-w-4xl border border-sky-300 my-4 mx-auto  bg-slate-100 h-60 space-y-4 pb-2 flex flex-col justify-center items-center">
                <div className="space-y-5">
                  <h1 id="tier-growth " className="text-base sm:text-lg m-2">
                    Only subscriber can view Auction Details and Documents. If
                    you are a Subscriber
                  </h1>
                  <div>
                    <Link href="/login">
                      <a
                        href="#"
                        className="py-1 space-x-2  px-4 bg-sky-600 text-white border"
                        aria-describedby="tier-growth"
                      >
                        <span>
                          {" "}
                          <FontAwesomeIcon icon={faUser} />
                        </span>{" "}
                        <span> Log In</span>
                      </a>
                    </Link>
                  </div>

                  <div className="flex justify-center items-center space-x-4 mt-5">
                    <div className=" w-20 sm:w-60 h-px bg-slate-300" />
                    <div className="items-baseline">OR</div>
                    <div className="w-20 sm:w-60 h-px bg-slate-300" />
                  </div>
                  <h1 id="tier-growth " className="text-base sm:text-lg m-2">
                    If not a subscriber please Register and subscribe the
                    service by making payment{" "}
                  </h1>
                  <div>
                    <Link href="/register">
                      <a
                        href="#"
                        className="py-1 space-x-2 px-4  bg-teal-500 text-white border "
                        aria-describedby="tier-growth"
                      >
                        <span>
                          {" "}
                          <FontAwesomeIcon icon={faUser} />
                        </span>{" "}
                        <span> Register</span>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default withPrivateRoute(OpenBidDetails);


const DownloadButton = (file) => {

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file;
    link.target = '_blank'; // Open the link in a new tab
    link.download = '.jpg'; // Set the filename for the downloaded image
    link.click();
};

return (
    <div>
        {/* <img src={file} alt="Image to download" /> */}
        <button className="" onClick={handleDownload}>   <DocumentDownloadIcon className=" h-8 w-8 text-gray-600 hover:text-green-600  rounded-md" ></DocumentDownloadIcon></button>
    </div>
);
}



function Format(value) {
  return (
    <div>
      <div className="flex space-x-2">
        <div className="space-y-1 font-medium">
          <div className="text-base font-normal tracking-wide text-gray-800">
            <span>{moment(value).format("MMMM Do, YYYY")}</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-200 rounded">
            {/* <span className="text-left">
              {moment(value).format("ddd h:mm a")}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
