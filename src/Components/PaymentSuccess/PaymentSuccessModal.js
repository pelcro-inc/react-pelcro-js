// Success view.
// The modal vindow wich is shown if the subscription was successful.

import React, { Component } from "react";
import PropTypes from "prop-types";
import Header from "../common/Header";
import Authorship from "../common/Authorship";
import { PaymentSuccessView } from "./PaymentSuccessView";

export class PaymentSuccessModal extends Component {
  componentDidMount = () => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "success"
    });

    document.addEventListener("keydown", this.handleSubmit);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = e => {
    if (e.key === "Enter") this.props.resetView();
  };

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-success"
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
                resetView={this.props.resetView}
                site={window.Pelcro.site.read()}
              ></Header>
              <div className="pelcro-prefix-modal-body">
                <PaymentSuccessView
                  resetView={this.props.resetView}
                  product={this.props.product}
                />
              </div>
              <div className="pelcro-prefix-modal-footer">
                <Authorship></Authorship>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PaymentSuccessModal.propTypes = {
  product: PropTypes.object,
  resetView: PropTypes.func
};
