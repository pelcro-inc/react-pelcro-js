import React, { useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../../assets/x-icon.svg";
import { dispatchModalDisplayEvents } from "../../Components/PelcroModalController/PelcroModalController.service";
import { usePelcro } from "../../hooks/usePelcro";
import Authorship from "../../Components/common/Authorship";
import { Dialog, DialogBackdrop } from "@headlessui/react";
import { Transition } from "@headlessui/react";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
export function Modal({
  id,
  bg = "plc-bg-white",
  onDisplay,
  className = "",
  hideCloseButton = !window.Pelcro.paywall.displayCloseButton(),
  children,
  title,
  description,
  ...props
}) {
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onDisplay?.();
    dispatchModalDisplayEvents(id);

    // Set loading false after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Dialog open={open} onClose={() => { }} className="relative z-50">
        <DialogBackdrop
          transition
          className="plc-fixed plc-inset-0 plc-bg-gray-500/75 plc-backdrop-blur-sm plc-transition-opacity data-[closed]:plc-opacity-0 data-[enter]:plc-duration-300 data-[leave]:plc-duration-200 data-[enter]:plc-ease-out data-[leave]:plc-ease-in"
        />

        <div className="plc-fixed plc-inset-0 plc-overflow-y-auto">
          <div className="plc-flex plc-min-h-full plc-items-center plc-justify-center plc-p-4">
            <Transition.Child
              as={React.Fragment}
              enter="plc-ease-out plc-duration-300"
              enterFrom="plc-opacity-0 plc-scale-95"
              enterTo="plc-opacity-100 plc-scale-100"
              leave="plc-ease-in plc-duration-200"
              leaveFrom="plc-opacity-100 plc-scale-100"
              leaveTo="plc-opacity-0 plc-scale-95"
            >
              <Dialog.Panel
                className={`${className ? className : 'plc-w-full plc-max-w-lg'}   plc-overflow-hidden plc-rounded-2xl 
                ${bg}
                plc-p-6 plc-shadow-xl plc-relative  z-50`}
                id={id}
                {...props}
              >
                {isLoading ? (
                  <div className="plc-absolute plc-inset-0 plc-flex plc-items-center plc-justify-center plc-bg-white/80 plc-backdrop-blur-sm plc-">
                    <svg className="plc-w-10 plc-h-10 plc-animate-spin" viewBox="0 0 24 24">
                      <circle className="plc-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="plc-opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                ) : null}

                <div className={`${isLoading ? 'plc-blur-sm' : ''}`}>
                  {children.find(({ type }) => type === ModalHeader)}
                  {children.find(({ type }) => type === ModalBody)}
                  {children.find(({ type }) => type === ModalFooter)}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export const ModalHeader = ({
  id,
  onDisplay,
  onCloseModal,
  className = "",
  hideCloseButton,
  title,
  description,
  children,
  fromDashboard,
  showBackButton = false,
  handleBackButton,
  ...props
}) => {
  const resetView = usePelcro((state) => state.resetView);
  const onClose = () => {

    onCloseModal?.();
    if (!fromDashboard) {
      resetView();
    }
  };

  return (
    <div className={`plc-relative ${className}`}>
      {!hideCloseButton && (
        <button
          type="button"
          className="plc-absolute plc-right-0 plc-top-0"
          aria-label="close modal"
          onClick={onClose}
        >
          <CloseIcon className="plc-h-4 plc-w-4 plc-fill-current plc-text-gray-500 hover:plc-text-gray-700" />
        </button>
      )}

      <div className="plc-relative plc-w-full">
          {showBackButton && (
            <button
              type="button"
              onClick={handleBackButton}
              className="plc-absolute plc-w-6 plc-text-gray-500 focus:plc-text-black plc-z-max plc-top-1/2 plc-left-6 plc-transform plc--translate-y-1/2 plc-border-0 hover:plc-text-black hover:plc-shadow-none plc-bg-transparent hover:plc-bg-transparent focus:plc-bg-transparent"
            >
              <ArrowLeft />
            </button>
          )}
          <div className="plc-flex plc-flex-col plc-items-center plc-justify-center plc-w-full">
            <h4 className="plc-text-2xl plc-font-bold plc-text-gray-800">
            {title}
            </h4>
            <p className="plc-mt-1 plc-text-gray-500 ">
              {description}
            </p>
          </div>
        </div>
      {children}
    </div>
  );
};

export const ModalBody = ({ className = "", children }) => {
  return (
    <div className={`pelcro-modal-body ${className}`}>{children}</div>
  );
};

export const ModalFooter = ({ className = "", children }) => {
  return (
    <div className={`plc-flex plc-flex-col plc-items-center plc-space-y-5 plc-mt-8 ${className}`}>
      {children}
      <Authorship />
    </div>
  );
};
