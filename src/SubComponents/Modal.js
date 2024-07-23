import React, { useEffect } from "react";
import { ReactComponent as CloseIcon } from "../assets/x-icon.svg";
import { dispatchModalDisplayEvents } from "../Components/PelcroModalController/PelcroModalController.service";
import { usePelcro } from "../hooks/usePelcro";
import Authorship from "../Components/common/Authorship";

/**
 *
 */
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

  return (
    <div className="pelcro-modal-overlay">
      <div
        className={`pelcro-modal ${className}`}
        role="dialog"
        aria-modal="true"
        id={id}
        {...props}
      >
        <div className="pelcro-modal-content">
          {children.find(
            ({ type }) =>
              type === ModalHeader && (
                <ModalHeader
                  id={id}
                  onDisplay={onDisplay}
                  hideCloseButton={hideCloseButton}
                  {...props}
                />
              )
          )}
          {children.find(({ type }) => type === ModalBody)}
          {children.find(({ type }) => type === ModalFooter)}
        </div>
      </div>
    </div>
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
          className={`plc-max-h-14 plc-my-2 pelcro-modal-logo ${
            window.Pelcro?._showModalHeader ? "" : "plc-hidden"
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
