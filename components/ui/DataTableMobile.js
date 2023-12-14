import {
    CalendarIcon,
    DocumentDownloadIcon,
    PrinterIcon,
  } from "@heroicons/react/outline";
  import moment from "moment";
const DataTableMobile = ({ index1, event, allowDownload,showAlertModal,setShowAlert }) => {
    return (
      <div className=" w-full  flex justify-center items-center mt-4 ">
        <div className="grid grid-cols-1 gap-1 w-96 border-2 border-orange-600 p-4 rounded-lg mx-3 space-y-1  font-inter font-medium">
            
          <div className="grid grid-cols-3 gap-1 space-x-2">
            <p className="flex justify-between text- ">
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
  
            <p className="col-span-2 text-sm flex"> {moment(event.startDate).format(" Do-MMMM-YYYY")}{" "}
                {moment(event.startDate).format(" h:mm a ")}</p>
          </div>
          <div className="grid grid-cols-3 gap-1 space-x-2">
            <p className="flex justify-between text-sm">
              Close Time <span>:</span>
            </p>
  
            <p className="col-span-2  text-sm flex"> {moment(event.endDate).format(" Do-MMMM-YYYY")}{" "}
                {moment(event.endDate).format(" h:mm a")}</p>
          </div>
          <hr className="to-black" />
          <div className="space-x-3 flex items-center   " >
            <button onClick={() => showAlertModal()} className="font-medium px-4 py-1 font-poppins  border text-sm border-[#DC2626] text-[#DC2626] rounded-xl">Enter</button>
            {allowDownload ? (
                <>
                  {event.ExcelFile && event?.ExcelFile?.file?.url && (
                    <a
                      href={`${process.env.BASE_URL}${event?.ExcelFile?.file?.url}`}
                      rel="noopener noreferrer"
                      target="_blank"
                      className=""
                    >
                      <DocumentDownloadIcon className=" text-gray-600 " />
                    </a>
                  )}
                </>
              ) : (
                <>
                  <button className=" self-start" onClick={() => showAlertModal()}>
                    <DocumentDownloadIcon className=" h-7 text-gray-600 " />
                  </button>
                </>
              )}
          </div>
        </div>
      </div>
    );
  };
  
  export default DataTableMobile;
  