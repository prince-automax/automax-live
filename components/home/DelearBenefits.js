import {
    AdjustmentsIcon,
    CheckIcon,
    EmojiHappyIcon,
    UserGroupIcon,
    UsersIcon,
    CursorClickIcon,
    SupportIcon,
} from '@heroicons/react/outline'

const features = [
    {
        name: 'Peace of mind',
        description: 'Buy with confidence since Autobse stands behind every transaction.',
        icon: EmojiHappyIcon,
    },
    {
        name: 'Digital Information',
        description: 'Industry leading digital condition reports and optional post sale Inspections are available',
        icon: CursorClickIcon,
    },
    {
        name: 'Work smarter',
        description: ' Save time and money, no need to travel to the auction means you have more time.',
        icon: CheckIcon,
    },
    {
        name: 'Unmatched inventory selection ',
        description: 'Expand your reach and expose your inventory to a national audience.',
        icon: AdjustmentsIcon,
    },
    {
        name: 'More bidders / buyers',
        description: 'Access to over 30,000+ vehicles and 750 sales Monthly at AutoBSE(OAT) OPEN Auction Technology',
        icon: UserGroupIcon,
    },
    {
        name: 'Remote Seller',
        description: 'Remotely represent your vehicles online reducing "if" and "no sales" to increase profits',
        icon: UsersIcon,
    },
    {
        name: 'Convenience',
        description: 'Buy and sell 24/7 using your Autobse.com ID and password.',
        icon: SupportIcon,
    },
]



export default function DelearBenefits() {
    return (
        <div className="py-16 bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-white font-semibold tracking-wide uppercase">
                        Benefits
                    </h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                        Delear Benefits
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative">
                                <dt>
                                    <div className="absolute flex items-start justify-center h-12 w-12 rounded-md bg-primary  text-white">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-white">{feature.name}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base font-light text-gray-200">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
