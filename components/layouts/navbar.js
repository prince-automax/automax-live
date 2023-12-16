import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon, ChevronRightIcon, a } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadphones,
  faCircleInfo,
  faHouse,
  faGridHorizontal,
  faCar,
  faTag,
  faTableColumns,
  faUser,
  faTruckFast,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import Logo from "../ui/Logo";
import Link from "next/link";
import { useRouter } from "next/router";
import useStore from "../../utils/store";
import { useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = useRouter();

  const { token, setToken } = useStore((state) => ({
    token: state.token,
    setToken: (token) => state.setToken(token),
  }));

  const logout = () => {
    setToken(null);
    // localStorage.removeItem("id");
    // localStorage.removeItem("token");
    localStorage.clear();
    router.push(`/`);
  };
  const isLoggedIn = Boolean(token);

  const navigation = [
    {
      name: "Home",
      href: isLoggedIn ? "/dashboard" : "/",
      current: router.pathname == "/" ? true : false,
      icon: <FontAwesomeIcon icon={faHouse} />,
    },

    {
      name: "Membership",
      href: "/membership",
      current: router.pathname == "/membership" ? true : false,
      icon: <FontAwesomeIcon icon={faTag} />,
    },
    {
      name: "About Us",
      href: "/about",
      current: router.pathname == "/about" ? true : false,
      icon: <FontAwesomeIcon icon={faCircleInfo} />,
    },
    {
      name: "Contact Us",
      href: "/contact",
      current: router.pathname == "/contact" ? true : false,
      icon: <FontAwesomeIcon icon={faHeadphones} />,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      current: router.pathname == "/dashboard" ? true : false,
      icon: <FontAwesomeIcon icon={faTableColumns} />,
    },
    {
      name: "Open Leads",
      href: "/findauction",
      current: router.pathname == "/findauction" ? true : false,
      icon: <FontAwesomeIcon icon={faCircleInfo} />,
    },
    {
      name: "Sell A Truck",
      href: "/sellacar",
      current: router.pathname == "/sellacar" ? true : false,
      icon: <FontAwesomeIcon icon={faCar} />,
    },
  ];

  return (
    <div className="bg-white">
      <Popover>
      {({ open, close }) => (
        <>
        <nav
          className="relative max-w-7xl mx-auto px-4 sm:px-6"
          aria-label="Global"
        >
          <div className="border-b border-gray-200 flex items-center justify-between py-3">
            <div className="flex items-center flex-1">
              <div className="flex items-center justify-between w-full md:w-auto">
                <Logo />
                <div className="-mr-2 flex items-center md:hidden">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white">
                    <span className=""></span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              {/* Desktop view mapping */}
              <div className="hidden space-x-2 md:flex md:ml-10">
                {navigation.map((item) => (
                  <Link href={item.href} key={item.name}>
                    <a
                      className={classNames(
                        item.current
                          ? "bg-secondary text-gray-900"
                          : "text-gray-900 hover:text-gray-900 hover:bg-gray-200",
                        "group rounded-full text-sm px-3 py-1 flex items-center font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden md:flex space-x-4 ">
              {token ? (
                <button
                  onClick={() => logout()}
                  className="block w-full px-5 py-3 text-center text-sm font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/register">
                    <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer">
                      Become a dealer
                    </a>
                  </Link>

                  <Link href="/login">
                    <a className="text-gray-900 bg-secondary hover:bg-secondary-hover inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md cursor-pointer">
                      Log in
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <Transition
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute z-40 top-0 right-0  transition transform origin-top-right md:hidden"
          >
            <div className="flex flex-col justify-between  rounded-xl shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden w-60 h-screen text-[#747474]">
              {/* <div className="px-5 flex items-center justify-between"> */}
              {/* <Logo /> */}
              {/* <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
               
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div> */}
              {/* </div> */}
              {/* mobile view mapping */}
              <div className="px-2 pt-2 pb-3 space-y-1  w-44 mx-auto">
                {navigation.map((item) => (
                  <div key={item.index} className="flex   items-center  ">
                    {/* <div className="flex items-center"> */}
                    <div>{item?.icon}</div>
                    <div className="  ml-2 ">
                      <Popover.Button className="bg-white rounded-md p-2    hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <Link href={item.href} key={item.name}>
                          <a onClick={close}  className="block px-3  py-2 rounded-md text-base font-medium text-[#747474] hover:text-gray-900 hover:bg-gray-50">
                            {item.name}
                          </a>
                        </Link>
                      </Popover.Button>
                    </div>

                    {/* </div> */}
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-between w-44 mx-auto first-letter: mb-2   space-y-4">
                {token ? (
                  <div className="w-full space-x-4">
                     <span>
                      {" "}
                      <FontAwesomeIcon className="text-orange-600" icon={faRightFromBracket} />{" "}
                    </span>{" "}
                    <button
                    onClick={logout}
                    className="  px-5 py-3   text-sm font-medium text-indigo-600 "
                  >
                   
                    Logout
                  </button>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="inline-flex justify-between items-center w-full ">
                      <FontAwesomeIcon icon={faUser} />

                      <Link href="/register">
                        <a   onClick={close}  className="block w-full px-5 py-3 text-start text-sm font-medium text-indigo-600  ">
                          Become a dealer
                        </a>
                      </Link>
                    </div>

                    <div className="inline-flex justify-between items-center w-full">
                      <FontAwesomeIcon icon={faTruckFast} />
                      <Link href="/login">
                        <a  onClick={close}  className="block w-full px-5 py-3 text-start text-sm font-medium text-indigo-600 ">
                          Log in
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
        </>
      )}
    
      </Popover>
    </div>
  );
}
