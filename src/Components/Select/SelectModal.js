import React, { Component } from "react";
import PropTypes from "prop-types";
import Authorship from "../common/Authorship";
import { withTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import { Link } from "../../SubComponents/Link";
import { Button } from "../../SubComponents/Button";
import { Checkbox } from "../../SubComponents/Checkbox";
import { Radio } from "../../SubComponents/Radio";

class SelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {},
      plan: {},
      isGift: props.isGift,
      disabled: true,
      mode: "product",
      productList: window.Pelcro.product.list()
    };

    this.product =
      this.props.product || window.Pelcro.paywall.getProduct();
    this.locale = this.props.t;
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
        mode: "plan"
      });
    }
    window.Pelcro.insight.track("Modal Displayed", {
      name: "select"
    });

    document.addEventListener("keydown", this.handleSubmit);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = (e) => {
    if (e.key === "Enter" && !this.state.disabled)
      this.submitOption();
  };

  onProductChange = (e) => {
    const product = window.Pelcro.product.list()[
      e.target.selectedIndex
    ];
    this.setState({ product: product, plan: product.plans[0] });
  };

  onPlanChange = (e) => {
    this.setState({
      plan: this.state.product.plans[e.target.selectedIndex]
    });
  };

  onIsGiftChange = (e) => {
    this.setState({ isGift: e.target.checked });
  };

  countStartPrice = (arr) => {
    let startingPlan = arr[0];
    for (const plan of arr) {
      if (plan.amount < startingPlan.amount) {
        startingPlan = plan;
      }
    }
    return `${startingPlan.amount_formatted}/${startingPlan.interval}`;
  };

  renderProducts = () => {
    const userDidSelectProduct = Boolean(this.state.mode === "plan");
    const productsToShow = userDidSelectProduct
      ? [this.state.product]
      : this.state.productList;
    const productButtonLabel = userDidSelectProduct
      ? this.locale("buttons.back")
      : this.locale("buttons.select");
    const productButtonCallback = userDidSelectProduct
      ? this.goBack
      : this.selectProduct;

    return productsToShow.map((product) => {
      return (
        <div
          key={product.id}
          className="p-2 mt-4 border border-gray-500 border-solid rounded pelcro-select-product-wrapper"
        >
          {product.image && (
            <img
              alt={`image of ${product.name}`}
              src={product.image}
              className="object-contain w-1/4 pelcro-select-product-image"
            />
          )}

          <div
            className={`flex flex-wrap ${
              product.image ? "w-3/4" : "w-full"
            }`}
          >
            <div className="w-full pelcro-select-product-header">
              <p className="font-bold pelcro-select-product-title">
                {product.name}
              </p>
              <p className="text-xs pelcro-select-product-description">
                {product.description}
              </p>
            </div>

            <div className="flex items-end w-full mt-3">
              {product.plans && (
                <p className="w-1/2 text-xs pelcro-select-product-cost">
                  {this.locale("labels.startingAt")}{" "}
                  {this.countStartPrice(product.plans)}
                </p>
              )}
              <Button
                onClick={productButtonCallback}
                data-key={product.id}
                id="pelcro-select-product-back-button"
                className="ml-auto text-xs"
              >
                {productButtonLabel}
              </Button>
            </div>
          </div>
        </div>
      );
    });
  };

  renderPlans = () => {
    return this.state.planList.map((plan) => {
      const isChecked = this.state.plan.id === plan.id ? true : false;
      return (
        <div
          key={plan.id}
          className="p-2 mx-3 mt-2 border border-gray-400 border-solid rounded pelcro-select-plan-wrapper"
        >
          <Radio
            inputClassName="self-start pelcro-select-plan-radio"
            labelClassName="cursor-pointer w-full"
            id={`pelcro-select-plan-${plan.id}`}
            name="plan"
            checked={isChecked}
            data-key={plan.id}
            onChange={this.selectPlan}
          >
            <div>
              <p className="font-bold pelcro-select-plan-title">
                {plan.nickname}
              </p>
              <p className="text-xs pelcro-select-plan-description">
                {plan.description}
              </p>
            </div>
            <p className="mt-3 font-bold pelcro-select-plan-price">
              {plan.amount_formatted}
            </p>
          </Radio>
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
          (this.state.product.address_required ||
            this.site.taxes_enabled) &&
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

  displayLoginView = () => {
    this.props.setView("login");
  };

  render() {
    const { disableGifting } = this.props;

    if (this.state.mode === "product") {
      this.props.ReactGA.event({
        category: "VIEWS",
        action: "Product Modal Viewed",
        nonInteraction: true
      });
    } else if (this.state.mode === "plan") {
      this.props.ReactGA.event({
        category: "VIEWS",
        action: "Plan Modal Viewed",
        nonInteraction: true
      });
    }

    return (
      <Modal id="pelcro-selection-modal">
        <ModalHeader
          hideCloseButton={!this.closeButton}
          onClose={this.props.onClose}
          logo={this.site.logo}
          title={this.site.name}
        />
        <ModalBody>
          <div id="pelcro-selection-view">
            <div className="flex flex-col items-center text-lg font-semibold text-center pelcro-title-wrapper">
              <h4>
                {(this.product &&
                  this.product.paywall.select_title) ||
                  window.Pelcro.product.list()[0]?.paywall
                    .select_title}
              </h4>
              <p>
                {(this.product &&
                  this.product.paywall.select_subtitle) ||
                  window.Pelcro.product.list()[0]?.paywall
                    .select_subtitle}
              </p>
            </div>
          </div>

          <div className="pelcro-select-products-wrapper">
            {this.renderProducts()}
          </div>

          {this.state.mode === "plan" && (
            <>
              <div className="overflow-y-scroll max-h-72 pelcro-select-plans-wrapper">
                {this.renderPlans()}
              </div>
              {!disableGifting && (
                <div className="flex justify-center mt-2">
                  <Checkbox
                    onChange={this.onIsGiftChange}
                    checked={this.state.isGift}
                    id="pelcro-input-is-gift"
                  >
                    {this.locale("messages.checkbox")}
                  </Checkbox>
                </div>
              )}
              <Button
                disabled={this.state.disabled}
                onClick={this.submitOption}
                isFullWidth={true}
                id="pelcro-submit"
                className="mt-2"
              >
                {this.locale("buttons.next")}
              </Button>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {!window.Pelcro.user.isAuthenticated() && (
            <p>
              {this.locale("messages.alreadyHaveAccount") + " "}
              <Link
                id="pelcro-link-login"
                onClick={this.displayLoginView}
              >
                {this.locale("messages.loginHere")}
              </Link>
            </p>
          )}
          <Authorship />
        </ModalFooter>
      </Modal>
    );
  }
}

SelectModal.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  iaGift: PropTypes.bool,
  disableGifting: PropTypes.bool,
  setView: PropTypes.func,
  resetView: PropTypes.func,
  subscribe: PropTypes.func
};

export const SelectModalWithTrans = withTranslation("select")(
  SelectModal
);
