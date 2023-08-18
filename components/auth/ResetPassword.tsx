import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    IsValidValue,
    IsValidMobile,
    IsValidPassword,
    IsSameValue,
} from "../../utils/validations";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { CheckCircleIcon } from "@heroicons/react/solid";

import graphQLClient from "@utils/useGQLQuery";
import {
    SendOtpMutationVariables,
    useSendOtpMutation,
    useVerifyOtpMutation,
    VerifyOtpMutationVariables,
    useResetPasswordMutation,
    ResetPasswordMutationVariables,
} from "@utils/graphql";

export default function ResetPassword() {
    const router = useRouter();
    const [success, setSuccess] = useState(null);

    const [mobileMode, setMobileMode] = useState(true);
    const [verificationMode, setVerificationMode] = useState(false);
    const [updatePasswordMode, setUpdatePasswordMode] = useState(false);

    const [mobile, setMobile] = useState("");
    const [otp, setOTP] = useState("");
    const [error, setError] = useState(null);
    const [token, setToken] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const callOTPMutation = useSendOtpMutation<SendOtpMutationVariables>(
        graphQLClient()
    );

    const callVerifyOTP = useVerifyOtpMutation<VerifyOtpMutationVariables>(
        graphQLClient()
    );

    const callResetPasswordMutation =
        useResetPasswordMutation<ResetPasswordMutationVariables>(
            graphQLClient({ Authorization: `Bearer ${token}` })
        );

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

    async function CallOTP() {
        let isValid = true;
        if (!IsValidValue(mobile) || !IsValidMobile(mobile)) {
            setError({ text: "Please enter a valid Mobile Number" });
            isValid = false;
        }
        if (isValid) {
            const result = await callOTPMutation.mutateAsync({ mobile });

            if (result.sendUserMagicAuthLink) {
                setMobileMode(false);
                setVerificationMode(true);
                setSuccess({
                    text: "Please enter the OTP received on your registered mobile number.",
                });
            } else {
                setError({
                    text: "Mobile number not registered. Please register first.",
                });
            }
        }
    }

    async function CallOTPVerify() {
        let isValid = true;
        if (!IsValidValue(otp)) {
            setError({ text: "Please enter a valid OTP." });
            isValid = false;
        }
        if (isValid) {
            const result = await callVerifyOTP.mutateAsync({ mobile, token: otp });
            if (result.redeemUserMagicAuthToken) {
                setToken(result.redeemUserMagicAuthToken["token"]);
                setVerificationMode(false);
                setUpdatePasswordMode(true);
                setSuccess({
                    text: "You have been successfully logged in.",
                });
            } else {
                setError({
                    text: "OTP verification failed. Please contact the support team.",
                });
            }
        }
    }

    async function CallUpdatePassword() {
        let isValid = true;

        if (!IsValidPassword(password)) {
            setError({ text: "Please enter a valid password." });
            isValid = false;
        }

        if (!IsSameValue(password, confirmPassword)) {
            setError({ text: "Password and confirm password do not match." });
            isValid = false;
        }

        if (isValid) {
            const result = await callResetPasswordMutation.mutateAsync({
                data: {
                    password,
                },
                where: { mobile: mobile },
            });
            if (result.updateUser) {
                setSuccess({
                    text: "You password has been reset successfully.",
                });
                router.push(`/login`);
            } else {
                setError({
                    text: "Something went wrong. Please try again or contact the support team.",
                });
            }
        }
    }

    const HandleCancel = () => {
        setMobileMode(true);
        setVerificationMode(false);
        setUpdatePasswordMode(false);
    };

    return (
        <>
            <div className="mt-4">
                {mobileMode && (
                    <div className="space-y-6">
                        <div>
                            <label
                                htmlFor="mobile"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mobile Number
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="mobile"
                                    placeholder="Please enter your mobile number"
                                    value={mobile}
                                    onChange={(e) => {
                                        setMobile(e.target.value);
                                    }}
                                    maxLength={10}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <Button
                            btnclass="w-full"
                            type="submit"
                            color="indigo"
                            onClick={CallOTP}
                        >
                            Send OTP
                        </Button>
                    </div>
                )}

                {verificationMode && (
                    <div className="space-y-6">
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircleIcon
                                        className="h-5 w-5 text-green-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">
                                        OTP sent successfully!
                                    </h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>
                                            Please enter the OTP received on your registered mobile
                                            number.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-gray-700"
                            >
                                OTP
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="mobile"
                                    placeholder="Please enter otp"
                                    value={otp}
                                    onChange={(e) => {
                                        setOTP(e.target.value);
                                    }}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                btnclass="w-full"
                                type="submit"
                                color="indigo"
                                onClick={CallOTPVerify}
                            >
                                Submit
                            </Button>

                            <button
                                className="w-full text-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 rounded"
                                onClick={HandleCancel}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={CallOTP}
                                className="w-full flex items-center justify-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 hover:text-indigo-800 focus:outline-none"
                            >
                                Click here to resend OTP
                            </button>
                        </div>
                    </div>
                )}

                {updatePasswordMode && (
                    <div className="space-y-6">
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircleIcon
                                        className="h-5 w-5 text-green-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">
                                        OTP successfully verified!
                                    </h3>
                                    <div className="mt-2 text-sm text-green-700">
                                        <p>Please enter your new password.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                btnclass="w-full"
                                type="submit"
                                color="indigo"
                                onClick={CallUpdatePassword}
                            >
                                Update Password
                            </Button>

                            <button
                                className="w-full text-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 rounded"
                                onClick={HandleCancel}
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
