
import { CheckIcon } from '@heroicons/react/outline'
const features = [
    {
        name: 'Online LIVE Auction: Internet Forward Auction',
    },
    {
        name: 'Public Auction(Open Auction): Physical Forward Auction ',
    },
    {
        name: 'Reverse Auctions: Internet Forward Auctions',
    },

    {
        name: 'Loan Portfolio Sales',
    },

    {
        name: 'Inventory Finance & Insurance',
    },
    {
        name: 'Business Liquidations',
    },
    {
        name: 'Equipments and Vehicle Rent',
    },
    {
        name: 'Specialty Services',
    },
    {
        name: 'Valuations: used vehicles, industrial surpluses, used equipment and machinery',
    },
    {
        name: 'Bulk Deals / Negotiated Sales : used vehicles, industrial surpluses, used equipment and machinery',
    },

]

export default function Services() {
    return (
        <div className="bg-gray-100">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:grid md:grid-cols-3 lg:gap-x-8">
                <div>
                    <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Everything you need</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900">All-in-one platform</p>
                    <p className="mt-4 text-lg text-gray-500">
                        Autobse.com B2B Marketplace is engaged in following types of auction Services to the Buyer and Seller’s
                    </p>
                </div>
                <div className="mt-12 lg:mt-0 lg:col-span-2">
                    <dl className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2  sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative">
                                <dt>
                                    <CheckIcon className="absolute h-6 w-6 text-indigo-700" aria-hidden="true" />
                                    <p className="ml-9 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                </dt>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
