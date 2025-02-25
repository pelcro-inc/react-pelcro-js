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

  useEffect(() => {
    onDisplay?.();
    dispatchModalDisplayEvents(id);
  }, []);

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
              <Dialog.Panel
                className={`w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-xl ${className}`}
                id={id}
                {...props}
              >
                <div className="">
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
    <div className={`pelcro-modal-header ${className}`}>
      {!hideCloseButton && (
        <button
          type="button"
          className="pelcro-modal-close"
          aria-label="close modal"
          onClick={onClose}
        >
          <CloseIcon className="fill-current" />
        </button>
      )}

      <div className="">
        {/* <img
          alt="business logo"
          className={`plc-max-h-14 plc-my-2 pelcro-modal-logo ${window.Pelcro?._showModalHeader ? "" : "plc-hidden"}`}
          src={window.Pelcro.site.read().logo?.url}
        /> */}
        {title && <Dialog.Title className="text-2xl font-bold text-gray-900">{title}</Dialog.Title>}
        {description && <Dialog.Description className="mt-2 text-gray-500">{description}</Dialog.Description>}
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
    <div className={`mt-6 flex justify-center ${className}`}>
      {children}
      <Authorship />
    </div>
  );
};
