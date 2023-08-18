import { useState, useMemo } from "react";
import DashboardTemplate from '../components/templates/DashboardTemplate'
import withPrivateRoute from "../utils/withPrivateRoute";
import Datatable from '../components/ui/Datatable'
import Loader from '../components/ui/Loader'


function MyWins() {

    const isLoading = false;

    const data = [
        {
            auctionId: "103118",
            auctionDetails: "Auction Details",
            vehicleDetails: "Vehicle Details",
            winningDetails: "11 August 2022 11:00 AM",
        },
        {
            auctionId: "203118",
            auctionDetails: "Auction Details",
            vehicleDetails: "Vehicle Details",
            winningDetails: "11 August 2022 11:00 AM",
        },
    ]

    const columns = useMemo(
        () => [
            {
                Header: 'Auction Id',
                accessor: 'auctionId',
            },
            {
                Header: 'Auction Details',
                accessor: 'auctionDetails',
                Cell: ({ row }) => <AuctionDetails />,
            },
            {
                Header: 'Vehicle Details',
                accessor: 'vehicleDetails',
                Cell: ({ row }) => <VehicleDetails />,
            },
            {
                Header: 'Win Details',
                Cell: ({ row }) => <WinDetails />,
            },
        ],
        []
    );

    return (
        <DashboardTemplate heading="My Wins">
            <div>
                {isLoading
                    ? <Loader />
                    :
                    <>
                        {data && data.length > 0
                            ? <Datatable tableData={data} tableColumns={columns} hideSearch />
                            : <div>No vehicles found</div>}
                    </>
                }
            </div>
        </DashboardTemplate>
    )
}




function AuctionDetails() {
    return (
        <div className="whitespace-nowrap sm:divide-y sm:divide-gray-200">
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Details
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    Ashok Leyland YOM-2020 RC-Y
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Seller Ref
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    9636952
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Seller Name
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    HDFC Bank
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Event ID
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    103118
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Event Name
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    HDFC Kerala Auction
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Start Date
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    21 August 2022 01:00 PM
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    End Date
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    23 August 2022 01:00 PM
                </dd>
            </div>
        </div>
    )
}


function VehicleDetails() {
    return (
        <div className="whitespace-nowrap  sm:divide-y sm:divide-gray-200">
            <div className="whitespace-nowrap  py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Vehicle Type
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    Commercial Vehicle
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Make
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    Ashok Leyland
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Model
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    Partner 6 Wheel 17 Feet
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Variant
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    103118
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Kms Run
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    29102
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Reg No
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    KL 40
                </dd>
            </div>
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Engine No
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">
                    MB128SAJOI
                </dd>
            </div>
        </div>
    )
}



function WinDetails() {
    const [updatePrice, setUpdatePrice] = useState(false);
    return (
        <div className="whitespace-nowrap space-y-4 flex flex-col items-start">
            <div>
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Winning Amount
                </dt>
                <dd className="whitespace-nowrap mt-1 text-lg font-semibold text-gray-900">
                    Rs. 1,00,000
                </dd>
            </div>
            <div>
                {!updatePrice
                    ? <button type="button" onClick={() => setUpdatePrice(true)} className="text-xs text-indigo-700 underline">Update price</button>
                    :
                    <>
                        <div className="w-40 border border-blue-700 rounded p-4">
                            <label htmlFor="text" className="block text-xs font-medium text-gray-700">
                                New amount
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="text"
                                    id="text"
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setUpdatePrice(false)}
                                className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                            >
                                Update
                            </button>
                        </div>
                    </>
                }
            </div>
            <div>
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Wining Date
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900">
                    21 August 2022 01:00 PM
                </dd>
            </div>
            <div>
                <dt className="whitespace-nowrap text-xs font-medium text-gray-500">
                    Winning Status
                </dt>
                <dd className="whitespace-nowrap mt-1 text-xs text-gray-900">
                    Fulfilled by HDFC
                </dd>
            </div>
            <button
                type="button"
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
            >
                Print Documents
            </button>
        </div>
    )
}

export default withPrivateRoute(MyWins)