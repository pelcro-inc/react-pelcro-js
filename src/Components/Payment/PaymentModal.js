import React from "react";
import { PaymentView } from "./PaymentView";
import Header from "../common/Header";
import Authorship from "../common/Authorship";

export const PaymentModal = props => (
  <div className="pelcro-prefix-view">
    <div
      className="pelcro-prefix-modal modal pelcro-prefix-fade pelcro-prefix-show"
      id="pelcro-view-payment"
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
            resetView={this.props.resetView}
            site={this.site}
          ></Header>
          <div className="pelcro-prefix-modal-body">
            <PaymentView {...props} />
          </div>
          <div className="pelcro-prefix-modal-footer">
            <Authorship></Authorship>
          </div>
        </div>
      </div>
    </div>
  </div>
);
