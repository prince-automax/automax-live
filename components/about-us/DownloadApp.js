import Link from "next/link";

export default function DownloadApp() {
    return (
        <div className="bg-indigo-700">
            <div className="max-w-3xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Download App Now!</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-indigo-200">
                    We digitize each step of the B2B Bidding Process using Click & swipe Technology connecting Sellers to Buyers.
                </p>
                <div className="flex space-x-6 justify-center">
    <a
        href="https://play.google.com/store/apps/details?id=com.autobseapp"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
    >
        Download Android App
    </a>

    <a
        href="https://rb.gy/14khe"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
    >
        Download iOS App
    </a>
</div>

            </div>
        </div>
    )
}


