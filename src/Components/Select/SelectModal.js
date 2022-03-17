import React, { Component } from "react";
import ReactGA from "react-ga";
import PropTypes from "prop-types";
import Authorship from "../common/Authorship";
import { withTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Link } from "../../SubComponents/Link";
import { Button } from "../../SubComponents/Button";
import { Checkbox } from "../../SubComponents/Checkbox";
import { Radio } from "../../SubComponents/Radio";
import { usePelcro } from "../../hooks/usePelcro";

/**
 *
 */
export function SelectModalWithHook(props) {
  React.useEffect(() => {
    props.onDisplay?.();
  }, []);

  const {
    productsList,
    isGift,
    plan,
    product,
    isRenewingGift,
    switchView,
    resetView,
    view,
    set
  } = usePelcro();

  const isRenewingSub = view === "_plan-select-renew";

  return (
    <SelectModalWithTrans
      productsList={productsList}
      isGift={isGift}
      disableGifting={isRenewingGift || isRenewingSub}
      isRenewingSub={isRenewingSub}
      plan={plan}
      product={product}
      onClose={() => {
        props.onClose?.();
        resetView();
      }}
      setProductAndPlan={(product, plan, isGift) =>
        set({ product, plan, isGift })
      }
      setSubscriptionIdToRenew={(subscriptionIdToRenew) =>
        set({ subscriptionIdToRenew })
      }
      setView={switchView}
    />
  );
}

SelectModalWithHook.viewId = "plan-select";
class SelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {},
      plan: {},
      isGift: props.isGift,
      disabled: true,
      mode: "product"
    };

    this.product =
      this.props.product || window.Pelcro.paywall.getProduct();
    this.locale = this.props.t;
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

    if (this.props.productsList.length === 1) {
      this.setState({
        product: this.props.productsList[0],
        planList: this.props.productsList[0].plans,
        mode: "plan"
      });
    }

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
    const product = productsList[e.target.selectedIndex];
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

  renderOneProduct = (product, index, options) => {
    const isPlanMode = Boolean(this.state.mode === "plan");
    const productButtonLabel = isPlanMode
      ? this.locale("buttons.back")
      : this.locale("buttons.select");
    const productButtonCallback = isPlanMode
      ? this.goBack
      : this.selectProduct;

    return (
      <div
        key={product.id}
        className={`plc-flex plc-items-start plc-p-2 plc-mt-4 plc-space-x-3 plc-text-gray-900 plc-border-solid plc-rounded plc-border-primary-500 pelcro-select-product-wrapper ${
          options?.emphasize ? "plc-border-2" : "plc-border"
        }`}
      >
        {product.image && (
          <img
            alt={`image of ${product.name}`}
            src={product.image}
            className="plc-object-contain plc-w-1/4 pelcro-select-product-image"
          />
        )}

        <div
          className={`plc-flex plc-flex-wrap ${
            product.image ? "plc-w-3/4" : "plc-w-full"
          }`}
        >
          <div className="plc-w-full pelcro-select-product-header">
            <p className="plc-font-bold pelcro-select-product-title">
              {product.name}
            </p>
            <p className="plc-text-xs pelcro-select-product-description">
              {product.description}
            </p>
          </div>

          <div className="plc-flex plc-items-end plc-w-full plc-mt-3">
            {product.plans && (
              <p className="plc-w-1/2 plc-text-xs pelcro-select-product-cost">
                {this.locale("labels.startingAt")}{" "}
                {this.countStartPrice(product.plans)}
              </p>
            )}
            <Button
              onClick={productButtonCallback}
              data-key={product.id}
              id="pelcro-select-product-back-button"
              className={`plc-ml-auto plc-text-xs ${
                options?.emphasize ? "plc-bg-primary-700" : ""
              }`}
              {...(index === 0 && { autoFocus: true })}
            >
              {productButtonLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  renderProducts = () => {
    const userDidSelectProduct = Boolean(this.state.mode === "plan");
    const productsToShow = userDidSelectProduct
      ? [this.state.product]
      : this.props.productsList;

    return productsToShow.map((product, index) => {
      return this.renderOneProduct(product, index);
    });
  };

  renderMatchingProductsFirst = () => {
    const isPlanMode = Boolean(this.state.mode === "plan");
    if (isPlanMode) {
      return this.renderOneProduct(this.state.product);
    }

    const [productsThatMatchArticleTag, allProductsMinusMatched] =
      productsWithMatchedTaggedFirst(this.props.productsList);

    // Render normal products if there are no available matching products
    if (!productsThatMatchArticleTag?.length) {
      return this.renderProducts();
    }

    return (
      <div>
        <h3 className="plc-text-sm plc-font-semibold">
          {this.locale("labels.restrictiveArticles.subscribeTo")}
        </h3>
        {productsThatMatchArticleTag.map((product, index) =>
          this.renderOneProduct(product, index, { emphasize: true })
        )}

        {allProductsMinusMatched?.length > 0 && (
          <>
            <hr className="plc-my-4" />

            <h3 className="plc-text-sm plc-font-semibold">
              {this.locale("labels.restrictiveArticles.or")}
            </h3>
            {allProductsMinusMatched.map((product, index) =>
              this.renderOneProduct(product, index)
            )}
          </>
        )}
      </div>
    );

    function productsWithMatchedTaggedFirst(allProducts) {
      const productsThatMatchArticleTag =
        window.Pelcro.product.getByMatchingPageTags();

      const allProductsMinusMatched = allProducts.filter(
        (product) =>
          !productsThatMatchArticleTag.some(
            (matchedProduct) => matchedProduct.id === product.id
          )
      );

      return [productsThatMatchArticleTag, allProductsMinusMatched];
    }
  };

  renderPlans = () => {
    return this.state.planList.map((plan) => {
      const isChecked = this.state.plan.id === plan.id ? true : false;
      return (
        <div
          key={plan.id}
          className="plc-p-2 plc-mx-3 plc-mt-2 plc-text-gray-900 plc-border plc-border-gray-400 plc-border-solid plc-rounded pelcro-select-plan-wrapper"
        >
          <Radio
            className="plc-self-start pelcro-select-plan-radio"
            labelClassName="plc-cursor-pointer plc-w-full"
            id={`pelcro-select-plan-${plan.id}`}
            name="plan"
            checked={isChecked}
            data-key={plan.id}
            onChange={this.selectPlan}
          >
            <div>
              <p className="plc-font-bold pelcro-select-plan-title">
                {plan.nickname}
              </p>
              <p className="plc-text-xs pelcro-select-plan-description">
                {plan.description}
              </p>
            </div>
            <p className="plc-mt-3 plc-font-bold pelcro-select-plan-price">
              {plan.amount_formatted}
            </p>
          </Radio>
        </div>
      );
    });
  };

  selectProduct = (e) => {
    const id = e.target.dataset.key;
    for (const product of this.props.productsList) {
      if (+product.id === +id) {
        this.setState({ product: product });
        this.setState({ planList: product.plans });
        this.setState({ mode: "plan" });
        const isSelectedPlanPartOfThisProduct =
          this.state.plan?.product_id === Number(product.id);

        if (isSelectedPlanPartOfThisProduct) {
          this.setState({ disabled: false });
        }
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

    if (this.props.isRenewingSub) {
      const matchingSub = window.Pelcro.subscription
        .list()
        .find(
          (sub) =>
            sub.plan.id === this.state.plan.id &&
            sub.status === "active" &&
            sub.cancel_at_period_end === 1
        );
      this.props.setSubscriptionIdToRenew(matchingSub?.id ?? null);
    }

    const { product, isGift } = this.state;
    const { setView } = this.props;
    const isAuthenticated = window.Pelcro.user.isAuthenticated();

    const { switchToAddressView, switchToPaymentView } =
      usePelcro.getStore();

    if (!isAuthenticated) {
      return setView("register");
    }

    if (isGift) {
      return setView("gift-create");
    }

    if (product.address_required) {
      return switchToAddressView();
    }

    return switchToPaymentView();
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  render() {
    const { disableGifting } = this.props;

    if (this.state.mode === "product") {
      ReactGA?.event?.({
        category: "VIEWS",
        action: "Product Modal Viewed",
        nonInteraction: true
      });
    } else if (this.state.mode === "plan") {
      ReactGA?.event?.({
        category: "VIEWS",
        action: "Plan Modal Viewed",
        nonInteraction: true
      });
    }

    return (
      <Modal
        hideCloseButton={!this.closeButton}
        onClose={this.props.onClose}
        id="pelcro-selection-modal"
      >
        <ModalBody>
          <div id="pelcro-selection-view">
            <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
              <h4 className="plc-text-2xl plc-font-semibold">
                {(this.product &&
                  this.product.paywall.select_title) ||
                  this.props.productsList[0]?.paywall.select_title}
              </h4>
              <p>
                {(this.product &&
                  this.product.paywall.select_subtitle) ||
                  this.props.productsList[0]?.paywall.select_subtitle}
              </p>
            </div>

            <div className="pelcro-select-products-wrapper">
              {window.Pelcro.site.read()
                ?.restrictive_paywall_metatags_enabled
                ? this.renderMatchingProductsFirst()
                : this.renderProducts()}
            </div>

            {this.state.mode === "plan" && (
              <>
                <div className="plc-overflow-y-scroll plc-max-h-72 pelcro-select-plans-wrapper">
                  {this.renderPlans()}
                </div>
                {!disableGifting && (
                  <div className="plc-flex plc-justify-center plc-mt-2">
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
                  id="pelcro-submit"
                  className="plc-w-full plc-mt-2"
                >
                  {this.locale("buttons.next")}
                </Button>
              </>
            )}
          </div>
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
  onClose: PropTypes.func,
  subscribe: PropTypes.func
};

export const SelectModalWithTrans =
  withTranslation("select")(SelectModal);
