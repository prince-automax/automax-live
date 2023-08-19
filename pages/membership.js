import {
  CashIcon,
  CheckIcon,
  CursorClickIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import qr from "@assets/QR CODE.png";
const features = [
  {
    name: "Pay Annually",
    description:
      "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
    icon: CashIcon,
  },
  {
    name: "Refund available within 3 days",
    description:
      "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
    icon: ReceiptRefundIcon,
  },
  {
    name: "Access to over 1,23,000 vehicles",
    description:
      "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
    icon: CursorClickIcon,
  },
];

const freeFeatures = [
  "Search from massive inventory",
  "Sapiente libero doloribus",
  "Vel ipsa esse repudiandae",
];

const yesBank = [
  "Bank Name: YES BANK",
  "A/C TYPE:  CURRENT A/C",
  "A/C NUMBER: 074563400000988",
  "IFSC CODE:  YESB0000745",
];

const bank = [
  "Bank Name: INDUSIND BANK",
  "A/C TYPE:  CURRENT A/C",
  "A/C NUMBER: 259447297030",
  "IFSC CODE:  INDB0001727",
  "BRANCH:     CHENNAI",
];

const premiumFeatures = [
  "View Multiple Online Auctions",
  "Bid on Multiple Vehicles at the same time Add Vehicle to your Watchlist / Watchlist Create Vehicle Alerts",
  "Download Auction Catelogue",
  "Phone Calls Intimations",
  "Everything included Basis Guest Plan",
];
export default function Membership() {
  return (
    <div className="bg-gray-900">
      <div className="pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
        <div className="text-center">
          <h2 className="text-lg leading-6 font-semibold text-gray-300 uppercase tracking-wider">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Membership Options
          </p>
        </div>
      </div>

      <div className="mt-16 bg-white pb-12 lg:mt-20 lg:pb-20">
        <div className="relative z-0">
          <div className="absolute inset-0 h-5/6 bg-gray-900 lg:h-2/3" />

          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
            <div className="relative lg:grid  lg:grid-cols-12">
              <div className="mx-auto max-w-md lg:mx-0 lg:max-w-none  lg:col-start-10 lg:col-end-13 lg:row-start-2 lg:row-end-3">
                <div className="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg">
                  <div className="flex-1 flex flex-col">
                    <div className="bg-white px-6 py-10">
                      <div>
                        <h3
                          className="text-center text-2xl font-medium text-gray-900"
                          id="tier-hobby"
                        >
                          QR Code
                        </h3>
                        <p className="block w-full text-center font-bold rounded-lg border border-transparent bg-white px-6 py-3 text-base  text-black hover:bg-gray-50">
                          Automax Solutions India Pvt. Ltd.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between border-t-2 border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                   
                      <Image
                        src={qr}
                        alt="auto bse"
                        className="w-full h-full object-center object-cover"
                      />
                   
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-4 lg:col-end-10 lg:row-start-1 lg:row-end-4">
                <div className="relative z-10 rounded-lg shadow-xl">
                  <div
                    className="pointer-events-none absolute inset-0 rounded-lg border-2 border-indigo-600"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 top-0 transform translate-y-px">
                    <div className="flex justify-center transform -translate-y-1/2">
                      <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold tracking-wider uppercase text-white">
                        Most popular
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-t-lg px-6 pt-12 pb-10">
                    <div>
                      <h3
                        className="text-center text-3xl font-semibold text-gray-900 sm:-mx-6"
                        id="tier-growth"
                      >
                        B2B Marketplace Premier
                      </h3>
                      <div className="mt-4 flex items-center justify-center">
                        <span className="px-3 flex items-start text-6xl tracking-tight text-gray-900 sm:text-6xl">
                          <span className="mt-2 mr-2 text-4xl font-medium">
                            Rs.
                          </span>
                          <span className="font-extrabold">5000/- </span>
                        </span>
                        <span className="text-2xl font-medium text-gray-500">
                          {" "}
                          + GST
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t-2 border-gray-100 rounded-b-lg pt-10 pb-8 px-6 bg-gray-50 sm:px-10 sm:py-10">
                    <ul role="list" className="space-y-4">
                      {premiumFeatures.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckIcon
                              className="flex-shrink-0 h-6 w-6 text-green-500"
                              aria-hidden="true"
                            />
                          </div>
                          <p className="ml-3 text-base font-medium text-gray-500">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-10">
                      <div className="rounded-lg shadow-md">
                        <Link href="/register">
                          <a
                            href="#"
                            className="block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-xl leading-6 font-medium text-white hover:bg-indigo-700"
                            aria-describedby="tier-growth"
                          >
                            Start your Registration
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-4  lg:row-start-2 lg:row-end-3">
                <div className="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg">
                  <div className="flex-1 flex flex-col">
                    <div className="bg-white px-6 py-10">
                      <div>
                        <h3
                          className="text-center text-2xl font-medium text-gray-900"
                          id="tier-hobby"
                        >
                          Account Details
                        </h3>
                        <p className="block w-full text-center font-bold rounded-lg border border-transparent bg-white px-6 py-3 text-base  text-black hover:bg-gray-50">
                          Automax Solutions India Pvt. Ltd.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between border-t-2 border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                      <ul role="list" className="space-y-4">
                        {bank.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <div className="flex-shrink-0">
                              <CheckIcon
                                className="flex-shrink-0 h-6 w-6 text-green-500"
                                aria-hidden="true"
                              />
                            </div>
                            <p className="ml-3 text-base font-medium text-gray-500">
                              {feature}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <p className="block w-full text-center font-semibold rounded-lg px-6 py-3 text-base  text-red-600 ">
                        * Please ensure the bank details before proceeding the
                        payment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative lg:grid  lg:grid-cols-12 mt-12 ml-12  ">
          <div className="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-5 lg:col-end-9 lg:row-start-1 lg:row-end-4 ">
            <div className="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg">
              <div className="flex-1 flex flex-col ">
                <div className="px-6 py-10  ">
                  <div>
                    <h3
                      className="text-center text-2xl font-medium text-gray-900"
                      id="tier-hobby"
                    >
                      YES BANK Account Details
                    </h3>
                    <p className="block w-full text-center font-bold rounded-lg border border-transparent bg-white px-6 py-3 text-base  text-black hover:bg-gray-50">
                      Automax Solutions India Pvt. Ltd.
                    </p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between items-center border-t-2 border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10 ">
                  <ul role="list" className="space-y-4">
                    {yesBank.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckIcon
                            className="flex-shrink-0 h-6 w-6 text-green-500"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="ml-3 text-base font-medium text-gray-500">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                 
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mx-auto max-w-md lg:mx-0 lg:max-w-none  lg:col-start-7 lg:col-end-12 lg:row-start-2 lg:row-end-3">
                <div className="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg">
                  <div className="flex-1 flex flex-col">
                    <div className="bg-white px-6 py-10">
                      <div>
                        <h3
                          className="text-center text-2xl font-medium text-gray-900"
                          id="tier-hobby"
                        >
                          QR Code
                        </h3>
                        <p className="block w-full text-center font-bold rounded-lg border border-transparent bg-white px-6 py-3 text-base  text-black hover:bg-gray-50">
                          Automax Solutions India Pvt. Ltd.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between border-t-2 border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10">
                   
                      <Image
                        src={qr}
                        alt="auto bse"
                        className="w-60 h-60 object-center object-cover"
                      />
                   
                    </div>
                  </div>
                </div>
              </div> */}


        </div>

        {/* features */}
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root rounded-lg bg-gray-50 border border-indigo-600 px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                          <feature.icon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                        {feature.name}
                      </h3>
                      {/* <p className="mt-5 text-base text-gray-500">{feature.description}</p> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
