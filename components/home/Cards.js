import React from 'react'
import {
    SearchIcon,
    CashIcon,
    CursorClickIcon,
} from '@heroicons/react/outline'

export default function Cards() {
    return (

        <section className="py-16 max-w-md mx-auto relative z-10 px-4 sm:max-w-3xl sm:px-6 lg:max-w-5xl lg:px-8" aria-labelledby="contact-heading">
            <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-8">

                <div className="group flex flex-col bg-white rounded-2xl shadow-xl border border-green-600 hover:border-green-700">
                    <div className="flex-1 relative pt-16 px-6 pb-8 md:px-8">
                        <div className="absolute top-0 p-5 inline-block bg-green-600 group-hover:bg-green-700 rounded-xl shadow-lg transform -translate-y-1/2">
                            <CashIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 group-hover:text-green-700">
                            Best Price Guarantee
                        </h3>
                        <p className="mt-4 text-base text-blue-gray-500 group-hover:text-green-700">
                        In just over two years, Autobse Auctions has helped 1000+ buyers  find great deals at unbelievably undervalued rates.
                        </p>
                    </div>
                </div>

                <div className="group flex flex-col bg-white rounded-2xl shadow-xl border border-purple-600 hover:border-purple-800">
                    <div className="flex-1 relative pt-16 px-6 pb-8 md:px-8">
                        <div className="absolute top-0 p-5 inline-block bg-purple-600 group-hover:bg-purple-700 rounded-xl shadow-lg transform -translate-y-1/2">
                            <SearchIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 group-hover:text-purple-700">
                            Largest Inventory
                        </h3>
                        <p className="mt-4 text-base text-blue-gray-500 group-hover:text-purple-700">
                            For vehicle dealers Autbse Auctions  offers a bounty of vehicle listings.
                        </p>
                    </div>
                </div>

                <div className="group flex flex-col bg-white rounded-2xl shadow-xl border border-blue-600 hover:border-blue-800">
                    <div className="flex-1 relative pt-16 px-6 pb-8 md:px-8">
                        <div className="absolute top-0 p-5 inline-block bg-blue-600 group-hover:bg-blue-700 rounded-xl shadow-lg transform -translate-y-1/2">
                            <CursorClickIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 group-hover:text-blue-700">
                            Real Time Auction
                        </h3>
                        <p className="mt-4 text-base text-blue-gray-500 group-hover:text-blue-700">
                        From Two Wheelers , Four Wheelers , Commercial Vehicles and Construction equipments, you will find some of the  most lucrative deals on Autobse Auctions.
                        </p>
                    </div>
                </div>

            </div>
        </section>

    )
}

