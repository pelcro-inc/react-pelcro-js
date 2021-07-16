import React from "react";
import {
  default as hotToast,
  Toaster as HotToaster
} from "react-hot-toast";
import { ReactComponent as CheckIcon } from "../assets/check-solid.svg";
import { ReactComponent as XIcon } from "../assets/x-icon-solid.svg";

export const Toaster = ({ children, ...otherProps }) => {
  return (
    <HotToaster
      containerClassName="pelcro-toaster-container"
      toastOptions={{
        success: {
          className: "pelcro-toaster-success",
          icon: <CheckIcon className="plc-w-24 plc-h-8" />,
          iconTheme: {
            primary: "white",
            secondary: "green"
          }
        },
        error: {
          className: "pelcro-toaster-error",
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
    </HotToaster>
  );
};

Toaster.viewId = "toaster";

export const toast = hotToast;
