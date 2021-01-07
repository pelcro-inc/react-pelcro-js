import React from "react";
import Authorship from "../common/Authorship";
import Header from "../common/Header";
import { OrderCreateView } from "./OrderCreateView";

export const OrderCreateModal = (props) => {
  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-checkout"
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
              resetView={props.resetView}
              site={window.Pelcro.site.read()}
            ></Header>

            <div className="pelcro-prefix-modal-body">
              <OrderCreateView {...props} />
            </div>
          </div>
        </div>
      </div>
      <div className="pelcro-prefix-modal-footer">
        <Authorship></Authorship>
      </div>
    </div>
  );
};
