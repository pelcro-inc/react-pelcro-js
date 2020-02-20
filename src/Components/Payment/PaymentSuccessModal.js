// Success view.
// The modal vindow wich is shown if the subscription was successful.

import React, { Component } from "react";
import PropTypes from "prop-types";
import Header from "../common/Header";
import Authorship from "../common/Authorship";
import { PaymentSuccessView } from "./PaymentSuccessView";

export class PaymentSuccessModal extends Component {
  constructor(props) {
    super(props);
    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();
  }

  componentDidMount = () => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "success"
    });

    this.props.ReactGA.event({
      category: "VIEWS",
      action: "Success Modal Viewed",
      nonInteraction: true
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
                closeButton={this.closeButton}
                resetView={this.props.resetView}
                site={this.site}
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
