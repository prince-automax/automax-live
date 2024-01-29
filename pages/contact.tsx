import { MailIcon, PhoneIcon } from "@heroicons/react/outline";
import * as Yup from "yup";
import { Formik, Form,Field, ErrorMessage } from "formik";
import FormField from "../components/ui/FormField";
import ButtonLoading from "../components/ui/ButtonLoading";
import graphQLClient from "@utils/useGQLQuery";
import withPrivateRoute from "../utils/withPrivateRoute";
import Loader from "@components/ui/Loader"; 
import { UserCircleIcon } from "@heroicons/react/outline";
import Router from "next/router";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRef } from 'react';
import {useCreateContactUsMutation,CreateContactUsMutationVariables} from '@utils/graphql'
const offices = [
  {
    id: 1,
    city: "Chennai",
    address: ["No.23 A, 2nd Floor", "Villivakkam, 600049"],
  },
  { id: 2, city: "Mumbai", address: ["coming Soon..."] },
  { id: 3, city: "Hyderabad", address: ["coming Soon..."] },
  { id: 4, city: "Kochi", address: [ "Green Earth Building"," palarivattam ,682024"] },
  
];


export default function Contact() {

  const formikRef = useRef(null);

  const callCreateContactus =
  useCreateContactUsMutation<CreateContactUsMutationVariables>(
      graphQLClient()
    );

  const onSubmitData=async(values ,{ resetForm })=>{
   

    const result = await callCreateContactus.mutateAsync({
      data:{
        firstName : values['firstname'],
        lastName : values['lastname'],
        mobile : values['phone'].toString(),
        // field has been changed to state instead of email 
        state:values['email'],
        message:values["message"],
        subject:values['subject']
      }
    }).then(() => {
      toast.success('Thank you. Your request has been recorded. Our Team will contact you soon', {
        duration: 5000,
        position: 'top-center'
      });
      // resetForm({ proof: "" });
      resetForm();
    })
    .catch((ex) => {
      toast.error("Request was not submitted. Please try again.");
    });
    
    

    // resetForm();
  }
  return (
    <div>
      <main className="overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50">
          <div className="py-24">
            <div className="relative z-10 max-w-7xl mx-auto pl-4 pr-8 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                Contact us
              </h1>
              <p className="mt-6 text-xl text-gray-500 max-w-3xl">
                For all enquiries, please fill up and submit  the below form.<br></br>Our team will contact you soon.
              </p>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <section
          className="relative bg-white"
          aria-labelledby="contact-heading"
        >
          <div
            className="absolute w-full h-1/2 bg-gray-50"
            aria-hidden="true"
          />
          {/* Decorative dot pattern */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <svg
              className="absolute z-0 top-0 right-0 transform -translate-y-16 translate-x-1/2 sm:translate-x-1/4 md:-translate-y-24 lg:-translate-y-72"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={384}
                fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
              />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="relative bg-white shadow-xl">
              <h2 id="contact-heading" className="sr-only">
                Contact us
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Contact information */}
                <div className="relative overflow-hidden py-10 px-6 bg-indigo-700 sm:px-10 xl:p-12">
                  {/* Decorative angle backgrounds */}
                  <div
                    className="absolute inset-0 pointer-events-none sm:hidden"
                    aria-hidden="true"
                  >
                    <svg
                      className="absolute inset-0 w-full h-full"
                      width={343}
                      height={388}
                      viewBox="0 0 343 388"
                      fill="none"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                        fill="url(#linear1)"
                        fillOpacity=".1"
                      />
                      <defs>
                        <linearGradient
                          id="linear1"
                          x1="254.553"
                          y1="107.554"
                          x2="961.66"
                          y2="814.66"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" />
                          <stop offset={1} stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none sm:block lg:hidden"
                    aria-hidden="true"
                  >
                    <svg
                      className="absolute inset-0 w-full h-full"
                      width={359}
                      height={339}
                      viewBox="0 0 359 339"
                      fill="none"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
                        fill="url(#linear2)"
                        fillOpacity=".1"
                      />
                      <defs>
                        <linearGradient
                          id="linear2"
                          x1="192.553"
                          y1="28.553"
                          x2="899.66"
                          y2="735.66"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" />
                          <stop offset={1} stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div
                    className="hidden absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none lg:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="absolute inset-0 w-full h-full"
                      width={160}
                      height={678}
                      viewBox="0 0 160 678"
                      fill="none"
                      preserveAspectRatio="xMidYMid slice"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z"
                        fill="url(#linear3)"
                        fillOpacity=".1"
                      />
                      <defs>
                        <linearGradient
                          id="linear3"
                          x1="192.553"
                          y1="325.553"
                          x2="899.66"
                          y2="1032.66"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" />
                          <stop offset={1} stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    Contact information
                  </h3>
                  <p className="mt-6 text-base text-indigo-50 max-w-3xl">
                    Live support is available Mon-Saturday 10am-5pm contact us
                    in the given numbers, or write to us.
                  </p>
                  <dl className="mt-8 space-y-6">
                    <dt>
                      <span className="sr-only">Phone number</span>
                    </dt>
                    <dd className="flex text-base text-indigo-50">
                      <PhoneIcon
                        className="flex-shrink-0 w-6 h-6 text-indigo-200"
                        aria-hidden="true"
                      />
                      <span className="ml-3">+91 9962334455</span>
                    </dd>
                    <dd className="flex text-base text-indigo-50">
                      <PhoneIcon
                        className="flex-shrink-0 w-6 h-6 text-indigo-200"
                        aria-hidden="true"
                      />
                      <span className="ml-3">+91 8129 94 97 30</span>
                    </dd>
                    <dd className="flex text-base text-indigo-50">
                      <PhoneIcon
                        className="flex-shrink-0 w-6 h-6 text-indigo-200"
                        aria-hidden="true"
                      />
                      <span className="ml-3">+91 8129 88 97 30</span>
                    </dd>
                    <dt>
                      <span className="sr-only">Email</span>
                    </dt>
                    <dd className="flex text-base text-indigo-50">
                      <MailIcon
                        className="flex-shrink-0 w-6 h-6 text-indigo-200"
                        aria-hidden="true"
                      />
                      <span className="ml-3">support@autobse.com</span>
                    </dd>
                  </dl>
                </div>

                {/* Contact form */}
                <div className="py-10 px-6 sm:px-10 lg:col-span-2 xl:p-12">
                  <h3 className="text-lg font-medium text-gray-900">
                    Send us a message
                  </h3>
                  <Formik  initialValues={{ firstname:'',lastname:'',email:'',phone:'',subject:'',message:''}} onSubmit={onSubmitData
                  }

            
                  innerRef={formikRef}
                
           >

                

{({ isSubmitting }) => (
                  <Form className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <div>
                      <label
                        htmlFor="firstname"
                        className="block text-sm font-medium text-gray-900"
                      >
                        First name
                      </label>
                      <div className="mt-1">
                        <Field
                          maxLength={10}
                          
                          type="text"
                          name="firstname"
                          id="firstname"
                          autoComplete="given-name"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="lastname"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Last name
                      </label>
                      <div className="mt-1">
                        <Field
                      
                          type="text"
                          name="lastname"
                          id="lastname"
                          autoComplete="family-name"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-900"
                      >
                        State
                      </label>
                      <div className="mt-1">

                        <Field
                          required
                          id="email"
                          name="email"
                          type="text"
                          autoComplete="email"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-900"
                        >
                          Phone
                        </label>
                        <span
                          id="phone-optional"
                          className="text-sm text-gray-500"
                        >
                          Optional
                        </span>
                      </div>
                      <div className="mt-1">
                        <Field
                        required
                          type="number"
                          name="phone"
                          id="phone"
                          autoComplete="tel"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                          aria-describedby="phone-optional"
                        />
                      </div>
                    </div>
                    {/* <div className="sm:col-span-2">
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-900"
                      >
                        State
                      </label>
                      <div className="mt-1">
                        <Field
                     
                          type="text"
                          name="subject"
                          id="subject"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                        />
                      </div>
                    </div> */}
                    <div className="sm:col-span-2">
                      <div className="flex justify-between">
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-900"
                        >
                          Message
                        </label>
                        <span
                          id="message"
                          className="text-sm text-gray-500"
                        >
                          Max. 500 characters
                        </span>
                      </div>
                      <div className="mt-1">
                        <Field
                       
                        as="textarea"
                          id="message"
                          name="message"
                          rows={4}
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                          aria-describedby="message-max"
                          // defaultValue={""}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:flex sm:justify-end">
                      <button
                        type="submit"
                        className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:w-auto"
                        disabled={isSubmitting}
                      >
                        Submit
                      </button>
                    </div>
                    </Form>
                      )}
                  {/* </form> */}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact grid */}
        <section aria-labelledby="offices-heading bg-gray-100">
          <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h2
              id="offices-heading"
              className="text-3xl font-extrabold text-gray-900"
            >
              Our offices
            </h2>
            <p className="mt-6 text-lg text-gray-500 max-w-3xl">
              We are expanding fast across India, let's connect with us through
              following offices.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {offices.map((office) => (
                <div key={office.id}>
                  <h3 className="text-lg font-medium text-gray-900">
                    {office.city}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {office.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
