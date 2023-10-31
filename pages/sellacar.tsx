import React from 'react'
import Image from 'next/image'
import bck from '../public/assets/Sell a car/bck2.jpg'

import SellACarOtp from '../components/sellacar/sellACarOtp'

const SellACar = () => {
  return (
<div className='w-full  h-screen relative flex items-center justify-center '>
<div className='w-full h-full absolute  z-[-1] '>
  <Image
  src={bck}
  alt="key"
  layout="fill"
  objectFit="cover"
  className='bg-opacity-50'

  />
  </div>
 <div className='w-full ' >
   {/* <h1>dfsdafjadsfopadsofasop</h1> */}
<SellACarOtp/>
 </div>
</div>
    
  )
}

export default SellACar