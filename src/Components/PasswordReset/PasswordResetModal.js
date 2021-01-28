import React from "react";
import { PasswordResetView } from "./PasswordResetView";
import Header from "../common/Header";

export const PasswordResetModal = (props) => {
  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-password-reset"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
          role="document"
        >
          <div className="pelcro-prefix-modal-content">
            <Header
              closeButton={true}
              resetView={props.resetView}
              site={window.Pelcro.site.read()}
            ></Header>
            <div className="pelcro-prefix-modal-body">
              <PasswordResetView {...props} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
