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
import toast from "react-hot-toast";

export default function WorkBookTable({
  showHeadings,
  hideSearch,
  allowDownload,
}) {
  const [accessToken, setAccessToken] = useState("");
  const [registered, setRegistered] = useState(false);
  const [id, setId] = useState("");
  const [registeredStatus, setRegisteredStatus] = useState("");


  // const id = localStorage.getItem("id");

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const token = localStorage.getItem("token");
  //     setAccessToken(token);
  //   }
  // }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      setAccessToken(token);
      setId(id);
    }
  }, []);

  
  const { data: userData, isLoading: loading } =
  useGetUserQuery<GetUserQueryVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    { where: { id } },
    {
      enabled: accessToken !== "",
    }
  );

  const payment = userData ? userData["user"]?.payments : "";

  console.log("registerd",userData)
  


  const PaymentStatus=()=>{
    toast("Your Access to this service has been disabled. Please contact Autobse for assistance", {
      duration: 5000,
      position: "top-right",

      // Styling
      // Styling
      style: {
        bottom: "80px",
        background: "rgb(95, 99, 93)",
        color: "white",
        border: "rounded",
        fontSize:"bold"
      },
      className: " bg-primary text-white ",

      // Custom Icon
      icon: " 🚫 ",

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: "#0000",
        secondary: "#fff",
      },

      // Aria
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    });

  }
  


  useEffect(() => {
    if (payment) {
      payment?.map((item) => {
        if (item.paymentFor === "registrations") {
          
          if (item.status === "success" && new Date(item?.RegistrationExpire)?.toISOString()  > new Date().toISOString()  ) {
            setRegistered(true);
          } else {
            setRegisteredStatus(item.status);
          }

          // console.log("trueeeee");
        } else {
          // console.log("falseeeeeeeeeee");
        }
      });
    }
  }, [payment]);


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
      Cell: ({ cell: { value } }) =>
        registered ? (
          View(value)
        ) : (
          <button className=" bg-primary-hover font-semibold border text-white py-1  px-6 rounded-lg" onClick={PaymentStatus}>
         view
        </button>
        )
    },
  ];



  function View(value) {
    return (
      <div>
        <Link href={`/workbook/${value}`}>
          <a target="_blank">
            <div>
              <span className=" bg-primary-hover font-semibold border text-white py-1 w-full px-6 rounded-lg">View</span>
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
                        registered={registered}
                        PaymentStatus={PaymentStatus}
                    
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
 PaymentStatus,
 registered,
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
          <div className="grid grid-cols-1 gap-1 w-96 border-2 border-[#536DD9] p-2 rounded-lg  space-y-1  ">
            {/*  */}
            <div className="grid grid-cols-3 gap-1 space-x-2">
            <p className="flex justify-between text-sm font-roboto text-[#646464] font-semibold ">
                Number <span>:</span>
              </p>

              <p className="col-span-2 text-sm flex  font-poppins font-medium text-[#0F172A]">
                {event?.registrationNumber}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1 space-x-2 ">
            <p className="flex justify-between text-sm font-roboto text-[#646464] font-semibold ">
                make <span>:</span>
              </p>

              <p className="col-span-2 text-sm flex  font-poppins font-medium text-[#0F172A]"> {event?.make}</p>
            </div>
            <div className="grid grid-cols-3 gap-1 space-x-2 ">
            <p className="flex justify-between text-sm font-roboto text-[#646464] font-semibold ">
                model <span>:</span>
              </p>

              <p className="col-span-2 text-sm flex  font-poppins font-medium text-[#0F172A] ">
                {event?.model}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1 space-x-2">
            <p className="flex justify-between text-sm font-roboto text-[#646464] font-semibold ">
                Varient <span>:</span>
              </p>

              <p className="col-span-2 text-sm flex  font-poppins font-medium text-[#0F172A]">{event?.varient}</p>
            </div>
            <hr className="to-black shadow-2xl" />
            <div className="mt-3">
              <div className="flex w-full  justify-center space-x-2 mt-4 ">
                <div>
                {registered ? (<a className="">{view(event?.id)}</a>) : (   <button onClick={PaymentStatus} className=" bg-primary-hover font-semibold border text-white py-1 w-full px-6 rounded-lg">View</button>)}
                  
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
