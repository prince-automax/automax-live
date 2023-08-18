import React from 'react'
import DashboardTemplate from "../components/templates/DashboardTemplate";
import withPrivateRoute from "../utils/withPrivateRoute";

import { PaperClipIcon, PencilAltIcon } from "@heroicons/react/outline";
import { GetUserQueryVariables, useGetUserQuery } from "@utils/graphql";
import { useEffect, useState } from "react";
import graphQLClient from "@utils/useGQLQuery";
import moment from "moment";


const Report = () => {
    
  return (
    <div>report</div>
  )
}

export default Report