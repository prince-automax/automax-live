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
faUserSlash
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
      const startAmnt=data?.vehicles[0]?.startBidAmount
      
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
          const strtprice=live.currentBidAmount !==0 ? live.currentBidAmount  :live.startBidAmount

          setBidAmount(strtprice)
        // }
        
      } else {
        setLiveItem(null);
      }
    } else {
      setLiveItem(null);
    }
  }, [data]);

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


  function upcomingSecondsLeft(){
    let noUpcoming='no upcoming left'
    try {
      if(upcoming[0]){
    
        let count=upcoming[0].length
        let string=count+""
       
        const startTime=moment(upcoming[0].bidStartTime)
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

  const handleBidAmount=(price)=>{
    
     
    setBidAmount(bidAmount+price)
  }


  return (
    <DashboardTemplate>
      {/* {data && data.vehicles[0].event?.status ==='active' ? 
      <> */}
      {liveItem ? (
        <div className="py-10">
      
          {/* Page header */}
          <div className="md:flex md:items-start md:justify-between md:space-x-5">
            <div className="flex items-center space-x-5">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Open Auction
                </h1>
                <p className="text-sm font-medium text-gray-500">
               <span className="text-black font-semibold">  LotNo:</span>  # {liveItem.vehicleIndexNo}
                </p>
                <h3 className="text-base py-4 font-semibold text-gray-900">Bid Status: <span className=" text-green-600 uppercase">{liveItem?.bidStatus}</span></h3>
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
                      {upcoming && upcoming[0] && upcoming[0].frontImage && (
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
                      {upcoming && upcoming[1] && upcoming[1].rightImage && (
                        <Tab.Panel key="i1">
                          <div className="text-sm py-2">
                            Reg No. : {upcoming[1].registrationNumber}
                          </div>
                          <Image
                            src={upcoming[1].rightImage}
                            alt="i1"
                            className="w-full h-full object-center object-cover border border-red-500 border-8   sm:rounded-lg"
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
                  <div  className=" ">
                  <span className=" text-green-600">{liveItem.myBidRank == '1' ? <span>Winning</span> :liveItem.myBidRank >1 && <span className="text-red-600"> Losing</span>}</span>
                  </div>
               
                  </div>
                  <div className="flex justify-between" >
                  <div>
                  <h2 className="text-lg font-medium text-gray-900">
                     Quote Increment
                  </h2>
                  <p className="text-xl text-green-600">
                    Rs. {liveItem.quoteIncreament}/-
                  </p>
                  </div>
                  </div>
                <div className="flex justify-between" >
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Current Bid Amount
                  </h2>
                  <p className="text-xl text-green-600">
                    Rs. {liveItem.currentBidAmount}/-
                  </p>
                  </div>
                
                </div>
                <div className="flex justify-between" >
               
                
                </div>
                
                <div className="space-y-6"><span className="text-orange-800 text-lg">{liveItem.myBidRank == 0  && 'Not enrolled' }</span></div>
              </div>

             
              <div className="bg-white px-4 py-5 sm:rounded-lg sm:px-6 border border-gray-200">
                <div className="flex-none  text-lg font-semibold pb-4 text-sm">
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
                            bidAmount+increment.value
                          );
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                      >
                        {increment.label}
                      </button> 
                    ))}
                   
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {
                      Array.from({ length: 6 }) .map((_, i) => (
                        <button  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                          handleBidAmount(+(e.target as HTMLButtonElement).value)
                        } className="inline-flex items-center px-2 py-1 border border-transparent text-base font-bold rounded-md text-green-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none" key={i} value={((i) * liveItem.quoteIncreament)}>
                          {bidAmount +((i) * liveItem.quoteIncreament)}
                        </button>
                    ))
                    }
                    </div>
                  <div className="block">
                    <input
                      name="text"
                      type="number"
                      defaultValue={liveItem.currentBidAmount !==0 ? liveItem.currentBidAmount  :liveItem.startBidAmount }
                      value={bidAmount}
                      onChange={(e) => {
                        //  setBidAmount(e.target.value.replace(/\D/g, ""));
                        setBidAmount(parseInt(e.target.value))
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

             
              {BidHistory(bidHistory,liveItem)}
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
                        setImages((liveItem?.rightImage).split(','))
                        setShowImageCarouselModal(true);
                      }}
                    >
                      <Image
                            src={liveItem?.rightImage}
                            alt="i1"
                            className="w-full h-full object-center object-cover sm:rounded-lg"
                            width={1000}
                            height={600}
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
                                  {liveItem?.type ? liveItem?.type :<span className="text-red-500 font-semibold">Nill</span>}

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
                                  {liveItem?.chassisNo ? liveItem?.chassisNo : <span className="text-red-500 font-semibold">Nill</span>}
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
      ):( counterLeftUpcoming(upcomingSecondsLeft())) }
      {/* </>
      :"there is no active auction"} */}
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





function counterLeftUpcoming(hhmmss: string,) {

if(hhmmss==="no upcoming left"){
  return (
    <div className="flex justify-center font-extrabold items-center animate-pulse text-black-600 sm:text-xl md:text-2xl lg:text-3xl " style={{ minHeight: '80vh' }}>NO MORE  UPCOMING VECHILES  </div>
  )
}else{

  const timeArray = hhmmss.split(":");

  return (
    <div className="flex justify-center items-center " style={{ minHeight: '80vh' }}>
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
          </div><div className="text-8xl pb-10">:</div>
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




function BidHistory(data,liveItem) {

  var username = localStorage.getItem('username');
  var name = localStorage.getItem('name');
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
                     {bid.name.split(':')[0].trim() === username ? name : 'Dealer'}
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
    <div className="w-72 text-indigo-500">
      <div className="text-center text-3xl font-bold ">Vehicle Live Time</div>
      <div className="text-2xl text-center flex w-full items-center justify-center">
        <div className="w-24 mx-1 p-2">
          <div className="font-bold text-7xl leading-none">{timeArray[0]}</div>
          <div className="mt-2 font-semibold uppercase text-sm leading-none">
            Hours
          </div>
        </div>
        <div className="text-6xl pb-10">:</div>
        <div className="w-24 mx-1 p-2">
          <div className="font-bold text-7xl leading-none">{timeArray[1]}</div>
          <div className="mt-2 font-semibold uppercase text-sm leading-none">
            Minutes
          </div>
        </div>
        <div className="text-6xl pb-10">:</div>
        <div className="w-24 mx-1 p-2">
          <div className="font-bold text-7xl leading-none">{timeArray[2]}</div>
          <div className="mt-2 font-semibold uppercase text-sm leading-none">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}