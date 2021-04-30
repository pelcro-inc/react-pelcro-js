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
    <div className="pelcro-modal-overlay">
      <div
        className={`pelcro-modal ${className}`}
        role="dialog"
        aria-modal="true"
        id={id}
        {...otherProps}
      >
        <div className="pelcro-modal-content">
          <div className="pelcro-modal-header">
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
          </div>
          {children.find(({ type }) => type === ModalBody)}
          {children.find(({ type }) => type === ModalFooter)}
        </div>
      </div>
    </div>
  );
}

export const ModalBody = ({ children }) => {
  return <div className="pelcro-modal-body">{children}</div>;
};

export const ModalFooter = ({ children }) => {
  return <div className="pelcro-modal-footer">{children}</div>;
};
