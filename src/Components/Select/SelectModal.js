// Select view.
// Here user selet the plap to subscribe. This view is displayed after clicking on 'Subscribe' button.

import React, { Component } from "react";
import ErrMessage from "../common/ErrMessage";
import PropTypes from "prop-types";

import localisation from "../../utils/localisation";
import { showError } from "../../utils/showing-error";

import Submit from "../common/Submit";
import Header from "../common/Header";
import Authorship from "../common/Authorship";
import { SelectView } from "./SelectView";

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
      productList: window.Pelcro.product.list(),
    };

    this.product = this.props.product || window.Pelcro.paywall.getProduct();
    this.locale = localisation("select").getLocaleData();
    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();
  }

  componentDidMount = () => {
    if (this.props.product) {
      const { product } = this.props;
      const planList = product.plans;
      this.setState({ product, planList, mode: "plan" });
    }
    if (this.props.plan) {
      const { plan } = this.props;
      this.setState({ plan, disabled: false });
    }

    if (this.state.productList.length === 1) {
      this.setState({
        product: this.state.productList[0],
        planList: this.state.productList[0].plans,
        mode: "plan",
      });
    }
    window.Pelcro.insight.track("Modal Displayed", {
      name: "select",
    });

    document.addEventListener("keydown", this.handleSubmit);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = (e) => {
    if (e.key === "Enter" && !this.state.disabled) this.submitOption();
  };

  onProductChange = (e) => {
    const product = window.Pelcro.product.list()[e.target.selectedIndex];
    this.setState({ product: product, plan: product.plans[0] });
  };

  onPlanChange = (e) => {
    this.setState({
      plan: this.state.product.plans[e.target.selectedIndex],
    });
  };

  onIsGiftChange = (e) => {
    this.setState({ isGift: e.target.checked });
  };

  countStartPrice = (arr) => {
    console.log("SelectModal -> arr", arr);
    let startingPlan = arr[0];
    for (const plan of arr) {
      if (plan.amount < startingPlan.amount) {
        startingPlan = plan;
      }
    }
    return `${startingPlan.amount_formatted}/${startingPlan.interval}`;
  };

  renderProducts = () => {
    return this.state.productList.map((product) => {
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

              <div className="row col-12">
                <div className="pelcro-prefix-product-cost col-6">
                  {" "}
                  <p>
                    {this.locale.labels.startingAt}{" "}
                    {this.countStartPrice(product.plans)}
                  </p>
                </div>
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
          <div className="pelcro-prefix-gradient-bg"></div>
        </div>
      );
    });
  };

  renderPlans = () => {
    return this.state.planList.map((plan) => {
      const isChecked = this.state.plan.id === plan.id ? true : false;
      return (
        <div
          key={`key_${plan.id}`}
          className="pelcro-prefix-plan-container row"
        >
          <label
            className="col-12 pelcro-prefix-plan-block control control-radio"
            htmlFor={`id_${plan.id}`}
          >
            <input
              type="radio"
              id={`id_${plan.id}`}
              name="plan"
              className=""
              checked={isChecked}
              data-key={plan.id}
              onChange={this.selectPlan}
            ></input>
            <div className="control-indicator"></div>
            <div className="pelcro-prefix-plan-title">{plan.nickname}</div>
            <div className="row">
              <div className="col-12 pelcro-prefix-plan-description">
                {plan.description}
              </div>
              <div className="col-12 pelcro-prefix-plan-price">
                {plan.amount_formatted}
              </div>
            </div>
          </label>
        </div>
      );
    });
  };

  selectProduct = (e) => {
    const id = e.target.dataset.key;
    for (const product of this.state.productList) {
      if (+product.id === +id) {
        this.setState({ product: product });
        this.setState({ planList: product.plans });
        this.setState({ mode: "plan" });
      }
    }
  };

  selectPlan = (e) => {
    const id = e.target.dataset.key;
    for (const plan of this.state.planList) {
      if (+plan.id === +id) {
        plan.isCheked = true;
        this.setState({ plan: plan });
        this.setState({ disabled: false });
      } else {
        plan.isCheked = false;
      }
    }
  };

  goBack = () => {
    this.setState({ disabled: true });
    this.setState({ mode: "product" });
  };

  submitOption = () => {
    this.props.setProductAndPlan(
      this.state.product,
      this.state.plan,
      this.state.isGift
    );

    // Check if user is already loggen in
    if (window.Pelcro.user.isAuthenticated()) {
      if (!this.state.isGift) {
        if (
          (this.state.product.address_required || this.site.taxes_enabled) &&
          !window.Pelcro.user.read().addresses
        ) {
          return this.props.setView("address");
        } else {
          this.props.setView("payment");
        }
      } else {
        this.props.setView("gift");
      }

      // User is not authenticated, register him first
    } else {
      this.props.setView("register");
    }
  };

  // inserting error message into modal window
  showError = (message) => {
    showError(message, "pelcro-error-select");
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  render() {
    const { product } = this.state;
    if (this.state.mode === "product") {
      this.props.ReactGA.event({
        category: "VIEWS",
        action: "Product Modal Viewed",
        nonInteraction: true,
      });

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
                  ></img>
                )}

                <Header
                  closeButton={this.closeButton}
                  resetView={this.props.resetView}
                  site={this.site}
                ></Header>

                <div className="pelcro-prefix-modal-body">
                  <div className="pelcro-prefix-title-block">
                    <h4>
                      {(this.product && this.product.paywall.select_title) ||
                        (window.Pelcro.product.list()[0] &&
                          window.Pelcro.product.list()[0].paywall.select_title)}
                    </h4>
                    <p>
                      {(this.product && this.product.paywall.select_subtitle) ||
                        (window.Pelcro.product.list()[0] &&
                          window.Pelcro.product.list()[0].paywall
                            .select_subtitle)}
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
                    {this.locale.messages.alreadyHaveAccount + " "}
                    <button
                      className="pelcro-prefix-link"
                      onClick={this.displayLoginView}
                    >
                      {this.locale.messages.loginHere}
                    </button>
                  </small>
                  <Authorship></Authorship>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.mode === "plan") {
      this.props.ReactGA.event({
        category: "VIEWS",
        action: "Plan Modal Viewed",
        nonInteraction: true,
      });

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
                  ></img>
                )}

                <Header
                  closeButton={this.closeButton}
                  resetView={this.props.resetView}
                  site={this.site}
                ></Header>

                <div className="pelcro-prefix-modal-body">
                  <div className="pelcro-prefix-title-block">
                    <h4>
                      {(this.product && this.product.paywall.select_title) ||
                        (window.Pelcro.product.list()[0] &&
                          window.Pelcro.product.list()[0].paywall.select_title)}
                    </h4>
                    <p>
                      {(this.product && this.product.paywall.select_subtitle) ||
                        (window.Pelcro.product.list()[0] &&
                          window.Pelcro.product.list()[0].paywall
                            .select_subtitle)}
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
                              <div className="pelcro-prefix-product-cost col-6">
                                {" "}
                                <p>
                                  {this.locale.labels.startingAt}{" "}
                                  {this.countStartPrice(product.plans)}
                                </p>
                              </div>
                              <button
                                onClick={this.goBack}
                                className="pelcro-prefix-btn pelcro-prefix-product-button col-6"
                              >
                                {this.locale.buttons.back}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="pelcro-prefix-gradient-bg"></div>
                      </div>
                    </div>
                  </div>

                  <div className="pelcro-prefix-plan-field-wrapper">
                    <div className="pelcro-prefix-plan-field">
                      {this.renderPlans()}
                    </div>
                  </div>

                  <div className="pelcro-prefix-center-text">
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
                  </div>

                  <Submit
                    disabled={this.state.disabled}
                    onClick={this.submitOption}
                    text={this.locale.buttons.next}
                    id="select-submit"
                  ></Submit>
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
                  <Authorship></Authorship>
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
  subscribe: PropTypes.func,
};
