import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { ReactComponent as CloseIcon } from "../assets/x-icon.svg";
import { usePelcro } from "../hooks/usePelcro";

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
  const resetView = usePelcro((state) => state.resetView);
  useEffect(() => {
    onDisplay?.();
    ReactGA?.event?.({
      category: "VIEWS",
      action: `${id
        .replace("pelcro-", "")
        .replaceAll("-", " ")} viewed`,
      nonInteraction: true
    });

    window.Pelcro.insight.track("Modal Displayed", {
      name: `${id.replace("pelcro-", "").replaceAll("-", " ")}`
    });
  }, []);

  const onClose = () => {
    props?.onClose?.();
    resetView();
  };

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
            <div className="plc-flex plc-items-center plc-justify-center plc-w-full">
              <img
                alt="business logo"
                className={`plc-max-h-14 plc-mt-2 pelcro-modal-logo ${
                  window.Pelcro?._showModalHeader ? "" : "plc-hidden"
                }`}
                src={window.Pelcro.site.read().logo?.url}
              />
            </div>
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
