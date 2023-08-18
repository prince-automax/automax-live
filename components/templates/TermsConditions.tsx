import React from "react";
import { GetUserQuery, useGetUserQuery } from "@utils/graphql";
import { useEffect, useState } from "react";
import graphQLClient from "@utils/useGQLQuery";
import withPrivateRoute from "../../utils/withPrivateRoute";
import TermsText from "@components/common/TermsText";

function TermsConditions(props) {
  const id = localStorage.getItem("id");
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setAccessToken(token);
    }
  }, []);
  const { data } = useGetUserQuery<GetUserQuery>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` }),
    { where: { id } },
    {
      enabled: accessToken !== "",
    }
  );
  return (
    <section className="flex mt-10">
      <div className="bg-gray-200 py-1 w-full rounded border-b-4 border-orange-400 ...">
        <TermsText data={props.data} />
      </div>
    </section>
  );
}

export default withPrivateRoute(TermsConditions);
