import React, { Component } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from "react-stripe-elements";
import Submit from "../common/Submit";
import PropTypes from "prop-types";
import localisation from "../../utils/localisation";
import styles from "../Payment/styles.module.scss";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.locale = localisation("checkoutForm").getLocaleData();

    this.cardNumber = {};
    this.cardDate = {};
    this.cardCVC = {};
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

  submit(ev) {
    this.props.setDisableSubmitState(true);

    this.props.stripe.createToken().then(({ token, error }) => {
      if (error) {
        this.props.showError(error.message);
        this.props.setDisableSubmitState(false);
      } else if (token) {
        this.props.callback(token);
      }
    });
  }

  render() {
    const {
      enableCouponField,
      showCouponField,
      couponCode,
      onCouponCodeChange,
      onApplyCouponCode,
      disableCouponButton
    } = this.props;

    return (
      // eslint-disable-next-line react/no-string-refs
      <div className="pelcro-prefix-form" ref="form">
        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label className="pelcro-prefix-label" htmlFor="ccnumber">
              {this.locale.labels.card} *
            </label>
            <CardNumberElement
              onReady={el => {
                this.cardNumber = el;
              }}
            />
            <img
              alt="credit_cards"
              className={`${styles["pelcro-prefix-payment-icons"]} pelcro-prefix-payment-icons`}
              src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="cc-exp-month" className="pelcro-prefix-label">
              {this.locale.labels.date} *
            </label>
            <CardExpiryElement
              onReady={el => {
                this.cardDate = el;
              }}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="cc-exp-year" className="pelcro-prefix-label">
              {this.locale.labels.CVC} *
            </label>
            <CardCVCElement
              onReady={el => {
                this.cardCVC = el;
              }}
            />
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

            <Submit
              onClick={this.submit}
              text={this.locale.labels.submit}
              disabled={this.props.disableSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

CheckoutForm.propTypes = {
  disableSubmit: PropTypes.bool,
  callback: PropTypes.func,
  showError: PropTypes.func
};

export default injectStripe(CheckoutForm);
