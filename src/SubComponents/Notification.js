import React from "react";
import { default as toast, Toaster } from "react-hot-toast";
import { ReactComponent as CheckIcon } from "../assets/check-solid.svg";
import { ReactComponent as XIcon } from "../assets/x-icon-solid.svg";
import { ReactComponent as SolidExclamationIcon } from "../assets/exclamation.svg";
import { ReactComponent as SpinnerIcon } from "../assets/spinner.svg";
import { Button } from "./Button";

export const Notification = ({ children, ...otherProps }) => {
  return (
    <Toaster
      containerClassName="pelcro-notification-container"
      toastOptions={{
        success: {
          className: "pelcro-notification-success",
          icon: <CheckIcon className="plc-w-24 plc-h-8" />,
          iconTheme: {
            primary: "white",
            secondary: "green"
          }
        },
        error: {
          className: "pelcro-notification-error",
          icon: <XIcon className="plc-w-20 plc-h-8" />,
          iconTheme: {
            primary: "white",
            secondary: "red"
          }
        },
        confirm: {
          className: "pelcro-notification-confirm",
          icon: (
            <SolidExclamationIcon className="plc-w-10 plc-h-10" />
          ),
          iconTheme: {
            primary: "white",
            secondary: "red"
          },
          duration: Infinity
        },
        loading: {
          className: "pelcro-notification-loading",
          icon: (
            <SpinnerIcon className="plc-w-10 plc-h-10 plc-animate-spin" />
          ),
          iconTheme: {
            primary: "white",
            secondary: "red"
          }
        }
      }}
      {...otherProps}
    >
      {children}
    </Toaster>
  );
};

Notification.viewId = "notification";

export const notify = toast;

notify.confirm = (
  onConfirm,
  { confirm, loading, success, error },
  options
) => {
  const id = notify(
    (t) => (
      <div className="plc-space-y-4">
        <p>{confirm}</p>
        <div className="plc-space-y-2 sm:plc-space-y-0 sm:plc-space-x-2">
          <Button
            variant="solid"
            className="plc-text-xs"
            onClick={onConfirmClick}
          >
            Confirm
          </Button>
          <Button
            className="plc-text-xs"
            variant="outline"
            onClick={() => notify.dismiss(t.id)}
          >
            Close
          </Button>
        </div>
      </div>
    ),
    {
      type: "confirm",
      ...options
    }
  );

  const onConfirmClick = () => {
    onLoading();
    onConfirm(onSuccess, onFailure);
  };

  const onLoading = () => {
    notify.loading(loading, {
      id,
      ...options
    });
  };

  const onSuccess = () => {
    notify.success(success, {
      id,
      ...options
    });
  };

  const onFailure = () => {
    notify.error(error, {
      id,
      ...options
    });
  };
};
