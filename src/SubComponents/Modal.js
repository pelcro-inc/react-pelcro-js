import React from "react";
import { ReactComponent as CloseIcon } from "../assets/x-icon.svg";

export function Modal({
  id,
  className = "",
  children,
  ...otherProps
}) {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-auto bg-black pelcro-modal-overlay z-max bg-opacity-60">
      <div
        className={`container absolute top-0 flex flex-col items-center max-w-lg bg-white rounded-md md:mt-8 pelcro-modal ${className}`}
        role="dialog"
        aria-modal="true"
        id={id}
        {...otherProps}
      >
        <div className="w-full pelcro-modal-content">
          {children.find(({ type }) => type === ModalHeader)}
          {children.find(({ type }) => type === ModalBody)}
          {children.find(({ type }) => type === ModalFooter)}
        </div>
      </div>
    </div>
  );
}

export const ModalHeader = ({
  hideCloseButton = false,
  onClose,
  logo,
  title
}) => {
  return (
    <div className="flex items-center justify-center p-3 border-b border-gray-300 pelcro-modal-header">
      {!hideCloseButton && (
        <button
          type="button"
          className="absolute w-6 text-gray-500 top-3 right-3 hover:text-black pelcro-modal-close"
          aria-label="close modal"
          onClick={onClose}
        >
          <CloseIcon className="fill-current" />
        </button>
      )}
      <div className="flex flex-col items-center w-full p-2 sm:mt-4">
        {logo ? (
          <img
            alt="company logo"
            className="max-h-14 pelcro-modal-logo"
            src={logo.url}
          />
        ) : (
          <h3 className="pelcro-modal-header-title">{title}</h3>
        )}
      </div>
    </div>
  );
};

export const ModalBody = ({ children }) => {
  return (
    <div className="px-8 py-4 pelcro-modal-body">{children}</div>
  );
};

export const ModalFooter = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-4 text-sm border-t border-gray-300 pelcro-modal-footer">
      {children}
    </div>
  );
};
