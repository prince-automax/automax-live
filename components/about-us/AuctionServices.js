import { CheckCircleIcon, StarIcon } from '@heroicons/react/outline'

const features = [
    {
        id: 1,
        name: 'Online B2B Auction with Fixed Base Price (FBP)',
    },
    {
        id: 2,
        name: 'Online B2B Auction with Zero Start Price (ZSP)',
    },
    {
        id: 3,
        name: 'Online B2B Auction with Reserve Base Price (RBP)',
    },
    {
        id: 3,
        name: 'Offline B2B Open Auction with Fixed Base Price (OFBP)',
    },
    {
        id: 3,
        name: 'Offline B2B Open Auction with Reserve Base Price (ORBP)',
    },
]

export default function AuctionServices() {
    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Auction Services
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        AutobseB2B Marketplace can do customized auctions for Seller’s. The following are the auction services we
                        offer.
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative">
                                <dt className="flex items-center">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-500 text-white">
                                        <StarIcon className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <p className="ml-6 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                </dt>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
