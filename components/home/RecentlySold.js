import PostThumb1 from '@assets/blog/C1.jpg';
import PostThumb2 from '@assets/blog/C2.jpg';
import PostThumb3 from '@assets/blog/C3.jpg';
import PostThumb4 from '@assets/blog/C4.png';
import Image from 'next/image'

const products = [
    {
        id: 3,
        imgSrc: PostThumb1,
        altText: 'Startup',
        postLink: '#',
        title: 'Tata Signa 4825.TK',
        authorName: 'Chennai',
        date: 'January, 2023',
    },
    {
        id: 1,
        imgSrc: PostThumb4,
        altText: 'Jaguar',
        postLink: '#',
        title: 'Jaguar F-PACE',
        authorName: 'Cochin',
        date: 'June 2, 2023',
    },
    {
        id: 2,
        imgSrc: PostThumb3,
        altText: 'Creative',
        postLink: '#',
        title: 'BharatBenz 1623 Bus',
        authorName: 'Karnataka',
        date: 'Dec, 2022',
    },

    {
        id: 4,
        imgSrc: PostThumb2,
        altText: 'Creative',
        postLink: '#',
        title: 'BharatBenz',
        authorName: 'Kolkata',
        date: 'March , 2023',
    },
];

export default function RecentySold() {
    return (
        <div className="bg-gray-50">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">

                <div className="text-center">
                    <h2 className="text-base font-semibold tracking-wider text-primary uppercase">
                        Opportunity Missed
                    </h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                        Recently Sold
                    </p>
                    <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                        The latest list of auction deals.This is sure to give you an insight into selection of vehicles and their pricing strategy.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden group-hover:opacity-75">
                                <Image
                                    src={product.imgSrc}
                                    alt={product.altText}
                                    className="w-full h-full object-center object-cover"
                                />
                            </div>
                            <h3 className="mt-4 text-sm text-gray-700">
                                <a href={product.postLink}>
                                    <span className="absolute inset-0" />
                                    {product.title}
                                </a>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{product.authorName}</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">{product.date}</p>
                        </div>
                    ))}
                </div>
                {/* <div className="mt-8 flex justify-center text-sm">
                    <a href="#" className="font-medium text-primary hover:text-indigo-500">
                        View all recently sold<span aria-hidden="true"> &rarr;</span>
                    </a>
                </div> */}
            </div>
        </div>
    )
}
