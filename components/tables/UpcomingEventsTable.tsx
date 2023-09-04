import { useMemo } from "react";
import Datatable from "../ui/Datatable";
import Loader from "../ui/Loader";
import moment from "moment";
import {
  CalendarIcon,
  DocumentDownloadIcon,
  PrinterIcon,
} from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import AlertModal from "../ui/AlertModal";
import { GetUserQueryVariables, UpcomingEventsQuery, useGetUserQuery, useUpcomingEventsQuery } from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import Router from "next/router";

export default function UpcomingEventsTable({
  showHeadings,
  hideSearch,
  allowDownload,
}) {
  const [accessToken, setAccessToken] = useState("");
  const [registered,setRegistered]=useState(false)
  const [registeredStatus,setRegisteredStatus]=useState("")
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
  };
  const { data, isLoading,refetch } = useUpcomingEventsQuery<UpcomingEventsQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    variables
  );

 useEffect(()=>{
  refetch()
 },[data])

  // console.log('upcoming',data);
  

  
  

  const { data:userData,isLoading:loading } = useGetUserQuery<GetUserQueryVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    { where: { id } },
    {
      enabled: accessToken !== "",
    }
  );

  
  
  const payment=userData?userData['user']?.payments : ''



useEffect(()=>{
  if(payment){
    // console.log('00');
    
    payment?.map((item)=>{
      // console.log('963',item.paymentFor);
      if(item.paymentFor === 'registrations' ){
        if( item.status==='success'){
          setRegistered(true)
        }
        else{
          setRegisteredStatus(item.status)
        }
       
     
        // console.log("trueeeee");
        
      
    }else{
      // console.log("falseeeeeeeeeee");
      
    }
    })
  }
},[payment])

  const columns = 
    [
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
        Header:"Vehicle",
        accessor:"vehiclesCount",
        Cell: ({ cell: { value } }) => (value ? value : ""),
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
        Header: "Action",
        accessor: "downloadableFile",
        Cell: ({ cell: { value } }) => (
          registered ?   <DownloadButton file={value} allowDownload={accessToken !== null && accessToken !== ""}/> :<span className="text-bold text-red-500 text-sm">{registeredStatus} </span>
        ),
      },
    ];
 



  return (
    <>
      <div className="relative bg-white">
        <div className="mx-auto max-w-md text-center  sm:max-w-3xl lg:max-w-7xl">
          {showHeadings && (
            <div className="pt-4 pb-1">
              {data &&
              data?.upcomingEvents &&
              data?.upcomingEvents?.length > 0 ? (
                <p className="mt-px text-3xl font-extrabold text-gray-900 tracking-tight sm:text-3xl animate-pulse">
                  Event Calender
                </p>
              ) : (
                <p className="mt-px text-3xl font-extrabold text-gray-900 tracking-tight sm:text-3xl ">
                  Event calender
                </p>
              )}
            </div>
          )}

          {isLoading ? (
            <Loader />
          ) : (
            <>
              {/* {data &&
                data?.upcomingEvents &&
                data?.upcomingEvents?.length > 0 && ( */}
              <>
                <div className="sm:hidden">
                  {data?.upcomingEvents?.map((event, eventIdx) => {
                    return (
                      <MobielViewCard
                        key={eventIdx}
                        index1={eventIdx}
                        event={event}
                       registered={registered}
                       registeredStatus={registeredStatus}
                        allowDownload={
                          accessToken !== null && accessToken !== ""
                        }
                      />
                    );
                  })}
                </div>
                <div className="hidden sm:block">
                  <Datatable
                    hideSearch={hideSearch}
                    tableData={data?.upcomingEvents}
                    tableColumns={columns}
                  />
                </div>
              </>
              {/* )}  */}
            </>
          )}
        </div>
      </div>
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

UpcomingEventsTable.defaultProps = {
  hideSearch: false,
  allowDownload: false,
};

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

UpcomingEventsTable.defaultProps = {
  showHeadings: true,
};

function MobielViewCard({index1, event, allowDownload,registered,registeredStatus }) {
  
 

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
       <div className={`overflow-hidden shadow-lg rounded-lg p-2 my-3 border ${index1 % 2===0 ? 'border-blue-600' :'border-red-700'} `}>
        <div className="">
          <div className="flex flex-col items-center py-4">
            <div className="flex w-full justify-between  ">
              <span className="font-semibold ">Event :</span>

              <span className="text-base ">{event?.seller?.name}</span>
            </div>
            <div className="flex w-full justify-between">
              <span className="font-semibold">Location :</span>

              <span className=" ">
                {event?.location?.name}, {event?.location?.state?.name}
              </span>
            </div>
            <div className="flex w-full justify-between">
              <span className="font-semibold">vehicles :</span>

              <span className=" ">
              {event?.vehiclesCount > 0 ? event?.vechileCount : ''}
              </span>
            </div>
            <div className="flex w-full  justify-between">
              <span className="font-semibold ">Start Time :</span>

              <span className="text-sm font-semibold ">
                {moment(event.startDate).format(" Do-MMMM-YYYY")}{" "}
                {moment(event.startDate).format(" h:mm a ")}
              </span>
            </div>
            <div className="flex w-full justify-between ">
              <span className="font-semibold">Close Time :</span>

              <span className=" text-sm font-semibold">
                {moment(event.endDate).format(" Do-MMMM-YYYY")}{" "}
                {moment(event.endDate).format(" h:mm a")}
              </span>
            </div>
            <div className="flex w-full  justify-center space-x-2 mt-4 ">
            {registered ?  
              allowDownload ? (
                <>
                  {event?.downloadableFile && event?.downloadableFile?.url && (
                    <a
                      href={`${process.env.BASE_URL}${event?.downloadableFile?.url}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <DocumentDownloadIcon className=" h-8 w-8 text-gray-600 hover:text-green-600 border border-slate-600 rounded-md" />
                    </a>
                  )}
                </>
              ) : (
                <>
                  <button onClick={() => showAlertModal()}>
                    <DocumentDownloadIcon className=" h-8 w-8 text-gray-600 hover:text-green-600 border border-slate-600 rounded-md" />
                  </button>
                </>
              ) : <p>Payment Status : <span className="text-red-500 font-bold">{registeredStatus}</span></p>}
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
