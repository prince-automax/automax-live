import Logo from "../ui/Logo";
import Link from "next/link";
export default function AuthTemplate({ children, heading, subHeading }) {
  return (
    <>
      <div className="min-h-full flex flex-col justify-center   py-12 sm:px-6 lg:px-8 space-y-4  mx-2 ">
        <div className="sm:mx-auto sm:w-full text-center sm:max-w-md">
          {heading && (
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {heading}
            </h2>
          )}
          {subHeading && (
            <p className="mt-2 text-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
              {subHeading}
            </p>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" py-8 px-4 border border-gray-800 rounded-lg sm:px-10   ">
            <div className="text-center -mt-4">
              <Logo />
            </div>

           <div> {children}</div>
            {/* <div className="text-center   ">
              <Link href="/deleteUser">
                <a target="_blank">
                  <div>
                    <span className="text-red-600 font-bold text-sm" >
                      Delete My Account
                    </span>
                  </div>
                </a>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

AuthTemplate.defaultProps = {
  heading: "",
  subHeading: "",
};
