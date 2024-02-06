import DashboardTemplate from "../../components/templates/DashboardTemplate";
import withPrivateRoute from "../../utils/withPrivateRoute";
import Image from "next/image";
import {
  faThumbsUp,
faThumbsDown,
faUserSlash
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PostThumb1 from "@assets/blog/C1.jpg";
import PostThumb2 from "@assets/blog/C2.jpg";
import PostThumb3 from "@assets/blog/C3.jpg";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import {
  CreateBidMutationVariables,
  GetEventQuery,
  OrderDirection,
  useCreateBidMutation,
  useGetEventQuery,
  useVehiclesQuery,
  VehiclesQuery,
  QueryQueryVariables,
  useQueryQuery,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import moment from "moment";
import Swal from "sweetalert2";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Vehicle() {
  const router = useRouter();
  const { id } = router.query;
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [interval, setAPIInterval] = useState(10000);
  const [vehicle, setVehicle] = useState(null);
  const queryClient = useQueryClient();
  const [images, setImages] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [tick, setTick] = useState(0);
  const [serverTime, setserverTime] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      setAccessToken(token);
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((tic) => tic + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: timeData } = useQueryQuery<QueryQueryVariables>(
    graphQLClient(),
    {},
    { refetchInterval: 60000 }
  );

  useEffect(() => {
    if (timeData && timeData.time) {
      setTick(0);
      setserverTime(timeData.time);
    }
  }, [timeData]);
  
  const callCreateBid = useCreateBidMutation<CreateBidMutationVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` })
  );

  const { data, isLoading } = useVehiclesQuery<VehiclesQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      where: {
        id: {
          equals: id as string,
        },
      },
      take: 1,
      skip: 0,
      userVehicleBidsOrderBy2: [{ amount: OrderDirection.Desc }],
    },
    {
      cacheTime: 5,
      refetchInterval: interval,
      enabled: accessToken !== "" && id !== "",
    }
  );



  

  let [tabs] = useState({
    "General ": [],
    Registration: [],
    Insurance: [],
    "Other ": [],
  });

  useEffect(() => {
    setVehicle(
      data && data.vehicles && data.vehicles[0] ? data.vehicles[0] : null
    );
  }, [data]);

  useEffect(() => {
     
       setImages((vehicle?.frontImage)?.split(','))
  } , [vehicle]);


  
  
  async function CallBid(amount, vehicleId) {
    const confirmed = await Swal.fire({
      text: "Are you sure to bid for Rs. " + amount + "?",
      title: "BID CONFIMATION",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, bid for it!",
      customClass: {
        popup: "animated bounceInDown",
        container: "custom-swal-container",
      },
    });

    if (confirmed.isConfirmed) {
      try {
        const cc = await callCreateBid.mutateAsync({
          data: {
            amount: parseInt(amount),
            bidVehicle: {
              connect: {
                id: vehicleId,
              },
            },
          },
        });
        // console.log("cc: ", cc);
        Swal.fire("Success!", "Your bid has been submitted.", "success");
      } catch (e) {
        // console.log("EEE: ", e);
      }
    }
  }
  function IsCompleted() {
    try {
      let bidTime = data.vehicles[0].bidTimeExpire;
   
      const expiryTime = moment(bidTime);
      const currentTime = moment(serverTime).add(tick, "seconds");
      const diff = expiryTime.diff(currentTime, "seconds");
    

      if (diff > 0) {
        return true;
      } else {
        return false;
      }
    } catch {}
    return true;
  }
 

  return (
    <DashboardTemplate>
      <div className="px-6 mb-8 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Vehicle
          </h2>
        </div>
        {/* <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <MinusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Remove from watchlist
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Add to watchlist
          </button>
        </div> */}
      </div>
      <div className="mt-2 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          <section>
            <Tab.Group
              as="div"
              className="flex flex-col max-w-2xl justify-between"
            >
              <div className="w-full  max-w-3xl mx-auto sm:block">
                <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                  {images?.map((image, index) => (
                    <Tab.Panel key={image.id}>
                      <Image
                        alt={`image${index}`}
                        src={image.trim()}
                        className="w-full h-full object-center object-cover sm:rounded-lg"
                        width={500}
                        height={300}
                      />
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </div>

              <div className=" mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {images?.map((image, index) => (
                    <Tab
                      key={index}
                      className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                    >
                      {({ selected }) => (
                        <>
                          {/* <span className="sr-only">{image.name}</span> */}
                          <span className="absolute inset-0 rounded-md overflow-hidden">
                            <Image
                              alt={image}
                              src={image.trim()}
                              className="w-full h-full object-center object-cover"
                              layout="fill"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-indigo-500" : "ring-transparent",
                              "absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </Tab.Group>
          </section>

          <section>
            <div>
              <div className="mb-4 text-xl font-semibold text-gray-900">
                Specifications
              </div>
              <div className="w-full  mt-4">
                
                <Tab.Group  >
                  <Tab.List className="flex justify-between space-x-1 rounded-xl">
                  {/* <div className="flex bg-amber-500"> */}
                    {Object.keys(tabs).map((tab) => (
                      <Tab
                        key={tab}
                        className={({ selected }) =>
                          classNames(
                            "w-full px-1 rounded-lg py-2.5 text-sm font-medium leading-5 bg-gray-200",
                            "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                            selected
                              ? "bg-blue-900 text-white shadow"
                              : "text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                          )
                        }
                      >
                        {tab}
                      </Tab>
                    ))}
                    {/* </div> */}
                  </Tab.List>
              
                  <Tab.Panels className="mt-4">
                    <Tab.Panel
                      className={"rounded-xl bg-white focus:outline-none"}
                    >
                      <GeneralDetailsTab vehicle={vehicle} />
                    </Tab.Panel>
                    <Tab.Panel
                      className={"rounded-xl bg-white  focus:outline-none"}
                    >
                      <RegistrationDetailsTab vehicle={vehicle} />
                    </Tab.Panel>
                    <Tab.Panel
                      className={"rounded-xl bg-white  focus:outline-none"}
                    >
                      <InsuranceDetailsTab vehicle={vehicle} />
                    </Tab.Panel>
                    <Tab.Panel
                      className={"rounded-xl bg-white  focus:outline-none"}
                    >
                      <OtherDetailsTab vehicle={vehicle} />
                    </Tab.Panel>
                  </Tab.Panels>
              
                </Tab.Group>
                
              </div>
            </div>
          </section>
        </div>

        <section className="lg:col-start-3 lg:col-span-1">
          <div className="bg-indigo-700 rounded-lg shadow mb-6">
            <div className="px-4 py-6">
              <h2 className="text-lg font-semibold text-white">Bid Details</h2>

              <div className="space-y-2 mt-4">
                <div className="flex items-center text-sm text-gray-200">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Start Date :{" "}
                  {vehicle?.event?.startDate
                    ? moment(vehicle?.event?.startDate).format(
                        "MMMM Do, YYYY ddd h:mm a"
                      )
                    : "NA"}
                </div>
                <div className="flex items-center text-sm text-gray-200">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  End Date :{" "}
                  {vehicle?.bidTimeExpire
                    ? moment(vehicle?.bidTimeExpire).format(
                        "MMMM Do, YYYY ddd h:mm a"
                      )
                    : "NA"}
                </div>
              </div>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-200">Start Price</dt>
                  <dd className="text-sm font-medium text-gray-200">
                    {vehicle?.startPrice}
                  </dd>
                </div>
                {vehicle?.event.bidLock === "locked" ? (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-200">Current Quote</dt>
                    <dd className="text-sm font-medium text-gray-200">
                      {vehicle?.currentBidAmount ?? "N/A"}
                    </dd>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-200">Latest Quote</dt>
                    <dd className="text-sm font-medium text-gray-200">
                      {vehicle?.userVehicleBids?.length
                        ? vehicle?.userVehicleBids[0].amount
                        : "N/A"}
                    </dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-200">Rank</dt>
                  <dd className="text-sm font-medium text-gray-200">
                    {vehicle?.myBidRank}
                  </dd>
                </div>

                <div className="border-t border-indigo-600 pt-4 flex items-center justify-between">
                  <dt className="flex items-center text-sm text-gray-300">
                    <span>Your bids left</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-200">
                    {vehicle?.event?.noOfBids - vehicle?.userVehicleBidsCount}
                  </dd>
                </div>
                <div className="border-t border-indigo-600 pt-4 flex items-center justify-between">
                  <dt className="flex text-sm text-gray-200">
                    <span>No. of bids</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-200">
                    {vehicle?.totalBids}
                  </dd>
                </div>
                <div className="border-t border-indigo-600 pt-4 flex items-center justify-between">
                  <dt className="flex text-sm text-gray-200">
                    <span>Quote Increment</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-200">
                    {vehicle?.quoteIncreament}
                  </dd>
                </div>
              </dl>
              {IsCompleted() && ( 
                <input
                  className="mt-6 w-full border-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white rounded-md"
                  placeholder="Enter bid amount"
                  value={bidAmount}              
                  onChange={(e) => {
                    setBidAmount(e.target.value.replace(/\D/g, ""));
                  }}
                />
              )}
              {IsCompleted() && (
                <button
                  type="submit"
                  onClick={() =>
                    {
                      if (parseInt(bidAmount) % 100 != 0) {
                        Swal.fire({
                          title: "Bid amount should be multiple of 100",
                          confirmButtonText: "OK",
                          position: "top",
                        });
                      } else if (
                        vehicle?.event?.bidLock === "locked" &&
                        vehicle?.currentBidAmount >= parseInt(bidAmount)
                      ) {
                        Swal.fire({
                          title: "Bid amount should be greater than last bid",
                          confirmButtonText: "OK",
                          position: "top",
                        });
                      }
                      //  else if (
                      //   vehicle?.event?.bidLock != "locked" &&
                      //   vehicle?.userVehicleBids?.length &&
                      //   vehicle?.userVehicleBids[0].amount >= parseInt(bidAmount)
                      // ) {
                      //   Swal.fire({
                      //     title: "Bid amount should be greater than last bid",
                      //     confirmButtonText: "OK",
                      //     position: "top",
                      //   });
                      // }
                       else if (
                        //vehicle?.event?.bidLock === "locked" &&
                        
                        parseInt(bidAmount) %  vehicle?.quoteIncreament !==0
                      ) {
                        Swal.fire({
                          title:
                            "Bid amount should be greater than minimum quote increment.",
                          confirmButtonText: "OK",
                          position: "top",
                        });
                      }
                      // else if(   vehicle?.event?.bidLock  != "locked" &&
                      // vehicle?.userVehicleBids?.length &&
                      // vehicle.quoteIncreament >
                      //   parseInt(bidAmount) - vehicle?.userVehicleBids[0].amount){
                      //     Swal.fire({
                      //       title:
                      //         "Bid amount should be greater than minimum quote increment.",
                      //       confirmButtonText: "OK",
                      //       position: "top",
                      //     });
  
                      // }
                       else if (vehicle?.startPrice > parseInt(bidAmount)) {
                        Swal.fire({
                          title: "Bid amount should be greater than start price.",
                          confirmButtonText: "OK",
                          position: "top",
                        });
                      } else if (parseInt(bidAmount) > 2147483647) {
                        Swal.fire({
                          title: "Bid amount exceeded the limit.",
                          confirmButtonText: "OK",
                          position: "top",
                        });
                      } else {
                        CallBid(bidAmount, vehicle?.id);
                        setTimeout(() => {
                          // setBidAmount("");
                        }, 1000);
                      }
                    }
                }
                  className="mt-3 w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
                >
                  BID NOW
                </button>
              )}
              <p className=" text-sm text-indigo-100">
                {/* {vehicle?.userVehicleBidsCount && vehicle?.myBidRank ? (
                  vehicle?.myBidRank == 1 ? (
                    <span style={{ color: "#00CC00" }}>Winning</span>
                  ) : (
                    <span style={{ color: "#FF3333" }}>Losing</span>
                  )
                ) : (
                  <span style={{ color: "#CCCC00" }}>Not Enrolled</span>
                )} */}
                 <div
                  className="mt-4 w-full border-white text-center bg-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white rounded-md">
                  
                  
                 {vehicle?.userVehicleBidsCount && vehicle?.myBidRank ? (
                    vehicle?.myBidRank == 1 ? (
                     <p className="text-green-500 font-bold text-base space-x-1"><FontAwesomeIcon icon={faThumbsUp} /> <span className="text-green-500"> Winning</span></p>
                    ) : (
                     <p className="text-red-500 font-bold text-base space-x-1"><FontAwesomeIcon icon={faThumbsDown} /> <span style={{ color: "#FF3333" }}>Losing</span></p>
                    )
                  ) : (
                    <p className="text-black font-bold text-base space-x-1"><FontAwesomeIcon icon={faUserSlash} /><span className="text-black"> Not  Enrolled </span></p>
                  )}              
               
               </div>
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardTemplate>
  );
}

export default withPrivateRoute(Vehicle);

function GeneralDetailsTab(props) {
  return (
    <div className="border border-gray-200 px-4 py-5 sm:p-0 rounded">
      <dl className="sm:divide-y sm:divide-gray-200">
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Power Steering</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.powerSteering}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.fuel}
          </dd>
        </div>

        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Transmission</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.gearBox}
          </dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Shape</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.shape}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Color</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.color}
          </dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Year of Manufacure
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.yearOfManufacture}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Maker</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.make}
          </dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">State</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.state}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">City</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.city}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Yard Name</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.yardLocation}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Yard Location</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.veicleLocation}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function RegistrationDetailsTab(props) {
  return (
    <div className="border border-gray-200 px-4 py-5 sm:p-0 rounded">
      <dl className="sm:divide-y sm:divide-gray-200">
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Reg No.</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.registrationNumber}
          </dd>
        </div>

        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Engine No.</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.engineNo}
          </dd>
        </div>

        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Chassis No.</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.chassisNo}
          </dd>
        </div>

        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Odometer</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.kmReading}
          </dd>
        </div>

        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Date of Registration
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.dateOfRegistration
              ? moment(props?.vehicle?.dateOfRegistration).format(
                  "MMMM Do, YYYY"
                )
              : ""}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function InsuranceDetailsTab(props) {
  return (
    <div className="border border-gray-200 px-4 py-5 sm:p-0 rounded">
      <dl className="sm:divide-y sm:divide-gray-200">
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Insurance Status
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.insuranceStatus}
          </dd>
        </div>

        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Insurance Type</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.insurance}
          </dd>
        </div>

        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Insurance Valid Till
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.insuranceValidTill
              ? moment(props?.vehicle?.insuranceValidTill).format(
                  "MMMM Do, YYYY"
                )
              : ""}
          </dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Tax</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.tax}
          </dd>
        </div>

        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Tax Validity Date
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.taxValidityDate
              ? moment(props?.vehicle?.taxValidityDate).format("MMMM Do, YYYY")
              : ""}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function OtherDetailsTab(props) {
  return (
    <div className="border border-gray-200 px-4 py-5 sm:p-0 rounded">
      <dl className="sm:divide-y sm:divide-gray-200">
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Hypothication</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.hypothication}
          </dd>
        </div>

        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Climate Control</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.climateControl}
          </dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Door Count</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.doorCount}
          </dd>
        </div>

        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Vehicle Condition
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.vehicleCondition}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Payment Terms</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.paymentTerms}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Autobse Contact Person
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.autobse_contact_person}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Autobse Contact Number
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.autobseContact}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.registeredOwnerName}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Repo Date</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.repoDt
              ? moment(props?.vehicle?.repoDt).format("MMMM Do, YYYY")
              : ""}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Loan Agreement Number
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.loanAgreementNo}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Buyer Fees</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.buyerFees}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Parking Charge</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.parkingCharges}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Parking Rate</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.parkingRate}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Client Contact Person
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.clientContactPerson}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Client Contact Number
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.clientContactNo}
          </dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            Additional Remarks
          </dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {props?.vehicle?.additionalRemarks}
          </dd>
        </div>
      </dl>
    </div>
  );
}