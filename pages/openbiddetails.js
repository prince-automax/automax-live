import React from "react";
import moment from "moment";
import Image from "next/image";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import DashboardTemplate from "../../components/templates/DashboardTemplate";
// import Loader from "../../components/ui/Loader";
// import withPrivateRoute from "../../utils/withPrivateRoute";
// import { Formik, Form,Field, ErrorMessage } from "formik";
// import { faCar,faCashRegister,faCog,faImages,   } from '@fortawesome/free-solid-svg-icons';
import {useFindAuctions} from "@utils/graphql";
// import graphQLClient from "@utils/useGQLQuery";
// import Router from "next/router";
import Link from "next/link";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const OpenBidDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      setAccessToken(token);
      setUserId(id);
    }
  }, []);

  return (
    <>
      <div className="max-w-4xl md:max-w-5xl mx-auto my-10   ">
        <div className=" mx-4 my-6 ">
          <h2 className="text-2xl font-semibold text-black ">
            Autobse.com Listing ID - 1287824 Details:
          </h2>
        </div>
        <div className="w-full h-px bg-gray-300 my-4  " />

        <div className="grid grid-cols-1  mx-4 border">
          <div className="space-y-2 py-3 px-3 md:grid md:grid-cols-2 border  ">
            <p className="text-base font-semibold tracking-wide ">
              Lisiting ID
            </p>
            <p className="text-base font-semibold tracking-wide h-">7897894</p>
          </div>
          <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border  ">
            <p className="text-base font-semibold tracking-wide">Institution</p>
            <p className="text-base font-normal tracking-wide text-gray-800">
              Debts Recovery Tribunal
            </p>
          </div>
          <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
            <p className="text-base font-semibold tracking-wide">Asset Type</p>
            <p className="text-base font-normal tracking-wide text-gray-800">
              Plot
            </p>
          </div>
          <div className="space-y-1 py-3 px-3 md:col-span-2 md:grid md:grid-cols-2 border ">
            <p className="text-base font-semibold tracking-wide">
              Asset Location
            </p>
            <p className="text-base font-normal tracking-wide text-gray-800">
              Pollachi
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 border max-lg:px-2  text-center">
            <div className=" max-w-4xl border border-sky-300 my-4 mx-auto  bg-slate-100 h-60 space-y-4 pb-2 flex flex-col justify-center items-center">
              <div className="space-y-2">
                <h1 className="text-base sm:text-lg m-2">
                  Only subscriber can view Auction Details and Documents. If you
                  are a Subscriber
                </h1>
                <div>
                  <Link href="/register">
                    <a
                      href="#"
                      className="py-1 px-4 bg-sky-600 text-white border"
                      aria-describedby="tier-growth"
                    >
                      Log In
                    </a>
                  </Link>
                </div>

                <div className="flex justify-center items-center space-x-4 mt-5">
                  <div className=" w-20 sm:w-60 h-px bg-slate-300" />
                  <div className="items-baseline">OR</div>
                  <div className="w-20 sm:w-60 h-px bg-slate-300" />
                </div>
                <div>
                  <Link href="/register">
                    <a
                      href="#"
                      className="py-1 px-4  bg-teal-500 text-white border "
                      aria-describedby="tier-growth"
                    >
                      Register
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpenBidDetails;
