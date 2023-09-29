import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardTemplate from "../../components/templates/DashboardTemplate";
import Loader from "../../components/ui/Loader";
import withPrivateRoute from "../../utils/withPrivateRoute";
import { Formik, Form,Field, ErrorMessage } from "formik";
import { faCar,faCashRegister,faCog,faImages,   } from '@fortawesome/free-solid-svg-icons';

  import {
    GetUserQueryVariables,
    useGetUserQuery,
    useUserWorkBookQuery,
    UserWorkBookQueryVariables,
    useUniqueuserWorkSheetQuery,
    UniqueuserWorkSheetQueryVariables
  } from "@utils/graphql";
  import graphQLClient from "@utils/useGQLQuery";
  import Router from "next/router";
  import Link from "next/link";
  import WorksheetCarsoul from "@components/modals/WorksheetCarsoul";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  function WorkBooks() {
    const router = useRouter();
    const { id } = router.query;
    const [accessToken, setAccessToken] = useState("");
    const [userId, setUserId] = useState("");
    const [usrid, setUsrid] = useState("");
    const [images, setImages] = useState([]);
    const [showImageCarouselModal, setShowImageCarouselModal] = useState(false);
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
  
        setAccessToken(token);
        setUserId(id);
        setUsrid(id);
      }
    }, []);


    const { data, isLoading, refetch } =
    useUniqueuserWorkSheetQuery<UniqueuserWorkSheetQueryVariables>(
      graphQLClient({ Authorization: `Bearer ${accessToken}` }),
      { where: { id :id as string} }
    );

  
   
    
    const make = data ? data["workSheet"]?.registrationNumber : "";



  useEffect(() => {
    refetch();
  }, [data]);

  function BindVehicleImage(vehicle) {

    
    if (vehicle) {
      const tempImages = [];
      let count = 0;
      if ( data && data["workSheet"]?.image1) {
        // alert('image1 is present')
        tempImages.push({
          id: 1,
          name: "Front Image",
          src: data ? data["workSheet"]?.image1 : "Not availabe",
          alt: "Front Image.",
        });
      }
      if (data && data["workSheet"]?.image2) {
        // alert('image 2 is present')
        tempImages.push({
          id: 2,
          name: "Back Image",
          src:data ? data["workSheet"]?.image2 : "Not availabe",
          alt: "Back Image.",
        });
      }
      if (data && data["workSheet"]?.image3) {
        // alert('image 3 is present')
        tempImages.push({
          id: 3,
          name: "Left Image",
          src: data ? data["workSheet"]?.image3 : "Not available",
          alt: "Left Image.",
        });
      }
      if (data && data["workSheet"]?.image4) {
        // alert('image 4 is present')
        tempImages.push({
          id: 4,
          name: "Right Image",
          src: data ? data["workSheet"]?.image4 : "Not available",
          alt: "Right Image.",
        });
      }
      if (data && data["workSheet"]?.image5) {
        // alert('image 5 is present')
        tempImages.push({
          id: 4,
          name: "Right Image",
          src: data ? data["workSheet"]?.image5 : "Not availabe",
          alt: "Right Image.",
        });
      }
    
      setImages(tempImages);
    } else {
      setImages([]);
    }
  }


  
    const validationSchema = Yup.object().shape({
        RegistrationNo: Yup.string().required('Registration Number is required and must'),
    
      });
    
  
      const onSubmit = async (values,{ resetForm }) => {
        
      }
      

   
   


    return (
        <DashboardTemplate>
       <div className="max-w-full mx-auto my-8 px-4">
      {/* {data && ( */}
        <div className="space-y-8">
        

          <Formik
           initialValues={{ RegistrationNo:'',make:'',model:'',ChaissNo:'',EngineNo:'',Varient:'' ,VehicleConditon:'',image1:'',image2:'',image3:'',image4:''
       , image5:''}} 
           validationSchema={validationSchema}
            onSubmit={onSubmit}
            
          >
            {(props) => (
             
              (
                <Form encType="multipart/form-data">
                  <div className="space-y-3 mt-4 pb-4">
                    <div className="mt-6 grid grid-cols-6 gap-6">
                      <div className="space-y-1 col-span-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Work Book
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500">
                          Enter the Vehicle Details .
                        </p>
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                          Registration No
                        </p>
                        <Field
                          type="input"
                          disabled
                          name="RegistrationNo"
                          label="Registration Number"
                          width="w-full"
                          placeholder="Registration Number"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 outline-none rounded-md"
                         value={ data ? data["workSheet"]?.registrationNumber : ""}
                        />
                        
                              
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                          Make
                        </p>
                        <Field
                          type="input"
                          name="make"
                          disabled
                          label="Make"
                          width="w-full"
                          placeholder="Make"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                          value={ data ? data["workSheet"]?.make : ""}
                        />
                        
                      </div>

                      <div className="col-span-6  sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                        Model
                        </p>
                        <Field
                          type="input"
                          disabled
                          name="model"
                          label="Model"
                          width="w-full"
                          placeholder="model"
                         
                    
                        className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border  border-gray-300 rounded-md"
                        value={ data ? data["workSheet"]?.model : ""}
                        />
                        
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                          Chaiss No
                        </p>
                        <Field
                          type="input"
                          name="ChaissNo"
                          disabled
                          label="Chaiss No"
                          width="w-full"
                          placeholder="Chaiss No"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none  border border-gray-300 rounded-md"
                          value={ data ? data["workSheet"]?.chassis : ""}
                        />
                        
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                      Engine No
                        </p>
                        <Field
                          type="input"
                          name="EngineNo"
                          disabled
                          label="Engine No"
                          width="w-full"
                          placeholder="Engine No"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none  border border-gray-300 rounded-md"
                          value={ data ? data["workSheet"]?.engineNo : ""}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                      Varient
                        </p>
                        <Field
                          type="input"
                          name="Varient"
                          disabled
                          label="Varient"
                          width="w-full"
                          placeholder="Varient"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                          value={ data ? data["workSheet"]?.varient : ""}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                      <p className="text-md leading-6 font-medium text-gray-900">
                      Vehicle Conditon
                        </p>
                        <Field
                             as="textarea"
                          name="VehicleConditon"
                          disabled
                          label="VehicleCondition"
                          width="w-full"
                          placeholder="Vehiclle condition"
                          className="py-3 px-4 block w-full shadow-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 outline-none border border-gray-300 rounded-md"
                          aria-describedby="message-max"
                          rows={4}
                          value={ data ? data["workSheet"]?.vehicleCondition : ""}
                        />
                      </div>
                      {/* IMAGES */}
                      <div className="space-y-1 col-span-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                         IMAGES
                        </h3>
                      
                      </div>
                  {/*  */}
                  <div>
               {   data && data["workSheet"] && data["workSheet"]?.image1 &&(
                      <div 
                       onClick={() => {
                        BindVehicleImage( data ? data : "");
                        setShowImageCarouselModal(true);
                      }}
                      className=" relative col-span-6 sm:col-span-12 text-center ">
                      <p className="text-md leading-6 font-medium text-gray-900 ">
                    <  FontAwesomeIcon className="mr-2 w-28 h-28 " icon={faImages} /> 
                 <span> View Image</span>
                        </p>
                      </div>
                    
            )}
</div>

            
                     </div>

                    
                  </div>
                </Form>
              )
            )}
          </Formik>
        </div>
    
    </div>
    <WorksheetCarsoul
        color="blue"
        open={showImageCarouselModal}
        close={() => setShowImageCarouselModal(false)}
        images={images}
      />
        </DashboardTemplate>
     
 
    )
    }
  
  export default withPrivateRoute(WorkBooks);
  