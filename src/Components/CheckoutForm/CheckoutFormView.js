import React, { Component } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from "react-stripe-elements";
import localisation from "../../utils/localisation";
import styles from "../UpdatePaymentMethod/styles.module.scss";
import { CheckoutFormContainer } from "./CheckoutFormContainer";
import { SubmitCheckoutForm } from "./SubmitCheckoutForm";

class CheckoutFormView extends Component {
  constructor(props) {
    super(props);

    this.locale = localisation("checkoutForm").getLocaleData();
  }

  state = {
    disableCouponButton: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.coupon !== this.props.coupon)
      if (
        this.props.coupon.duration === "forever" &&
        this.props.coupon.percent_off === 100
      ) {
        this.setState({ disableCouponButton: true });
        this.props.setDisableSubmitState(true);
        this.props.callback({});
      }
  }

  render() {
    const {
      enableCouponField,
      showCouponField,
      couponCode,
      onCouponCodeChange,
      onApplyCouponCode,
      disableCouponButton,
      successMessage
    } = this.props;

    return (
      <CheckoutFormContainer successMessage={successMessage}>
        <div className="pelcro-prefix-form" ref="form">
          <div className="pelcro-prefix-row">
            <div className="col-md-12">
              <label className="pelcro-prefix-label">
                {this.locale.labels.card} *
              </label>
              <CardNumberElement />
              <img
                alt="credit_cards"
                className={`${styles["pelcro-prefix-payment-icons"]} pelcro-prefix-payment-icons`}
                src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
              />
            </div>

            <div className="col-md-6">
              <label className="pelcro-prefix-label">
                {this.locale.labels.date} *
              </label>
              <CardExpiryElement />
            </div>

            <div className="col-md-6">
              <label className="pelcro-prefix-label">
                {this.locale.labels.CVC} *
              </label>
              <CardCVCElement />
            </div>

            <div className="col-md-12">
              <small className="pelcro-footnote form-text">
                * {this.locale.labels.required}
              </small>

              <div>
                <button
                  className="pelcro-prefix-link"
                  type="button"
                  onClick={showCouponField}
                  style={!enableCouponField ? { marginBottom: 10 } : {}}
                >
                  {!enableCouponField
                    ? this.locale.labels.addCode
                    : this.locale.labels.hideCode}
                </button>
                {enableCouponField && (
                  <div className="pelcro-prefix-row">
                    <div className="col-sm-12">
                      <div className="pelcro-prefix-input-wrapper">
                        <label
                          className="pelcro-prefix-label"
                          htmlFor="pelcro-input-coupon_code"
                        >
                          {this.locale.labels.code}
                        </label>
                        <input
                          value={couponCode}
                          onChange={onCouponCodeChange}
                          className="pelcro-prefix-input pelcro-prefix-form-control"
                          type="text"
                          placeholder={this.locale.labels.codePlaceholder}
                          id="pelcro-input-coupon_code"
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 apply-coupon-button">
                      <div className="pelcro-prefix-input-wrapper">
                        <button
                          className="pelcro-prefix-link"
                          type="button"
                          onClick={onApplyCouponCode}
                          disabled={
                            !couponCode ||
                            this.state.disableCouponButton ||
                            disableCouponButton
                          }
                        >
                          {this.locale.labels.applyCouponCode}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <SubmitCheckoutForm name={this.locale.labels.submit} />
            </div>
          </div>
        </div>
      </CheckoutFormContainer>
    );
  }
}

export default injectStripe(CheckoutFormView);
