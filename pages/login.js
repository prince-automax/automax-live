import { Tab } from '@headlessui/react'
import AuthTemplate from '../components/templates/AuthTemplate';
import LoginUsingOtp from '../components/auth/LoginUsingOtp.tsx';
import LoginUsingPassword from '../components/auth/LoginUsingPassword.tsx';
import withGuestRoutes from "../utils/withGuestRoutes.tsx";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Login() {

    return (
        <AuthTemplate heading="Sign in to your account" >
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded bg-blue-900/20 p-1 mt-4">
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded py-2.5 text-sm font-medium leading-5',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white shadow text-blue-700'
                                    : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-700'
                            )
                        }
                    >
                        Login Using OTP
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded py-2.5 text-sm font-medium leading-5',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white shadow text-blue-700'
                                    : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-700'
                            )
                        }
                    >
                        Login Using Password
                    </Tab>
                </Tab.List>

                <Tab.Panels className="mt-2">

                    <Tab.Panel>
                        <LoginUsingOtp />
                    </Tab.Panel>

                    <Tab.Panel>
                        <LoginUsingPassword />
                    </Tab.Panel>

                </Tab.Panels>
            </Tab.Group>
        </AuthTemplate>
    )
}


export default withGuestRoutes(Login)
