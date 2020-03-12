// Payment view.
// It is displayed after the plan is selected (after Select view) if user is authenticated.

import React, { Component } from "react";

import PropTypes from "prop-types";
import { getErrorMessages } from "../common/Helpers";

import localisation from "../../utils/localisation";
import { showError, hideError } from "../../utils/showing-error";

import Header from "../common/Header";
import Authorship from "../common/Authorship";

import { formatDiscountedPrice } from "../../utils/utils";
import { CreatePaymentView } from "./CreatePaymentView";

export class CreatePaymentModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enableCouponField: false,
      disableSubmit: false,
      couponCode: "",
      percentOff: "",
      coupon: null,
      disableCouponButton: false
    };

    this.locale = localisation("payment").getLocaleData();

    this.plan = this.props.plan;
    this.product = this.props.product;

    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();

    this.setDisableSubmitState = this.setDisableSubmitState.bind(this);
    this.showCouponField = this.showCouponField.bind(this);
    this.onCouponCodeChange = this.onCouponCodeChange.bind(this);
  }

  componentDidMount = () => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "payment"
    });

    this.props.ReactGA.event({
      category: "VIEWS",
      action: "Payment Modal Viewed",
      nonInteraction: true
    });

    if (window.Pelcro.coupon.getFromUrl()) {
      this.setState({ couponCode: window.Pelcro.coupon.getFromUrl() }, () => {
        this.showCouponField();
        this.onApplyCouponCode();
      });
    }
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-payment-create");
  };

  showCouponField = () => {
    this.setState({
      enableCouponField: !this.state.enableCouponField
    });
  };

  setDisableSubmitState = state => {
    this.setState({ disableSubmit: state });
  };

  getMonthsOptions = () => {
    let value = 0;
    const monthOptions = [];
    for (const month in this.locale.labels.months) {
      monthOptions.push(
        <option value={++value} key={"month-option-" + value}>
          {this.locale.labels.months[month]}
        </option>
      );
    }
    return monthOptions;
  };

  getYearsOptions = () => {
    const thisYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = thisYear; year <= thisYear + 12; year++) {
      yearOptions.push(
        <option value={year + ""} key={"year-option-" + year}>
          {year}
        </option>
      );
    }
    return yearOptions;
  };

  onCouponCodeChange(event) {
    this.setState({ couponCode: event.target.value });
  }

  onApplyCouponCode = () => {
    this.setState({ disableCouponButton: true });

    window.Pelcro.order.create(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: this.plan.id,
        coupon_code: this.state.couponCode
      },
      (err, res) => {
        this.setState({
          disableCouponButton: false
        });

        if (err) {
          console.log({ err });
          this.setState({ percentOff: "" });
          return this.showError(getErrorMessages(err));
        } else {
          hideError("pelcro-error-payment-create");
        }
        // @FIXME: remove manually entered $ sign
        this.setState({
          percentOff:
            "Discounted price: $" +
            formatDiscountedPrice(
              this.plan.amount,
              res.data.coupon.percent_off
            ),
          coupon: res.data.coupon
        });
      }
    );
  };

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
                closeButton={this.closeButton}
                resetView={this.props.resetView}
                site={this.site}
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
