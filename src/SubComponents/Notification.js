import React from "react";
import { default as toast, ToastBar, Toaster } from "react-hot-toast";
import { ReactComponent as CheckIcon } from "../assets/check-solid.svg";
import { ReactComponent as SolidXIcon } from "../assets/x-icon-solid.svg";
import { ReactComponent as SolidExclamationIcon } from "../assets/exclamation.svg";
import { ReactComponent as XIcon } from "../assets/x-icon.svg";

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
          icon: <SolidXIcon className="plc-w-20 plc-h-8" />,
          iconTheme: {
            primary: "white",
            secondary: "red"
          }
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
              <XIcon
                className="plc-w-10 plc-h-5 plc-cursor-pointer"
                onClick={() => toast.dismiss(t.id)}
              />
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

export const notify = toast;
