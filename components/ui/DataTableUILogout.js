import {
    CalendarIcon,
    DocumentDownloadIcon,
    PrinterIcon,
  } from "@heroicons/react/outline";
  import moment from "moment";
  
   const DataTableUILogout = ({
    index1,
    event,
    allowDownload,
    registered,
    registeredStatus,
  }) => {
    return (
      <div className=" w-full  flex justify-center items-center mt-4 ">
        <div className="grid grid-cols-1 gap-1 w-96 border-2 border-[#536DD9] p-2 rounded-lg mx-2 space-y-1  ">
          <div className="grid grid-cols-3 gap-1 space-x-2">
          <p className="flex justify-between text-sm font-roboto text-[#646464] font-semibold ">
              Event <span>:</span>
            </p>
  
            <p className="col-span-2 text-sm flex  font-poppins font-medium text-[#0F172A]">{event?.seller?.name}</p>
          </div>
          <div className="grid grid-cols-3 gap-1 space-x-2 ">
          <p className="flex justify-between text-sm font-roboto text-[#646464] font-semibold ">
              Location <span>:</span>
            </p>
  
            <p className="col-span-2 text-sm  flex">
              {" "}
              {event?.location?.name}, {event?.location?.state?.name}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1 space-x-2 ">
          <p className="flex justify-between text-sm font-roboto text-[#646464] font-semibold ">
              Start Time <span>:</span>
            </p>
  
            <p className="col-span-2 text-sm flex">
              {" "}
              {moment(event.startDate).format(" Do-MMMM-YYYY")}{" "}
              {moment(event.startDate).format(" h:mm a ")}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1 space-x-2">
          <p className="flex justify-between text-sm font-roboto text-[#646464] font-semibold ">
              Close Time <span>:</span>
            </p>
  
            <p className="col-span-2  text-sm flex">
              {" "}
              {moment(event.firstVehicleBidTimeExpire).format(" Do-MMMM-YYYY")}{" "}
              {moment(event.firstVehicleBidTimeExpire).format(" h:mm a")}
            </p>
          </div>
          <hr className="to-black shadow-2xl" />
          {/* <div className="space-x-3 flex items-center  m-2  ">
            {registered && (
              <div>
                <a
                  className={`border px-4 rounded-md border-red-600 text-red-600 py-1`}
                  href={`/${
                    event.eventCategory === "open" ? "open-auctions" : "events"
                  }/${event.id}?type=l`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Enter
                </a>
              </div>
            )}
            {registered ? (
              allowDownload ? (
                <>
                  {event.downloadableFile && event?.downloadableFile?.url && (
                    <a
                      href={`${process.env.BASE_URL}${event?.downloadableFile?.url}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <DocumentDownloadIcon className=" h-8 w-8 text-gray-600 hover:text-green-600 border border-slate-300 rounded-md" />
                    </a>
                  )}
                </>
              ) : (
                <>
                  <button onClick={() => showAlertModal()}>
                    <DocumentDownloadIcon className="h-8 w-8 text-gray-600 hover:text-green-600" />
                  </button>
                </>
              )
            ) : (
              <p className="font-poppins font-semibold text-sm">
                Payment  :{" "}
                <span className="text-orange-500 font-bold ">{registeredStatus? registeredStatus:"Payment Nil"}</span>
              </p>
            )}
          </div> */}
        </div>
      </div>
    );
  };
  
  export default DataTableUILogout;
  