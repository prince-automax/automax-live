import {
  ClipboardListIcon,
  DocumentReportIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/outline";
import {
  CreateBidMutationVariables,
  GetEventQuery,
  LiveWatchListItemQueryVariables,
  OrderDirection,
  QueryQueryVariables,
  useAddToWatchListMutation,
  useCreateBidMutation,
  useGetEventQuery,
  useLiveWatchListItemQuery,
  useQueryQuery,
  useUserWorkBookQuery,
  UserWorkBookQueryVariables,
  useFindAuctionsQuery,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardTemplate from "../../components/templates/DashboardTemplate";
import Loader from "../../components/ui/Loader";
import withPrivateRoute from "../../utils/withPrivateRoute";
import { useQueryClient } from "react-query";
import { SecondsToDhms } from "@utils/common";
import TermsConditions from "@components/templates/TermsConditions";
import InspectionReportModal from "@components/modals/InspectionReportModal";
import ImageCarouselModal from "@components/modals/ImageCarouselModal";
import Swal from "sweetalert2";
// import TermsAndCondtionsModal from  "@components/modals/TermsAndConditionModal"
import {
  faThumbsUp,
faThumbsDown,
faUserSlash
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Events() {
  const router = useRouter();
  const { id, type } = router.query;
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [usrid, setUsrid] = useState("");
  const [interval, setAPIInterval] = useState(2000);
  const queryClient = useQueryClient();
  const [tick, setTick] = useState(0);
  const [serverTime, setserverTime] = useState(null);
  const [showInspectionReportModal, setShowInspectionReportModal] =
    useState(false);
  const [showImageCarouselModal, setShowImageCarouselModal] = useState(false);
  const [images, setImages] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [isNotInWatchlist, setIsNotInWatchlist] = useState(true);
  const [wathclistVehicls, setWatchlistvehicls] = useState([]);
  const [demo, setDemo] = useState([]);

  // useEffect(()=>{
  //   TermsAndCondtionsModal()
  // },[])

  const handleClick = () => {
    setShowCode(!showCode);
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
      setUsrid(id);
    }
  }, []);

  const { data, isLoading } = useGetEventQuery<GetEventQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      where: { id: id as string },
      orderBy: [
        {
          bidTimeExpire: OrderDirection.Asc,
        },
      ],
      take: 1,
      skip: 0,
      userVehicleBidsOrderBy2: [{ amount: OrderDirection.Desc }],
    },
    { cacheTime: 5, refetchInterval: interval, enabled: accessToken !== "" }
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

  const callCreateBid = useCreateBidMutation<CreateBidMutationVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` })
  );

  function SecondsLeft(item) {
    try {
      if (item) {
        const expiryTime = moment(item.bidTimeExpire);
        const currentTime = moment(serverTime).add(tick, "seconds");
        const diff = expiryTime.diff(currentTime, "seconds");
        if (diff > 0) {
          return (
            <div className="w-full">
              <div className="text-xs">End's in</div>
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

  function IsCompleted(item) {
    try {
      if (item) {
        const expiryTime = moment(item.bidTimeExpire);
        const currentTime = moment(serverTime).add(tick, "seconds");
        const diff = expiryTime.diff(currentTime, "seconds");

        if (diff > 0) {
          return true;
        } else {
          return false;
        }
      }
    } catch {}
    return true;
  }

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

  const watchListMutation = useAddToWatchListMutation(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      onSuccess() {
        queryClient.invalidateQueries("getEvent");
      },
    }
  );

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

  let filteredArray = data?.event?.vehicles?.map((item, index) => {
    return item?.watchedBy?.filter(
      (watchlistUser) => watchlistUser?.id === userId
    );
  });

  return (
    <DashboardTemplate
      heading={
        "Event ID#" +
        data?.event?.eventNo +
        " " +
        data?.event?.seller?.name +
        ",  " +
        data?.event?.location?.name
      }
      subHeading={"List of all vehicles in this event"}
    >
      {data && data.event && data.event.termsAndConditions ? (
        <TermsConditions data={data.event.termsAndConditions} />
      ) : null}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6 mt-8 ">
          {!data?.event?.vehicles?.length && <div>No Vehicles Found</div>}
          {data?.event?.vehicles?.map((item, index) => {
            const expiryTime = moment(item.bidTimeExpire);
            const currentTime = moment(serverTime).add(tick, "seconds");
            const diff = expiryTime.diff(currentTime, "seconds");
            if ((diff > 0 && type == "l") || type == "c") {
              {
                const find = (
                  workbook?.workSheets as any[] | undefined
                )?.filter(
                  (wb) => wb.registrationNumber === item.registrationNumber
                );

                return (
                  <div
                    key={`d${index}`}
                    className={`sm:flex sm:max-md:flex-col font-sans border  rounded  ${
                      moment(item?.bidTimeExpire).diff(moment(), "s") <= 120 &&
                      moment(item?.bidTimeExpire).diff(moment(), "s") > 0
                        ? "blink"
                        : ""
                    } ${
                      index % 2 == 0
                        ? "border-yellow-300 bg-gray-100 "
                        : "border-gray-300 bg-slate-50"
                    }  `}
                  >
                    {item?.frontImage && (
                      <div
                        className="flex-none w-70 h-56  sm:max-md:h-56 sm:max-md:w-full md:h-auto sm:w-60 relative p-6 hover:cursor-pointer"
                        onClick={() => {
                          // BindVehicleImage(item);
                          setImages((item?.frontImage).split(","));

                          setShowImageCarouselModal(true);
                        }}
                      >
                        <Image
                          alt="img"
                          src={item?.frontImage}
                          layout="fill"
                          className="absolute inset-0 w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    <div className={`flex-auto p-3 lg:space-y-4 sm:p-6 `}>
                      <div className="mb-3">
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
                      </div>

                      <div className="sm:flex flex-wrap">
                        <div className="flex-auto">
                          <h1 className="   text-base sm:text-lg   font-bold sm:font-semibold text-blue-800 uppercase">
                            {item?.yearOfManufacture} {item?.make} -
                            {item.registrationNumber}
                          </h1>
                          <div className="text-sm font-medium text-black">
                            {data?.event?.seller?.name}
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <button
                          className=" sm:hidden flex justify-center w-full  text-black font-normal py-1 px-4 rounded"
                          onClick={handleClick}
                        >
                          {showCode ? (
                            <span className="text-blue-800 font-semibold">
                              {" "}
                              Hide Details
                            </span>
                          ) : (
                            <span className="text-blue-800 font-semibold">
                              {" "}
                              Show Details
                            </span>
                          )}
                        </button>
                        <div
                          className={`${
                            showCode ? "block mt-2 sm:mt-4" : "hidden"
                          } sm:block  `}
                        >
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3">
                            <div className="sm:col-span-1 flex items-center justify-between sm:block">
                              <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                Odometer
                              </dt>
                              <dd className="text-sm font-medium sm:font-normal text-gray-900">
                                {item?.kmReading ?? "N/A"} km
                              </dd>
                            </div>
                            {/* <div className=" sm:col-span-1 flex items-center justify-between sm:block">
                            <dt className="text-sm font-bold sm:font-medium text-gray-500">
                              Ownership
                            </dt>
                            <dd className="text-sm font-medium sm:font-normal file: text-gray-900">
                              {item?.ownership}
                            </dd>
                          </div> */}
                            <div className="sm:col-span-1 flex items-center justify-between sm:block">
                              <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                RC Book
                              </dt>
                              <dd className="text-sm font-medium sm:font-normal text-gray-900">
                                {item?.rcStatus}
                              </dd>
                            </div>
                            <div className="sm:col-span-1 flex items-center justify-between sm:block">
                              <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                Repo date
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {item?.repoDt
                                  ? new Date(item?.repoDt).toLocaleDateString()
                                  : "N/A"}
                              </dd>
                            </div>
                            <div className="sm:col-span-1 flex items-center justify-between sm:block">
                              <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                Total Bids
                              </dt>
                              <dd className="text-sm font-medium sm:font-normal text-gray-900">
                                {item?.totalBids}
                              </dd>
                            </div>
                            <div className="sm:col-span-1 flex items-center justify-between sm:block">
                              <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                Bids Remaining
                              </dt>
                              <dd className="text-sm font-medium sm:font-normal text-gray-900">
                                {data?.event?.noOfBids -
                                  item?.userVehicleBidsCount}
                              </dd>
                            </div>
                            <div className="sm:col-span-1 flex items-center justify-between sm:block">
                              <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                Rank
                              </dt>
                              <dd className="text-base font-medium sm:font-normal text-gray-900">
                                {item?.myBidRank ? item.myBidRank : "N/A"}
                              </dd>
                            </div>
                            {data.event.bidLock === "locked" ? (
                              <div className="sm:col-span-1 flex items-center justify-between sm:block">
                                <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                  Current Quote
                                </dt>
                                <dd className="text-base font-medium sm:font-normal text-gray-900">
                                  {item?.currentBidAmount ?? "N/A"}
                                </dd>
                              </div>
                            ) : (
                              <div className="sm:col-span-1 flex items-center justify-between sm:block">
                                <dt className="text-sm font-bold sm:font-medium text-gray-500">
                                  Your Latest Quote
                                </dt>
                                <dd className="text-base font-medium sm:font-normal text-gray-900">
                                  {item?.userVehicleBids?.length
                                    ? item?.userVehicleBids[0].amount
                                    : "N/A"}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      </div>

                      <div className="flex  space-x-4 mt-6 pt-4 text-sm font-medium border-t  border-slate-300">
                        <div className="flex-auto flex space-x-4">
                          <div className="mt-1 flex flex-row sm:flex-wrap sm:mt-0 space-x-2 sm:space-x-6 justify-around w-full  sm:max-md:justify-around sm:max-md:w-full ">
                            {IsCompleted(item) && (
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                {item?.watchedBy?.filter(
                                  (watchlistUser) =>
                                    watchlistUser?.id === userId
                                ).length > 0 ? (
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs sm:text-sm  leading-4 font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => removeFromWatchList(item.id)}
                                  >
                                    <MinusIcon
                                      className="-ml-0.5 mr-2 h-4 w-4"
                                      aria-hidden="true"
                                    />
                                    from watchlist
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs sm:text-sm leading-4 font-medium rounded text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => addToWatchList(item.id)}
                                  >
                                    <PlusIcon
                                      className="-ml-0.5 mr-2 h-4 w-4"
                                      aria-hidden="true"
                                    />
                                    Add to watchlist
                                  </button>
                                )}
                              </div>
                            )}

                            {/* {IsCompleted(item) && (
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              {!(item.watchedByCount > 0) ? (
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
                          )} */}

                            <div
                              className="mt-2 flex items-center text-sm text-blue-800 hover:cursor-pointer hover:text-blue-600"
                              // onClick={() => setShowInspectionReportModal(true)}
                              onClick={() => {}}
                            >
                              {/* <DocumentReportIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-700"
                              aria-hidden="true"
                            />
                            Inspection Report
                             */}
                              <Link href={item.inspectionLink}>
                                <a
                                  target="_blank"
                                  className="flex items-center text-xs sm:text-sm  text-blue-800"
                                >
                                  <DocumentReportIcon
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-700"
                                    aria-hidden="true"
                                  />
                                  Inspection Report
                                </a>
                              </Link>
                            </div>
                            <div className="mt-2">
                              <Link href={`/vehicle/${item.id}`}>
                                <a
                                  target="_blank"
                                  className="flex items-center text-xs sm:text-sm  text-blue-800"
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
                    </div>
                    {/* starts at herer */}
                    <div className="flex-none w-50   sm:max-md:w-full text-center mx-auto sm:w-60 ">
                      <div className="flex sm:max-md:flex-row flex-col items-center  justify-center  relative p-4 space-y-2">
                        <div className="w-full  sm:max-md:w-1/2 sm:max-md:self-start    sm:max-md:text-left space-y-2 mt-1 sm:mt-2 ">
                          <span className="sm:max-md:text-base md:text-left">
                            {" "}
                            {SecondsLeft(item)}
                          </span>
                          <div className="hidden sm:block">
                            <div className=" flex flex-col md:items-start justify-left text-xs sm:max-md:text-sm text-gray-700">
                              <span className="font-semibold">Start Date</span>
                              <span>
                                {data.event.startDate
                                  ? moment(data.event.startDate).format(
                                      "MMMM Do, YYYY ddd h:mm a"
                                    )
                                  : "NA"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col md:items-start text-xs sm:max-md:text-sm text-gray-700">
                            <span className="font-semibold">End Date</span>
                            <span>
                              {item?.bidTimeExpire
                                ? moment(item?.bidTimeExpire).format(
                                    "MMMM Do, YYYY ddd h:mm a"
                                  )
                                : "NA"}
                            </span>
                          </div>
                        </div>

                        <div className=" w-64 sm:max-md:w-1/2 md:w-full bg-gray-200 rounded-lg">
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
                              <div className="flex  items-center justify-between text-xs text-gray-700">
                                <span>Current Status</span>
                                {item.userVehicleBidsCount && item.myBidRank ? (
                                  item.myBidRank == 1 ? (
                                    <p className="space-x-2"><FontAwesomeIcon icon={faThumbsUp} /><span style={{ color: "#00CC00" }}>
                                    Winning
                                  </span></p>
                                  ) : (
                                 <p className="space-x-2"> <FontAwesomeIcon icon={faThumbsDown} />  <span style={{ color: "#FF3333" }}>
                                 Losing
                               </span></p>
                                  )
                                ) : (
                                  <p className="space-x-2"><FontAwesomeIcon icon={faUserSlash} /> <span style={{ color: "#CCCC00" }}>
                                  Not Enrolled
                                </span></p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            {IsCompleted(item) && (
                              <EnterBid
                                row={item}
                                call={CallBid}
                                event={data["event"]}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end here */}
                  </div>
                );
              }
            } else {
              return null;
            }
          })}
        </div>
      )}
      <InspectionReportModal
        color="blue"
        open={showInspectionReportModal}
        close={() => setShowInspectionReportModal(false)}
      />
      <ImageCarouselModal
        color="blue"
        open={showImageCarouselModal}
        close={() => setShowImageCarouselModal(false)}
        images={images}
      />
    </DashboardTemplate>
  );
}

export default withPrivateRoute(Events);

const EnterBid = ({ row, call, event }) => {
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    if (event.bidLock === "locked") {
      if (row.currentBidAmount !== null && row.currentBidAmount !== undefined) {
        setBidAmount(row.currentBidAmount.toString());
      }
    } else {
      if (row.currentBidAmount !== null && row.currentBidAmount !== undefined) {
        let amt = row?.userVehicleBids?.length
          ? row?.userVehicleBids[0].amount
          : row.startPrice;
        setBidAmount(amt.toString());
      }
    }
  }, [event.bidLock, row.currentBidAmount]);

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
              // setBidAmount("");
            }, 1000);
          } else if (
            event?.bidLock === "locked" &&
            row?.currentBidAmount >= parseInt(bidAmount)
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
