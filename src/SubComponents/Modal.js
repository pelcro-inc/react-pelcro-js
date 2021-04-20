import React from "react";
import { ReactComponent as CloseIcon } from "../assets/x-icon.svg";

export function Modal({
  id,
  className = "",
  children,
  hideCloseButton = false,
  onClose,
  ...otherProps
}) {
  return (
    <div className="plc-fixed plc-top-0 plc-left-0 plc-flex plc-items-center plc-justify-center plc-w-full plc-h-full plc-overflow-auto plc-bg-black pelcro-modal-overlay plc-z-max plc-bg-opacity-60">
      <div
        className={`plc-container plc-absolute plc-top-0 plc-flex plc-flex-col plc-items-center plc-max-w-lg plc-bg-white plc-border-t-8 plc-border-primary-500 plc-rounded-md md:plc-mt-8 pelcro-modal ${className}`}
        role="dialog"
        aria-modal="true"
        id={id}
        {...otherProps}
      >
        <div className="plc-w-full pelcro-modal-content">
          <div className="plc-p-1 pelcro-modal-header">
            {!hideCloseButton && (
              <button
                type="button"
                className="plc-absolute plc-w-6 plc-text-gray-500 plc-top-3 plc-right-3 hover:plc-text-black pelcro-modal-close"
                aria-label="close modal"
                onClick={onClose}
              >
                <CloseIcon className="plc-fill-current" />
              </button>
            )}
          </div>
          {children.find(({ type }) => type === ModalBody)}
          {children.find(({ type }) => type === ModalFooter)}
        </div>
      </div>
    </div>
  );
}

export const ModalBody = ({ children }) => {
  return (
    <div className="plc-mx-8 plc-my-4 pelcro-modal-body">
      {children}
    </div>
  );
};

export const ModalFooter = ({ children }) => {
  return (
    <div className="plc-flex plc-flex-col plc-items-center plc-justify-center plc-mx-8 plc-mt-6 plc-mb-4 plc-text-sm pelcro-modal-footer">
      {children}
    </div>
  );
};
