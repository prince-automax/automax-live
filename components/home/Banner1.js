import TheImage from '../../public/assets/banners/002.svg';
import Image from 'next/image';


export default function Banner1() {
    return (
        <div className="relative bg-primary overflow-hidden ">
            <div className="hidden sm:block sm:absolute sm:inset-0" aria-hidden="true">
                <svg
                    className="absolute bottom-0 right-0 transform translate-x-1/2 mb-48 text-gray-700 lg:top-0 lg:mt-8 lg:mb-0 xl:transform-none xl:translate-x-0"
                    width={364}
                    height={384}
                    viewBox="0 0 364 384"
                    fill="none"
                >
                    <defs>
                        <pattern
                            id="eab71dd9-9d7a-47bd-8044-256344ee00d0"
                            x={0}
                            y={0}
                            width={20}
                            height={20}
                            patternUnits="userSpaceOnUse"
                        >
                            <rect x={0} y={0} width={4} height={4} fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width={364} height={384} fill="url(#eab71dd9-9d7a-47bd-8044-256344ee00d0)" />
                </svg>
            </div>
            <div className="relative pt-1 pb-16 sm:pb-0">
                <main className="mt-1">
                    <div className="mx-auto max-w-7xl">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                            <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
                                <div>
                                    <div
                                        className="inline-flex items-center text-white rounded-full p-0.5 sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
                                    >
                                        <span className="px-3 py-0.5 mt-px text-gray-900 text-xs font-light leading-5 uppercase tracking-wide bg-secondary rounded-full">
                                            Open space to Virtual space in autobse guguh
                                        </span>
                                    </div>
                                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-none lg:mt-4">
                                        <span >The New Standard in </span>{' '}
                                        <span className="text-secondary">B2B Marketplace. </span>
                                    </h1>

                                    <p className="mt-3 text-base text-gray-100 sm:mt-3">
                                        First time in India, AutoBSE introduces open auction technology
                                    </p>

                                    <p className="mt-3 text-base text-gray-100 sm:mt-4">
                                        AutoBSE is a full-service wholesale dealer at PAN India level, providing unmatched transparency that thousands of business partners trust.
                                    </p>
                                    <p className="mt- font-bold italic text-base text-gray-100 sm:mt-4 sm:text-xl lg:text-lg xl:text-xl">
                                        "OUR MISSION IS YOURS SATISFACTION"
                                    </p>
                                    <div className="mt-5 sm:mt-5 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            <a
                                                href="#"
                                                className="btn-secondary px-6 py-2 md:py-2 md:text-lg md:px-5"
                                            >
                                                Start Bidding
                                            </a>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <a
                                                href="#"
                                                className="btn-white px-6 py-2 md:py-2 md:text-lg md:px-5"
                                            >
                                                How it works
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-full">
                                <div className="relative w-full h-64 sm:h-72 md:h-50 lg:absolute lg:inset-y-[-81px] lg:right-0 lg:w-1/2 lg:h-full">
                                    <div className="absolute inset-0 w-full h-full object-cover">
                                        <Image 
                                            src={TheImage}
                                            alt="auto bse"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
