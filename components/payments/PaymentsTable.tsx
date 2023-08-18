import React, { useEffect, useState } from "react";
import Image from "next/image";
import PostThumb1 from "@assets/receipt.jpeg";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import {
  CalendarIcon,
  CheckCircleIcon,
  LightningBoltIcon,
} from "@heroicons/react/outline";
import {
  OrderDirection,
  PaymentsQueryVariables,
  usePaymentsQuery,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import moment from "moment";

export default function PaymentsTable() {
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAccessToken(token);
    }
  }, []);

  const { data, isLoading } = usePaymentsQuery<PaymentsQueryVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      orderBy: [
        {
          createdAt: OrderDirection.Desc,
        },
      ],
      skip: 0,
      take: 5,
    },
    { refetchInterval: 10000, enabled: accessToken != "" }
  );

  const renderPaymentFor = (paymentFor) => {
    switch (paymentFor) {
      case "registrations":
        return "Registration Pay";
      case "emd":
        return "EMD Payment";
      case "refund":
        return "Refund";
      case "other":
        return "Other";
      default:
        return "-";
    }
  };

  return (
    <div>
      <div className="pt-8">
        <div className="font-semibold">Recent Requests</div>
        <div className="space-y-6 mt-8">
          {data &&
            data["payments"] &&
            data["payments"].map((item, index) => (
              <div
                key={`d${index}`}
                className="sm:flex font-sans border border-gray-200 rounded bg-gray-100"
              >
                {item?.image?.url && (
                  <div className="flex-none w-40 relative p-6">
                    <Image
                      alt=""
                      src={`${process.env.BASE_URL}${item?.image?.url}`}
                      width={item?.image?.width}
                      height={item?.image?.height}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-auto p-6">
                  <div className="sm:flex flex-wrap">
                    <div className="flex-auto">
                      <h1 className="text-lg font-semibold text-slate-900">
                        {`Rs. ${item.amount}`}
                      </h1>
                      <div className="text-sm font-medium text-slate-700">
                        {`Payment For : ${renderPaymentFor(item.paymentFor)}`}
                      </div>
                      <div className="text-sm font-medium text-slate-700">
                        {`Description : ${item.description}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-6 pt-4 text-sm font-medium border-t border-slate-200">
                    <div className="flex-auto flex space-x-4">
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <CalendarIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {item?.createdAt
                            ? moment(item?.createdAt).format(
                                "MMMM Do, YYYY ddd h:mm a"
                              )
                            : ""}
                        </div>
                        {/* <div className="mt-2 flex items-center text-sm text-gray-500">
                          <CheckCircleIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          -
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
