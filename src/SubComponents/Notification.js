import React from "react";
import {
  default as toast,
  ToastBar,
  Toaster,
  resolveValue
} from "react-hot-toast";
import { ReactComponent as CheckIcon } from "../assets/check-solid.svg";
import { ReactComponent as XIcon } from "../assets/x-icon.svg";
import { ReactComponent as SolidXIcon } from "../assets/x-icon-solid.svg";
import { ReactComponent as SolidExclamationIcon } from "../assets/exclamation.svg";
import { ReactComponent as SpinnerIcon } from "../assets/spinner.svg";
import { Button } from "./Button";
import i18n from "../i18n";

export const Notification = ({ children, ...otherProps }) => {
  return (
    <Toaster
      containerClassName="pelcro-notification-container"
      containerStyle={{ zIndex: 9999999 }}
      toastOptions={{
        success: {
          className: "pelcro-notification-success",
          icon: <CheckIcon className="plc-w-20 plc-h-8" />,
          iconTheme: {
            primary: "white",
            secondary: "green"
          }
        },
        error: {
          className: "pelcro-notification-error",
          icon: <SolidXIcon className="plc-w-20 plc-h-8" />,
          iconTheme: {
            primary: "white",
            secondary: "red"
          }
        },
        confirm: {
          className: "pelcro-notification-confirm",
          icon: (
            <SolidExclamationIcon className="plc-w-20 plc-h-8 plc-text-red-500" />
          ),
          duration: Infinity,
          hideCloseButton: true
        },
        loading: {
          className: "pelcro-notification-loading",
          icon: (
            <SpinnerIcon className="plc-w-8 plc-h-8 plc-animate-spin" />
          ),
          duration: Infinity,
          hideCloseButton: true
        }
      }}
      {...otherProps}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {!t.hideCloseButton && (
                <XIcon
                  className="plc-w-10 plc-h-5 plc-cursor-pointer"
                  onClick={() => toast.dismiss(t.id)}
                />
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

Notification.viewId = "notification";

toast.warning = (msg, options) =>
  toast(msg, {
    className: "pelcro-notification-warning",
    icon: <SolidExclamationIcon className="plc-w-24 plc-h-8" />,
    iconTheme: {
      primary: "white",
      secondary: "yellow"
    },
    ...options
  });

toast.confirm = (
  onConfirm,
  { confirmMessage, loadingMessage, successMessage, errorMessage },
  { confirmButtonLabel, closeButtonLabel, ...options } = {}
) => {
  const translations = i18n.t("notification:confirm", {
    returnObjects: true
  });

  const id = toast(
    (t) => (
      <div className="plc-space-y-4">
        <p className="plc-font-semibold">{confirmMessage}</p>
        <div className="plc-space-y-2 sm:plc-space-y-0 sm:plc-space-x-2">
          <Button
            variant="solid"
            className="plc-text-xs plc-bg-red-500 hover:plc-bg-red-600 plc-min-h-0"
            onClick={onConfirmClick}
          >
            {confirmButtonLabel ?? translations.labels.confirm}
          </Button>
          <Button
            className="plc-text-xs plc-min-h-0"
            variant="outline"
            onClick={() => toast.dismiss(t.id)}
          >
            {closeButtonLabel ?? translations.labels.close}
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
    toast.loading(loadingMessage, {
      id,
      ...options
    });
  };

  const onSuccess = (successValue) => {
    toast.success(resolveValue(successMessage, successValue), {
      id,
      ...options
    });

    setTimeout(() => {
      notify.dismiss(id);
    }, 3000);
  };

  const onFailure = (errorValue) => {
    toast.error(resolveValue(errorMessage, errorValue), {
      id,
      ...options
    });

    setTimeout(() => {
      notify.dismiss(id);
    }, 3000);
  };
};

export const notify = toast;
