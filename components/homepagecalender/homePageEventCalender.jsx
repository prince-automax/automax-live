import UpcomingEventHomePage from "../tables/UpcomingEventHomePage"
import LiveEventHomePage from "../tables/LiveEventHomePage"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

import { Tab } from "@headlessui/react";
import React, {  useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const HomePageEventCalender = () => {
    let [tabs] = useState({
        "Upcoming Event": [],
        "Live Event": [],
      });
    
  return (
      <div className="pl-6">
        <div className="w-full  sm:px-0  my-2 p-4 ">
          <Tab.Group>
            <Tab.List className="flex justify-center space-x-1  sm:w-96  border ">
              {Object.keys(tabs).map((tab, tabIndex) => (
                <Tab
                  key={tabIndex}
                  className={({ selected }) =>
                    classNames(
                      "w-full h-full p-2 relative  text-sm font-medium leading-5",
                      "ring-offset-0 focus:outline-none text-black ",
                      selected
                        ? "bg-blue-600 text-white"
                        : "text-white bg-slate-500 ]"
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      {tab}
                      {selected && (
                        <span className="absolute top-10 left-14 transform -translate-y-1/2 transition ease-in-out delay-100">
                          <FontAwesomeIcon
                            icon={faCaretDown}
                            className="w-20 h-8 text-blue-600 "
                          />
                        </span>
                      )}
                    </>
                  )}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-6">
              <Tab.Panel>
              <UpcomingEventHomePage/>
              </Tab.Panel>
              <Tab.Panel>
               <LiveEventHomePage/>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div> 
  )
}

export default HomePageEventCalender