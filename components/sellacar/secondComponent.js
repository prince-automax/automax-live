import { useState } from 'react';
import { Formik, Form, Field } from 'formik';


const SecondComponent = () => {
    const [data, setData] = useState({
        firstname: '',
        lastName: '',
        email: '',
        password: '',
        location: '',
        city: ''
    });
    const handleSubmit = (values) => {
        // props.next(values);
    };
  return (
    <div className='max-w-2xl mx-auto bg-slate-100 border p-5 mt-10'>
    <Formik initialValues={data} onSubmit={handleSubmit}>
       {({values}) => (
              <Form className='space-y-6'>
               <p>make</p>
               <Field name="email"  className='p-2 border '/>
               <p>model</p>
               <Field name="password"  className='p-2 border ' />
            
               <div className='space-x-5'>
               <button  className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:w-auto" type="button" onClick={()=>props.prev(values)}>Back</button>
                   <button  className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:w-auto" type="submit">Next</button>
               </div>
           </Form>
       )}
   </Formik>
  </div>
  )
}

export default SecondComponent