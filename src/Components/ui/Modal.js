import React, { useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../../assets/x-icon.svg";
import { dispatchModalDisplayEvents } from "../../Components/PelcroModalController/PelcroModalController.service";
import { usePelcro } from "../../hooks/usePelcro";
import Authorship from "../../Components/common/Authorship";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export function Modal({
  id,
  onDisplay,
  className = "",
  hideCloseButton = !window.Pelcro.paywall.displayCloseButton(),
  children,
  ...props
}) {
  useEffect(() => {
    onDisplay?.();
    dispatchModalDisplayEvents(id);
  }, []);

  const [open, setOpen] = useState(true)

  const onClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className={`relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[480px] sm:px-6 w-full ${className}`}
            role="dialog"
            aria-modal="true"
            id={id}
            {...props}
          >
            <div className="pelcro-modal-content">
              {children.find(({ type }) => type === ModalHeader)}
              {children.find(({ type }) => type === ModalBody)}
              {children.find(({ type }) => type === ModalFooter)}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export const ModalHeader = ({
  id,
  onDisplay,
  onCloseModal,
  className = "",
  hideCloseButton,
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
          <CloseIcon className="plc-fill-current" />
        </button>
      )}

      <div className="plc-flex plc-w-full">
        <img
          alt="business logo"
          className={`plc-max-h-14 plc-my-2 pelcro-modal-logo ${window.Pelcro?._showModalHeader ? "" : "plc-hidden"
            }`}
          src={window.Pelcro.site.read().logo?.url}
        />
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
    <div className={`pelcro-modal-footer ${className}`}>
      {children}
      <Authorship />
    </div>
  );
};
