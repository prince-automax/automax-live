
export default function Newsletter() {
    return (
        <div className="relative sm:py-16 bg-gray-50">
            <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="relative rounded-2xl px-6 py-10  overflow-hidden   sm:px-12 sm:py-20">
                    <div className="relative">
                        <div className="sm:text-center">
                            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                                Get notified about new events
                            </h2>
                            <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
                                Enter your email id to subsribe to our newsletter service, we assure you that we will not spam your mailbox.
                            </p>
                        </div>
                        <form action="#" className="mt-12 sm:mx-auto sm:max-w-lg sm:flex">
                            <div className="min-w-0 flex-1">
                                <label htmlFor="cta-email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="cta-email"
                                    type="email"
                                    className="block w-full border  rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-3">
                                <button
                                    type="submit"
                                    className="block w-full rounded-md border border-transparent px-5 py-3 bg-primary text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                                >
                                    Notify me
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}



