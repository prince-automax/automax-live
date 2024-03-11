import Loader from "@components/ui/Loader";
import {
  CreateBidMutationVariables,
  OrderDirection,
  QueryQueryVariables,
  useAddToWatchListMutation,
  useCreateBidMutation,
  useQueryQuery,
  useWatchListQuery,
  WatchListQuery,
  useUserWorkBookQuery,
  UserWorkBookQueryVariables,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import moment from "moment";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import { useEffect, useState } from "react";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import withPrivateRoute from "../utils/withPrivateRoute";
import Image from "next/image";
import Link from "next/link";
import ImageCarouselModal from "@components/modals/ImageCarouselModal";
import {
  ClipboardListIcon,
  DocumentReportIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/outline";
import { useQueryClient } from "react-query";
import { SecondsToDhms } from "@utils/common";
import Swal from "sweetalert2";
import { faCircleInfo, faAngleRight,faUserSlash,faThumbsDown,faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function WatchList() {
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const queryClient = useQueryClient();
  const [tick, setTick] = useState(0);
  const [serverTime, setserverTime] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [images, setImages] = useState([]);
  const [showImageCarouselModal, setShowImageCarouselModal] = useState(false);
  const [showChild, setShowChild] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Get the vertical scroll position
      const scrollPosition = window.scrollY;

      console.log("window", scrollPosition);

      // Determine the point where you want to show the child div
      const showThreshold = 200; // Adjust this value as needed

      // Toggle the visibility of the child div based on the scroll position
      setShowChild(scrollPosition >= showThreshold);
    };

    // Add event listener for scroll when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const options = {
    rewind: true,
    gap: 1, // Adjust gap as needed
    autoplay: true,
    interval: 2000, // Set autoplay interval in milliseconds
    pauseOnHover: false,
    resetProgress: false,
    pagination: false,
  };

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      setAccessToken(token);
      setUserId(id);
    }
  }, []);

  const { data, isLoading } = useWatchListQuery<WatchListQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      take: 50,
      skip: 0,
      orderBy: [
        {
          bidTimeExpire: OrderDirection.Asc,
        },
      ],
      userVehicleBidsTake2: 1,
      userVehicleBidsSkip2: 0,
      userVehicleBidsOrderBy2: [{ amount: OrderDirection.Desc }],
    },
    {
      cacheTime: 5,
      refetchInterval: 10000,
      enabled: accessToken !== "" && userId !== "",
    }
  );

  const {
    data: workbook,
    isLoading: workbookLoading,
    refetch,
  } = useUserWorkBookQuery<UserWorkBookQueryVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` })
  );

  useEffect(() => {
    refetch();
  }, [workbook]);

  const watchListMutation = useAddToWatchListMutation(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      onSuccess() {
        queryClient.invalidateQueries("getEvent");
      },
    }
  );

  function SecondsLeft(item) {
    try {
      if (item) {
        const expiryTime = moment(item.bidTimeExpire);
        const currentTime = moment(serverTime).add(tick, "seconds");
        const diff = expiryTime.diff(currentTime, "seconds");
        if (diff > 0) {
          return (
            <div className="w-full max-sm:flex items-center justify-between">
              <div className="text-sm text-[#646464] font-poppins">
                End's In
              </div>
              <div className="text-base text-red-500">
                {SecondsToDhms(diff)}
              </div>
            </div>
          );
        } else {
          return (
            <div className="w-full">
              <div className="text-base text-red-500">Completed</div>
            </div>
          );
        }
      }
    } catch {}
    return (
      <div className="w-full">
        <div className="text-xs">End's in</div>
        <div className="text-base text-red-500">NA</div>
      </div>
    );
  }

  const addToWatchList = async (vehicleId: string) => {
    await watchListMutation.mutateAsync({
      data: {
        data: {
          watchList: {
            connect: [
              {
                id: vehicleId,
              },
            ],
          },
        },
        where: {
          id: userId,
        },
      },
    });
  };

  const removeFromWatchList = async (vehicleId: string) => {
    await watchListMutation.mutateAsync({
      data: {
        data: {
          watchList: {
            disconnect: [
              {
                id: vehicleId,
              },
            ],
          },
        },
        where: {
          id: userId,
        },
      },
    });
  };

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

  return (
    <DashboardTemplate heading={"My Watch List"}>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6 mt-8">
          {!data?.authenticatedItem?.watchList?.length && (
            <div>No Vehicles Found</div>
          )}
          {data?.authenticatedItem?.watchList
            ?.filter((item) => item.vehicleEventStatus == "live")
            .map((item, index) => {
              const find = (workbook?.workSheets as any[] | undefined)?.filter(
                (wb) => wb?.registrationNumber === item?.registrationNumber
              );

              console.log("item in front image", item);

              return (
                <>
                  {/*  MOBILE VIEW STARTS HERE */}
                  <div
                    key={`d${index}`}
                    className={`sm:hidden sm:max-md:flex-col font-sans border-2  rounded border-[#A7C2FF80] bg-[#EEF1FB]   ${
                      moment(item?.bidTimeExpire).diff(moment(), "s") <= 120 &&
                      moment(item?.bidTimeExpire).diff(moment(), "s") > 0
                        ? "blink"
                        : ""
                    }`}
                    id={`parentcontainer-${index}`}
                  >
                    {/* WORKBOOK MATCH, TITLE, IMAGE FOR MOBILE VIEW STARTS HERE  */}
                    <div className="flex-auto p-3 lg:space-y-4 sm:p-6 ">
                      {/* workbook match and watchlist remove button starts here */}
                      <div className="mb-3 flex justify-between">
                        {find?.length > 0 && (
                          <Link href={`/workbook/${find[0].id}`}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Click here to view the workbook"
                              className="bg-blue-700 p-2 cursor-pointer rounded-md text-white animate-pulse"
                            >
                              WorkBook matched
                            </a>
                          </Link>
                        )}

                        <button
                          type="button"
                          className="
                         sm:hidden inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded text-red-700 "
                          onClick={() => removeFromWatchList(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                      {/* workbook match and watchlist remove button  ends here */}

                      {/* title starts here */}
                      <div className="sm:flex flex-wrap">
                        <div className="flex-auto">
                          <h1 className="   text-base sm:text-lg   font-bold sm:font-semibold text-blue-800 uppercase">
                            {item?.yearOfManufacture}
                            {item?.make}
                            {/* {item?.model} -{" "} */}
                            {item.registrationNumber}
                          </h1>
                          <div className="text-sm font-medium text-slate-700">
                            {item?.event?.seller?.name}
                          </div>
                        </div>
                      </div>
                      {/* title ends here */}

                      {/* mobile veiw for image starts here */}
                      {item?.frontImage && (
                        <div
                          className="block sm:hidden flex-none w-70 h-56  sm:max-md:h-56 sm:max-md:w-full md:h-auto sm:w-60 relative p-6 m-3 hover:cursor-pointer"
                          onClick={() => {
                            // BindVehicleImage(item);
                            setImages((item?.frontImage).split(","));
                            setShowImageCarouselModal(true);
                          }}
                        >
                          <Image
                            alt=""
                            src={item?.frontImage}
                            layout="fill"
                            className="absolute inset-0 w-full h-full object-cover rounded"
                          />
                        </div>
                      )}
                      {/* <div 
      className=" h-full  w-full relative p-6 m-3 hover:cursor-pointer">

  <Splide options={options} aria-label="React Splide Example">
  {item.frontImage?.split(',').map((imageUrl, index) => (
    <SplideSlide key={index}>
      <Image  
        alt={`image${index}`}
        src={imageUrl.trim()}
        className="w-full h-full object-center object-cover rounded-lg"
        width={500}
        height={300}
      />
    </SplideSlide>
  ))}
</Splide>
  </div> */}

                      {/* mobile view for image ends here */}
                    </div>

                    {/* WORKBOOK MATCH, TITLE, IMAGE FOR MOBILE VIEW ENDS HERE  */}

                    {/* VEHICLE INFORMATION, INOECTION REPORT,BID TIMING  FOR MOBILE, BID BOX   STARTS HERE */}
                    <div className="flex-auto   ">
                      {/* vehicle information starts here */}
                      <div className=" mt-4 pb-3 border-b-2 border-zinc-200">
                        <dl className="grid grid-cols-3 gap-x-2 gap-y-4 sm:gap-x-4 sm:gap-y-3  ">
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Odometer
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.kmReading ?? "N/A"} km
                            </dd>
                          </div>
                          <div className="max-sm:hidden sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Ownership
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.ownership}
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              RC Book
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.rcStatus}
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Repo date
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {" "}
                              -
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Total Bids
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.totalBids}
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Bids Remaining
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.event?.noOfBids -
                                item?.userVehicleBidsCount}
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block ">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Rank
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.myBidRank ? item.myBidRank : "N/A"}
                            </dd>
                          </div>
                          <div className=" col-span-3 sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block  ">
                            {item?.event?.bidLock === "locked" ? (
                              <>
                                <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                  Current Quote
                                </dt>
                                <dd className="text-sm font-medium sm:font-normal text-gray-900">
                                  {item?.currentBidAmount ?? "N/A"}
                                </dd>
                              </>
                            ) : (
                              <>
                                <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                  Your Latest Quote
                                </dt>
                                <dd className="text-sm font-medium sm:font-normal text-gray-900">
                                  {item?.userVehicleBids?.length
                                    ? item?.userVehicleBids[0]?.amount
                                    : "N/A"}
                                </dd>
                              </>
                            )}
                          </div>
                        </dl>
                      </div>
                      {/* vehicle information ends here */}

                      {/* MOBILE VIEW FOR INSPECT AND MORE DETAIL STARTS HERE) */}
                      <div className="flex sm:hidden space-x-4 mt-6 pt-4 pr-1 text-sm font-medium border-t border-slate-200">
                        <div className="flex-auto flex space-x-4">
                          <div className="mt-1 flex flex-row sm:flex-wrap sm:mt-0 space-x-2 sm:space-x-6 justify-around w-full  sm:max-md:justify-around sm:max-md:w-full ">
                            <div className="flex flex-col space-y-2 w-64">
                              <div className=" flex items-center justify-between text-sm text-blue-800 ">
                                <p className="flex items-center text-sm font-poppins font-medium text-[#2563EB]">
                                  {" "}
                                  Inspection Report
                                </p>

                                <FontAwesomeIcon icon={faCircleInfo} />
                              </div>
                              <div className=" flex items-center justify-between text-sm text-blue-800 ">
                                <Link href={`/vehicle/${item.id}`}>
                                  <a
                                    target="_blank"
                                    className="flex items-center text-sm font-poppins font-medium text-[#2563EB]"
                                  >
                                    More Details
                                  </a>
                                </Link>

                                <FontAwesomeIcon icon={faAngleRight} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* MOBILE VIEW FOR INSPECT AND MORE DETAIL ENDS HERE) */}

                      {/* BID TIMING SHOW STARTS HERE */}
                      <div className="flex sm:max-md:flex-row flex-col items-center  justify-center  p-4 space-y-2">
                        <div className="w-full max-sm:flex flex-col sm:max-md:w-1/2 sm:max-md:self-start    sm:max-md:text-left space-y-2 mt-1 sm:mt-2 ">
                          <p className="sm:max-md:text-base md:text-left">
                            {" "}
                            {SecondsLeft(item)}
                          </p>

                          {/* <div className="w-full space-y-2 mt-4"> */}
                          <div className="flex justify-between sm:flex-col md:items-start sm:justify-left text-sm  text-gray-700 ">
                            <p className="text-[#646464] text-sm font-poppins">
                              Start Date
                            </p>
                            <p className="font-semibold font-poppins ">
                              {item?.event?.startDate
                                ? moment(item?.event?.startDate).format(
                                    "MMMM Do, YYYY ddd h:mm a"
                                  )
                                : "NA"}
                            </p>
                          </div>
                          <div className="flex justify-between sm:flex-col md:items-start text-sm  text-gray-700">
                            <p className="text-[#646464] text-sm font-poppins">
                              End Date
                            </p>
                            <p className="items-start font-semibold font-poppins">
                              {item?.bidTimeExpire
                                ? moment(item?.bidTimeExpire).format(
                                    "MMMM Do, YYYY ddd h:mm a"
                                  )
                                : "NA"}
                            </p>
                          </div>
                          {/* </div> */}
                        </div>
                      </div>
                      {/* BID TIMING SHOW ENDS HERE */}

                      {/* BID BOX FOR MOBILE VIEW STARTS HERE */}

                      <div className=" w-full mt-4  bg-[#E5E9F9] rounded-lg">
                        <div className="px-4 py-2">
                          <h2 className="text-base  text-gray-900  text-center font-poppins font-bold">
                            Bid Details
                          </h2>

                          <div className="space-y-2 mt-2 text-sm">
                            <div className="flex items-center justify-between  text-gray-700">
                              <span className="font-poppins font-medium text-sm text-[#646464]">
                                Start Price
                              </span>
                              <span className="font-bold text-base">
                                ₹ {item?.startPrice}
                              </span>
                            </div>
                            <div className="flex items-center justify-between  text-gray-700">
                              <span className="font-poppins font-medium text-sm text-[#646464]">
                                Reserve Price
                              </span>
                              <span className="font-bold text-base">
                                ₹ {item?.reservePrice}
                              </span>
                            </div>
                            <div className="flex items-center justify-between  text-gray-700">
                              <span className="font-poppins font-medium text-sm text-[#646464]">
                                Quote Increment
                              </span>
                              <span className="font-bold text-base">
                                ₹ {item?.quoteIncreament}
                              </span>
                            </div>
                            <div className="flex items-center justify-between  text-gray-700">
                              <span className="font-bold">Current Status</span>
                              {item?.userVehicleBidsCount && item?.myBidRank ? (
                                item?.myBidRank == 1 ? (
                                  <p className="space-x-2">
                                       <FontAwesomeIcon icon={faThumbsUp} />
<span
                                    style={{ color: "#00CC00" }}
                                    className="font-bold text-base"
                                  >
                                    Winning
                                  </span>
                                  </p>
                                  
                                ) : (
                                  <p className="space-x-2">
                                    <FontAwesomeIcon
                                            icon={faThumbsDown}
                                          />{" "}
                                  <span
                                    style={{ color: "#FF3333" }}
                                    className="font-bold text-base"
                                  >
                                    Losing
                                  </span>
                                  </p>
                                  
                                )
                              ) : (
                                <p className="space-x-2">
                                  <FontAwesomeIcon icon={faUserSlash} />{" "}
                                  <span
                                    style={{ color: "#CCCC00" }}
                                    className="font-bold text-base"
                                  >
                                    Not Enrolled
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <EnterBid
                            row={item}
                            call={CallBid}
                            event={data["event"]}
                          />
                        </div>
                      </div>
                      {/* BID BOX FOR MOBILE VIEW ENDS HERE */}
                    </div>
                    {/* VEHICLE INFORMATION, INSPECTION REPORT,BID TIMING  FOR MOBILE  ENDS HERE  */}
                  </div>
                  {/*  MOBILE VIEW ENDS HERE */}

                  {/* DESKTOP VIEW STARTS HERE */}
                  <div
                    key={`d${index}`}
                    className={`hidden  sm:flex sm:max-md:flex-col font-sans border-2  rounded relative   ${
                      moment(item?.bidTimeExpire).diff(moment(), "s") <= 120 &&
                      moment(item?.bidTimeExpire).diff(moment(), "s") > 0
                        ? "blink"
                        : ""
                    }`}
                    id={`parentcontainer-${index}`}
                  >
                    {/* image only for desktop view starts here */}
                    {item?.frontImage && (
                      <div
                        className="hidden sm:block flex-none w-70 h-56  sm:max-md:h-56 sm:max-md:w-full md:h-auto sm:w-60 relative p-6 hover:cursor-pointer"
                        onClick={() => {
                          // BindVehicleImage(item);
                          setImages((item?.frontImage).split(","));
                          setShowImageCarouselModal(true);
                        }}
                      >
                        <Image
                          alt=""
                          src={item?.frontImage}
                          layout="fill"
                          className="absolute inset-0 w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    {/* image only for desktop view ends here */}

                    {/* WORKBOOK MATCH, TITLE, IMAGE FOR MOBILE VIEW,VEHICLE INFORMATION, INOECTION REPORT FOR MOBILE AND DESKTOP STARTS HERE  */}
                    <div className="flex-auto p-3 lg:space-y-4 sm:p-6">
                      {/* workbook match and watchlist remove button starts here */}
                      <div className="mb-3 flex justify-between">
                        {find?.length > 0 && (
                          <Link href={`/workbook/${find[0].id}`}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Click here to view the workbook"
                              className="bg-blue-700 p-2 cursor-pointer rounded-md text-white animate-pulse"
                            >
                              WorkBook matched
                            </a>
                          </Link>
                        )}

                        <button
                          type="button"
                          className="
                         sm:hidden inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded text-red-700 "
                          onClick={() => removeFromWatchList(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                      {/* workbook match and watchlist remove button  ends here */}

                      {/* title starts here */}
                      <div className="sm:flex flex-wrap">
                        <div className="flex-auto">
                          <h1 className="   text-base sm:text-lg   font-bold sm:font-semibold text-blue-800 uppercase">
                            {item?.yearOfManufacture}
                            {item?.make}
                            {/* {item?.model} -{" "} */}
                            {item.registrationNumber}
                          </h1>
                          <div className="text-sm font-medium text-slate-700">
                            {item?.event?.seller?.name}
                          </div>
                        </div>
                      </div>
                      {/* title ends here */}

                      {/* vehicle information starts here */}
                      <div className="">
                        <dl className="grid grid-cols-3 gap-x-1 gap-y-2 sm:gap-x-4 sm:gap-y-3  ">
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Odometer
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.kmReading ?? "N/A"} km
                            </dd>
                          </div>
                          <div className="max-sm:hidden sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Ownership
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.ownership}
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              RC Book
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.rcStatus}
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Repo date
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {" "}
                              -
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Total Bids
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.totalBids}
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Bids Remaining
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.event?.noOfBids -
                                item?.userVehicleBidsCount}
                            </dd>
                          </div>
                          <div className="sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block ">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Rank
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal text-gray-900">
                              {item?.myBidRank ? item.myBidRank : "N/A"}
                            </dd>
                          </div>
                          <div className=" col-span-3 sm:col-span-1 flex max-sm:flex-col items-center justify-between sm:block  ">
                            {item?.event?.bidLock === "locked" ? (
                              <>
                                <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                  Current Quote
                                </dt>
                                <dd className="text-sm font-medium sm:font-normal text-gray-900">
                                  {item?.currentBidAmount ?? "N/A"}
                                </dd>
                              </>
                            ) : (
                              <>
                                <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                  Your Latest Quote
                                </dt>
                                <dd className="text-sm font-medium sm:font-normal text-gray-900">
                                  {item?.userVehicleBids?.length
                                    ? item?.userVehicleBids[0]?.amount
                                    : "N/A"}
                                </dd>
                              </>
                            )}
                          </div>
                        </dl>
                      </div>
                      {/* vehicle information ends here */}

                      {/* </div> */}
                      {/* DESKTOP  VIEW FOR INSPECT AND MORE DETAIL STARTS HERE) */}
                      <div className="hidden sm:flex space-x-4 mt-6 pt-4 pr-1 text-sm font-medium border-t border-slate-200">
                        <div className="flex-auto flex space-x-4">
                          <div className="mt-1 flex flex-row sm:flex-wrap sm:mt-0 space-x-2 sm:space-x-6 justify-around w-full  sm:max-md:justify-around sm:max-md:w-full ">
                            <div className="hidden sm:flex mt-2  items-center text-sm text-gray-500">
                              {!item.watchedByCount ? (
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  onClick={() => addToWatchList(item.id)}
                                >
                                  <PlusIcon
                                    className="-ml-0.5 mr-2 h-4 w-4"
                                    aria-hidden="true"
                                  />
                                  Add to watchlist
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  onClick={() => removeFromWatchList(item.id)}
                                >
                                  <MinusIcon
                                    className="-ml-0.5 mr-2 h-4 w-4"
                                    aria-hidden="true"
                                  />
                                  from watchlist
                                </button>
                              )}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-blue-800">
                              <DocumentReportIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-700"
                                aria-hidden="true"
                              />
                              Inspection Report
                            </div>
                            <div className="mt-2">
                              <Link href={`/vehicle/${item.id}`}>
                                <a
                                  target="_blank"
                                  className="flex items-center text-sm text-blue-800"
                                >
                                  <ClipboardListIcon
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-700"
                                    aria-hidden="true"
                                  />
                                  More Details
                                </a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* DESKTOP  VIEW FOR INSPECT AND MORE DETAIL ENDS HERE) */}
                    </div>
                    {/* WORKBOOK MATCH, TITLE, IMAGE FOR MOBILE VIEW,VEHICLE INFORMATION, INOECTION REPORT FOR MOBILE AND DESKTOP ENDS HERE  */}

                    {/* PARENT DIV THAT INCLUDE BID TIMING AND BID BOX FOR DESKTOP STARTS HERE */}
                    <div className="flex-none w-50   sm:max-md:w-full text-center mx-auto sm:w-60 sm:p-2 ">
                      {/* BID TIMING SHOW STARTS HERE */}
                      <div className="flex sm:max-md:flex-row flex-col items-center  justify-center  p-4 space-y-2">
                        <div className="w-full max-sm:flex flex-col sm:max-md:w-1/2 sm:max-md:self-start    sm:max-md:text-left space-y-2 mt-1 sm:mt-2 ">
                          <p className="sm:max-md:text-base md:text-left">
                            {" "}
                            {SecondsLeft(item)}
                          </p>

                          {/* <div className="w-full space-y-2 mt-4"> */}
                          <div className="flex justify-between sm:flex-col md:items-start sm:justify-left text-sm  text-gray-700 ">
                            <p className="font-semibold">Start Date</p>
                            <p className=" ">
                              {item?.event?.startDate
                                ? moment(item?.event?.startDate).format(
                                    "MMMM Do, YYYY ddd h:mm a"
                                  )
                                : "NA"}
                            </p>
                          </div>
                          <div className="flex justify-between sm:flex-col md:items-start text-sm  text-gray-700">
                            <p className="font-semibold">End Date</p>
                            <p className="items-start">
                              {item?.bidTimeExpire
                                ? moment(item?.bidTimeExpire).format(
                                    "MMMM Do, YYYY ddd h:mm a"
                                  )
                                : "NA"}
                            </p>
                          </div>
                          {/* </div> */}
                        </div>
                      </div>

                      {/* BID TIMING SHOW ENDS HERE */}

                      {/* bid box  for desktop  starts here */}
                      <div className="max-sm:hidden  w-full sm:max-md:w-1/2 md:w-full bg-gray-200 rounded-lg  p-0">
                        <div className="px-4 py-2">
                          <h2 className="text-sm font-semibold text-gray-900">
                            Bid Details
                          </h2>

                          <div className="space-y-2 mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-700">
                              <span>Start Price</span>
                              <span>{item?.startPrice}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-700">
                              <span>Reserve Price</span>
                              <span>{item?.reservePrice}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-700">
                              <span>Quote Increment</span>
                              <span>{item?.quoteIncreament}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-700">
                              <span>Current Status</span>
                              {item?.userVehicleBidsCount && item?.myBidRank ? (
                                item?.myBidRank == 1 ? (
                                  <span style={{ color: "#00CC00" }}>
                                    Winning
                                  </span>
                                ) : (
                                  <span style={{ color: "#FF3333" }}>
                                    Losing
                                  </span>
                                )
                              ) : (
                                <span style={{ color: "#CCCC00" }}>
                                  Not Enrolled
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <EnterBid
                            row={item}
                            call={CallBid}
                            event={data["event"]}
                          />
                        </div>
                      </div>

                      {/* bid box  for desktop ends here */}
                    </div>
                    {/* PARENT DIV THAT INCLUDE BID TIMING AND BID BOX FOR DESKTOP  ENDS HERE  */}
                  </div>
                  {/* DESKTOP VIEW ENDS HERE */}
                </>
              );
            })}
        </div>
      )}
      <ImageCarouselModal
        color="blue"
        open={showImageCarouselModal}
        close={() => setShowImageCarouselModal(false)}
        images={images}
      />
    </DashboardTemplate>
  );
}

const EnterBid = ({ row, call, event }) => {
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    if (event?.bidLock === "locked") {
      if (
        row?.currentBidAmount !== null &&
        row?.currentBidAmount !== undefined
      ) {
        setBidAmount(row?.currentBidAmount?.toString());
      }
    } else {
      if (
        row?.currentBidAmount !== null &&
        row?.currentBidAmount !== undefined
      ) {
        let amt = row?.userVehicleBids?.length
          ? row?.userVehicleBids[0].amount
          : row?.startPrice;
        setBidAmount(amt.toString());
      }
    }
  }, [event?.bidLock, row?.currentBidAmount]);

  const enrolled = row.userVehicleBidsCount > 0;

  return (
    <div>
      {event?.bidLock === "locked" ? (
        <input
          id="input"
          className="w-full border border-gray-500 px-5 py-2 placeholder-gray-500 focus:outline-none rounded-md"
          placeholder="Enter amount"
          // defaultValue={row.currentBidAmount !==0 ? row.currentBidAmount  :row.startPrice }
          value={bidAmount !== "0" ? bidAmount : row.startPrice}
          onChange={(e) => {
            setBidAmount(e.target.value.replace(/\D/g, ""));
          }}
        />
      ) : (
        <input
          id="input"
          className="w-full border border-gray-400 px-5 py-2 placeholder-gray-500 focus:outline-none rounded-md"
          placeholder="Enter amount"
          // defaultValue={row.currentBidAmount !==0 ? row.currentBidAmount  :row.startPrice }
          value={bidAmount !== "0" ? bidAmount : row.startPrice}
          onChange={(e) => {
            setBidAmount(e.target.value.replace(/\D/g, ""));
          }}
        />
      )}

      <button
        type="submit"
        className="mt-2 w-full flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        onClick={() => {
          if (parseInt(bidAmount) === 0) {
            call(row.startPrice, row.id);
            setTimeout(() => {
              ("");
              // setBidAmount("");
            }, 1000);
          } else if (
            row?.event?.bidLock === "locked" &&
            row.currentBidAmount >= parseInt(bidAmount)
          ) {
            Swal.fire({
              title: "Bid amount should be greater than last bid",
              confirmButtonText: "OK",
              position: "top",
            });
          } else if (parseInt(bidAmount) % row.quoteIncreament !== 0) {
            Swal.fire({
              title:
                "Bid amount should be greater than minimum quote increment.",
              confirmButtonText: "OK",
              position: "top",
            });
          } else if (row.startPrice > parseInt(bidAmount)) {
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
            call(bidAmount, row.id);
            setTimeout(() => {
              // setBidAmount("");
            }, 1000);
          }
        }}
      >
        Bid Now
      </button>
    </div>
  );
};

export default withPrivateRoute(WatchList);
