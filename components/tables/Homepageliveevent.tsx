import { useEffect, useState, useMemo } from "react";
import Datatable from "../ui/Datatable";
import Loader from "../ui/Loader";
import moment from "moment";
import {
  CalendarIcon,
  DocumentDownloadIcon,
  PrinterIcon,
} from "@heroicons/react/outline";
import AlertModal from "../ui/AlertModal";
import {
  LiveEventsQuery,
  useLiveEventsQuery,
  GetUserQueryVariables,
  useGetUserQuery,
  useUserWorkBookQuery,
  UserWorkBookQueryVariables,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import Router from "next/router";
import Link from "next/link";
import DataTableUILogout from "../ui/DataTableUILogout";

export  function LiveEventHomePage({
  showHeadings,
  hideSearch,
  allowDownload,
  eventCategory = "online",
}) {
  const [accessToken, setAccessToken] = useState("");
  const [registered, setRegistered] = useState(false);
  const [registeredStatus, setRegisteredStatus] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAccessToken(token);
    }
  }, []);

  const variablesLive = {
    skip: 0,
    take: 10,
    where: {
      OR: [
        {
          eventCategory: {
            equals: "online",
          },
        },
        {
          eventCategory: {
            equals: "open",
          },
        },
      ],
    },
  };
  const { data, refetch, isLoading } = useLiveEventsQuery<LiveEventsQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    variablesLive
  );

  

  useEffect(() => {
    refetch();
  }, [data]);

  const columns = [
    {
      Header: "Event Date",
      accessor: "startDate",
      Cell: ({ cell: { value } }) => StartDate(value),
    },
    {
      Header: "Seller",
      accessor: "seller.name",
    },
    { Header: "Event Type", accessor: "eventCategory" },
   
  
    {
      Header: "Location",
      accessor: "location.name",
    },
    {
      Header: "Category",
      accessor: "eventType",
      Cell: ({ cell: { value } }) => RenderEventTypes(value),
    },
    {
      Header: "Closing Date",
      accessor: "endDate",
      Cell: ({ cell: { value } }) => EndDate(value),
    },
  ];

  return (
    <>
      <div className="relative bg-white ">
        <div className="mx-auto max-w-md text-center  sm:max-w-3xl lg:max-w-7xl">
          {showHeadings && (
            <div className=" ">
              {data?.liveEvents?.length == 0 && (
                <p className="mt-px text-xl font-extrabold text-gray-900 tracking-tight sm:text-xl animate-pulse">
                  NO LIVE EVENTS ...
                </p>
              )}
              {/* <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Most recent events
              </p>
              <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                Open auction or closed auction!! Know your deal better with list
                of locations, type of auction, date and many more features, An
                updates on our most recent events.
              </p> */}
            </div>
          )}

          {isLoading ? (
            <Loader />
          ) : (
            <>
              {/* {!data?.liveEvents?.length && <div>No Auctions Found</div>} */}
              {/* {data?.liveEvents && data?.liveEvents?.length > 0 && ( */}
              <>
                <div className="sm:hidden">
                  {data?.liveEvents?.map((event, eventIdx) => {
                    return (
                      <MobielViewCard
                        key={eventIdx}
                        index1={eventIdx}
                        event={event}
                        allowDownload={allowDownload}
                        registered={registered}
                        registeredStatus={registeredStatus}
                        // noOfVehicles={event?.v}
                      />
                    );
                  })}
                </div>
                <div className="hidden sm:block">
                  <Datatable
                    hideSearch={hideSearch}
                    tableData={data?.liveEvents}
                    tableColumns={columns}
                  />
                </div>
              </>
              {/* )} */}
            </>
          )}
        </div>
      </div>
    </>
  );
}

LiveEventHomePage.defaultProps = {
  hideSearch: false,
  allowDownload: false,
};

function vechileCount(value) {
 

  return (
    <div>
      <span>{value}</span>
    </div>
  );
}

function View(value, eventCategory) {
 

  return (
    <div>
      <Link
        href={`/${
          eventCategory === "open" ? "open-auctions" : "events"
        }/${value}?type=l`}
      >
        <a target="_blank">
          <div>
            <span className="text-emerald-600 font-extrabold">Bid Now</span>
          </div>
        </a>
      </Link>
    </div>
  );
}

function RenderEventTypes(eventTypes) {
  if (eventTypes && eventTypes.length > 0) {
    return (
      <div>
        {eventTypes.map((type, index) => {
          return (
            <div key={`d${index}`}>
              <span>{type.name}</span>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div />;
  }
}

function StartDate(value) {
  return (
    <div>
      <div className="flex space-x-2">
        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
        <div className="space-y-1 font-medium">
          <div className="text-sm text-gray-900 whitespace-nowrap">
            <span>{moment(value).format("MMMM Do, YYYY")}</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-200 rounded">
            <span className="text-left">
              {moment(value).format("ddd h:mm a")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EndDate(value) {
  return (
    <div>
      <div className="flex space-x-2">
        <div className="space-y-1 font-medium">
          <div className="text-sm text-gray-900 whitespace-nowrap">
            <span>{moment(value).format("MMMM Do, YYYY")}</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-200 rounded">
            <span className="text-left">
              {moment(value).format("ddd h:mm a")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadButton({ file, allowDownload }) {


  const [showAlert, setShowAlert] = useState(false);

  const showAlertModal = () => {
    setShowAlert(true);
  };

  const redirectToLoginPage = () => {
    setShowAlert(false);
    Router.push("/login");
  };

  return (
    <>
      {allowDownload ? (
        <>
          {file && file?.url && (
            <a
              href={`${process.env.BASE_URL}${file?.url}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <DocumentDownloadIcon className="h-8 w-8 text-gray-600 hover:text-green-600" />
            </a>
          )}
        </>
      ) : (
        <>
          <button onClick={() => showAlertModal()}>
            <DocumentDownloadIcon className="h-8 w-8 text-gray-600 hover:text-green-600" />
          </button>
        </>
      )}

      {showAlert && (
        <AlertModal
          title="Authentication Required!"
          description="Please login or register to download the file."
          handleClick={redirectToLoginPage}
          open={showAlert}
          close={() => setShowAlert(false)}
          buttonLabel="Login"
        />
      )}
    </>
  );
}

LiveEventHomePage.defaultProps = {
  showHeadings: true,
};

function MobielViewCard({
  index1,
  event,
  allowDownload,
  registered,
  registeredStatus,
}) {
  const [showAlert, setShowAlert] = useState(false);

  const showAlertModal = () => {
    setShowAlert(true);
  };

  const redirectToLoginPage = () => {
    setShowAlert(false);
    Router.push("/login");
  };

  return (
    <>
      <div className="w-full">
        <DataTableUILogout
          index1={index1}
          event={event}
          allowDownload={allowDownload}
          registered={registered}
          registeredStatus={registeredStatus}
        />
      </div>

      {showAlert && (
        <AlertModal
          title="Authentication Required!"
          description="Please login or register to download the file."
          handleClick={redirectToLoginPage}
          open={showAlert}
          close={() => setShowAlert(false)}
          buttonLabel="Login"
        />
      )}
    </>
  );
}
