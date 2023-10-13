import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Datatable from "../components/ui/findAuctionTable";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import {
  CalendarIcon,
  DocumentDownloadIcon,
  PrinterIcon,
  ArrowCircleRightIcon,
  ArrowRightIcon
} from "@heroicons/react/outline";

import {
  CreateBidMutationVariables,
  useInstitutionsQuery,
  InstitutionsQueryVariables,
  useFindAuctionsQuery,
  FindAuctionsQueryVariables,
  useFindAuctionStateQuery,
  FindAuctionStateQueryVariables,
  OrderDirection
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";

const Findauction = () => {
  const [queryResult, setQueryResult] = useState(null);


  const formikRef = useRef(null);



   const Category=[
    
    { value:"vehicle",label:"Vehicle"},
    { value:"flat",label:"Flat"},
  { value:"mechinery",label:"Mechinery"},
  { value:"gold",label:"Gold"},
  { value:"other",label:"Other"}

]

  const { data, isLoading: loadingbank } =
    useInstitutionsQuery<InstitutionsQueryVariables>(graphQLClient());

    const { data:findAuctionState, isLoading: loadingstate } =
    useFindAuctionStateQuery<FindAuctionStateQueryVariables>(graphQLClient());

   
    const variables={
      skip: 0,
      take: 10,
    }

    

    const { data: findAuction } = useFindAuctionsQuery(graphQLClient(),  {
      skip: 0,
    take: 100,
    orderBy: [
      {
        listingId: OrderDirection.Desc,
      },
    ],
    
      where: {
        ...(queryResult?.category && {
          propertyType: {
            equals: queryResult?.category 
          }
        }),
        ...(queryResult?.bank && {
          institution_details: {
            name: {
              equals: queryResult?.bank
            }
          }
        }),
        ...(queryResult?.state && {
          state: {
            name: {
              equals: queryResult?.state
            }
          }
        }),
        ...(queryResult?.city && {
         
            city: {
              contains: queryResult?.city
            }
          
        }),
       
        ...(queryResult?.fromDate && {
          auctionStartDate: {
            gte:  new Date(queryResult?.fromDate).toISOString()
            
          }
        }),
        ...(queryResult?.toDate && {
          auctionEndDate: {
            lte:  new Date(queryResult?.toDate).toISOString()
            
          }
        }),
     
    
  
        ...(queryResult?.minimum && {
          reservePrice: {
            gte:  queryResult?.minimum.toString()
            
          }
        }),
        ...(queryResult?.maximum && {
          reservePrice: {
            lte: queryResult?.maximum.toString()
            
          }
        })
      },
      
    });
    


    



  const columns = [
    {
      Header:"Listing Id",
      accessor:"listingId"

    },
    {
      Header: "State",
      accessor: "state.name",
    }
  ,
    {
      Header: "Institution Name",
      accessor: "institution_details.name",
    },
    {
      Header: "Property Details",
      accessor: "propertyType",
    },
    {
      Header: "Auction Start Date",
      accessor: "auctionStartDate",
      Cell: ({ cell: { value } }) => Format(value),
    },
    {
      Header: "Auction End Date",
      accessor: "auctionEndDate",
      Cell: ({ cell: { value } }) => Format(value),
    },
    {
      Header: "Reserve Price",
      accessor: "reservePrice",
    },
    {
      Header: "View Details",
      accessor: "id",
      Cell: ({ cell: { value } }) =>  View(value)
    },
  ];

  function View(value) {
    return (
      <div>
        <Link href={`/openbiddetails/${value}`}>
          <a target="_blank">
            <div>
              <span className="text-emerald-600 font-extrabold">View</span>
            </div>
          </a>
        </Link>
      </div>
    );
  }
  function MobileViewId(value) {
    return (
      <div>
        <Link href={`/openbiddetails/${value}`}>
          <a target="_blank">
            <div className="flex">
          <span className="  font-normal px-4 py-1 mb-6 border bg-blue-500 text-white rounded"> View</span> <div><ArrowRightIcon/></div>
            </div>
          </a>
        </Link>
      </div>
    );
  }
  function Format(value) {
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
                {/* {moment(value).format("ddd h:mm a")} */}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  function dataFormat(value) {
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
                {/* {moment(value).format("ddd h:mm a")} */}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }


 

  const onSubmitData = async (values, { resetForm }) => {
    setQueryResult(values);
    // resetForm();
  };

  return (
    <div className="mt-5">
      <main className="overflow-hidden max-w-7xl mx-auto">
        {/* Header */}

        {/* Contact section */}
        <section className="relative " aria-labelledby="contact-heading">
          {/* <div
            className="absolute w-full h-1/2 bg-gray-50"
            aria-hidden="true"
          /> */}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="relative bg-white shadow-md ">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Contact information */}

                {/* Contact form */}
                <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12 ">
                  <h3 className="text-2xl font-medium text-gray-900 border-b">
                    Search Auction
                  </h3>
                  <Formik
                    initialValues={{
                      state: "",
                      bank: "",
                      category: "",
                      city: "",
                      fromDate: "",
                      toDate: "",
                      minimum: "",
                      maximum: "",
                    }}
                    onSubmit={onSubmitData}
                    innerRef={formikRef}
                  >
                    {({ isSubmitting }) => (
                      <Form className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                        <div>
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Location
                          </label>
                          <div className="mt-1">
                          <Field
                              as="select"
                              name="state"
                              id="state"
                              autoComplete="family-name"
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                              placeholder="List of Banks"
                             
                            >
                              <option>Select</option>
                              {(findAuctionState?.states as any[] | undefined)?.map(
                                (banks, index) => (
                                  <>
                                 
                                  <option key={index} value={banks.name}>
                                    {banks.name}
                                  </option>
                                  </>
                                )
                              )}
                            </Field>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="bank"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Bank Name
                          </label>
                          <div className="mt-1">
                            <Field
                              as="select"
                              name="bank"
                              id="banks"
                              autoComplete="family-name"
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                              placeholder="List of Banks"
                             
                            >
                              <option>Select</option>
                              {(data?.institutions as any[] | undefined)?.map(
                                (banks, index) => (
                                  <>
                                 
                                  <option key={index} value={banks.name}>
                                    {banks.name}
                                  </option>
                                  </>
                                )
                              )}
                            </Field>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Category
                          </label>
                          <div className="mt-1">
                            <Field
                              id="Category"
                              name="category"
                              as="select"
                              autoComplete="email"
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                            >
                              <option>select</option>
                              {Category.map((category, index) => (
                                
                                // <
                                <option key={index} value={category.value}>
                                  {category.label}
                                </option>
                                
                              
                              ))}
                            </Field>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <label
                              htmlFor="borrower"
                              className="block text-sm font-medium text-gray-900"
                            >
                              City
                            </label>
                          </div>
                          <div className="mt-1">
                            <Field
                              type="text"
                              name="city"
                              id="city"
                              autoComplete="tel"
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                              aria-describedby="phone-optional"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="fromDate"
                            className="block text-sm font-medium text-gray-900"
                          >
                            From
                          </label>
                          <div className="mt-1">
                            <Field
                              type="Date"
                              name="fromDate"
                              id="subject"
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="toDate"
                            className="block text-sm font-medium text-gray-900"
                          >
                            To
                          </label>
                          <div className="mt-1">
                            <Field
                              type="Date"
                              name="toDate"
                              id="subject"
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="minimum"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Minimum price
                          </label>
                          <div className="mt-1">
                            <Field
                              maxLength={10}
                              type="number"
                              name="minimum"
                              id="Minimum"
                              autoComplete="given-name"
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 border focus:ring-indigo-500 focus:border-indigo-500 border-black-300 rounded-md"
                              placeholder="₹ "
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="firstname"
                            className="block text-sm font-medium text-gray-900"
                          >
                            maximum price
                          </label>
                          <div className="mt-1">
                            <Field
                              maxLength={10}
                              type="number"
                              name="maximum"
                              id="maximum"
                              autoComplete="given-name"
                              className="py-3 px-4 block w-full shadow-sm text-gray-900 border focus:ring-indigo-500 focus:border-indigo-500 border-black-300 rounded-md"
                              placeholder="₹ "
                            />
                          </div>
                        </div>
                       
                        <div className="sm:col-span-2 sm:flex sm:justify-start">
                          <button
                            type="submit"
                            className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:w-auto"
                            disabled={isSubmitting}
                          >
                            Search Auction
                          </button>
                        </div>
                      </Form>
                    )}
                    {/* </form> */}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
         <div className="hidden md:block">
         { findAuction?.findAuctions && <Datatable
                    hideSearch={false}
                    tableData={findAuction?.findAuctions}
                    tableColumns={columns}
                  /> }
         </div>
         <div className="md:hidden">
         {/* <div className="overflow-hidden shadow-lg  rounded-lg p-2 my-3 border border-slate-400 mx-4"> */}
         <div className="grid grid-cols-1 mx-10 border border-slate-300 my-6">
          <div className="flex flex-col border-b space-y-2 px-3 py-2 font-medium text-sm">
            <span>Listing ID</span>
            <span>State</span>
            <span>Institution Name</span>
            <span>Property Details</span>
            <span>Application Deadline</span>
            <span>Auction Date</span>
            <span>Reserve Price</span>
            <span>View Details</span>
          </div>
       
        {findAuction?.findAuctions.map((item,index)=>( 
            <div key={index}>
          <div className="flex flex-col border-b border-slate-300 space-y-2 px-3 py-3 text-black">
          <div className="flex  justify-center font-bold">  <span>{item?.listingId}</span></div>
          <span>{item?.state.name}</span>
            <span>{item?.institution_details.name}</span>
            
            <span>{item?.propertyType}</span>
            <span>{new Date(item?.emdSubmissionDate).toLocaleDateString()}</span>
            <span>{new Date(item?.auctionStartDate).toLocaleDateString()}</span>
            <span>₹{item?.reservePrice}</span>
            <div className="flex justify-end mx-4">
           <span className="bg-red-200"><ArrowRightIcon className="bg-black"/></span>  {MobileViewId(item.id)}
            </div>
          </div>
          </div>
        ))  }
        
         </div>
      {/* </div> */}
         </div>
        </section>
        {/* Contact grid */}
      </main>
    </div>
  );
};

export default Findauction;
