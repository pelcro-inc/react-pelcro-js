import React from "react";
import { useTranslation } from "react-i18next"
import { usePelcro } from "../../hooks/usePelcro"
import { initPaywalls, initViewFromURL } from "../PelcroModalController/PelcroModalController.service"
import { getStableViewID } from "../../utils/utils"
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { EnvelopeIcon, ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import Authorship from "../common/Authorship"
import { XMarkIcon } from "@heroicons/react/24/outline"

const subscriptionOptions = [
  {
    id: "basic",
    title: "Basic Plan",
    description: "Perfect for individuals and small teams",
    startingPrice: 12,
    plans: [
      {
        id: "monthly",
        name: "Monthly Basic",
        description: "Billed monthly, cancel anytime",
        price: 12,
        interval: "month",
        features: ["Basic features", "Email support"],
      },
      {
        id: "yearly",
        name: "Yearly Basic",
        description: "Billed annually, save 20%",
        price: 120,
        interval: "year",
        features: ["Basic features", "Save 20%"],
      },
    ],
  },
  {
    id: "pro",
    title: "Pro Plan",
    description: "Advanced features for professionals",
    startingPrice: 24,
    image: "https://www.svgrepo.com/show/485070/gift-box-part-2.svg",
    plans: [
      {
        id: "monthly",
        name: "Monthly Pro",
        description: "Billed monthly, cancel anytime",
        price: 24,
        interval: "month",
        features: ["All Basic features", "Priority support", "5 users"],
      },
      {
        id: "yearly",
        name: "Yearly Pro",
        description: "Billed annually, save 20%",
        price: 240,
        interval: "year",
        features: ["All Basic features", "Priority support", "5 users", "Save 20%"],
      },
    ],
  },
]

/**
 *
 */
export function SubscriptionModal({ onDisplay, onClose, ...props }) {
  const { t } = useTranslation("subscription")
  const [open, setOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState()
  const [selectedPlan, setSelectedPlan] = useState()
  const [isGift, setIsGift] = useState(false)
  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId)
  }

  const handleBack = () => {
    setSelectedOption(null)
    setSelectedPlan(null)
  }


  const handleNext = () => {
    // Handle next step logic here
    console.log("Moving to next step")
  }



  return (
    <>
  <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl px-4 pb-4 pt-5 text-left shadow-2xl ring-1 ring-black/5 transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[800px] sm:px-6 w-full"
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

            <div className="flex min-h-full flex-1 flex-col justify-center sm:px-6 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="mt-6 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Subscribe to get access
                </h1>
                <div className="mt-3 flex justify-center">
                  <div className="inline-flex items-center">
                    <div className="h-0.5 w-12 bg-gradient-to-r from-primary-600/40 to-primary-600"></div>
                    <div className="mx-2 h-2 w-2 rounded-full bg-primary-600 animate-pulse"></div>
                    <div className="h-0.5 w-12 bg-gradient-to-l from-primary-600/40 to-primary-600"></div>
                  </div>
                </div>
                <p className="mt-2 text-center text-sm text-gray-600">Select one of the options below</p>
              </div>

              <div className="mt-8 px-2">
                {!selectedOption ? (
                  // Show subscription options
                  <div className="space-y-4">
                    {subscriptionOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        className="group relative rounded-xl border border-gray-200 bg-white p-6 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center gap-6">
                          {option.image && (
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 p-2 group-hover:border-primary-500/20 group-hover:bg-primary-50/50 transition-colors duration-300">
                              <img
                                src={option.image || "/placeholder.svg"}
                                alt=""
                                width={80}
                                height={80}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                              {option.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{option.description}</p>
                            <p className="mt-2 inline-flex items-center text-sm font-medium text-gray-900 bg-gray-50 rounded-full px-3 py-1 group-hover:bg-primary-50 transition-colors duration-300">
                              Starting at ${option.startingPrice}/month
                            </p>
                          </div>
                          <div className="shrink-0">
                            <span className="inline-flex items-center justify-center rounded-lg bg-primary-50 p-3 text-primary-600 group-hover:bg-primary-100 transition-colors duration-300">
                              <ArrowLeftIcon className="h-6 w-6 rotate-180" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Show plans for selected option
                  <div className="space-y-6">
                    <div className="relative rounded-xl border border-gray-200 bg-white">
                      <div className="flex items-center gap-4 p-6 border-b border-gray-100">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="group inline-flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                        >
                          <ArrowLeftIcon className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform duration-200" />
                          Back
                        </button>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {subscriptionOptions.find((opt) => opt.id === selectedOption)?.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {subscriptionOptions.find((opt) => opt.id === selectedOption)?.description}
                          </p>
                        </div>
                        {subscriptionOptions.find((opt) => opt.id === selectedOption)?.image && (
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 p-2">
                            <img
                              src={
                                subscriptionOptions.find((opt) => opt.id === selectedOption)?.image ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt=""
                              width={64}
                              height={64}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subscriptionOptions
                        .find((opt) => opt.id === selectedOption)
                        ?.plans.map((plan) => (
                          <label
                            key={plan.id}
                            className={`relative flex cursor-pointer rounded-xl border-2 bg-white transition-all duration-300 ${
                              selectedPlan === plan.id
                                ? "border-primary-500 ring-1 ring-primary-500/20 shadow-lg shadow-primary-500/10"
                                : "border-gray-200 hover:border-primary-500/50 hover:shadow-md"
                            }`}
                          >
                            {plan.popular && (
                              <div className="absolute -top-3 left-6">
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600 border border-primary-100">
                                  <SparklesIcon className="h-3.5 w-3.5" />
                                  Popular
                                </span>
                              </div>
                            )}
                            <input
                              type="radio"
                              name="plan"
                              value={plan.id}
                              className="sr-only"
                              onChange={() => setSelectedPlan(plan.id)}
                              checked={selectedPlan === plan.id}
                            />
                            <div className="flex w-full p-5">
                              <div className="flex-1">
                                <div className="flex items-center gap-x-2">
                                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                                <ul className="mt-4 space-y-3">
                                  {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm text-gray-600">
                                      <CheckIcon className="h-5 w-5 text-primary-500 shrink-0 mr-3" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="ml-6 flex flex-col items-end justify-between">
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-gray-900">
                                    ${plan.price}
                                    <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
                                  </div>
                                </div>
                                <div
                                  className={`mt-2 flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-300 ${
                                    selectedPlan === plan.id ? "border-primary-600 bg-primary-600" : "border-gray-300"
                                  }`}
                                >
                                  <CheckIcon
                                    className={`h-4 w-4 transition-colors duration-300 ${
                                      selectedPlan === plan.id ? "text-white" : "text-transparent"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                    </div>

                    <div className="flex items-center">
                      <div className="group relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="gift"
                            name="gift"
                            type="checkbox"
                            checked={isGift}
                            onChange={(e) => setIsGift(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 focus:ring-offset-2 transition-all duration-200"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="gift" className="font-medium text-gray-900">
                            Gift this subscription
                          </label>
                          <p className="text-gray-500">Send this subscription as a gift to someone special</p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!selectedPlan}
                      className="w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                    >
                      Continue to checkout
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                  >
                    Sign in
                  </a>
                </p>
              </div>
              <div className="mt-6 flex justify-center">
                <Authorship />
              </div>
              
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
    </>
  )
}

SubscriptionModal.viewId = "plan-select"

