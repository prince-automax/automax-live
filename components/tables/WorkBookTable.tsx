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
      Cell: ({ cell: { value } }) => View(value),
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
      <div className="relative bg-white w-full  text-right ">
        <Link href="/addworkbook">
          <a className="bg-blue-700 text-white  text-center rounded-md p-2">
            Add Vehicle
          </a>
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
                        view={View}
                        event={workSheet}
                    
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
 
  view,
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
      <div className="overflow-scroll">
        <div className=" w-full  flex justify-center items-center mt-4 ">
          <div className="grid grid-cols-1 gap-1 w-96 border-2 border-orange-400 p-2 rounded-lg  space-y-1  ">
            {/*  */}
            <div className="grid grid-cols-3 gap-1 space-x-2">
              <p className="flex justify-between text-sm ">
                Number <span>:</span>
              </p>

              <p className="col-span-2 text-sm flex">
                {event?.registrationNumber}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1 space-x-2 ">
              <p className="flex justify-between text-sm  ">
                make <span>:</span>
              </p>

              <p className="col-span-2 text-sm  flex"> {event?.make}</p>
            </div>
            <div className="grid grid-cols-3 gap-1 space-x-2 ">
              <p className="flex justify-between text-sm">
                model <span>:</span>
              </p>

              <p className="col-span-2 text-sm flex   justify-start ">
                {event?.model}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1 space-x-2">
              <p className="flex justify-between text-sm">
                Varient <span>:</span>
              </p>

              <p className="col-span-2  text-sm flex">{event?.varient}</p>
            </div>
            <hr className="to-black shadow-2xl" />
            <div className="mt-3">
              <div className="flex w-full  justify-center space-x-2 mt-4 ">
                <div>
                  <a className="">{view(event?.id)}</a>
                </div>
              </div>
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
