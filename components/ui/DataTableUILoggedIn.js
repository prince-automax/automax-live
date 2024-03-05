import {
  CalendarIcon,
  DocumentDownloadIcon,
  PrinterIcon,
} from "@heroicons/react/outline";
import moment from "moment";

 const DataTableUILoggedIn = ({
  index1,
  event,
  allowDownload,
  registered,
  registeredStatus,
}) => {



  return (
    <div className=" w-full  flex justify-center items-center mt-4 ">
      <div className="grid grid-cols-1 gap-1 w-96 border-2 border-[#536DD9] p-2 rounded-lg mx-2 space-y-1  py-4 ">
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
            {moment(event.endDate).format(" Do-MMMM-YYYY")}{" "}
            {moment(event.endDate).format(" h:mm a")}
          </p>
        </div>
        <hr className="to-black shadow-2xl" />
        <div className=" space-x-4 flex items-center    m-2 ">
          
          {registered ? (
            allowDownload ? (
              <>
                {event.downloadableFile && event?.downloadableFile?.url && (
                  <a
                    href={`${process.env.BASE_URL}${event?.downloadableFile?.url}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex space-x-2"
                  >

                    
<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 0C9.23478 0 8.98043 0.105357 8.79289 0.292893C8.60536 0.48043 8.5 0.734784 8.5 1V3H2.5C1.96957 3 1.46086 3.21071 1.08579 3.58579C0.710714 3.96086 0.5 4.46957 0.5 5V18C0.5 18.5304 0.710714 19.0391 1.08579 19.4142C1.46086 19.7893 1.96957 20 2.5 20H16.5C17.0304 20 17.5391 19.7893 17.9142 19.4142C18.2893 19.0391 18.5 18.5304 18.5 18V5C18.5 4.46957 18.2893 3.96086 17.9142 3.58579C17.5391 3.21071 17.0304 3 16.5 3H10.5V1C10.5 0.734784 10.3946 0.48043 10.2071 0.292893C10.0196 0.105357 9.76522 0 9.5 0ZM10.5 3V11.828L12.328 10C12.5155 9.81236 12.7699 9.70689 13.0351 9.7068C13.3004 9.7067 13.5549 9.81199 13.7425 9.9995C13.9301 10.187 14.0356 10.4414 14.0357 10.7066C14.0358 10.9719 13.9305 11.2264 13.743 11.414L10.383 14.773C10.1486 15.0072 9.83083 15.1387 9.4995 15.1387C9.16817 15.1387 8.85039 15.0072 8.616 14.773L5.257 11.414C5.16416 11.3211 5.09052 11.2108 5.0403 11.0894C4.99008 10.9681 4.96425 10.838 4.9643 10.7066C4.96434 10.5753 4.99026 10.4452 5.04057 10.3239C5.09088 10.2026 5.16459 10.0923 5.2575 9.9995C5.35041 9.90666 5.4607 9.83302 5.58207 9.7828C5.70343 9.73258 5.8335 9.70675 5.96485 9.7068C6.0962 9.70684 6.22626 9.73276 6.34759 9.78307C6.46892 9.83338 6.57916 9.90709 6.672 10L8.5 11.828V3H10.5Z" fill="#536DD9"/>
</svg> <span className="underline text-[#536DD9] font-poppins font-semibold">Download</span>
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

{registered && (
            <div>
              <a
                className={`font-poppins font-semibold px-4 rounded-md py-1`}
                href={`/${
                  event.eventCategory === "open" ? "open-auctions" : "events"
                }/${event.id}?type=l`}
                rel="noopener noreferrer"
                target="_blank"
              >
            More Details
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTableUILoggedIn;
