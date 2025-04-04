import * as React from "react"
import { useTranslation } from "react-i18next"
import { usePelcro } from "../../hooks/usePelcro"
import { initPaywalls, initViewFromURL } from "../PelcroModalController/PelcroModalController.service"
import { getStableViewID } from "../../utils/utils"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { EnvelopeIcon, ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import Authorship from "../common/Authorship"
import { Transition } from "@headlessui/react"
import { CheckCircle, XCircle } from "lucide-react"

/**
 *
 */
export function LoginModal({ onDisplay, onClose, ...props }) {
    const { t } = useTranslation("login")
    const { switchView, resetView, product, plan, order, switchToAddressView, switchToPaymentView, giftCode, isGift } =
        usePelcro()

    const onSuccess = (res) => {
        props.onSuccess?.(res)
        handleAfterLoginLogic()
    }

    const handleAfterLoginLogic = () => {
        if (window.Pelcro.paywall.isArticleRestricted()) {
            initPaywalls()
        }

        if (!product && !order && !giftCode) {
            // If product and plan are not selected
            return resetView()
        }

        // If this is a redeem gift
        if (giftCode) {
            return switchView("gift-redeem")
            // return switchToAddressView();
        }

        // Check if the subscription is meant as a gift (if so, gather recipients info)
        if (isGift) {
            return switchView("gift-create")
        }

        if (order) {
            return switchToAddressView()
        }

        if (product && plan) {
            if (product.address_required) {
                return switchToAddressView()
            } else {
                return switchToPaymentView()
            }
        }

        if (product && !plan) {
            return switchView("plan-select")
        }

        const viewFromURL = getStableViewID(window.Pelcro.helpers.getURLParameter("view"))

        const viewsURLs = ["invoice-details", "gift-redeem", "plan-select", "payment-method-update"]

        if (viewsURLs.includes(viewFromURL)) {
            return initViewFromURL()
        }

        return resetView()
    }

    const onCreateAccountClick = () => {
        switchView("plan-select")
    }

    const onForgotPassword = () => {
        switchView("password-forgot")
    }

    const onPasswordlessRequest = () => {
        switchView("passwordless-request")
    }
    const [open, setOpen] = useState(true)
    const [currentView, setCurrentView] = useState("main")


    const [isOpen, setIsOpen] = React.useState(true)
    const [isLoading, setIsLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
    }


    return (
        <>
            <Dialog open={open} onClose={() => { }} className="relative z-50">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
                                <Dialog.Title className="text-2xl font-bold text-gray-900">Welcome back</Dialog.Title>
                                <Dialog.Description className="mt-2 text-gray-500">Sign in to your account</Dialog.Description>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <button className="group flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#1877F2"
                                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                            />
                                        </svg>
                                        Facebook
                                    </button>
                                    <button className="group relative flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow active:bg-gray-100">
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                            <path
                                                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                                fill="#EA4335"
                                            />
                                            <path
                                                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                                fill="#34A853"
                                            />
                                        </svg>
                                        Google
                                    </button>
                                </div>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm uppercase">
                                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            className="w-full rounded-lg border-2 border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-800 focus:border-2 focus:bg-white focus:shadow-sm focus:placeholder:text-gray-500"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="password"
                                            required
                                            className="w-full rounded-lg border-2 border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-gray-800 focus:border-2 focus:bg-white focus:shadow-sm focus:placeholder:text-gray-500"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />

                                        <div className="mt-2 flex items-center justify-end">
                                            <a
                                                href="/forgot-password"
                                                className="text-sm text-gray-600 transition-colors hover:text-gray-900 hover:underline"
                                            >
                                                Forgot password?
                                            </a>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="relative w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Signing in...
                                            </div>
                                        ) : (
                                            "Sign in"
                                        )}
                                    </button>
                                </form>

                                <p className="text-center text-sm text-gray-500 mt-8">
                                    Don't have an account?{" "}
                                    <a href="/register" className="font-medium text-gray-900 transition-colors hover:underline">
                                        Sign up
                                    </a>
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <Authorship />
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

LoginModal.viewId = "login"

