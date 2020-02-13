// Shows and hides error messages in the modal window.

import React from "react";
import { hideError } from "../../utils/showing-error";

const ErrMessage = props => {
  const { name } = props;

  // removing error message from the modal window
  const hideErr = () => {
    hideError("pelcro-error-" + name);
  };

  return (
    <div
      id={"pelcro-error-" + name}
      className="pelcro-prefix-error-message pelcro-prefix-alert pelcro-prefix-alert-danger"
      style={{ display: "none" }}
    >
      <div className="pelcro-prefix-error-message-text">
        <span>Here is the alert text</span>
      </div>
      <button
        name="close"
        onClick={hideErr}
        className="pelcro-prefix-alert-close pelcro-prefix-close"
      >
        <span>&times;</span>
      </button>
    </div>
  );
};

export default ErrMessage;
