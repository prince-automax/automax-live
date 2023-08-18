import React from 'react'
import DashboardTemplate from "../components/templates/DashboardTemplate";
import withPrivateRoute from "../utils/withPrivateRoute";
import Logo from "../components/ui/Logo";
import { PaperClipIcon, PencilAltIcon } from "@heroicons/react/outline";
import { useReportQuery, useGetUserQuery, ReportQueryVariables, VehicleBidStatusType } from "@utils/graphql";
import { useEffect, useState,  } from "react";
import graphQLClient from "@utils/useGQLQuery";
import moment from "moment";
import Datatable from "../components/ui/Datatable"
import Loader from "../components/ui/Loader";
import Link from "next/link";
import { useRouter } from 'next/router';

const Report = ({  hideSearch}) => {
  const [accessToken, setAccessToken] = useState("");
  const router = useRouter();

let id

if(typeof window !== 'undefined'){ 
    id=localStorage.getItem("id");
  }

  console.log("this id from localstorage",id)

  
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAccessToken(token);
    }
  }, []);

  
  const variables = {
    
      where: {
        bidStatus: {
          equals:VehicleBidStatusType.Fulfilled
          }
          ,AND:[{
          currentBidUser:{
            id: {
              "equals": id
        }
        } }]
  }
    
  };

  const { data:vehicles, isLoading } = useReportQuery<ReportQueryVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
variables ,   {
      enabled: accessToken !== "",
    }
  );
  
  // if (data?.where?.bidStatus?.equals && data.vehicles.length > 0) {
  //   console.log("!!!", data.vehicles[0]);
  // }
  const vehicle=vehicles?vehicles['vehicles'] : ''
  console.log('!!!',vehicle);
  
  

  


  const columns = [
    {
      Header: "registrationNumber",
      accessor: "registrationNumber",
     
    },
    {
      Header: "wining amount",
      accessor: "currentBidAmount",
    },
    {  Header: "Event ",
      accessor: "event.eventNo",
    },
    {
      Header: "make",
      accessor: "make",
    },
    {
      Header: "bidstatus",
      accessor: "bidStatus",
    },
    {
      Header: "vehicleEventStatus",
      accessor: "vehicleEventStatus",
    },
    // {
    //   Header: "View Report",
    //   accessor: "id",
    //   Cell: ({ cell: { value } }) => View(value),
    // },
    
    
  ];

  function View(value) {
    // router.push('/reportForm');
    return (
      <div>
        {/* <Link
          href={`/$/${value}?type=l`}
        >
          <a target="_blank"><div>
          <span className="text-black font-sm">view</span></div></a>
        </Link> */}
        <Link href={`/report/${value}`}>
  <a>view</a>
</Link>
     
      </div>
    );                                        
  }

    
  return (
    <DashboardTemplate>
   <>
      <div className="relative bg-white">
        <div className="mx-auto max-w-md text-center  sm:max-w-3xl lg:max-w-7xl">
          {
            <div className="pt-8 pb-8">
              <h2 className="text-base font-extrabold tracking-wider text-black uppercase">
                
                Report
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
          }

          {isLoading ? (
            <Loader />
          ) : (
            <>
             {/* {data && data.vehicles && data.vehicles.length = 0 <div>No wining vehicles Found</div>} */}
{/* {data && data.vehicles && data.vehicles.length > 0 && ( */}
                <>
                  {/* <div className="sm:hidden">
                  {events.map((event, eventIdx) => {
                      return (
                        <MobielViewCard
                          key={eventIdx}
                          event={event}
                          allowDownload={allowDownload}
                        />
                      );
                    })}
                  </div> */}
                  <div className="hidden sm:block">
                  {vehicle  && vehicle.length > 0 && (
  <Datatable
    hideSearch={hideSearch}
    tableData={vehicle}
    tableColumns={columns}
  />
)}

                  </div>
                </>
              {/* )} */}
            </>
          )}
        </div>
      </div>
    </>
    </DashboardTemplate>
  )
}

export default Report