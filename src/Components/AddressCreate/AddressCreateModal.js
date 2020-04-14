import React from "react";
import Header from "../common/Header";
import Authorship from "../common/Authorship";
import { AddressCreateView } from "./AddressCreateView";

export const AddressCreateModal = props => {
  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-address"
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
              closeButton={window.Pelcro.paywall.displayCloseButton()}
              resetView={() => props.setView("")}
              site={window.Pelcro.site.read()}
            ></Header>
            <div className="pelcro-prefix-modal-body">
              <AddressCreateView {...props} />
            </div>
            <div className="pelcro-prefix-modal-footer">
              <Authorship></Authorship>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
