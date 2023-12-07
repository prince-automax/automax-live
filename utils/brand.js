
import Image from 'next/image';
import Tata from '../public/assets/Truck logos/tata.png'
import ashok from '../public/assets/Truck logos/ashok.png'
import asian from '../public/assets/Truck logos/asian.png'
import bajaj from '../public/assets/Truck logos/bajaj.jpg'
import bharath from '../public/assets/Truck logos/bharathbenz.png'
import eicher from '../public/assets/Truck logos/eicher.gif'
import force from '../public/assets/Truck logos/force.png'
import isuzu from '../public/assets/Truck logos/isuzu.jpg'
import mahindra from '../public/assets/Truck logos/mahindra.jpg'
import marthi from '../public/assets/Truck logos/ms.png'
import piago from '../public/assets/Truck logos/Piaggio.png'
import Volvo from '../public/assets/Truck logos/Volvo.jpg'


export  const  truckBrands = [
    { name: "Tata Motors", image: <Image src={Tata} alt='tata' width="60px" height="50px" className='' />},
    { name: "Ashok Leyland", image:<Image src={ashok} alt='ashok'  width="60px" height="50px"/>},
    { name: "asian", image: <Image src={asian} alt='asian'  width="60px" height="50px"/>},
    { name: "bajaj", image:<Image src={bajaj} alt='bajaj'  width="60px" height="50px"/>},
    { name: "bharath", image: <Image src={bharath} alt='bharath'  width="60px" height="50px"/>},  
    { name: "eicher", image: <Image src={eicher} alt='eicher'  width="60px" height="50px"/>},
    { name: "force", image: <Image src={force} alt='force'  width="60px" height="50px"/>},
    { name: "isuzu", image: <Image src={isuzu} alt='isuzu'  width="60px" height="50px"/>},
    { name: "mahindra", image: <Image src={mahindra} alt='mahindra'  width="60px" height="50px"/>},
    { name: "marthi", image:<Image src={marthi} alt='ms'  width="60px" height="50px" />},
    { name: "piago", image: <Image src={piago} alt='piago'  width="60px" height="50px"/>},
    { name: "Volvo", image: <Image src={Volvo} alt='Volvo'  width="60px" height="50px"/>},
  ];
  
 