// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// export const Alerts = (title) => {
//     confirmAlert({
//         title: title,
       
//         buttons: [
//           {
//             label: 'Yes',
//             onClick: () => ture
//           },
//           {
//             label: 'No',
//             onClick: () => false
//           }
//         ]
//       });

// }

// export const Alerts = (title) => {
//     return new Promise((resolve, reject) => {
//       confirmAlert({
//         title: title,
  
//         buttons: [
//           {
//             label: 'Yes',
//             onClick: () => resolve(true)
//           },
//           {
//             label: 'No',
//             onClick: () => reject(false)
//           }
//         ]
//       });
//     });
//   }
  
// import { confirm } from 'react-bootstrap-confirm';
// import 'react-bootstrap-confirm/dist/react-bootstrap-confirm.css'; // Import the default CSS
// import './custom-confirm.css'; // Import the custom CSS



// export let = confirm({
//     title: 'Confirm Bid',
//     message: `Are you sure to bid for\nRs. ${amount}`,
//     okLabel: 'Yes',
//     cancelLabel: 'No',
//     dialogClassName: 'custom-confirm', // Add a custom class to the dialog
//   });

// }

// export const Alerts=(title , message,okLabel,cancelLabel)=>{
//     confirm({
//            title: title,
//            message: message,
//         okLabel: okLabel,
//             cancelLabel: cancelLabel,
//             dialogClassName: 'custom-confirm', // Add a custom class to the dialog
//            });

// }

// import { confirm } from 'react-bootstrap-confirm';
// import 'react-bootstrap-confirm/dist/react-bootstrap-confirm.css';

// import './custom-confirm.css';

// export const bootstrapConfirm = async (amount) => {
//   const confirmed = await confirm({
//     title: 'Confirm Bid',
//     message: `Are you sure to bid for\nRs. ${amount}`,
//     okLabel: 'Yes',
//     cancelLabel: 'No',
//     dialogClassName: 'custom-confirm',
//   });

//   return confirmed;
// };




  // async function CallBid(amount, vehicleId) {
  //   const confirmed = await Swal.fire({
  //     text:'Are you sure to bid for Rs. ' + amount + '?',
  //     title: "BID CONFIMATION" ,
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, bid for it!',
  //     customClass: {
  //       popup: 'animated bounceInDown'
  //     }
  //   });
  //   if (confirmed.isConfirmed) {
  //     try {
  //       const cc = await callCreateBid.mutateAsync({
  //         data: {
  //           amount: parseInt(amount),
  //           bidVehicle: {
  //             connect: {
  //               id: vehicleId,
  //             },
  //           },
  //         },
  //       });
  //       console.log("cc: ", cc);
  //       Swal.fire(
  //         'Success!',
  //         'Your bid has been submitted.',
  //         'success'
  //       );
  //     } catch (e) {
  //       console.log("EEE: ", e);
  //     }
  //   }
  // }
  

  import { FiAlertTriangle } from 'react-icons/fi';

export function AlertIcon() {
  return <FiAlertTriangle />;
}
