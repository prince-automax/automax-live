import HeroSection from "../components/home/HeroSection";
import UpcomingEventsTable from "../components/tables/UpcomingEventsTable";
import LiveEventsTable from "../components/tables/LiveEventsTable";
import AllEventsTable from "../components/tables/AllEventsTable";
import { useRouter } from 'next/router';
import RecentlySold from "../components/home/RecentlySold";
import Newsletter from "../components/home/Newsletter";
import Advantages from "../components/home/Advantages";
import LogoCloud from "../components/home/LogoCloud";
import DelearBenefits from "../components/home/DelearBenefits";
import Cards from "../components/home/Cards";
import React, { useEffect } from 'react';
export default function Example() {
    const router = useRouter();
    const isLoggedIn = typeof window !== 'undefined' && window.localStorage.getItem("token");  //typeof window !== 'undefined' check is used to prevent errors during server-side rendering when accessing the window object.
    // console.log('oops',isLoggedIn);
 

useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  }, []);

    return (
        <>
        
            <HeroSection />
           <AllEventsTable/>
            <Cards />
            <RecentlySold />
            <LogoCloud />
            <DelearBenefits />
            <Advantages />
            {/* <Newsletter /> */}
        </>
    )
}
