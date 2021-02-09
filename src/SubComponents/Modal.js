import React from "react";
import { ReactComponent as CloseIcon } from "../assets/x-icon.svg";

export function Modal({
  id,
  className = "",
  children,
  ...otherProps
}) {
  return (
    <div className="pelcro-prefix-view">
      <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-auto bg-black pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show z-max bg-opacity-60">
        <div
          className={`container absolute top-0 flex flex-col items-center max-w-xl bg-white rounded-md md:mt-8 pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered ${className}`}
          role="dialog"
          aria-modal="true"
          id={id}
          {...otherProps}
        >
          <div className="pelcro-prefix-modal-content">
            {children.find(({ type }) => type.name === "ModalHeader")}
            {children.find(({ type }) => type.name === "ModalBody")}
            {children.find(({ type }) => type.name === "ModalFooter")}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ModalHeader = ({
  hideCloseButton = false,
  resetView,
  logo,
  name
}) => {
  return (
    <div className="flex items-center justify-center p-10 border-b-2 border-gray-300 h-1/6 pelcro-prefix-header">
      {!hideCloseButton && (
        <button
          type="button"
          className="absolute w-6 text-gray-500 top-5 right-4 hover:text-black pelcro-prefix-close"
          aria-label="close modal"
          onClick={resetView}
        >
          <CloseIcon className="fill-current" />
        </button>
      )}
      <div className="pelcro-prefix-modal-header">
        {logo && (
          <img
            alt="company logo"
            className="pelcro-prefix-site-logo"
            src={logo.url}
          />
        )}
        <h3 className="pelcro-prefix-site-name">{name}</h3>
      </div>
    </div>
  );
};

export const ModalBody = ({ children }) => {
  return (
    <div className="p-6 pelcro-prefix-modal-body">{children}</div>
  );
};

export const ModalFooter = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 border-t-2 border-gray-300 h-1/6 pelcro-prefix-modal-footer">
      {children}
    </div>
  );
};
