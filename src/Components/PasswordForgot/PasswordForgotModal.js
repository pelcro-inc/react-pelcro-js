// Newsletter view.
// The emaill form. Allows users to get free articles by entering their email.

import React from "react";
import { PasswordForgotView } from "./PasswordForgotView";
import Header from "../common/Header";

export const PasswordForgotModal = props => {
  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-password-forgot"
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
              resetView={props.setView}
              site={window.Pelcro.site.read()}
            ></Header>
            <div className="pelcro-prefix-modal-body">
              <PasswordForgotView {...props} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
