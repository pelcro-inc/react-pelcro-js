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
import { getEntitlementsFromElem } from "../../utils/utils";

/**
 *
 */
export function DonationModalWithHook(props) {
  React.useEffect(() => {
    props.onDisplay?.();
  }, []);

  const {
    isGift,
    plan,
    product,
    isRenewingGift,
    switchView,
    resetView,
    view,
    set
  } = usePelcro();

  const entitlementsProtectedElements = document.querySelectorAll(
    "[data-pelcro-entitlements]"
  );

  const entitlements =
    entitlementsProtectedElements.length > 0
      ? getEntitlementsFromElem(entitlementsProtectedElements[0])
      : null;

  return (
    <DonationModalWithTrans
      isGift={isGift}
      disableGifting={isRenewingGift}
      plan={plan}
      product={product}
      onClose={() => {
        props.onClose?.();
        resetView();
      }}
      setProductAndPlan={(product, plan, isGift) =>
        set({ product, plan, isGift })
      }
      setView={switchView}
      matchingEntitlements={
        view === "_plan-select-entitlements" ? entitlements : null
      }
    />
  );
}

function productsWithMatchedTaggedFirst() {
  const allProducts = window.Pelcro.product.list() ?? [];
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

function productMatchPageLanguage(product) {
  if (!product) {
    return false;
  }

  if (product.language === null) {
    return true;
  }

  const siteLanguage =
    window.Pelcro.helpers.getHtmlLanguageAttribute();
  return product.language === siteLanguage;
}

DonationModalWithHook.viewId = "donation-select";

class DonationModal extends Component {
  constructor(props) {
    super(props);

    const productList = props.matchingEntitlements
      ? window.Pelcro.product
          .getByEntitlements(props.matchingEntitlements)
          .filter((product) => product.has_donation_plans === true)
      : window.Pelcro.product
          .list()
          .filter((product) => product.has_donation_plans === true);

    this.state = {
      product: {},
      plan: {},
      isGift: props.isGift,
      disabled: true,
      mode: "product",
      productList: productList,
      selectedDonatoinAmount: 0,
      totalDonatoinAmount: 0
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

    if (this.state.productList.length === 1) {
      this.setState({
        product: this.state.productList[0],
        planList: this.state.productList[0].plans,
        mode: "plan"
      });
    }

    // if (
    //   this.state.productList.length === 0 &&
    //   !window.Pelcro.user.isAuthenticated()
    // ) {
    //   this.props.setView("register");
    // }

    document.addEventListener("keydown", this.handleSubmit);

    if (
      !document.querySelector("#pelcro-selection-view") ||
      !document.querySelector(".pelcro-select-product-wrapper")
    ) {
      const userCurrency = window.Pelcro?.user?.read().currency;
      const userCountry = window.Pelcro?.user?.location.countryCode;
      const userLanguage = window.Pelcro?.user?.read().language;

      const productsMatchingUserCurrency = window.Pelcro?.site
        ?.read()
        .products.filter((product) => {
          const filteredPlans = product.plans.filter(
            (plan) => plan.currency === userCurrency || !userCurrency
          );
          if (filteredPlans.length) return filteredPlans;
        });

      const productsMatchingUserCountry =
        productsMatchingUserCurrency.filter((product) => {
          const filteredPlans = product.plans.filter(
            (plan) =>
              (plan.countries &&
                plan.countries?.includes(userCountry)) ||
              !plan.countries ||
              !plan.countries.length
          );
          if (filteredPlans.length) return filteredPlans;
        });
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = (e) => {
    if (e.key === "Enter" && !this.state.disabled)
      this.submitOption();
  };

  onProductChange = (e) => {
    const product =
      window.Pelcro.product.list()[e.target.selectedIndex];
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
    return `${startingPlan.amount_formatted}/${
      startingPlan.interval_count > 1
        ? `${startingPlan.interval_count} ${startingPlan.interval}s`
        : `${startingPlan.interval}`
    }`;
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
      : this.state.productList;

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
      productsWithMatchedTaggedFirst();

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
  };

  renderPlans = () => {
    return this.state.planList.map((plan) => {
      const isChecked = this.state.plan.id === plan.id ? true : false;

      let presetDonationValues = null;
      if (plan.preset_donation_values) {
        presetDonationValues = (
          <div className="plc-mt-3 plc-pt-3 plc-border-t plc-border-gray-200">
            <h5 className="plc-mb-4 plc-font-medium">
              Select amount
            </h5>
            <ul className="plc-grid plc-grid-cols-2 plc-gap-3">
              {plan.preset_donation_values.map((value) => (
                <li key={value}>
                  <button
                    className={`plc-bg-white plc-rounded-md plc-flex plc-items-center plc-justify-center plc-text-lg plc-w-full plc-min-h-20 focus:plc-outline-none ${
                      isChecked &&
                      +this.state.selectedDonatoinAmount === +value
                        ? "plc-border-primary-500 plc-text-primary-900 plc-border-2"
                        : "plc-border-gray-200 plc-text-gray-900 plc-border"
                    }`}
                    onClick={() => {
                      this.setState({
                        selectedDonatoinAmount: +value
                      });
                      this.setState({
                        totalDonatoinAmount: +value * +plan.amount
                      });
                      this.setState({ disabled: false });
                    }}
                  >
                    {value}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      }
      return (
        <div
          key={plan.id}
          className={`plc-p-2 plc-mx-3 plc-mt-2 plc-text-gray-900 plc-border-solid plc-rounded pelcro-select-plan-wrapper ${
            isChecked
              ? "plc-border-primary-500 plc-border-2"
              : "plc-border-gray-400 plc-border "
          }`}
        >
          <Radio
            className="plc-self-start pelcro-select-plan-radio plc-hidden"
            labelClassName="plc-cursor-pointer plc-w-full plc-ml-0"
            id={`pelcro-select-plan-${plan.id}`}
            name="plan"
            checked={isChecked}
            data-key={plan.id}
            onChange={this.selectPlan}
          >
            <div className="plc-flex plc-items-center">
              <div>
                <p className="plc-font-bold pelcro-select-plan-title">
                  {plan.nickname}
                </p>
                <p className="plc-text-xs pelcro-select-plan-description">
                  {plan.description}
                </p>
              </div>
              <p className="plc-font-bold pelcro-select-plan-price plc-flex-shrink-0 plc-ml-auto plc-pl-3">
                {plan.amount_formatted}
              </p>
            </div>
          </Radio>
          {isChecked && presetDonationValues}
        </div>
      );
    });
  };

  selectProduct = (e) => {
    const id = e.target.dataset.key;
    for (const product of this.state.productList) {
      if (+product.id === +id) {
        this.setState({ product: product });
        this.setState({
          planList: product.plans.filter(
            (plan) => plan.type === "donation"
          )
        });
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
    this.setState({
      selectedDonatoinAmount: 0
    });
    this.setState({
      totalDonatoinAmount: 0
    });
    this.setState({ disabled: true });

    const id = e.target.dataset.key;
    for (const plan of this.state.planList) {
      if (+plan.id === +id) {
        plan.isCheked = true;
        this.setState({ plan: plan });
        // this.setState({ disabled: false });
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

    const { product, isGift } = this.state;
    const { setView } = this.props;
    const isAuthenticated = window.Pelcro.user.isAuthenticated();

    const { switchToAddressView, switchToPaymentView } =
      usePelcro.getStore();

    // if (!isAuthenticated) {
    //   return setView("register");
    // }

    if (isGift) {
      return setView("gift-create");
    }

    // if (product.address_required) {
    //   return switchToAddressView();
    // }

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
                {/* {!disableGifting && ( */}
                {/*   <div className="plc-flex plc-justify-center plc-mt-2"> */}
                {/*     <Checkbox */}
                {/*       onChange={this.onIsGiftChange} */}
                {/*       checked={this.state.isGift} */}
                {/*       id="pelcro-input-is-gift" */}
                {/*     > */}
                {/*       {this.locale("messages.checkbox")} */}
                {/*     </Checkbox> */}
                {/*   </div> */}
                {/* )} */}
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

DonationModal.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  iaGift: PropTypes.bool,
  disableGifting: PropTypes.bool,
  setView: PropTypes.func,
  onClose: PropTypes.func,
  subscribe: PropTypes.func
};

export const DonationModalWithTrans =
  withTranslation("donation")(DonationModal);
