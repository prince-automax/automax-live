import TheImage from '../../public/assets/banners/001.svg';
import Image from 'next/image';
import Link from "next/link";


export default function Banner2() {
    return (
        <div className="relative bg-primary  ">
            <main className="lg:relative">
                <div className="mx-auto max-w-7xl w-full text-center pt-10 sm:pt-16 lg:pt-8 lg:pb-1 lg:text-left">
                
                    <div className="lg:py-px px-4 lg:w-1/2 sm:px-8 xl:pr-16"> 
                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-none lg:mt-6">
                            <span className="block xl:inline">Start Buying with </span>{' '}
                            <span className="block text-secondary xl:inline">AutoBSE Auctions</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-lg text-gray-100 sm:text-xl md:mt-5 md:max-w-3xl">
                            100% online Automobile business to business (B2B) Marketplace Auctions
                        </p>
                        <p className="mt-3 font-bold max-w-md mx-auto text-sm text-gray-100 sm:text-xl md:mt-5 md:max-w-3xl">
                            GET ON BOARD AND INCREASE  YOUR SALES OF USED VEHICLES
                        </p>
                        <div className="mt-5 pb-3 sm:flex sm:justify-center lg:justify-start">
                            <div className="rounded-md shadow ">
                                <a
                                    href="#"
                                    className="btn-secondary px-6 py-3 md:py-2 md:text-lg md:px-5"
                                >
                                    Learn More
                                </a>
                            </div>
                          
                            <div className="mt-3     rounded-md shadow sm:mt-0  sm:ml-3 ">
                            <Link href="/register">
                                <a
                                    href="#"
                                    className="btn-white px-6 py-3  md:py-2 md:text-lg md:px-5"
                                >
                                    Join Now
                                </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="  flex relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-[-1px] lg:right-0 lg:w-1/2 lg:h-full">
<div className="absolute flex justify-center items-center  w-full h-full object-cover">
    <Image
        src={TheImage}
        alt="auto bse"
        layout="fill"
      objectFit="cover"
      className="object-cover w-full  h-full"
    />
</div>
</div>


            </main>
        </div>
    )
}
