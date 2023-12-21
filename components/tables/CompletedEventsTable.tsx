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
import { useCompliedEventsQuery, CompliedEventsQuery, useGetUserQuery, GetUserQueryVariables, } from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import Router from "next/router";
import Link from "next/link";

export default function EventsTable({
  showHeadings,
  hideSearch,
  allowDownload,
  eventCategory = "online",
}) {
  const [accessToken, setAccessToken] = useState("");
  const [registered, setRegistered] = useState(false);
  const [registeredStatus, setRegisteredStatus] = useState("");
  const id = localStorage.getItem("id");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAccessToken(token);
    }
  }, []);

  const variables = {
    skip: 0,
    take: 10,
    where: {
      eventCategory: {
        equals: eventCategory,
      },
    },
  };
  const { data, isLoading } = useCompliedEventsQuery<CompliedEventsQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    variables
  );

  const { data: userData, isLoading: loading } =
    useGetUserQuery<GetUserQueryVariables>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` }),
      { where: { id } },
      {
        enabled: accessToken !== "",
      }
    );



  const payment = userData ? userData["user"]?.payments : "";


  useEffect(() => {
    if (payment) {
      console.log("00");

      payment?.map((item) => {
        console.log("963", item.paymentFor);
        if (item.paymentFor === "registrations") {
          if (item.status === "success") {
            setRegistered(true);
          } else {
            setRegisteredStatus(item.status);
          }

          console.log("trueeeee");
        } else {
          console.log("falseeeeeeeeeee");
        }
      });
    }
  }, [payment]);

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
    {
      Header: "Event Type",
      accessor: "eventCategory",
    },
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
    {
      Header: "Details",
      accessor: "id",
      Cell: ({ cell: { value } }) => View(value),
    },
  
  ];

  return (
    <>
      <div className="relative bg-white">
        <div className="mx-auto max-w-md text-center  sm:max-w-3xl lg:max-w-7xl">
          {showHeadings && (
            <div className="pt-16 pb-8">
              <h2 className="text-base font-semibold tracking-wider text-primary uppercase">
                Events
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Most recent events
              </p>
              <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                Open auction or closed auction!! Know your deal better with list
                of locations, type of auction, date and many more features, An
                updates on our most recent events.
              </p>
            </div>
          )}

          {isLoading ? (
            <Loader />
          ) : (
            <>
              {data?.compliedEvents && data?.compliedEvents?.length > 0 && (
                <>
                  <div className="sm:hidden">
                    {data?.compliedEvents?.map((event, eventIdx) => {
                      return (
                        <MobielViewCard
                          key={eventIdx}
                          index1={eventIdx}
                          event={event}
                          allowDownload={allowDownload}
                          registered={registered}
                          registeredStatus={registeredStatus}
                        />
                      );
                    })}
                  </div>
                  <div className="hidden sm:block">
                    <Datatable
                      hideSearch={hideSearch}
                      tableData={data?.compliedEvents}
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

EventsTable.defaultProps = {
  hideSearch: false,
  allowDownload: false,
};

function View(value) {
  return (
    <div>
      <Link href={`/events/${value}?type=c`}>
        <a target="_blank"><span className="text-red-600 font-extrabold">View</span></a>
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

EventsTable.defaultProps = {
  showHeadings: true,
};

function MobielViewCard({ index1,event, allowDownload,registered,registeredStatus }) {
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
      
      
      <div className="">
       
      <div className=" w-full  flex justify-center items-center mt-4 ">
    <div className="grid grid-cols-1 gap-1 w-96 border-2 border-orange-400 p-4 rounded-lg  space-y-1  ">
        {/*  */}
      <div className="grid grid-cols-3 gap-1 space-x-2">
        <p className="flex justify-between text-sm ">
          Event <span>:</span>
        </p>

        <p className="col-span-2 text-sm flex">{event?.seller?.name}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 space-x-2 ">
        <p className="flex justify-between text-sm  ">
          Location <span>:</span>
        </p>

        <p className="col-span-2 text-sm  flex">   {event?.location?.name}, {event?.location?.state?.name}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 space-x-2 ">
        <p className="flex justify-between text-sm">
          Start Time <span>:</span>
        </p>

        <p className="col-span-2 text-sm flex   justify-start "> {moment(event.startDate).format(" Do-MMMM-YYYY")}{" "}
            {moment(event.startDate).format(" ")}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 space-x-2">
        <p className="flex justify-between text-sm">
          Close Time <span>:</span>
        </p>

        <p className="col-span-2  text-sm flex"> {moment(event.endDate).format(" Do-MMMM-YYYY")}{" "}
            {moment(event.endDate).format(" ")}</p>
      </div>
      <hr className="to-black shadow-2xl" />
      <div className="mt-3">
           {registered ? <div>  
            <a  href={`/events/${event.id}?type=c`} target="_blank" rel="noopener noreferrer"><span      className={`border px-4 rounded-md ${index1 % 2==0 ? 'bg-red-600' :'bg-blue-700'} text-white py-1`}>View</span></a>
           </div>   :<p>
                  Payment Status :{" "}
                  <span className="text-red-500 font-bold">
                    {registeredStatus}
                  </span>
                </p>  }
            
              {/* {allowDownload ? (
                <>
                  {event.ExcelFile && event?.ExcelFile?.file?.url && (
                    <a
                      href={`${process.env.API_URL}${event?.ExcelFile?.file?.url}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <PrinterIcon className="h-8 w-8 text-gray-600 hover:text-green-600" />
                    </a>
                  )}
                </>
              ) : (
                <>
                  <button onClick={() => showAlertModal()}>
                    <PrinterIcon className="h-8 w-8 text-gray-600 hover:text-green-600" />
                  </button>
                </>
              )} */}
            </div>
    </div>
  
  </div>

            
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
