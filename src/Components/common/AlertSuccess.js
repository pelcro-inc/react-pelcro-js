// Shows and hides error messages in the modal window.

import React from "react";
import { hideSuccess } from "../../utils/showing-error";

const AlertSuccess = props => {
  const { name } = props;

  // removing error message from the modal window
  const hide = () => {
    hideSuccess("pelcro-success-" + name);
  };

  return (
    <div
      id={"pelcro-success-" + name}
      className="pelcro-prefix-success-message pelcro-prefix-alert pelcro-prefix-alert-success"
      style={{ display: "none" }}
    >
      <div className="pelcro-prefix-error-message-text">
        <span>Here is the alert text</span>
      </div>
      <button
        name="close"
        onClick={hide}
        className="pelcro-prefix-alert-close pelcro-prefix-close"
      >
        <span>&times;</span>
      </button>
    </div>
  );
};

export default AlertSuccess;
