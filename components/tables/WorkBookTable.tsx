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
import {
  GetUserQueryVariables,
  useGetUserQuery,
  useUserWorkBookQuery,
  UserWorkBookQueryVariables,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import Router from "next/router";
import Link from "next/link";

export default function WorkBookTable({
  showHeadings,
  hideSearch,
  allowDownload,
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

  const { data, isLoading, refetch } =
    useUserWorkBookQuery<UserWorkBookQueryVariables>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` })
    );



  useEffect(() => {
    refetch();
  }, [data]);

  const columns = [
    {
      Header: "Reg No",
      accessor: "registrationNumber",
      
    },
    {
      Header: "make",
      accessor: "make",
    },
    {
      Header: "model",
      accessor: "model",
    },
    {
      Header: "varient",
      accessor: "varient",
    },
    {
      Header: "Chaiss No",
      accessor: "chassis",
    },
    {
      Header: "Engine No",
      accessor: "engineNo",
      
    },
    {
      Header: "View",
      accessor: "id",
      Cell: ({ cell: { value } }) =>  View(value)
      
    },
  ];





  function View(value) {
   
    
    return (
      <div>
        <Link href={`/workbook/${value}`}>
          <a target="_blank">
            <div>
              <span className="text-emerald-600 font-extrabold">View</span>
            </div>
          </a>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    // alert('loading')

    return <Loader />;
  }

  return (
    <>
      <div className="relative bg-white w-full h-screen text-right ">
        <Link href="/addworkbook">
          <a className="bg-blue-700 text-white p-1 text-center rounded-md p-2">Add Vehicle</a>
        </Link>

        <div className="mx-auto max-w-md text-center  sm:max-w-3xl lg:max-w-7xl">
          {showHeadings && (
            <div className="pt-4 pb-1">
              {data &&
              data?.workSheets &&
              Array.isArray(data?.workSheets) &&
              (data?.workSheets as any[]).length > 0 ? (
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
              <>
                <div className="sm:hidden">
                  {(data?.workSheets as any[] | undefined)?.map(
                    (workSheet, eventIdx) => (
                      <MobielViewCard
                        key={eventIdx}
                        index1={eventIdx}
                        event={workSheet}
                        registered={registered}
                        registeredStatus={registeredStatus}
                        allowDownload={
                          accessToken !== null && accessToken !== ""
                        }
                      />
                    )
                  )}
                </div>

                <div className="hidden sm:block">
                  <Datatable
                    hideSearch={hideSearch}
                    tableData={data?.workSheets}
                    tableColumns={columns}
                  />
                </div>
              </>
            </>
          )}
        </div>
      </div>
    </>
  );
}

WorkBookTable.defaultProps = {
  hideSearch: false,
  allowDownload: false,
};

// WorkBookTable.defaultProps = {
//   showHeadings: true,
// };

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
      <div
        className={`overflow-hidden shadow-lg rounded-lg p-2 my-3 border ${
          index1 % 2 === 0 ? "border-blue-600" : "border-red-700"
        } `}
      >
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
            <div className="flex w-full  justify-between">
              <span className="font-semibold ">Start Time :</span>

              {/* <span className="text-sm font-semibold ">
                {moment(event.startDate).format(" Do-MMMM-YYYY")}{" "}
                {moment(event.startDate).format(" h:mm a ")}
              </span>
            </div>
            <div className="flex w-full justify-between ">
              <span className="font-semibold">Close Time :</span>

              <span className=" text-sm font-semibold">
                {moment(event.endDate).format(" Do-MMMM-YYYY")}{" "}
                {moment(event.endDate).format(" h:mm a")}
              </span> */}
            </div>
            <div className="flex w-full  justify-center space-x-2 mt-4 ">
              {registered ? (
                allowDownload ? (
                  <>
                    {event?.downloadableFile &&
                      event?.downloadableFile?.url && (
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
                )
              ) : (
                <p>
                  Payment Status :{" "}
                  <span className="text-red-500 font-bold">
                    {registeredStatus}
                  </span>
                </p>
              )}
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
