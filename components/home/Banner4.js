import TheImage from '../../public/assets/banners/004.svg';
import Image from 'next/image';
import Link from "next/link";


export default function Banner4() {
    return (
        <div className="relative overflow-hidden">
            <main>
                <div className="pt-10 bg-green-800 sm:pt-16 lg:pt-px lg:pb-[28px] lg:overflow-hidden">
                    <div className="mx-auto max-w-7xl lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                                <div className="lg:py-px">
                                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white">
                                        Autobse Open Auction Technology
                                    </h1>
                                    <p className="mt-3 text-base text-gray-300 sm:mt-5">
                                        We make sure your presence and convenience at our bidding platform with open auction technology.
                                        Digital presence, highest bidding and smarter deals all at your place of comfort.
                                    </p>
                                   
                                    <p className="mt-3 text-base text-gray-300 sm:mt-5">
                                        It gives accessible via Autobse s 24/7 online wholesale vehicle marketplace
                                        with the largest selection of inventory in the industry. The site gives sellers the ability to remarket their inventory
                                        earlier in the remarketing cycle than the normal open auction. Buyers save on time and travel expenses with virtual Auction
                                        and they have the largest nationwide selection of wholesale inventory.
                                    </p>
                                    <p className="mt-3 text-base text-gray-300 sm:mt-5">
                                        It enables customers to buy and sell online in live auction sales via real-time deals.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
                                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                    <div
                                        className="w-2/4 lg:absolute lg:inset-y-[-50px] lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                    >
                                        <Image
                                            src={TheImage}
                                            alt="auto bse"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    )
}
