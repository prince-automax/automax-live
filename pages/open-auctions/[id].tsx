import { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import DashboardTemplate from "../../components/templates/DashboardTemplate";
import {
  CalendarIcon,
  ChipIcon,
  CollectionIcon,
  DocumentTextIcon,
  FastForwardIcon,
  FireIcon,
  FolderIcon,
  LocationMarkerIcon,
  TrendingUpIcon,
  UserIcon,
} from "@heroicons/react/outline";
import {
  faThumbsUp,
  faThumbsDown,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import withPrivateRoute from "../../utils/withPrivateRoute";
import Image from "next/image";
import PostThumb1 from "@assets/blog/C1.jpg";
import PostThumb2 from "@assets/blog/C2.jpg";
import PostThumb3 from "@assets/blog/C3.jpg";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import moment from "moment";
import graphQLClient from "@utils/useGQLQuery";
import {
  useOpenAuctionVehiclesQuery,
  OpenAuctionVehiclesQuery,
  useCreateBidMutation,
  CreateBidMutationVariables,
  QueryQueryVariables,
  useQueryQuery,
  OrderDirection,
  useSudoBidsQuery,
  SudoBidsQuery,
} from "@utils/graphql";
import ImageCarouselModal from "@components/modals/ImageCarouselModal";

import Swal from "sweetalert2";

const incrementAmounts = [
  {
    id: 1,
    label: "500",
    value: 500,
  },
  {
    id: 2,
    label: "1,000",
    value: 1000,
  },

  {
    id: 3,
    label: "2,000",
    value: 2000,
  },
  {
    id: 4,
    label: "5,000",
    value: 5000,
  },
  {
    id: 5,
    label: "10,000",
    value: 10000,
  },
  {
    id: 6,
    label: "15,000",
    value: 15000,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function OpenAuctions() {
  const router = useRouter();
  const { id } = router.query;
  const [accessToken, setAccessToken] = useState("");
  const [rInterval, setRInterval] = useState(5000);
  const [liveItem, setLiveItem] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [tick, setTick] = useState(0);
  const [serverTime, setserverTime] = useState(null);
  const [showImageCarouselModal, setShowImageCarouselModal] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      setAccessToken(token);
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

  const { data, isLoading } =
    useOpenAuctionVehiclesQuery<OpenAuctionVehiclesQuery>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` }),
      {
        where: {
          event: {
            id: {
              equals: id ? id.toString() : "",
            },
          },
        },
      },
      {
        cacheTime: 5,
        refetchInterval: rInterval,
        enabled: id !== undefined && id != "" && accessToken !== "",
      }
    );

    console.log('open auction',data);
    

  // let duration=data?.vehicles[0]?.event?.gapInBetweenVehicles

  const { data: bidHistory } = useSudoBidsQuery<SudoBidsQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      where: {
        bidVehicle: {
          id: {
            equals:
              liveItem && liveItem.id && liveItem.id !== undefined
                ? liveItem.id
                : "",
          },
        },
      },
    },
    {
      cacheTime: 5,
      refetchInterval: 7500,
      enabled:
        liveItem != null && liveItem.id != null && liveItem.id != undefined,
    }
  );

  function compare(a, b) {
    if (a.bidStartTime < b.bidStartTime) {
      return -1;
    }
    if (a.bidStartTime > b.bidStartTime) {
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    if (data && data.vehicles.length > 0) {
      const startAmnt = data?.vehicles[0]?.startBidAmount;

      const live = data?.vehicles.find(
        (element) => element.vehicleEventStatus == "live"
      );

      const upcomingVehicles = data.vehicles.filter(
        (element) => element.vehicleEventStatus == "upcoming"
      );
      const sortedUpcoming = upcomingVehicles.sort(compare);
      setUpcoming(sortedUpcoming);
      //   bidStartTime;
      if (live) {
        setLiveItem(live);

        // if(live?.startPrice>bidAmount)
        // {
        const strtprice =
          live.currentBidAmount !== 0
            ? live.currentBidAmount
            : live.startBidAmount;

        setBidAmount(strtprice);
        // }
      } else {
        setLiveItem(null);
      }
    } else {
      setLiveItem(null);
    }
  }, [data]);

  console.log('LIVE ITEM', liveItem);
  

  const callCreateBid = useCreateBidMutation<CreateBidMutationVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` })
  );

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

    if (confirmed.value) {
      callCreateBid
        .mutateAsync({
          data: {
            amount: parseInt(amount),
            bidVehicle: {
              connect: {
                id: vehicleId,
              },
            },
          },
        })
        .then(() => {
          Swal.fire("Success!", "Your bid has been submitted.", "success");
        })
        .catch((error) => {
          // Handle the error
          Swal.fire("Error!", error.message, "error");
        });
    }
  }

  function SecondsLeft() {
    // expiry - server + tick
    try {
      if (liveItem) {
        const expiryTime = moment(liveItem.bidTimeExpire);
        const currentTime = moment(serverTime).add(tick, "seconds");
        const diff = expiryTime.diff(currentTime, "seconds");

        if (diff > 0) return moment.utc(diff * 1000).format("HH:mm:ss");
        else return "00:00:00";
      }
      return "00:00:00";
    } catch {
      return "00:00:00";
    }
  }

  function upcomingSecondsLeft() {
    let noUpcoming = "no upcoming left";
    try {
      if (upcoming[0]) {
        let count = upcoming[0].length;
        let string = count + "";

        const startTime = moment(upcoming[0].bidStartTime);
        const currentTime = moment(serverTime).add(tick, "seconds");
        const diff = startTime.diff(currentTime, "seconds");
        if (diff > 0) return moment.utc(diff * 1000).format("HH:mm:ss");
        else return "00:00:00";
      }
      return noUpcoming;
    } catch (error) {
      console.log(error.message);

      return "00:00:00";
    }
  }

  function BindVehicleImage(vehicle) {
    if (vehicle) {
      const tempImages = [];
      let count = 0;
      if (vehicle.frontImage !== "") {
        tempImages.push({
          id: 1,
          name: "Front Image",
          src: vehicle.frontImage,
          alt: "Front Image.",
        });
      }
      if (vehicle.backImage !== "") {
        tempImages.push({
          id: 2,
          name: "Back Image",
          src: vehicle.backImage,
          alt: "Back Image.",
        });
      }
      if (vehicle.leftImage !== "") {
        tempImages.push({
          id: 3,
          name: "Left Image",
          src: vehicle.leftImage,
          alt: "Left Image.",
        });
      }
      if (vehicle.rightImage !== "") {
        tempImages.push({
          id: 4,
          name: "Right Image",
          src: vehicle.rightImage,
          alt: "Right Image.",
        });
      }

      setImages(tempImages);
    } else {
      setImages([]);
    }
  }

  let [vehicleDetails] = useState({
    Specification: [],
    Details: [],
  });

  const options = {
    type: "loop",
    gap: "1rem",
    autoplay: true,
    pauseOnHover: false,
    resetProgress: false,
    pagination: false,
  };

  const handleBidAmount = (price) => {
    setBidAmount(bidAmount + price);
  };


  console.log('upcoming',upcoming);
  
  return (
    <DashboardTemplate>
      {/* {data && data.vehicles[0].event?.status ==='active' ? */}
      <>
        {liveItem ? (
          <>
            {/* FOR MOBILE VEIW ONLY */}
            <div className="  border    md:px-3 px-2 py-5">
              {/* Page header */}
              <div className="lg:hidden">
                <div className="flex items-center space-x-5">
                  <div className="mt-3">
                    <h1 className="text-base font-bold text-gray-900 pl-3">
                    {liveItem.event.seller.name}
                    </h1>
                  </div>
                  
                  {/* <div className=" block md:flex md:items-start md:justify-between md:space-x-5">
          
        </div> */}
                </div>
              </div>
              
                <div className=" mx-auto grid grid-cols-1 lg:gap-x-16 gap-6 md:grid-cols-2  ">
                {/* Next Vehicles Details */}
                {upcoming[0]?.frontImage && (
                <section className="max-lg:space-y-2  max-md:row-start-7  md:col-start-1 pl-1 ">
                  <div className="text-lg font-semibold pl-3 text-blue-800">
                    Next Vehicle
                  </div>
                  <div>
                    <Tab.Group
                      as="div"
                      className="flex flex-col max-w-2xl justify-between border border-[#A7C2FF] "
                    >
                      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 border-2 h-fit px-1 py-6">
                        <Tab.Panels className="w-full  ">
                          {upcoming &&
                            upcoming[0] &&
                            upcoming[0]?.frontImage && (
                              <Tab.Panel key="i1">
                                   <div className="grid grid-cols-2 gap-y-2 pl-2">
                                  <div className="text-xs py-2 col-span-2 font-bold text-gray-400 pl-1">
                                   
                                   
                                    <span className="text-black uppercase">
                                      {upcoming[1]?.make}  {upcoming[1]?.model}
                                    
                                    </span>
                                  </div>
                                  <Image
                                    src={upcoming[0]?.frontImage}
                                    alt="i1"
                                    className="w-20 h-20 object-center object-cover sm:rounded-lg "
                                    width={100}
                                    height={100}
                                  />
                                  <ul className="pl-2 grid grid-cols-3  gap-0  text-xs font-medium">
                                  <li className=" w-11  flex justify-between text-gray-400">
                                      Reg no <span className="">:</span>
                                    </li>
                                    <li className=" col-span-2 text-[12px] font-bold">
                                      {upcoming[0]?.registrationNumber}{" "}
                                    </li>
                                    <li className=" w-11 flex justify-between text-gray-400">
                                      Model <span className="">:</span>
                                    </li>
                                    <li className="col-span-2 text-[12px] font-bold">{upcoming[0]?.model}</li>
                                    <li className=" w-11 flex justify-between text-gray-400">
                                      Make <span className="">:</span>
                                    </li>
                                    <li className="col-span-2 text-[12px] font-bold"> {upcoming[0]?.make}</li>
                                  </ul>
                                </div>
                              </Tab.Panel>
                            )}
                        </Tab.Panels>
                      </div>
                    </Tab.Group>
                  </div>
              
             

                  {/* <div className="text-lg pl-3 font-semibold  text-blue-800 ">
                    Next Vehicle
                  </div> */}

                  {/* <div>
                    <Tab.Group
                      as="div"
                      className="flex flex-col max-w-2xl justify-between"
                    >
                      <div className="w-full max-w-3xl mx-auto grid grid-cols-1  border border-[#A7C2FF] h-44 ">
                        <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                          {upcoming &&
                            upcoming[1] &&
                            upcoming[1].rightImage && (
                              <Tab.Panel key="i1">
                                <div className="grid grid-cols-2 gap-y-2 pl-2">
                                  <div className="text-sm py-2 col-span-2 font-bold text-gray-400 pl-1">
                                 
                                    <span className="text-black uppercase text-xs">
                                      {upcoming[1].make}  {upcoming[1].model}
                                    </span>
                                  </div>
                                  
                                  <Image
                                    src={upcoming[1].frontImage}
                                    alt="i1"
                                    className="w-20 h-20 object-center object-cover sm:rounded-lg "
                                    width={100}
                                    height={100}
                                  />
                                  <ul className="pl-2 grid grid-cols-3  gap-0  text-xs font-medium">
                                    <li className=" w-11  flex justify-between text-gray-400">
                                      Reg no <span className="">:</span>
                                    </li>
                                    <li className=" col-span-2 text-[12px] font-bold">
                                      {upcoming[1].registrationNumber}{" "}
                                    </li>
                                    <li className=" w-11 flex justify-between text-gray-400">
                                      Model <span className="">:</span>
                                    </li>
                                    <li className="col-span-2 text-[12px] font-bold">{upcoming[1].model}</li>
                                    <li className=" w-11 flex justify-between text-gray-400">
                                      Make <span className="">:</span>
                                    </li>
                                    <li className="col-span-2 text-[12px] font-bold"> {upcoming[1].make}</li>
                                  </ul>
                                </div>
                              </Tab.Panel>
                            )}
                        </Tab.Panels>
                      </div>
                    </Tab.Group>
                  </div> */}
                </section>
                )}

                {/* Bidding */}
                <section className=" space-y-2 md:col-start-2 md:row-start-1 lg:row-start-2 row-start-5 pl-1">
                  <div className="text-lg font-bold pl-3 text-center  ">Bid Details</div>

                  <div className="bg-white px-4 py-5 sm:rounded-lg sm:px-6 border border-[#A7C2FF] space-y-2">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-6">
                      <div className="">
                        <div>
                          <h2 className="text-sm font-medium text-gray-900">
                            Start Price
                          </h2>
                          <p className="text-sm text-green-600 font-bold">
                            {/* Rs. {liveItem.startPrice}/- */}
                            {liveItem.startBidAmount}/-
                          </p>
                        </div>
                        {/* <div className=" ">
                          <span className=" text-green-600 font-bold">
                            {liveItem.myBidRank == "1" ? (
                              <span>Winning</span>
                            ) : (
                              liveItem.myBidRank > 1 && (
                                <span className="text-red-600 font-bold"> Losing</span>
                              )
                            )}
                          </span>
                        </div> */}
                      </div>
                      <div className="flex justify-between pl-3.5">
                        <div>
                          <h2 className="text-sm font-medium text-gray-900">
                            Quote Increment
                          </h2>
                          <p className="text-sm text-green-600 font-bold">
                            Rs. {liveItem.quoteIncreament}/-
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-sm font-medium text-gray-900">
                            Current Bid Amount
                          </h2>
                          <p className="place-items-start text-sm text-green-600 font-bold">
                            Rs. {liveItem.currentBidAmount}/-
                          </p>
                        </div>
                      </div>
                      <div className="pl-3.5">
                        <h2 className="text-sm font-medium text-gray-900">
                          Current status
                        </h2>
                        <span className="text-red-600 text-xs flex pt-px items-start font-bold">
                          {liveItem.myBidRank == 0 && "Not enrolled"}
                        </span>
                       
                          <span className=" text-green-600 font-bold">
                            {liveItem.myBidRank == "1" ? (
                              <span>Winning</span>
                            ) : (
                              liveItem.myBidRank > 1 && (
                                <span className="text-red-600 font-bold"> Losing</span>
                              )
                            )}
                          </span>
                       
                      </div>
                      {/* */}{" "}
                    </div>
                    <div className="text-center text-base font-semibold py-5 ">
                      Quick Bid - Increment by
                    </div>

                    <div className="grid  grid-cols-1 ">
                      <div className="grid grid-cols-3 gap-2 lg:gap-4">
                        {incrementAmounts.map((increment, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setBidAmount(
                                // liveItem.currentBidAmount + increment.value
                                bidAmount + increment.value
                              );
                            }}
                            className="  h-10 inline-flex items-center justify-center border border-transparent text-base font-semibold rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                          >
                            {increment.label}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                              handleBidAmount(
                                +(e.target as HTMLButtonElement).value
                              )
                            }
                            className="  h-10 inline-flex items-center justify-center border border-transparent text-base font-semibold rounded-md text-green-700 bg-green-50 hover:bg-indigo-200 focus:outline-none"
                            key={i}
                            value={i * liveItem.quoteIncreament}
                          >
                            {bidAmount + i * liveItem.quoteIncreament}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* <div className="bg-white px-4 py-5 flex justify-between items-center sm:rounded-lg sm:px-6 border border-gray-200">
            <h2 className="text-sm font-medium text-gray-900">
              status
            </h2>
            <p className="text-xl text-green-600">
              {liveItem.myBidRank ?? "0"}
            </p>
          </div> */}

                  <div className="bg-[#EEF1FB] max-h-48 overflow-y-scroll font-semibold  border border-[#A7C2FF]">
                    {BidHistory(bidHistory, liveItem)}
                    {/* new timer added */}
                  </div>
                </section>





{/* buttn */}
                <section className="max-md:fixed w-full bottom-0 left-0 md:row-start-2 lg:row-start-3 md:col-start-2  max-sm:bg-[#F1F5F9] lg:pb-4  z-10 md:mt-16 ">
                  <div className="grid grid-cols-2 border-3 border-gray-200 h-8  ">
                    <div className="bg-violet-100  flex justify-center items-center gap-2 h-8 border-y border-r border-gray-200">
                      <p>
                        <svg
                          width="24"
                          height="26"
                          viewBox="0 0 24 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 9.97046C19 10.8897 18.8189 11.8 18.4672 12.6492C18.1154 13.4985 17.5998 14.2702 16.9497 14.9202C16.2997 15.5702 15.5281 16.0858 14.6788 16.4376C13.8295 16.7894 12.9193 16.9705 12 16.9705C11.0807 16.9705 10.1705 16.7894 9.32122 16.4376C8.47194 16.0858 7.70026 15.5702 7.05025 14.9202C6.40024 14.2702 5.88463 13.4985 5.53284 12.6492C5.18106 11.8 5 10.8897 5 9.97046C5 8.11394 5.7375 6.33347 7.05025 5.02071C8.36301 3.70796 10.1435 2.97046 12 2.97046C13.8565 2.97046 15.637 3.70796 16.9497 5.02071C18.2625 6.33347 19 8.11394 19 9.97046Z"
                            fill="#4F46E5"
                            fill-opacity="0.66"
                          />
                          <path
                            d="M7.09286 16.9705L6.71386 18.3525C6.08586 20.6445 5.77186 21.7905 6.19086 22.4175C6.33786 22.6375 6.53486 22.8135 6.76386 22.9305C7.41586 23.2625 8.42386 22.7375 10.4389 21.6875C11.1089 21.3375 11.4449 21.1635 11.8009 21.1255C11.9331 21.1113 12.0666 21.1113 12.1989 21.1255C12.5549 21.1635 12.8899 21.3385 13.5609 21.6875C15.5759 22.7375 16.5839 23.2625 17.2359 22.9305C17.4649 22.8135 17.6619 22.6375 17.8089 22.4175C18.2289 21.7905 17.9139 20.6445 17.2859 18.3525L16.9069 16.9705C15.4729 17.9873 13.7578 18.5322 11.9999 18.5295C10.2419 18.5322 8.52682 17.9873 7.09286 16.9705Z"
                            fill="#4F46E5"
                            fill-opacity="0.66"
                          />
                        </svg>
                      </p>
                      <h2 className=" text-sm font-normal text-gray-900 h-6">
                        Ranking
                      </h2>
                      <p className="text-sm font-medium text-blue-800 h-6">
                        {liveItem.myBidRank ?? "0"}
                      </p>
                    </div>
                    <div className="bg-blue-200  flex justify-center gap-2 items-center  border-y border-r max-h-8 border-gray-200 ">
                      <h2 className="text-sm font-normal text-gray-900 h-6">
                        your bid{" "}
                      </h2>
                      <div className="flex items-center">
                      <p className="   pb-1">
                      ₹
                      </p>

                      <p className="text-sm font-medium text-blue-800 h-6 flex">
                       {bidAmount}

                      </p>
                      </div>
                      
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    {liveItem?.bidStatus}
                  </div>

                  {/* BID BUTTON HERE */}
                  <div className=" flex flex-col items-center  h-24 mt-3">
                    <input
                      name="text"
                      type="number"
                      defaultValue={
                        liveItem.currentBidAmount !== 0
                          ? liveItem.currentBidAmount
                          : liveItem.startBidAmount
                      }
                      value={bidAmount}
                      onChange={(e) => {
                        //  setBidAmount(e.target.value.replace(/\D/g, ""));
                        setBidAmount(parseInt(e.target.value));
                      }}
                      className="w-11/12 h-9 px-5 py-3 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs border-gray-300 rounded-md"
                      placeholder="Enter Bid Amount"
                    />

                    <div className="mt-3 rounded-md shadow w-full flex justify-center">
                      <button
                        type="submit"
                        onClick={() => {
                          if (bidAmount % 100 != 0) {
                            Swal.fire({
                              title: "Bid amount should be multiple of 100",
                              confirmButtonText: "OK",
                              position: "top",
                            });
                          } else if (liveItem.currentBidAmount >= bidAmount) {
                            Swal.fire({
                              title:
                                "Bid amount should be greater than last bid",
                              confirmButtonText: "OK",
                              position: "top",
                            });
                          } else {
                            CallBid(bidAmount, liveItem.id);
                          }
                        }}
                        className="w-11/12 h-12    flex items-center justify-center px-5 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-400 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Bid Now
                      </button>
                    </div>
                  </div>
                </section>


{/* lot*/} 
                <section className=" space-y-2 md:col-start-1 md:row-start-1 lg:col-span-2 lg:col-start-1 px-3 md:mt-[16.2rem] lg:m-auto md:w-full">
                  <div className="grid cols-2    ">
                <div className="flex items-center space-x-5 max-lg:hidden">
                  <div className="">
                    <h1 className="text-base font-bold text-gray-900 pl-1">
                    {liveItem.event.seller.name}
                    </h1>
                  </div>
                  
                  {/* <div className=" block md:flex md:items-start md:justify-between md:space-x-5">
          
        </div> */}
                </div>
                    
                    <div className="flex justify-between col-span-2 ">
                      <h3 className="text-base  font-medium text-gray-500 lg:order-2 lg:mr-2">
                        Bid Status:{" "}
                        <span className=" text-green-600 uppercase font-semibold">
                          {liveItem?.bidStatus}
                        </span>
                      </h3>

                      <p className="text-base font-semibold text-black lg:pl-1">
                        <span className=" font-medium  text-gray-500">
                          {" "}
                          LotNo:
                        </span>{" "}
                        # {liveItem.vehicleIndexNo}
                      </p>
                    </div>
                    <div className="col-span-2 w-fit md:w-full lg:w-fit h-7  lg:col-span-1  border border-indigo-400 bg-indigo-100   mt-4 md:mt-0 pt-px max-lg:px-6 lg:col-start-2 lg:row-start-1 lg:place-self-end lg:mr-2 lg:px-2">
                      {CountdownTimer(SecondsLeft())}
                    </div>
                  </div>
                </section>
                {/* main img */}
                <section className="space-y-2 row-start-1 lg:row-start-2 md:col-start-1  w-full  border-2">
                  
                  <div>
                    <Tab.Group
                      as="div"
                      className="flex flex-col max-w-2xl justify-between"
                    >
                      <div className="w-full max-w-3xl mx-auto sm:block">
                        <Tab.Panels className="w-full aspect-w-1 ">
                         
                          

                          {liveItem?.rightImage && (
                            <div
                              className="flex-none min-w-fit relative p-6 hover:cursor-pointer"
                              onClick={() => {
                                // BindVehicleImage(liveItem);
                                setImages((liveItem?.rightImage).split(","));
                                setShowImageCarouselModal(true);
                              }}
                            >
                              <Image
                                src={liveItem?.rightImage}
                                alt="i1"
                                className="w-full h-full  object-center object-contain sm:rounded-lg"
                                width={1000}
                                height={540}
                              />
                            </div>
                          )} 

                          
                          
                        </Tab.Panels>
                      </div>

                      
                    </Tab.Group>
                  </div>
                </section>


                {/* Vehicles Details */}
                <section className="space-y-2 lg:mb-6 lg:px-2 md:col-start-1 md:row-start-1 lg:row-start-2  md:place-self-end  w-full mt-4">
                  {/* <div className="pb-8">
                    <h1 className="text-base  pl-4 pb-3 uppercase font-poppins font-bold">
                    {liveItem.make}    {liveItem.model}
                    </h1>
                    <ul className=" grid grid-cols-2 text-sm font-medium  gap-y-2 pb-2 px-4">
                  
                      <li className="text-gray-600 justify-self-end pr-2 flex flex-col">
                        Repo Date
                        <span className="text-gray-900 pl-1.5">{liveItem?.repoDt
                                  ? new Date(liveItem?.repoDt).toLocaleDateString()
                                  : "N/A"}
</span>
                      </li>
                      <li className="flex flex-col text-gray-600 pl-1">
                        Event No<span className="text-gray-900">{liveItem?.event?.eventNo}</span>
                      </li>
                      <li className="flex flex-col text-gray-600 justify-self-end text-center pr-2">
                        contact person
                        <span className="text-gray-900">{liveItem?.event?.seller?.contactPerson ? liveItem?.event?.seller?.contactPerson  :"NA"}</span>
                      </li>
                      <li className="flex flex-col text-gray-600 justify-self-end text-center pr-2">
                        contact person
                        <span className="text-gray-900">{liveItem?.event?.seller?.contactPerson ? liveItem?.event?.seller?.contactPerson  :"NA"}</span>
                      </li>
                    </ul>
                  </div> */}

                  {/* Vehicle Description list*/}
                  <div className="w-full max-sm:max-w-md  mt-4 rounded  border border-[#A7C2FF80]">
                    <Tab.Group>
                      <Tab.List className="flex space-x-1 rounded-xl  ">
                        {Object.keys(vehicleDetails).map((detail) => (
                          <Tab
                            key={detail}
                            className={({ selected }) =>
                              classNames(
                                "w-full     py-2.5 text-lg font-bold leading-5",
                                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                selected
                                  ? "bg-gray-700 text-white shadow"
                                  : "text-gray-900 hover:bg-gray-200"
                              )
                            }
                          >
                            {detail}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="mt-px border border-gray-200 rounded h-48 overflow-y-scroll ">
                        <Tab.Panel
                          className={classNames(
                            "rounded-xl bg-white p-3",
                            "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                          )}
                        >
                          <div className="bg-white">
                            <div className="space-y-4">
                              
                              {liveItem.registrationNumber && (
                                <div className=" flex space-x-2">
                                  <div className="">
                                    <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                      Reg No.
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                      {liveItem.registrationNumber}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              {liveItem.make && (
                                <div className=" flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                      Make
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                      {liveItem.make}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              <div className=" flex space-x-2">
                                <div>
                                  <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                    Model
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                    {liveItem.model}
                                  </dd>
                                </div>
                              </div>

                              {liveItem.yearOfManufacture && (
                                <div className=" flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                      Year of Manufactor
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                      {liveItem.yearOfManufacture}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              {liveItem.kmReading && (
                                <div className=" flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                      Odometer (kms)
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                      {liveItem.kmReading}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              {liveItem.ownership && (
                                <div className=" flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                      Ownership
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                      {liveItem.ownership}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              <div className=" flex space-x-2">
                                <div>
                                  <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                    RC Book
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                    {liveItem.rcStatus}
                                  </dd>
                                </div>
                              </div>

                              {liveItem.fuel && (
                                <div className=" flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                      Fuel Type
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                      {liveItem.fuel}
                                    </dd>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Tab.Panel>

                        <Tab.Panel
                          className={classNames(
                            "rounded-xl bg-white p-3",
                            "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                          )}
                        >
                          <div className="bg-white">
                            <dl className="space-y-4">
                              {liveItem.registrationNumber && (
                                <div className=" flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                      Insurance
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                      {liveItem?.insuranceStatus}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              {liveItem.make && (
                                <div className=" flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                      Type
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                      {liveItem?.type ? (
                                        liveItem?.type
                                      ) : (
                                        <span className="text-red-500 font-semibold">
                                          Nill
                                        </span>
                                      )}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              <div className=" flex space-x-2">
                                <div>
                                  <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                    Varient
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900v font-poppins font-medium text-[#0F172A]">
                                    {liveItem?.varient}
                                  </dd>
                                </div>
                              </div>

                              <div className=" flex space-x-2">
                                <div>
                                  <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                    Loan Agreement Number
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem.loanAgreementNo}
                                  </dd>
                                </div>
                              </div>

                              <div className=" flex space-x-2">
                                <div>
                                  <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                    Yard Location
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem?.yardLocation}
                                  </dd>
                                </div>
                              </div>

                              {liveItem.ownership && (
                                <div className=" flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                      Vehicle Location
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem?.veicleLocation}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              <div className=" flex space-x-2">
                                <div>
                                  <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                    Shape
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem?.shape}
                                  </dd>
                                </div>
                              </div>

                              <div className=" flex space-x-2">
                                <div>
                                  <dt className="text-sm font-roboto text-[#646464] font-semibold">
                                    Chaiss No
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem?.chassisNo ? (
                                      liveItem?.chassisNo
                                    ) : (
                                      <span className="text-red-500 font-semibold">
                                        Nill
                                      </span>
                                    )}
                                  </dd>
                                </div>
                              </div>
                            </dl>
                          </div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </section>


              </div>
            </div>












































            {/* FOR DESKTOP AND TABLET VIEW ONLY */}
            <div className="hidden py-10">
              {/* Page header */}
              <div className="md:flex md:items-start md:justify-between md:space-x-5">
                <div className="flex items-center space-x-5">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Open Auction
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                      <span className="text-black font-semibold"> LotNo:</span>{" "}
                      # {liveItem.vehicleIndexNo}
                    </p>
                    <h3 className="text-base py-4 font-semibold text-gray-900">
                      Bid Status:{" "}
                      <span className=" text-green-600 uppercase">
                        {liveItem?.bidStatus}
                      </span>
                    </h3>
                  </div>
                  {/* <div className=" block md:flex md:items-start md:justify-between md:space-x-5">
          
        </div> */}
                </div>

                <div className="flex flex-col items-center mt-4 sm:mt-0">
                  {CountdownTimer(SecondsLeft())}
                </div>
              </div>

              <div className="mt-8 mx-auto grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-3">
                {/* Next Vehicles Details */}
                <section className="space-y-2 lg:col-span-1">
                  <div className="text-lg font-semibold">Next Vehicle</div>
                  <div>
                    <Tab.Group
                      as="div"
                      className="flex flex-col max-w-2xl justify-between"
                    >
                      <div className="w-full max-w-3xl mx-auto sm:block">
                        <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                          {upcoming &&
                            upcoming[0] &&
                            upcoming[0].frontImage && (
                              <Tab.Panel key="i1">
                                <div className="text-sm py-2">
                                  Reg No. : {upcoming[0].registrationNumber}
                                </div>
                                <Image
                                  src={upcoming[0].frontImage}
                                  alt="i1"
                                  className="w-full h-full object-center object-cover sm:rounded-lg"
                                  width={500}
                                  height={300}
                                />
                              </Tab.Panel>
                            )}
                        </Tab.Panels>
                      </div>
                    </Tab.Group>
                  </div>

                  <div className="text-lg font-semibold">Next Vehicle</div>

                  <div>
                    <Tab.Group
                      as="div"
                      className="flex flex-col max-w-2xl justify-between"
                    >
                      <div className="w-full max-w-3xl mx-auto sm:block">
                        <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                          {upcoming &&
                            upcoming[1] &&
                            upcoming[1].rightImage && (
                              <Tab.Panel key="i1">
                                <div className="text-sm py-2">
                                  Reg No. : {upcoming[1].registrationNumber}
                                </div>
                                <Image
                                  src={upcoming[1].rightImage}
                                  alt="i1"
                                  className="w-full h-full object-center object-cover border-red-500 border-8   sm:rounded-lg"
                                  width={500}
                                  height={300}
                                />
                              </Tab.Panel>
                            )}
                        </Tab.Panels>
                      </div>
                    </Tab.Group>
                  </div>
                </section>

                {/* Bidding */}
                <section className="lg:col-span-1 space-y-2">
                  <div className="text-lg font-semibold">Live Bidding</div>

                  <div className="bg-white px-4 py-5 sm:rounded-lg sm:px-6 border border-gray-200 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          Start Price
                        </h2>
                        <p className="text-xl text-green-600">
                          {/* Rs. {liveItem.startPrice}/- */}
                          {liveItem.startBidAmount}/-
                        </p>
                      </div>
                      <div className=" ">
                        <span className=" text-green-600">
                          {liveItem.myBidRank == "1" ? (
                            <span>Winning</span>
                          ) : (
                            liveItem.myBidRank > 1 && (
                              <span className="text-red-600"> Losing</span>
                            )
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          Quote Increment
                        </h2>
                        <p className="text-xl text-green-600">
                          Rs. {liveItem.quoteIncreament}/-
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">
                          Current Bid Amount
                        </h2>
                        <p className="text-xl text-green-600">
                          Rs. {liveItem.currentBidAmount}/-
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between"></div>

                    <div className="space-y-6">
                      <span className="text-orange-800 text-lg">
                        {liveItem.myBidRank == 0 && "Not enrolled"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white px-4 py-5 sm:rounded-lg sm:px-6 border border-gray-200">
                    <div className="flex-none  lg:text-lg font-semibold pb-4 text-sm">
                      Quick Bid - Increment by
                    </div>
                    <div className="grid gap-y-4 grid-cols-1 lg:gap-x-8 lg:items-start">
                      <div className="flex flex-wrap gap-2">
                        {incrementAmounts.map((increment, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setBidAmount(
                                // liveItem.currentBidAmount + increment.value
                                bidAmount + increment.value
                              );
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                          >
                            {increment.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                              handleBidAmount(
                                +(e.target as HTMLButtonElement).value
                              )
                            }
                            className="inline-flex items-center px-2 py-1 border border-transparent text-base font-bold rounded-md text-green-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                            key={i}
                            value={i * liveItem.quoteIncreament}
                          >
                            {bidAmount + i * liveItem.quoteIncreament}
                          </button>
                        ))}
                      </div>
                      <div className="block">
                        <input
                          name="text"
                          type="number"
                          defaultValue={
                            liveItem.currentBidAmount !== 0
                              ? liveItem.currentBidAmount
                              : liveItem.startBidAmount
                          }
                          value={bidAmount}
                          onChange={(e) => {
                            //  setBidAmount(e.target.value.replace(/\D/g, ""));
                            setBidAmount(parseInt(e.target.value));
                          }}
                          className="w-full px-5 py-3 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs border-gray-300 rounded-md"
                          placeholder="Enter Bid Amount"
                        />

                        <div className="mt-3 rounded-md shadow">
                          <button
                            type="submit"
                            onClick={() => {
                              if (bidAmount % 100 != 0) {
                                Swal.fire({
                                  title: "Bid amount should be multiple of 100",
                                  confirmButtonText: "OK",
                                  position: "top",
                                });
                              } else if (
                                liveItem.currentBidAmount >= bidAmount
                              ) {
                                Swal.fire({
                                  title:
                                    "Bid amount should be greater than last bid",
                                  confirmButtonText: "OK",
                                  position: "top",
                                });
                              } else {
                                CallBid(bidAmount, liveItem.id);
                              }
                            }}
                            className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Bid Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white px-4 py-5 flex justify-between items-center sm:rounded-lg sm:px-6 border border-gray-200">
                    <h2 className="text-sm font-medium text-gray-900">
                      Current Rank
                    </h2>
                    <p className="text-xl text-green-600">
                      {liveItem.myBidRank ?? "0"}
                    </p>
                  </div>
                  {/* <div className="bg-white px-4 py-5 flex justify-between items-center sm:rounded-lg sm:px-6 border border-gray-200">
            <h2 className="text-sm font-medium text-gray-900">
              status
            </h2>
            <p className="text-xl text-green-600">
              {liveItem.myBidRank ?? "0"}
            </p>
          </div> */}

                  {BidHistory(bidHistory, liveItem)}
                </section>

                {/* Vehicles Details */}
                <section className="space-y-2 lg:col-span-1">
                  <div className="text-lg font-semibold">Vehicle Details</div>
                  <div>
                    <Tab.Group
                      as="div"
                      className="flex flex-col max-w-2xl justify-between"
                    >
                      <div className="w-full max-w-3xl mx-auto sm:block">
                        <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
                          {/* <Splide options={options}>
                <SplideSlide> */}
                          {/* {liveItem.frontImage && (
                    <Tab.Panel key="i1">
                       <a href={liveItem.frontImage} target="_blank" rel="noopener noreferrer"></a>
                      <Image
                        src={liveItem.frontImage}
                        alt="i1"
                        className="w-full h-full object-center object-cover sm:rounded-lg"
                        width={500}
                        height={300}
                      />
                    </Tab.Panel>
                  )} */}

                          {liveItem?.rightImage && (
                            <div
                              className="flex-none min-w-fit relative p-6 hover:cursor-pointer"
                              onClick={() => {
                                // BindVehicleImage(liveItem);
                                setImages((liveItem?.rightImage).split(","));
                                setShowImageCarouselModal(true);
                              }}
                            >
                              <Image
                                src={liveItem?.rightImage}
                                alt="i1"
                                className="w-full h-full object-center object-cover sm:rounded-lg"
                                width={900}
                                height={500}
                              />
                            </div>
                          )}

                          {/* {liveItem.backImage && (
                    <Tab.Panel key="i2">
                      <a href={liveItem.backImage} target="_blank" rel="noopener noreferrer"></a>
                      <Image
                        src={liveItem.backImage}
                        alt="i2"
                        className="w-full h-full object-center object-cover sm:rounded-lg"
                        width={500}
                        height={300}
                      />
                    </Tab.Panel>
                  )} */}
                          {/* {liveItem.leftImage && (
                    <Tab.Panel key="i3">
                       <a href={liveItem.leftImage} target="_blank" rel="noopener noreferrer"></a>
                      <Image
                        src={liveItem.leftImage}
                        alt="i3"
                        className="w-full h-full object-center object-cover sm:rounded-lg"
                        width={500}
                        height={300}
                      />
                    </Tab.Panel>
                  )} */}
                          {/* {liveItem.rightImage && (
                    <Tab.Panel key="i4">
                       <a href={liveItem.rightImage} target="_blank" rel="noopener noreferrer"></a>
                      <Image
                        src={liveItem.rightImage}
                        alt="i4"
                        className="w-full h-full object-center object-cover sm:rounded-lg"
                        width={500}
                        height={300}
                      />
                    </Tab.Panel>
                  )} */}
                          {/* </SplideSlide>
                  </Splide> */}
                        </Tab.Panels>
                      </div>

                      {/* <div className="hidden mt-6 mb-3 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {liveItem.frontImage && (
                    <Tab
                      key="it1"
                      className="relative h-12 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                    >
                      {({ selected }) => (
                        <>
                          <span className="absolute inset-0 rounded-md overflow-hidden">
                          <a href={liveItem.frontImage} target="_blank" rel="noopener noreferrer">
                            <Image
                              src={liveItem.frontImage}
                              alt="altii1"
                              className="w-full h-full object-center object-cover"
                              width={100}
                              height={100}
                            />
                             </a>
                          </span>
                          <span
                            className={classNames(
                              selected
                                ? "ring-indigo-500"
                                : "ring-transparent",
                              "absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  )}
                  {liveItem.backImage && (
                    <Tab
                      key="it2"
                      className="relative h-12 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                    >
                      {({ selected }) => (
                        <>
                          <span className="absolute inset-0 rounded-md overflow-hidden">
                          <a href={liveItem.backImage} target="_blank" rel="noopener noreferrer">
                            <Image
                              src={liveItem.backImage}
                              alt="altii2"
                              className="w-full h-full object-center object-cover"
                              width={100}
                              height={100}
                            />
                             </a>
                          </span>
                          <span
                            className={classNames(
                              selected
                                ? "ring-indigo-500"
                                : "ring-transparent",
                              "absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  )}
                  {liveItem.leftImage && (
                    <Tab
                      key="it3"
                      className="relative h-12 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                    >
                      {({ selected }) => (
                        <>
                          <span className="absolute inset-0 rounded-md overflow-hidden">
                          <a href={liveItem.leftImage} target="_blank" rel="noopener noreferrer">
                            <Image
                              src={liveItem.leftImage}
                              alt="altii3"
                              className="w-full h-full object-center object-cover"
                              width={100}
                              height={100}
                            />
                             </a>
                          </span>
                          <span
                            className={classNames(
                              selected
                                ? "ring-indigo-500"
                                : "ring-transparent",
                              "absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  )}
                  {liveItem.rightImage && (
                    <Tab
                      key="it4"
                      className="relative h-12 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
                    >
                      {({ selected }) => (
                        <>
                          <span className="absolute inset-0 rounded-md overflow-hidden">
                          <a href={liveItem.leftImage} target="_blank" rel="noopener noreferrer">
                            <Image
                              src={liveItem.rightImage}
                              alt="altii4"
                              className="w-full h-full object-center object-cover"
                              width={100}
                              height={100}
                            />
                             </a>
                          </span>
                          <span
                            className={classNames(
                              selected
                                ? "ring-indigo-500"
                                : "ring-transparent",
                              "absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  )}
                </Tab.List>
              </div> */}
                    </Tab.Group>
                  </div>

                  {/* Vehicle Description list*/}
                  <div className="w-full max-w-md px-2 py-1 rounded sm:px-0">
                    <Tab.Group>
                      <Tab.List className="flex space-x-1 rounded-xl p-1">
                        {Object.keys(vehicleDetails).map((detail) => (
                          <Tab
                            key={detail}
                            className={({ selected }) =>
                              classNames(
                                "w-full rounded-lg py-2.5 text-lg font-bold leading-5",
                                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                                selected
                                  ? "bg-gray-700 text-white shadow"
                                  : "text-gray-900 hover:bg-gray-200"
                              )
                            }
                          >
                            {detail}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="mt-2 border border-gray-200 rounded">
                        <Tab.Panel
                          className={classNames(
                            "rounded-xl bg-white p-3",
                            "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                          )}
                        >
                          <div className="">
                            <dl className="space-y-4">
                              {liveItem.registrationNumber && (
                                <div className="sm:col-span-1 flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                      Reg No.
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem.registrationNumber}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              {liveItem.make && (
                                <div className="sm:col-span-1 flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                      Make
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem.make}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              <div className="sm:col-span-1 flex space-x-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Model
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem.model}
                                  </dd>
                                </div>
                              </div>

                              {liveItem.yearOfManufacture && (
                                <div className="sm:col-span-1 flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                      Year of Manufactor
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem.yearOfManufacture}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              {liveItem.kmReading && (
                                <div className="sm:col-span-1 flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                      Odometer (kms)
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem.kmReading}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              {liveItem.ownership && (
                                <div className="sm:col-span-1 flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                      Ownership
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem.ownership}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              <div className="sm:col-span-1 flex space-x-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    RC Book
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem.rcStatus}
                                  </dd>
                                </div>
                              </div>

                              {liveItem.fuel && (
                                <div className="sm:col-span-1 flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                      Fuel Type
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem.fuel}
                                    </dd>
                                  </div>
                                </div>
                              )}
                            </dl>
                          </div>
                        </Tab.Panel>

                        <Tab.Panel
                          className={classNames(
                            "rounded-xl bg-white p-3",
                            "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                          )}
                        >
                          <div className="">
                            <dl className="space-y-4">
                              {liveItem.registrationNumber && (
                                <div className="sm:col-span-1 flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                      Insurance
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem?.insuranceStatus}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              {liveItem.make && (
                                <div className="sm:col-span-1 flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                      Type
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem?.type ? (
                                        liveItem?.type
                                      ) : (
                                        <span className="text-red-500 font-semibold">
                                          Nill
                                        </span>
                                      )}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              <div className="sm:col-span-1 flex space-x-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Varient
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem?.varient}
                                  </dd>
                                </div>
                              </div>

                              <div className="sm:col-span-1 flex space-x-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Loan Agreement Number
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem.loanAgreementNo}
                                  </dd>
                                </div>
                              </div>

                              <div className="sm:col-span-1 flex space-x-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Yard Location
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem?.yardLocation}
                                  </dd>
                                </div>
                              </div>

                              {liveItem.ownership && (
                                <div className="sm:col-span-1 flex space-x-2">
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                      Vehicle Location
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {liveItem?.veicleLocation}
                                    </dd>
                                  </div>
                                </div>
                              )}

                              <div className="sm:col-span-1 flex space-x-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Shape
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem?.shape}
                                  </dd>
                                </div>
                              </div>

                              <div className="sm:col-span-1 flex space-x-2">
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Chaiss No
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {liveItem?.chassisNo ? (
                                      liveItem?.chassisNo
                                    ) : (
                                      <span className="text-red-500 font-semibold">
                                        Nill
                                      </span>
                                    )}
                                  </dd>
                                </div>
                              </div>
                            </dl>
                          </div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </section>
              </div>
            </div>
          </>
        ) : (
          counterLeftUpcoming(upcomingSecondsLeft())
        )}
      </>

      <ImageCarouselModal
        color="blue"
        open={showImageCarouselModal}
        close={() => setShowImageCarouselModal(false)}
        images={images}
      />
    </DashboardTemplate>
  );
}

export default withPrivateRoute(OpenAuctions);

function counterLeftUpcoming(hhmmss: string) {
  if (hhmmss === "no upcoming left") {
    return (
      <div
        className="flex justify-center font-extrabold items-center animate-pulse text-black-600 sm:text-xl md:text-2xl lg:text-3xl "
        style={{ minHeight: "80vh" }}
      >
        NO MORE UPCOMING VECHILES{" "}
      </div>
    );
  } else {
    const timeArray = hhmmss.split(":");

    return (
      <div
        className="flex justify-center items-center "
        style={{ minHeight: "80vh" }}
      >
        <div className="w-72 text-blue-700">
          <div className="text-center text-3xl text-black font-extrabold uppercase">
            Next vehicle will be in
          </div>
          <div className="text-2xl text-center flex w-full items-center justify-center">
            <div className="w-24 mx-2 p-2">
              <div className="font-semibold text-7xl leading-none">
                {timeArray[0]}
              </div>
              <div className="mt-2 font-mono uppercase text-sm leading-none">
                Hours
              </div>
            </div>
            <div className="text-8xl pb-10">:</div>
            <div className="w-24 mx-2 p-2">
              <div className="font-mono text-7xl leading-none">
                {timeArray[1]}
              </div>
              <div className="mt-2 font-mono uppercase text-sm leading-none">
                Minutes
              </div>
            </div>
            <div className="text-8xl pb-10">:</div>
            <div className="w-24 mx-2 p-2">
              <div className="font-mono text-7xl leading-none">
                {timeArray[2]}
              </div>
              <div className="mt-2 font-mono uppercase text-sm leading-none">
                Seconds
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function BidHistory(data, liveItem) {
  var username = localStorage.getItem("username");
  var name = localStorage.getItem("name");
  // console.log('009',name);

  // console.log('usernamebeforetrim',username);

  // let ogUsername=username.trim()
  // console.log('usernameaftertrim',ogUsername);

  // console.log('006',ogUsername);
  // let value=data
  // console.log('value007',value);
  // let value=data?.sudoBids.map((item)=>{
  //  return  item.name.split(':')[0].trim()
  // })

  // console.log('003',value);
  // let don="abs9487884391 : TN37BH7417"
  // let dons=don.split(':')[0].trim()

  // console.log('004',dons);

  return (
    <div>
      <div className="flow-root bg-white px-4 py-5 sm:rounded-lg sm:px-6 border border-gray-200">
        <div className="text-sm font-semibold mb-4">Bid History</div>
        {data && data.sudoBids && data.sudoBids.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200">
            {data.sudoBids.map((bid, index) => (
              <li key={index} className="py-2">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {bid.name.split(":")[0].trim() === username
                        ? name
                        : "Dealer"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 truncate">
                      {"Rs." + bid.amount}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm mb-4">Not Available</div>
        )}
      </div>
    </div>
  );
}

function CountdownTimer(hhmmss: string) {
  const timeArray = hhmmss.split(":");

  return (
    // <div className="  max-sm:flex max-sm:h-7  justify-center  max-sm:grid-cols-2   max-sm:gap-1    md:w-72 text-indigo-500">
    //   <div className="max-sm:text-sm   md:text-center md:text-3xl font-bold  ">
    //     Vehicle Live Time
    //   </div> 
    //   <div className=" text-2xl md:text-center flex md:w-full md:items-center md:justify-center">
    //     <div className="md:w-24 md:mx-1 md:p-2">
    //       <div className="max-sm:text-sm    font-bold md:text-7xl md:leading-none">
    //         {timeArray[0]}
    //       </div>
    //       {/* <div className="max-sm:hidden mt-2 font-semibold uppercase text-sm md:leading-none">
    //         Hours
    //       </div> */}
    //     </div>
    //     {/* <div className="max-sm:text-sm   md:text-6xl md:pb-10">
    //       :
    //     </div> */}
    //     <div className="md:w-24 md:mx-1 md:p-2">
    //       <div className="max-sm:text-sm  font-bold text-7xl md:leading-none">
    //         {timeArray[1]}
    //       </div>
    //       {/* <div className="max-sm:hidden mt-2 font-semibold uppercase text-sm leading-none">
    //         Minutes
    //       </div> */}
    //     </div>
    //     {/* <div className="max-sm:text-sm  max-sm:leading-7  text-6xl pb-10">
    //       :
    //     </div> */}
    //     <div className="md:w-24 md:mx-1 md:p-2">
    //       <div className="max-sm:text-sm    font-bold text-7xl leading-none">
    //         {timeArray[2]}
    //       </div>
    //       {/* <div className="max-sm:hidden mt-2 font-semibold uppercase text-sm md:leading-none">
    //         Seconds
    //       </div> */}
    //     </div>
    //   </div>
    // </div>



    <div className="  flex h-7  justify-center       gap-1     text-indigo-500">
      <div className="text-sm   font-bold  ">
        Vehicle Live Time
      </div> 
      <div className=" text-2xl  flex  ">
        <div className="">
          <div className="text-sm    font-bold ">
            {timeArray[0]}
          </div>
          {/* <div className="max-sm:hidden mt-2 font-semibold uppercase text-sm md:leading-none">
            Hours
          </div> */}
        </div>
        <div className="text-base leading-[1.2rem]   ">
          :
        </div>
        <div className="">
          <div className="text-sm  font-bold ">
            {timeArray[1]}
          </div>
          {/* <div className="max-sm:hidden mt-2 font-semibold uppercase text-sm leading-none">
            Minutes
          </div> */}
        </div>
        <div className="text-base leading-[1.2rem]   ">
          :
        </div>
        <div className="">
          <div className="text-sm    font-bold  ">
            {timeArray[2]}
          </div>
          {/* <div className="max-sm:hidden mt-2 font-semibold uppercase text-sm md:leading-none">
            Seconds
          </div> */}
        </div>
      </div>
    </div>
  );
}

