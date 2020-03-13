import React, { Component } from "react";

import Header from "../common/Header";
import Authorship from "../common/Authorship";

import { CreatePaymentView } from "./CreatePaymentView";

export class CreatePaymentModal extends Component {
  // showCouponField = () => {
  //   this.setState({
  //     enableCouponField: !this.state.enableCouponField
  //   });
  // };

  // onCouponCodeChange(event) {
  //   this.setState({ couponCode: event.target.value });
  // }

  render() {
    return (
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
                closeButton={window.Pelcro.paywall.displayCloseButton()}
                resetView={this.props.resetView}
                site={window.Pelcro.site.read()}
              ></Header>

              <div className="pelcro-prefix-modal-body">
                <CreatePaymentView />
              </div>
              <div className="pelcro-prefix-modal-footer">
                <small>
                  {this.locale.messages.haveQuestion}{" "}
                  {this.locale.messages.visitOurFaq.visitOur}{" "}
                  <a
                    className="pelcro-prefix-link"
                    target="new"
                    href="https://www.pelcro.com/faq/user"
                  >
                    {this.locale.messages.visitOurFaq.faq}
                  </a>
                  . {this.locale.messages.cancel}
                  {" " + this.locale.messages.logout.logout}{" "}
                  <button
                    className="pelcro-prefix-link"
                    onClick={this.props.logout}
                  >
                    {this.locale.messages.logout.here}
                  </button>
                </small>
                <Authorship></Authorship>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
