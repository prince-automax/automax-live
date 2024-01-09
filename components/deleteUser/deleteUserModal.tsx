import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
    CreateUserMutationVariables,
    SendOtpMutationVariables,
    useCreateUserMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    VerifyOtpMutationVariables,
    UserStatusType,

    useDeleteUserMutation,
    DeleteUserMutationVariables

  } from "@utils/graphql";
  import graphQLClient from "@utils/useGQLQuery";
  import toast from "react-hot-toast";


const Modal = ({isModalOpend,closeModals}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [usrid, setUsrid] = useState("");
  const router = useRouter();


  useEffect(() => {
    setModalOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      setAccessToken(token);
      setUserId(id);
      setUsrid(id);
    }
  }, []);


  const closeModal = () => {
    setModalOpen(false);
  };

  const handleOk = () => {
    // Handle 'Ok' button click logic here
    // For now, just closing the modal
    closeModals();
  };

  const handleCancel = () => {
    // Handle 'Cancel' button click logic here
    // For now, just closing the modal
    closeModals();
    router.push('/')
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const userDeleteMutation=useDeleteUserMutation<DeleteUserMutationVariables>(
    graphQLClient({ Authorization: `Bearer ${accessToken}` })
  )

const onSubmit=async()=>{

  console.log('entereed in onsubmit function');
  closeModals();
    try {
      const result=await userDeleteMutation.mutateAsync({
        where: { id: userId as string },
    })
    
    toast.success('your Account has being successfully Deleted')
    console.log('reuslt from delete user',result);
  
    localStorage.clear();
    router.push(`/`);
 
    
    } catch (error) {
      console.log('ASDFGHJKLPOIII');
      
      console.log('error',);
      
    }
}


  return (
    isModalOpend && (
      <div className="fixed top-20 z-10 overflow-y-auto"onClick={closeModals} >
        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className="fixed inset-0 transition-opacity"
            onClick={stopPropagation}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>

          <div
            className="relative z-20 bg-white rounded-lg p-8 max-w-xl"
            onClick={stopPropagation}
          >
            <div className="flex justify-end">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModals}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4" onClick={stopPropagation}>
              {/* <h2 className="text-2xl font-bold mb-4">Delete Account</h2> */}
              <div className="space-y-2">
              <p className="text-black font-semibold ">
                Are you sure you want to delete your account from AutoBSE?

              </p>
              {/* <ul className="list-disc space-y-1 max-w-md flex flex-col mx-auto">
                <li>
                  {" "}
                  All your personal information, including profile data, posts,
                  and comments, will be erased.
                </li>
                <li>
                  {" "}
                  You will lose access to all your saved settings and
                  preferences.
                </li>
                <li> You will no longer be able to use AutoBSE services.</li>
              </ul> */}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-2"
                  onClick={onSubmit}
                >
                  Ok
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
