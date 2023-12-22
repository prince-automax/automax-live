import Button from "../ui/Button";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IsValidValue, IsValidMobile } from "../../utils/validations";
import useStore from "../../utils/store";
import graphQLClient from "@utils/useGQLQuery";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import {
    useAuthenticateUserWithPasswordMutation,
    AuthenticateUserWithPasswordMutationVariables,
} from "@utils/graphql";
import Link from "next/link";

export default function LoginUsingPassword() {
    const router = useRouter();
    const [success, setSuccess] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const [showPassword, setShowPassword] = useState(false)
    const [inputFieldType, setInputFieldType] = useState('password')

    const handleShowPassword = () => {
        if (showPassword) {
            setInputFieldType('password')
        }
        else {
            setInputFieldType('text')
        }
        setShowPassword(!showPassword)
    }

    const callAuthenticateUserWithPasswordMutation =
        useAuthenticateUserWithPasswordMutation<AuthenticateUserWithPasswordMutationVariables>(
            graphQLClient()
        );

    const { setToken } = useStore((state) => ({
        setToken: (token) => state.setToken(token),
    }));

    useEffect(() => {
        if (success) {
            toast.success(success.text ? success.text : "Success");
            setTimeout(() => {
                setSuccess(null);
            }, 2000);
        }
        if (error) {
            toast.error(
                error.text ? error.text : "Something went wrong. Please contact support"
            );
            setTimeout(() => {
                setError(null);
            }, 2000);
        }
    }, [success, error]);

    async function CallPasswordLogin() {
    

        let isValid = true;
        if (!IsValidValue(username) || !IsValidMobile(username)) {
            setError({ text: "Please enter a valid Mobile Number" });
            isValid = false;
        }
        if (isValid && !IsValidValue(password)) {
            setError({ text: "Please enter a valid Password" });
            isValid = false;
        }
        if (isValid) {
            const result = await callAuthenticateUserWithPasswordMutation.mutateAsync(
                {
                    mobile: username,
                    password,
                }
            );

            if (result.authenticateUserWithPassword["sessionToken"]) {
                localStorage.setItem(
                    "token",
                    result.authenticateUserWithPassword["sessionToken"]
                );
                localStorage.setItem(
                    "id",
                    result.authenticateUserWithPassword["item"]["id"]
                );
                localStorage.setItem(
                    "status",
                    result.authenticateUserWithPassword["item"]["status"]
                );
                localStorage.setItem(
                    "name",
                    result.authenticateUserWithPassword["item"]["firstName"]
                );

                setToken(result.authenticateUserWithPassword["sessionToken"]);
                setSuccess({
                    text: "You have been successfully logged in.",
                });
                router.push(`/dashboard`);
            } else {
                setError({
                    text: "Invalid username or password.",
                });
            }
        }
    }



    return (
        <>
            <div className="space-y-6 mt-4">
                <div>
                    <label
                        htmlFor="mobile"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Mobile Number
                    </label>
                    <div className="mt-1">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            placeholder="Please enter your mobile number"
                            required
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            maxLength={10}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <div className="mt-1 relative">
                        <input
                            id="password"
                            name="password"
                            type={inputFieldType}
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            required
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div onClick={handleShowPassword} className="absolute inset-y-0 top-2 right-3">
                            {!showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5 text-gray-600" />}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link href="/reset-password">
                            <a className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </a>
                        </Link>
                    </div>
                </div>

                <div>
                    <Button
                        btnclass="w-full"
                        type="submit"
                        color="indigo"
                        onClick={CallPasswordLogin}
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        </>
    );
}
