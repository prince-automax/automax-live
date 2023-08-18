import Logo from '../ui/Logo';

export default function AuthTemplate({ children, heading, subHeading }) {

    return (
        <>
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8  mx-2">
                <div className="sm:mx-auto sm:w-full text-center sm:max-w-md">
                    {heading && <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {heading}
                    </h2>}
                    {subHeading && <p className="mt-2 text-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        {subHeading}
                    </p>}
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 border border-gray-800 rounded-lg sm:px-10">
                        <div className="text-center -mt-4">
                            <Logo />
                        </div>

                        {children}
                    </div>
                </div>
            </div>

        </>
    );
}

AuthTemplate.defaultProps = {
    heading: '',
    subHeading: '',
}
