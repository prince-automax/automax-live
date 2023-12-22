import Swal from 'sweetalert2';
export const welcomeMessage=({name})=>{

    Swal.fire({
      position: 'top-center',
      icon: 'success',
      title: name,
      showConfirmButton: false,
      timer: 1500
    })
}