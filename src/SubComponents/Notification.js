import React from "react";
import { default as toast, Toaster } from "react-hot-toast";
import { ReactComponent as CheckIcon } from "../assets/check-solid.svg";
import { ReactComponent as XIcon } from "../assets/x-icon-solid.svg";

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
