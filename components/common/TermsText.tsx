import React, { useState, useEffect } from "react";
import {
  useQueryQuery,
  QueryQueryVariables,
  GetEventQuery,
  useGetEventQuery,
  OrderDirection,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import moment from "moment";
import router from "next/router";
export default function TermsText(props) {
  const { id } = router.query;
  const [name, setName] = useState("");
  const [tick, setTick] = useState(0);
  const [serverTime, setserverTime] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("name");
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      setAccessToken(token);
      setName(name);
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((tic) => tic + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useGetEventQuery<GetEventQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    {
      where: { id: id as string },
      orderBy: [
        {
          createdAt: OrderDirection.Asc,
        },
      ],
      take: 1,
      skip: 0,
      userVehicleBidsOrderBy2: [{ amount: OrderDirection.Desc }],
    },
    { cacheTime: 5, refetchInterval: 60000, enabled: accessToken !== "" }
  );

  useEffect(() => {
    // if (data && data.time) {
    //     setTick(0);
    //     setserverTime(data.time);
    // }
  }, [data]);

  return (
    <div className="  flex flex-col ml-2">
      <p className="text-base font-bold">Terms & Conditions</p>
      <div className="text-xs font-semibold leading-6">
        {props.data}
        {/* 1. Sample Terms and conditions Text. */}
        {/* {data?.event?.termsAndConditions.document.getItem("")} */}
        {/* {serverTime
                    ? moment(serverTime).add(tick, "seconds").format("MMMM Do, YYYY")
                    : "-"}
                {" "}
                {serverTime
                    ? moment(serverTime).add(tick, "seconds").format("h:mm:ss a")
                    : "-"} */}
      </div>
      {/* <div className="text-xs">2. Sample Terms and conditions Text.</div>
      <div className="text-xs">3. Sample Terms and conditions Text.</div> */}
    </div>
  );
}
