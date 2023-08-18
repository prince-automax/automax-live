import TheImage from '../../public/assets/banners/005.webp';
import Image from 'next/image';

export default function Banner3() {
    return (
        <div className="relative bg-gray-50 ">
            <main className="lg:relative ">
                <div className="mx-auto max-w-7xl w-full pt-16 pb-24 text-center lg:py-4 lg:text-left">
                    <div className="px-4  lg:w-1/2 sm:px-8 xl:pr-16">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:leading-none lg:mt-6">
                            <span>
                                The Automobile Industry's
                            </span>{' '}
                            <span className="text-primary">
                                Largest B2B Marketplace
                            </span>{' '}
                            <span>
                                at Your Disposal
                            </span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                            By bringing together the largest volume of automobile auction,
                            Dealers and OEM inventory, AutoBSE gives you an omni-channel access to more vehicle
                        </p>
                        <div className="mt-10  sm:flex sm:justify-center lg:justify-start mb-2">
                            <div className="rounded-md shadow  ">
                                <a
                                    href="#"
                                    className=" btn-primary px-8 py-3 md:py-2 md:text-lg md:px-5 "
                                >
                                    Download App
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-[-41px] lg:right-0 lg:w-1/2 lg:h-full">

                    <div className="absolute inset-0 w-full h-full object-cover">
                        <Image
                            src={TheImage}
                            alt="auto bse"
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}
