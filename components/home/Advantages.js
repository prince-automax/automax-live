import {
    ClockIcon,
    SearchCircleIcon,
    UsersIcon,
} from '@heroicons/react/outline'

const features = [
    {
        name: 'Targeted Vehicle Search',
        icon: SearchCircleIcon,
    },
    {
        name: 'Direct Purchase to Verified and Rated B2B Dealers Only',
        icon: UsersIcon,
    },
    {
        name: 'Flexible Auction Times 24/7 Auction',
        icon: ClockIcon,
    },

]

export default function Advantges() {
    return (
        <div className="bg-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:pt-20 text-center sm:pb-24 lg:max-w-7xl lg:pt-24 lg:px-8">
                <h2 className="text-3xl font-extrabold text-primary tracking-tight">
                    AutoBse Advantage
                </h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-primary">
                    A BEST-IN-CLASS EXPERIENCE, DESIGNED FOR YOU
                </p>
                <p className="mt-4 max-w-3xl mx-auto text-base text-gray-700">
                    Make better decisions with cutting edge data, insights and help from the experts at AUTOBSE .
                    All with the advantage of the unparalleled number of buyers and sellers in our B2B Marketplace.

                </p>
                <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
                    {features.map((feature) => (
                        <div key={feature.name}>
                            <div >
                                <span className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                                </span>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
