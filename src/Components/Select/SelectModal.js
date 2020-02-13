// Select view.
// Here user selet the plap to subscribe. This view is displayed after clicking on 'Subscribe' button.

import React, { Component } from "react";
import ErrMessage from "../common/ErrMessage";
import PropTypes from "prop-types";

import localisation from "../../utils/localisation";
import { showError, hideError } from "../../utils/showing-error";

import Header from "../common/Header";
import Authorship from "../common/Authorship";
import Submit from "../common/Submit";

export class SelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // product: props.product ? props.product : window.Pelcro.site.read().products[0],
      // plan: props.plan ? props.plan : window.Pelcro.site.read().products[0].plans[0],
      // isGift: props.isGift,

      product: {},
      plan: {},
      isGift: props.isGift,
      disabled: true,
      mode: "product",
      productList: window.Pelcro.product.list().reverse(),
      isMonthly: false,
      isAnnual: false,
      customAmount: null,
      isCustom: false,
      isDonor: false
    };

    this.locale = localisation("select").getLocaleData();
    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();
    this.product = this.props.product || window.Pelcro.paywall.getProduct();
  }

  componentDidMount = () => {
    if (this.props.product) {
      const { product } = this.props;
      const planList = product.plans;
      this.setState({ product, planList, mode: "plan" });

      if (
        product &&
        product.plans &&
        product.plans.length === 1 &&
        !product.plans[0].amount
      ) {
        this.setState({ plan: product.plans[0] }, () => this.submitOption());
      } else if (
        product &&
        product.plans &&
        product.plans.length > 1 &&
        product.name.toLowerCase() === "donor"
      ) {
        this.setState({
          isAnnual: true,
          isMonthly: true,
          isDonor: true
        });
      } else if (product && product.plans && product.plans.length > 1) {
        this.setState({ isMonthly: true });
      }
    }
    if (this.props.plan) {
      const { plan } = this.props;
      this.setState({ plan, disabled: false });
    }
    window.Pelcro.insight.track("Modal Displayed", {
      name: "select"
    });

    document.addEventListener("keydown", this.handleSubmit);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = e => {
    if (e.key === "Enter" && !this.state.disabled) this.submitOption();
  };

  onProductChange = e => {
    const product = window.Pelcro.product.list()[e.target.selectedIndex];
    this.setState({ product: product, plan: product.plans[0] });
  };

  onPlanChange = e => {
    this.setState({
      plan: this.state.product.plans[e.target.selectedIndex]
    });
  };

  onIsGiftChange = e => {
    this.setState({ isGift: e.target.checked });
  };

  countStartPrice = arr => {
    let startingPlan = arr[0];
    // eslint-disable-next-line no-unused-vars
    for (const plan of arr) {
      if (plan.amount < startingPlan.amount) {
        startingPlan = plan;
      }
    }
    return `${startingPlan.amount_formatted}/${startingPlan.interval}`;
  };

  renderProducts = () => {
    return this.state.productList.map(product => {
      let isFree = false;
      let startPrice = 0;
      if (product.plans.length === 1 && !product.plans[0].amount) {
        isFree = true;
      } else {
        startPrice = product.plans[0].amount;
        product.plans.forEach(plan => {
          if (startPrice > plan.amount / 100) {
            startPrice = plan.amount / 100;
          }
        });
      }
      return (
        <div key={`product-${product.id}`}>
          <div className="pelcro-prefix-product-container pelcro-prefix-gradient-border row">
            {product.image && (
              <img
                alt="product"
                src={`${product.image}`}
                className="pelcro-prefix-product-img col-3"
              />
            )}

            <div className={`row ${product.image ? "col-9" : "col-12"}`}>
              <div className="pelcro-prefix-product-block col-12">
                <div className="pelcro-prefix-product-title">
                  {product.name}
                </div>
                <div className="pelcro-prefix-product-description">
                  {product.description}
                </div>
              </div>

              <div className="row col-12 pelcro-prefix-product-select">
                {isFree && (
                  <span className="col-6 pelcro-prefix-product-cost-description">
                    Free subscription
                  </span>
                )}
                <button
                  data-key={product.id}
                  onClick={this.selectProduct}
                  className="pelcro-prefix-btn pelcro-prefix-product-button col-6"
                >
                  {this.locale.buttons.select}
                </button>
              </div>
            </div>
          </div>
          <div className="pelcro-prefix-gradient-bg" />
        </div>
      );
    });
  };

  renderPlanItem = plan => {
    return (
      <div
        key={`key_${plan.id}`}
        className={`${
          plan.isCheked
            ? "pelcro-prefix-plan-container pelcro-prefix-plan-item col-auto active"
            : "pelcro-prefix-plan-container pelcro-prefix-plan-item col-auto"
        }`}
      >
        <div
          className="pelcro-prefix-plan-title"
          data-key={plan.id}
          onClick={this.selectPlan}
        >
          {plan.nickname}
        </div>
      </div>
    );
  };
  renderPlans = () => {
    return (
      this.state.planList &&
      this.state.planList.map(plan => {
        if (this.state.isMonthly && plan.interval === "month") {
          return this.renderPlanItem(plan);
        }
        if (this.state.isAnnual && plan.interval === "year") {
          return this.renderPlanItem(plan);
        }
        if (!this.state.isAnnual && !this.state.isMonthly) {
          return this.renderPlanItem(plan);
        }
      })
    );
  };

  selectProduct = async e => {
    const id = e.target.dataset.key;
    let isMonthly = false;
    // eslint-disable-next-line no-unused-vars
    for (const product of this.state.productList) {
      if (+product.id === +id) {
        if (product.plans.length > 1) {
          let montly = false;
          let annual = false;
          product.plans.forEach(plan => {
            if (plan.interval === "month") {
              montly = true;
            }
            if (plan.interval === "year") {
              annual = true;
            }
          });
          if (montly && annual) {
            isMonthly = true;
          }
        }
        this.setState({ product: product, isMonthly });
        if (product.plans.length === 1 && !product.plans[0].amount) {
          await this.setState({ plan: product.plans[0] });
          this.submitOption();
        }
        this.setState({ planList: product.plans });
        this.setState({ mode: "plan" });
        if (product.name.toLowerCase() === "donor") {
          this.setState({
            isAnnual: true,
            isMonthly: true,
            isDonor: true
          });
        }
      }
    }
  };

  selectPlan = e => {
    const id = e.target.dataset.key;
    // eslint-disable-next-line no-unused-vars
    for (const plan of this.state.planList) {
      if (+plan.id === +id) {
        plan.isCheked = true;
        this.setState({ plan: plan });
        this.setState({ disabled: false });
        if (+plan.amount === 100) {
          this.setState({ isCustom: true });
        } else {
          this.setState({ isCustom: false });
        }
      } else {
        plan.isCheked = false;
      }
    }
  };

  goBack = () => {
    this.hideError();
    this.setState({
      mode: "product",
      isAnnual: false,
      isMonthly: false,
      disabled: true,
      isDonor: false
    });
  };

  submitOption = () => {
    if (this.state.product && this.state.plan) {
      this.props.setProductAndPlan(
        this.state.product,
        this.state.plan,
        this.state.isGift
      );
    }
    if (this.state.customAmount) {
      this.props.setQuantity(this.state.customAmount);
    }

    if (window.Pelcro.user.isAuthenticated()) {
      if (!this.state.isGift) {
        if (
          (this.state.product.address_required || this.site.taxes_enabled) &&
          !window.Pelcro.user.read().addresses
        )
          return this.props.setView("address");
        if (
          this.state.product.plans.length === 1 &&
          !this.state.product.plans[0].amount
        ) {
          this.props.setView("success");
        } else this.props.setView("payment");
      } else {
        this.props.setView("gift");
      }

      // User is not authenticated, register him first
    } else {
      this.props.setView("register");
    }
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-select");
  };

  hideError = () => {
    hideError("pelcro-error-select");
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  selectMonthly = () => {
    this.setState({ isMonthly: true, isAnnual: false });
  };

  selectAnnual = () => {
    this.setState({ isMonthly: false, isAnnual: true });
  };
  setCustomAmount = e => {
    const customAmount = e.target.value;
    const { isMonthly, isAnnual, isDonor } = this.state;
    if (isDonor && customAmount < 10) {
      this.showError("Minimum donation should be $10");
      this.setState({ disabled: true });
    } else if (isAnnual && customAmount < 50 && !isDonor) {
      this.showError("Annual recurring minimum should be $50/year");
      this.setState({ disabled: true });
    } else if (isMonthly && customAmount < 5 && !isDonor) {
      this.showError("Monthly recurring minimum should be $5/month");
      this.setState({ disabled: true });
    } else {
      this.hideError();
      this.setState({
        disabled: false,
        customAmount
      });
    }
  };

  render() {
    const { product } = this.state;
    if (this.state.mode === "product") {
      return (
        <div className="pelcro-prefix-view">
          <div
            className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
            id="pelcro-view-select"
            tabIndex="-1"
            role="dialog"
            aria-hidden="true"
          >
            <div
              className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
              role="document"
            >
              <div className="pelcro-prefix-modal-content">
                {this.site.banner_url && (
                  <img
                    alt="banner"
                    src={this.site.banner_url.url}
                    width="100% !important;"
                  />
                )}

                <Header
                  closeButton={this.closeButton}
                  resetView={this.props.resetView}
                  site={this.site}
                />

                <div className="pelcro-prefix-modal-body">
                  <div className="pelcro-prefix-title-block">
                    <h4>
                      {(this.product && this.product.paywall.select_title) ||
                        window.Pelcro.product.list()[0].paywall.select_title}
                    </h4>
                    <p>
                      {(this.product && this.product.paywall.select_subtitle) ||
                        window.Pelcro.product.list()[0].paywall.select_subtitle}
                    </p>
                  </div>

                  <ErrMessage name="select" />
                  <div className="pelcro-prefix-product-field-wrapper">
                    <div className="pelcro-prefix-product-field">
                      {this.renderProducts()}
                    </div>
                  </div>
                </div>
                <div className="pelcro-prefix-modal-footer">
                  <small>
                    <div>
                      {this.locale.messages.alreadyHaveAccount + " "}
                      <button
                        className="pelcro-prefix-link"
                        onClick={this.displayLoginView}
                      >
                        {this.locale.messages.loginHere}
                      </button>
                      .
                    </div>
                    <div>
                      Click <a href="#">here</a> to learn more.
                    </div>
                  </small>
                  <Authorship />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.mode === "plan") {
      return (
        <div className="pelcro-prefix-view">
          <div
            className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
            id="pelcro-view-select"
            tabIndex="-1"
            role="dialog"
            aria-hidden="true"
          >
            <div
              className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
              role="document"
            >
              <div className="pelcro-prefix-modal-content">
                {this.site.banner_url && (
                  <img
                    alt="banner"
                    src={this.site.banner_url.url}
                    width="100% !important;"
                  />
                )}

                <Header
                  closeButton={this.closeButton}
                  resetView={this.props.resetView}
                  site={this.site}
                />

                <div className="pelcro-prefix-modal-body">
                  <div className="pelcro-prefix-title-block">
                    <h4>
                      {(this.product && this.product.paywall.select_title) ||
                        window.Pelcro.product.list()[0].paywall.select_title}
                    </h4>
                    <p>
                      {(this.product && this.product.paywall.select_subtitle) ||
                        window.Pelcro.product.list()[0].paywall.select_subtitle}
                    </p>
                  </div>

                  <ErrMessage name="select" />

                  <div className="pelcro-prefix-product-field-wrapper">
                    <div className="pelcro-prefix-product-field">
                      <div key={`product-${product.id}`}>
                        <div className="pelcro-prefix-product-container pelcro-prefix-gradient-border row">
                          {product.image && (
                            <img
                              alt="product"
                              src={`${product.image}`}
                              className="pelcro-prefix-product-img col-3"
                            />
                          )}

                          <div
                            className={`row ${
                              product.image ? "col-9" : "col-12"
                            }`}
                          >
                            <div className="pelcro-prefix-product-block col-12">
                              <div className="pelcro-prefix-product-title">
                                {product.name}
                              </div>
                              <div className="pelcro-prefix-product-description">
                                {product.description}
                              </div>
                            </div>

                            <div className="row col-12">
                              <button
                                onClick={this.goBack}
                                className="pelcro-prefix-btn pelcro-prefix-product-button col-6"
                              >
                                {this.locale.buttons.back}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="pelcro-prefix-gradient-bg" />
                      </div>
                    </div>
                  </div>
                  {(this.state.isMonthly || this.state.isAnnual) &&
                    !this.state.isDonor && (
                      <div className="row no-gutters pelcro-prefix-interval">
                        <div className="col-md-6">
                          <button
                            className={`pelcro-prefix-btn ${
                              this.state.isMonthly ? "active" : ""
                            }`}
                            onClick={this.selectMonthly}
                          >
                            Monthly
                          </button>
                        </div>
                        <div className="col-md-6">
                          <button
                            className={`pelcro-prefix-btn ${
                              this.state.isAnnual ? "active" : ""
                            }`}
                            onClick={this.selectAnnual}
                          >
                            Annual
                          </button>
                        </div>
                      </div>
                    )}

                  <div className="pelcro-prefix-plan-field-wrapper">
                    <div className="pelcro-prefix-plan-field row">
                      {this.renderPlans()}
                    </div>
                  </div>
                  {this.state.isCustom && (
                    <div className="pelcro-prefix-amount-container row no-gutters">
                      <span
                        className="pelcro-prefix-amount-currency col-auto"
                        id="basic-addon1"
                      >
                        $
                      </span>
                      <input
                        type="text"
                        className="pelcro-prefix-amount-quantity col-10"
                        onChange={this.setCustomAmount}
                        placeholder="Enter Amount"
                      />
                    </div>
                  )}
                  {/* <div className="pelcro-prefix-center-text">
                    <label
                      className="pelcro-prefix-form-check-label control control-checkbox"
                      htmlFor="pelcro-input-is_gift"
                    >
                      {this.locale.messages.checkbox}
                      <input
                        onChange={this.onIsGiftChange}
                        checked={this.state.isGift}
                        type="checkbox"
                        id="pelcro-input-is_gift"
                      />
                      <div className="control-indicator"></div>
                    </label>
                  </div> */}

                  <Submit
                    disabled={this.state.disabled}
                    onClick={this.submitOption}
                    text={this.locale.buttons.next}
                    id="select-submit"
                  />
                </div>
                <div className="pelcro-prefix-modal-footer">
                  <small>
                    {this.locale.messages.alreadyHaveAccount + " "}
                    <button
                      className="pelcro-prefix-link"
                      onClick={this.displayLoginView}
                    >
                      {this.locale.messages.loginHere}
                    </button>
                  </small>
                  <Authorship />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
SelectModal.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  iaGift: PropTypes.bool,
  setView: PropTypes.func,
  resetView: PropTypes.func,
  subscribe: PropTypes.func
};
