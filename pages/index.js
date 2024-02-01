import HeroSection from "../components/home/HeroSection";
import HomePageEventCalender from "../components/homepagecalender/homePageEventCalender"
import AllEventsTable from "../components/tables/AllEventsTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import RecentlySold from "../components/home/RecentlySold";
import Advantages from "../components/home/Advantages";
import LogoCloud from "../components/home/LogoCloud";
import DelearBenefits from "../components/home/DelearBenefits";
import Cards from "../components/home/Cards";
import { Tab } from "@headlessui/react";
import React, { useEffect, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Example() {
  const [accessToken, setAccessToken] = useState("");
  const router = useRouter();
  const isLoggedIn =
    typeof window !== "undefined" && window.localStorage.getItem("token"); //typeof window !== 'undefined' check is used to prevent errors during server-side rendering when accessing the window object.
  

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, []);

  let [tabs] = useState({
    "Upcoming Event": [],
    "Live Event": [],
  });

  return (
    <>
      <HeroSection />

     <HomePageEventCalender/>
{/* <AllEventsTable/> */}
      <Cards />
      <RecentlySold />
      <LogoCloud />
      <DelearBenefits />
      <Advantages />
    </>
  );
}
