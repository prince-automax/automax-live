import Swal from 'sweetalert2';
export const welcomeMessage=({name})=>{
   console.log("name from welcome message",name);
    Swal.fire({
      position: 'top-center',
      icon: 'success',
      title: name,
      showConfirmButton: false,
      timer: 1500
    })
}