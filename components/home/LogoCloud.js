import Image from 'next/image'
import indusland from '@assets/banks/indusland.jpg'
import kanaka from '@assets/banks/kanaka.jpg'
import mahaveer from '@assets/banks/MF.png'
import manappuram from '@assets/banks/Manappuram.png'

import muth from '@assets/banks/muth.png'
import TATA from '@assets/banks/tata.png'
import equitas from '@assets/banks/equitas.jpg'
import tvs from '@assets/banks/tvscredit.png'
import toyo from '@assets/banks/toyo.png'

export default function LogoCloud() {
    return (
        <div className="bg-white">
            <div className="max-w-full text-center mx-auto sm:py-20 py-12  px-4 sm:px-6 lg:px-8">
                <div>
                    {/* <h2 className="text-base font-semibold tracking-wider text-primary uppercase">
                        Popular Makers
                    </h2> */}
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                        Our  Clients
                    </p>
                </div>

                <div className="grid grid-cols-4 mt-8 gap-6 sm:grid-cols-8">
                    <div className="col-span-1 flex justify-center transition-transform duration-500 ease-in-out hover:scale-110">
                        <Image src={toyo} alt="toyo" />
                    </div>
                    <div className="col-span-1 flex justify-center transition-transform duration-500 ease-in-out hover:scale-110">
                        <Image src={tvs} alt="tvs" />
                    </div>
                    <div className="col-span-1 flex justify-center transition-transform duration-500 ease-in-out hover:scale-110">
                        <Image src={kanaka} alt="kanaka" />
                    </div>
                    <div className="col-span-1 flex justify-center transition-transform duration-500 ease-in-out hover:scale-110">
                        <Image src={equitas} alt="equitas" />
                    </div>
                    <div className="col-span-1 flex justify-center transition-transform duration-500 ease-in-out hover:scale-110">
                        <Image src={mahaveer} alt="mahaveer" />
                    </div>
                    <div className="col-span-1 flex justify-center transition-transform duration-500 ease-in-out hover:scale-110">
                        <Image src={TATA} alt="tata" />
                    </div>
                   
                    <div className="col-span-1 flex justify-center transition-transform duration-500 ease-in-out hover:scale-110">
                        <Image src={manappuram} alt="manapuram" />
                    </div>
                    <div className="col-span-1 flex justify-center transition-transform duration-500 ease-in-out hover:scale-110">
                        <Image src={muth} alt="muth" />
                    </div>
                
                </div>
            </div>
        </div>
    )
}
