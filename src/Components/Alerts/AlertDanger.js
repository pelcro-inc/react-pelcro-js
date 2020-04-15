import React from "react";
import { hideError } from "../../utils/showing-error";

export const AlertDanger = ({
  name,
  style = { display: "none" },
  className = "pelcro-prefix-error-message pelcro-prefix-alert pelcro-prefix-alert-danger",
}) => {
  const hideErr = () => {
    hideError("pelcro-error-" + name);
  };

  return (
    <div id={"pelcro-error-" + name} className={className} style={style}>
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
