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
  UpcomingEventsQuery,
  useUpcomingEventsQuery,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import Router from "next/router";
import Link from "next/link";
import DataTableMobile from "../ui/DataTableMobile";
export default function AllEventsTable({
  showHeadings,
  hideSearch,
  allowDownload,
  eventCategory = "online",
}) {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAccessToken(token);
    }
  }, []);

  const variablesUpcoming = {
    skip: 0,
    take: 10,
  };
  const { data: upcomingEvents, isLoading } =
    useUpcomingEventsQuery<UpcomingEventsQuery>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` }),
      variablesUpcoming
    );

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
  const { data: liveEvents } = useLiveEventsQuery<LiveEventsQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    variablesLive
  );

  const events = [
    ...Object.values(upcomingEvents || []),
    ...Object.values(liveEvents || []),
  ];
  const eventdata = events.flat();

  // console.log("liveevents", liveEvents);

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
      Header: "State",
      accessor: "location.state.name",
    },
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
      <div className="relative bg-white">
        <div className="mx-auto max-w-md text-center  sm:max-w-3xl lg:max-w-7xl">
          {showHeadings && (
            <div className="pt-8 pb-8">
              <h2 className="text-base font-extrabold tracking-wider text-black uppercase">
                Events Calender
              </h2>
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
              {!eventdata.length && (
                <div className="font-bold sm:text-base md:text-xl text-black uppercase animate-pulse duration-100 text-red-600">
                  No Upcoming / Live Events{" "}
                </div>
              )}
              {eventdata.length > 0 && (
                <>
                  <div className="sm:hidden">
                    {eventdata.map((event, eventIdx) => {
                      return (
                        <MobielViewCard
                          key={eventIdx}
                          index1={eventIdx}
                          event={event}
                          allowDownload={allowDownload}
                        />
                      );
                    })}
                  </div>
                  <div className="hidden sm:block">
                    <Datatable
                      hideSearch={hideSearch}
                      tableData={eventdata}
                      tableColumns={columns}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

AllEventsTable.defaultProps = {
  hideSearch: false,
  allowDownload: false,
};

function View(value, eventCategory, startDate) {
  // console.log("$$", eventCategory, startDate);
  let currentDate = new Date();
  let eventStartDate = startDate;

  const CurrentDates = new Date(currentDate);
  const eventStartDates = new Date(eventStartDate);

  //  if(eventStartDates > CurrentDates){
  //   console.log('trueeeeeee');

  //  }else{
  //   console.log('falseeeeeee');

  //  }

  // console.log("$$", currentDate, startDate);

  return (
    <>
      {eventStartDates > CurrentDates ? (
        <span className="text-secondary uppercase font-semibold">upcoming</span>
      ) : (
        <div>
          <Link
            href={`/${
              eventCategory === "open" ? "open-auctions" : "events"
            }/${value}?type=l`}
          >
            <a target="_blank">
              <div>
                <span className="text-emerald-600 font-bold">Bid Now</span>
              </div>
            </a>
          </Link>
        </div>
      )}
    </>
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
  // console.log("value form StartDate", value);

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
          {file && file?.file?.url && (
            <a
              href={`${process.env.BASE_URL}${file?.file?.url}`}
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

AllEventsTable.defaultProps = {
  showHeadings: true,
};

function MobielViewCard({ index1, event, allowDownload }) {
  // console.log("key", index1);
  // console.log("event", event);
  // console.log("allowDownload", allowDownload);

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
      <div className= "space-y-6  ">
      <DataTableMobile
        index1={index1}
        event={event}
        allowDownload={allowDownload}
        showAlertModal={showAlertModal}
        setShowAlert={setShowAlert}
      />
        {/* <div className="">
        <div className="flex flex-col items-center py-4">
            <div className="flex w-full justify-between  ">
              <span className="font-semibold ">Event :</span>
            
              <span className=" ">{event?.seller?.name}</span>
            </div>
            <div className="flex w-full justify-between ">
              <span className="font-semibold">Location :</span>
         
              <span className=" ">
                {event?.location?.name}, {event?.location?.state?.name}
              </span>
            </div>
            <div className="flex w-full  justify-between">
              <span className="font-semibold ">Start Time :</span>
            
              <span className="">
                {moment(event.startDate).format(" Do-MMMM-YYYY")}{" "}
                {moment(event.startDate).format(" h:mm a ")}
              </span>
            </div>
            <div className="flex w-full justify-between ">
              <span className="font-semibold">Close Time :</span>
           
              <span className=" ">
                {moment(event.endDate).format(" Do-MMMM-YYYY")}{" "}
                {moment(event.endDate).format(" h:mm a")}
              </span>
            </div>
           
            <div className="flex w-full mt-3  justify-center space-x-2 ">
              <button onClick={() => showAlertModal()} className={` rounded-md text-white px-3 py-1 ${index1 % 2==0 ? 'bg-red-600' :'bg-blue-700'} `}>Enter</button>
              {allowDownload ? (
                <>
                  {event.ExcelFile && event?.ExcelFile?.file?.url && (
                    <a
                      href={`${process.env.BASE_URL}${event?.ExcelFile?.file?.url}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      className=""
                    >
                      <DocumentDownloadIcon className="h-8 w-8 text-gray-600 hover:text-green-600" />
                    </a>
                  )}
                </>
              ) : (
                <>
                  <button onClick={() => showAlertModal()}>
                    <DocumentDownloadIcon className=" h-8 w-8 text-gray-600 hover:text-green-600 border border-slate-600 rounded-md" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div> */}
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
