import React, { useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../../assets/x-icon.svg";
import { dispatchModalDisplayEvents } from "../../Components/PelcroModalController/PelcroModalController.service";
import { usePelcro } from "../../hooks/usePelcro";
import Authorship from "../../Components/common/Authorship";
import { Dialog, DialogBackdrop } from "@headlessui/react";
import { Transition } from "@headlessui/react";

export function Modal({
  id,
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
                className={`plc-w-full plc-max-w-lg plc-overflow-hidden plc-rounded-2xl plc-bg-white plc-p-6 plc-shadow-xl ${className} plc-relative`}
                id={id}
                {...props}
              >
                {isLoading ? (
                  <div className="plc-absolute plc-inset-0 plc-flex plc-items-center plc-justify-center plc-bg-white/80 plc-backdrop-blur-sm plc-z-50">
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
  ...props
}) => {
  const resetView = usePelcro((state) => state.resetView);
  const onClose = () => {
    onCloseModal?.();
    resetView();
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

      <div className="">
        {/* <img
          alt="business logo"
          className={`plc-max-h-14 plc-my-2 pelcro-modal-logo ${window.Pelcro?._showModalHeader ? "" : "plc-hidden"}`}
          src={window.Pelcro.site.read().logo?.url}
        /> */}
        {title && <Dialog.Title className="plc-text-2xl plc-font-bold plc-text-gray-800">{title}</Dialog.Title>}
        {description && <Dialog.Description className="plc-mt-2 plc-text-gray-500">{description}</Dialog.Description>}
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
    <div className={`plc-flex plc-flex-col plc-items-center plc-space-y-5 ${className}`}>
      {children}
      <Authorship />
    </div>
  );
};
