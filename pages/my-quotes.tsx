import { useState, useMemo, useEffect } from "react";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import withPrivateRoute from "../utils/withPrivateRoute";
import Datatable from "../components/ui/Datatable";
import Loader from "../components/ui/Loader";

import {
    useActiveBidsQuery,
    ActiveBidsQueryVariables,
    OrderDirection,
    ActiveBidsQuery,
    UpdateVehicleMutationVariables,
    useUpdateVehicleMutation,
    useMyQuotesQuery,
    MyQuotesQuery,
    useQueryQuery,
    QueryQueryVariables,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import moment from "moment";

function MyQuotes() {
    const [accessToken, setAccessToken] = useState("");
    const [userId, setUserId] = useState("");
    const [apiInterval, setAPIInterval] = useState(60000);
    const [tick, setTick] = useState(0);
    const [serverTime, setserverTime] = useState();
    // const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const timerR = setInterval(() => {
            setTick((tic) => tic + 1);
        }, 1000);
        return () => clearInterval(timerR);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            const id = localStorage.getItem("id");
            setAccessToken(token);
            setUserId(id);
        }
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

    const { data, isLoading } = useMyQuotesQuery<MyQuotesQuery>(
        graphQLClient({ Authorization: `Bearer ${accessToken}` }),
        {
            where: {
                userVehicleBids: {
                    some: {
                        user: {
                            id: {
                                equals: userId,
                            },
                        },
                    },
                },
                bidTimeExpire: {
                    lt: serverTime,
                },

            },
            take: 1,
            orderBy: [
                {
                    createdAt: OrderDirection.Desc,
                }
            ],
            vehiclesOrderBy2: [
                {
                    updatedAt: OrderDirection.Desc,
                },
            ],

        },
        {
            cacheTime: 0,
            refetchInterval: apiInterval,
            enabled: accessToken != "" && userId != "",
        }
    );
    console.log("thi is data",data);
    
    const callUpdateVehicle =
        useUpdateVehicleMutation<UpdateVehicleMutationVariables>(
            graphQLClient({ Authorization: `Bearer ${accessToken}` })
        );

    useEffect(() => {
        if (data?.vehicles) {
            // setAPIInterval(0);
            // setEnabled(false);
        }
    }, [data]);

    const columns = useMemo(
        () => [
            {
                Header: "Auction Id",
                Cell: ({row}) => (
                    
                    <div>
                        <span>{row?.original?.event?.eventNo}</span>
                        
                        
                    </div>
                ),
            },
            {
                Header: "Auction Details",
                accessor: "auctionDetails",
                Cell: ({ row }) => <AuctionDetails row={row?.original?.event} />,
            },
            {
                Header: "Vehicle Details",
                accessor: "vehicleDetails",
                Cell: ({ row }) => <VehicleDetails row={row?.original} />,
                
                
            },
            {
                Header: "Win Details",
                Cell: ({ row }) => <WinDetails row={row?.original} />,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <DashboardTemplate heading="My Quotes">
            <div>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {data?.vehicles.length > 0 ? (
                            <Datatable
                                tableData={data?.vehicles}
                                tableColumns={columns}
                                hideSearch
                            />
                        ) : (
                            <div>No Quotes found</div>
                        )}
                    </>
                )}
            </div>
        </DashboardTemplate>
    );
    // function AuctionId(){
    //     return (
    //         <div></div>
    //     )
    // }

    function AuctionDetails({ row }) {
        return (
            <div className="whitespace-nowrap sm:divide-y sm:divide-gray-200">
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Auction Type 
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        <span style={{ color: "green", fontSize: 14 }}>{row?.eventCategory}</span>
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Seller Name
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.seller?.name}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Event ID
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.eventNo}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Category
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.eventType[0]?.name}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Location
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.location?.state?.name}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Start Date
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.startDate
                            ? moment(row?.startDate).format("MMMM Do, YYYY ddd h:mm a")
                            : ""}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        End Date
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.startDate
                            ? moment(row?.endDate).format("MMMM Do, YYYY ddd h:mm a")
                            : ""}
                    </dd>
                </div>
            </div>
        );
    }

    function VehicleDetails({ row }) {
        return (
            <div className="whitespace-nowrap  sm:divide-y sm:divide-gray-200">
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Make
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.make ?? "-"}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Model
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.model ?? "-"}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Variant
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.varient ?? "-"}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Kms Run
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.kmReading ?? "-"}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Reg No
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.registrationNumber ?? "-"}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Engine No
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.engineNo ?? "-"}
                    </dd>
                </div>
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Chassis No
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                        {row?.chassisNo ?? "-"}
                    </dd>
                </div>
            </div>
        );
    }

    function CallUpdatePrice(vehicleId, amount, setUpdatePrice) {
        //
        const confirmed = confirm(
            `Are you sure to update the bid to\nRs. ${amount}`
        );
        if (confirmed) {
            callUpdateVehicle
                .mutateAsync({
                    data: {
                        bidAmountUpdate: parseInt(amount),
                    },
                    where: {
                        id: vehicleId,
                    },
                })
                .then(() => {
                    alert("Your bid has been updated");
                })
                .catch((error) => {
                    // alert(error.message);
                });
        }
        setUpdatePrice(false);
    }

    function WinDetails({ row }) {
        const [amount, setAmount] = useState("");
        const [updatePrice, setUpdatePrice] = useState(false);
        return (
            <div className="whitespace-nowrap space-y-4 flex flex-col items-start">
                <div>
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        {row &&
                            row?.userVehicleBids[0] &&
                            row?.userVehicleBids[0]?.bidVehicle?.currentBidUser ? (
                            <span style={{ color: "green" }}>Won</span>
                        ) : (
                            <span style={{ color: "red" }}>Lost</span>
                        )}
                    </dt>
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        <span>Amount</span>
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-lg font-semibold text-gray-900">
                        Rs. {row?.userVehicleBids[0]?.amount?.toLocaleString("en-IN")}
                    </dd>
                </div>
                <div>
                    {!updatePrice ? (
                        row?.bidStatus == "pending" &&
                        row?.userVehicleBids[0]?.bidVehicle?.currentBidUser && (
                            <button
                                type="button"
                                onClick={() => setUpdatePrice(true)}
                                className="text-xs text-indigo-700 underline"
                            >
                                {row?.bidAmountUpdate > 0
                                    ? `Update price( Current Amount:
                ${row?.bidAmountUpdate})`
                                    : `Update price`}
                            </button>
                        )
                    ) : (
                        <>
                            <div className="w-40 border border-blue-700 rounded p-4">
                                <label
                                    htmlFor="text"
                                    className="block text-xs font-medium text-gray-700"
                                >
                                    New amount
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="text"
                                        id="text"
                                        onChange={(e) => {
                                            setAmount(e.target.value.replace(/\D/g, ""));
                                        }}
                                        value={amount}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        CallUpdatePrice(row?.id, amount, setUpdatePrice);
                                    }}
                                    className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUpdatePrice(false)}
                                    className="px-2 text-xs text-indigo-700 underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <div>
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        {row && row?.currentBidUser && row?.currentBidUser.id
                            ? "Winning Date"
                            : "Bidding Date"}
                    </dt>
                    <dd className="whitespace-nowrap mt-1 text-xs text-gray-900">
                        {row?.bidTimeExpire
                            ? moment(row?.bidTimeExpire).format("MMMM Do, YYYY ddd h:mm a")
                            : ""}
                    </dd>
                </div>
                <div>
                    <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                        Status
                    </dt>
                    <dd
                        className={
                            row?.bidStatus == "pending"
                                ? "whitespace-nowrap mt-1 text-xs text-yellow-500"
                                : row?.bidStatus == "approved"
                                    ? "whitespace-nowrap mt-1 text-xs text-blue-500"
                                    : row?.bidStatus == "fulfilled"
                                        ? "whitespace-nowrap mt-1 text-xs text-green-500"
                                        : row?.bidStatus == "declined"
                                            ? "whitespace-nowrap mt-1 text-xs text-red-500"
                                            : "whitespace-nowrap mt-1 text-xs text-gray-500"
                        }
                    >
                        {row?.bidStatus?.toUpperCase()}
                    </dd>
                </div>
                {row?.bidStatus == "fulfilled" && (
                    <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                    >
                        Print Documents
                    </button>
                )}
            </div>
        );
    }
}

export default withPrivateRoute(MyQuotes);
