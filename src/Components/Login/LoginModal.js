import React from "react";
import { useTranslation } from "react-i18next"
import { usePelcro } from "../../hooks/usePelcro"
import { initPaywalls, initViewFromURL } from "../PelcroModalController/PelcroModalController.service"
import { getStableViewID } from "../../utils/utils"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { EnvelopeIcon, ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import Authorship from "../common/Authorship"

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

  return (
    <>
      <Dialog open={open} onClose={() => { }} className="relative z-50">
        <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[480px] sm:px-6 w-full"
            >
               <div className="absolute right-4 top-4">
              <button
                type="button"
                className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100/50 transition-all duration-200"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
              <div className="flex min-h-full flex-1 flex-col justify-center">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                  <h1 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-gray-900">
                    {currentView === "main" ? "Login to your account" : "Passwordless Login"}
                  </h1>
                  <div className="mt-3 flex justify-center">
                    <div className="inline-flex items-center">
                      <div className="h-0.5 w-12 bg-gradient-to-r from-primary-600/40 to-primary-600"></div>
                      <div className="mx-2 h-2 w-2 rounded-full bg-primary-600 animate-pulse"></div>
                      <div className="h-0.5 w-12 bg-gradient-to-l from-primary-600/40 to-primary-600"></div>
                    </div>
                  </div>
                  {/* <p className="mt-2 text-center text-sm text-gray-600">
                    {currentView === "main" 
                      ? "Enter your credentials or choose another method" 
                      : "Receive a magic link to login without a password"}
                  </p> */}
                </div>

                <div className="px-2 py-11">
                  {currentView === "main" ? (
                    // Main login form
                    <form action="#" method="POST" className="space-y-6">
                      <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            placeholder="Email address"
                            type="email"
                            required
                            autoComplete="email"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                          Password
                        </label>
                        <div className="mt-2">
                          <input
                            id="password"
                            name="password"
                            placeholder="Password"
                            type="password"
                            required
                            autoComplete="current-password"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end">                         
                        <div className="text-sm/6">
                          <a href="#" className="font-semibold text-gray-900 hover:text-primary-500">
                            Forgot password?
                          </a>
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                          Sign in
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Passwordless login form
                    <form action="#" method="POST" className="space-y-6">
                      <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                          Email address <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            name="email"
                            placeholder="Email address"
                            type="email"
                            required
                            autoComplete="email"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                        >
                          Send Magic Link
                        </button>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentView("main")}
                          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                          <ArrowLeftIcon className="h-4 w-4 mr-2" />
                          Back to Login Options
                        </button>
                      </div>
                    </form>
                  )}

                  {currentView === "main" && (
                    <div>
                      <div className="relative mt-10">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm/6 font-medium">
                          <span className="bg-white px-6 text-gray-900">Or continue with</span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <a
                          href="#"
                          className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                        >
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
                          <span className="text-sm/6 font-semibold">Google</span>
                        </a>

                        <a
                          href="#"
                          className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                        >
                          <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="h-5 w-5 text-[#1877F2]"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          <span className="text-sm/6 font-semibold">Facebook</span>
                        </a>

                        <a
                          href="#"
                          className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                        >
                          <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                            className="size-5 fill-[#24292F]"
                          >
                            <path
                              d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.032 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm/6 font-semibold">OAuth</span>
                        </a>

                        <button
                          onClick={() => setCurrentView("passwordless")}
                          className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                        >
                          <EnvelopeIcon className="h-5 w-5 text-gray-900" />
                          <span className="text-sm/6 font-semibold">Passwordless</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-1 flex justify-center">
                <Authorship />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

LoginModal.viewId = "login"

