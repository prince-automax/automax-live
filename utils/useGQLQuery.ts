/* eslint-disable no-undef */
import { GraphQLClient } from "graphql-request";

//* Commented out for now, as it's for feature purpuse or referance */
// import { useQuery, useMutation } from "react-query";
// import { RequestDocument } from "graphql-request/dist/types";

const endpoint =
    process.env.API_URL || "https://api.autobse.com/api/graphql";

const graphQLClient = (headers?: HeadersInit) =>
    new GraphQLClient(endpoint, { credentials: "include", headers });
export default graphQLClient;

// export const useGQLQuery = (key: string | any[], query: RequestDocument, variables = {}, config = {}) => {
//   const fetchData = () => graphQLClient().request(query, variables);
//   return useQuery(key, fetchData, config);
// };

// export const useGQLMutation = () => {
//   return useMutation(({ query, variables }: any) =>
//     graphQLClient().request(query, variables)
//   );
// };