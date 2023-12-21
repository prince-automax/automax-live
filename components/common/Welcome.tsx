import React, { useState, useEffect } from "react";
import {
  useQueryQuery,
  QueryQueryVariables,
  GetUserQueryVariables,
  useGetUserQuery,
} from "@utils/graphql";
import graphQLClient from "@utils/useGQLQuery";
import moment from "moment";
export default function Welcome() {
  const [name, setName] = useState("");
  const [tick, setTick] = useState(0);
  const [serverTime, setserverTime] = useState(null);
  const id = localStorage.getItem("id");
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = localStorage.getItem("name");

      setName(name);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((tic) => tic + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: userData, isLoading } = useGetUserQuery<GetUserQueryVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    { where: { id } },
    {
      enabled: accessToken !== "",
    }
  );

  const username = userData ? userData["user"]?.username : "";
 

  if (username) {
    localStorage.setItem("username", username);
  }

  const { data } = useQueryQuery<QueryQueryVariables>(
    graphQLClient(),
    {},
    { refetchInterval: 60000 }
  );

  useEffect(() => {
    if (data && data.time) {
      setTick(0);
      setserverTime(data.time);
    }
  }, [data]);

  return (
    <div className="flex flex-col space-y-1 sm:space-y-0">
      <p className="text-sm sm:text-base">
        <span className="font-normal">Welcome</span> {name}!{" "}
      </p>

      <div className="text-xs">
      <p>  {serverTime
          ? moment(serverTime).add(tick, "seconds").format("MMMM Do, YYYY")
          : "-"}{" "}</p>
      <p className="hidden md:block">  {serverTime
          ? moment(serverTime).add(tick, "seconds").format("h:mm:ss a")
          : "-"}</p>
      </div>
    </div>
  );
}
