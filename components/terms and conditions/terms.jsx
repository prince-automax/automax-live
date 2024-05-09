import React from 'react';
import Link from 'next/link';
export const Terms   = ({ acceptTerms, rejectTerms }) => {

  return (
    <div className="fixed inset-1 flex  items-center justify-center bg-gray-800 bg-opacity-50 z-50 w-full md:px-20 md:py-48 py-10 px-5  lg:px-30 xl:px-40">
      <div className="bg-white  rounded-2xl  h-fit w-full lg:w-10/12  xl:w-1/2 max-md:h-fit pb-6 relative" >
    {/* <img src= alt="no image" className='w-full  object-cover absolute mix-blend-overlay'/> */}
        <h2 className="bg-blue-800 md:text-2xl text-lg  mb-4 text-center font-bold uppercase rounded-t-xl p-4 text-white ">Terms and Conditions</h2>
        <ul className=" max-md:h-[330px]  md:h-[500px]  overflow-y-auto    md:text-lg font-semibold   px-6 mt-3 bg-cover"  >
          <li className="mb-2">All vehicles are sold on "As is where is basis"</li>
          <li className="mb-2">All vehicles to be inspected by the bidder / buyer before the auction & bidding</li>
          <li className='mb-2'> The bidder will be liable for transfer of vehicle.</li>
          <li className='mb-2'> All issues related to RTO needs to be checked before bidding like RTO Objection / hold etcYear of Manufacture and Dealer Liability (if any) will have to be confirmed by bidder before bidding.
   Indemnity / Bond / Undertaking if demanded by Seller will have to be fulfilled by Bidder / Buyer.</li>
          <li className='mb-2'>Parking charges applic'public/pattern1.jpeg'able as per sellers terms & conditions. Buyer needs to check the same with respective seller before placing the bid.</li>
          <li className='mb-2'> Bids once placed cannot be cancelled. Winning bids will be valid till month end.</li>
          <li className='mb-2'> 10K Deposit will be forfeited per vehicle in case of default for not making payment of approved bids and ID will be blocked from auction participation in future.</li>
          <li className='mb-2'> This is Post Approval auction</li>
          <li className='mb-2'>  Payment terms: within 48 hours of approval.</li>
          <li className='mb-2'>  Availability of Form 36 & other transfer related documents need to be checked with seller before bidding.</li>
          <li className='mb-2'> Seller has the right to reverse approval given for repo sale as per their company policy.</li>
          <li className='mb-2'> Additional taxes applicable on transactions as per existing Govt. Of India rules. Please refer to seller for details.</li>
          <li className=' mb-2'> With Immediate effect no bids will be cancelled in any of the auctions. Request you to kindly place bids carefully.</li> 
          <li className='mb-2'> Release letter will be provided after submission of Documents within 72 working hours with all the best efforts as soon as  possible.</li>
          <li className='mb-2'>buyer fees applicable 2.5% + GST</li>

   
        </ul>
        <h2 className="md:text-xl font-bold uppercase text-center pb-4 max-md:mt-4">i agree to the terms of service and i read the privacy notice</h2>
        <div className="flex justify-center gap-8">
          <button onClick={acceptTerms} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800">Accept</button><Link href="/open-auctions/"><button onClick={rejectTerms}  className="px-4 py-2 bg-gray-400  text-white rounded hover:bg-gray-600">Reject</button></Link>
          
        </div>
      </div>
    </div>
  )
}
// 