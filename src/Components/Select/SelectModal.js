import React, { Component } from "react";
import ReactGA from "react-ga";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Link } from "../../SubComponents/Link";
import { Button } from "../../SubComponents/Button";
import { Checkbox } from "../../SubComponents/Checkbox";
import { Radio } from "../../SubComponents/Radio";
import { Carousel } from "../../SubComponents/Carousel";
import { usePelcro } from "../../hooks/usePelcro";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
import {
  getEntitlementsFromElem,
  notifyBugsnag
} from "../../utils/utils";

/**
 *
 */
export function SelectModalWithHook(props) {
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
    <SelectModalWithTrans
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

SelectModalWithHook.viewId = "plan-select";
class SelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {},
      plan: {},
      isGift: props.isGift,
      disabled: true,
      mode: "product",
      productList: props.matchingEntitlements
        ? window.Pelcro.product.getByEntitlements(
            props.matchingEntitlements
          )
        : window.Pelcro.product.list()
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

    if (
      this.state.productList.length === 0 &&
      !window.Pelcro.user.isAuthenticated()
    ) {
      this.props.setView("register");
    }

    document.addEventListener("keydown", this.handleSubmit);

    if (
      !document.querySelector("#pelcro-selection-view") ||
      !document.querySelector(".pelcro-select-product-wrapper")
    ) {
      notifyBugsnag(() => {
        Bugsnag.notify("SelectModal - No data viewed", (event) => {
          event.addMetadata("MetaData", {
            site: window.Pelcro?.site?.read(),
            user: window.Pelcro?.user?.read(),
            uiVersion: window.Pelcro?.uiSettings?.uiVersion,
            environment: window.Pelcro?.environment
          });
        });
      });
      console.log("bugsnag Triggered");
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  componentDidUpdate(prevProps, prevState) {
    //Scroll to active tab
    const activeElement = document.getElementById("activeTab");

    if (activeElement) {
      activeElement.parentNode.scrollLeft =
        activeElement.offsetLeft - 80;
    } else {
      console.log(document.getElementById("activeTab"));
    }
  }

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
    return (
      <h5 className="plc-text-3xl pelcro-select-product-cost">
        <span className="plc-font-medium">
          {startingPlan.amount_formatted}
        </span>
        <span className="plc-text-sm plc-ml-1 plc-text-gray-400">
          /{" "}
          {startingPlan.interval_count > 1
            ? `${startingPlan.interval_count} ${startingPlan.interval}s`
            : `${startingPlan.interval}`}
        </span>
      </h5>
    );
  };

  renderOneProduct = (product, index, options) => {
    const isPlanMode = Boolean(this.state.mode === "plan");
    const productButtonLabel = this.locale("buttons.select");
    const productButtonCallback = this.selectProduct;

    return (
      <div
        key={product.id}
        className={`pelcro-product plc-relative plc-overflow-hidden plc-h-full plc-flex plc-flex-col plc-items-start plc-p-4 plc-text-gray-900 plc-border-solid plc-rounded plc-border-gray-200 plc-bg-white pelcro-select-product-wrapper ${
          options?.emphasize ? "plc-border-2" : "plc-border"
        }`}
      >
        {product.image && (
          <figure className="plc-w-full plc-mb-4 plc-h-28 plc-relative plc-overflow-hidden plc-flex plc-items-stretch">
            <img
              alt={`image of ${product.name}`}
              src={product.image}
              className="plc-object-contain plc-max-w-50% plc-object-left plc-max-h-full pelcro-select-product-image"
            />
          </figure>
        )}

        <div className="plc-flex plc-flex-col plc-flex-wrap plc-w-full plc-flex-1">
          <div className="plc-w-full pelcro-select-product-header">
            <h4 className="plc-font-medium plc-text-2xl pelcro-select-product-title">
              {product.name}
            </h4>
            <p className="plc-text-sm plc-mt-1 pelcro-select-product-description">
              {product.description}
            </p>
          </div>

          <div className="plc-mt-3 plc-mb-6">
            {product.plans && (
              <>
                <p className="plc-mb-2">
                  {this.locale("labels.startingAt")}
                </p>

                {this.countStartPrice(product.plans)}
              </>
            )}
          </div>
        </div>
        {isPlanMode || (
          <div className="plc-mt-auto plc-w-full">
            <Button
              onClick={productButtonCallback}
              data-key={product.id}
              id="pelcro-select-product-back-button"
              className={`plc-w-full ${
                options?.emphasize ? "plc-bg-primary-700" : ""
              }`}
              {...(index === 0 && { autoFocus: true })}
            >
              {productButtonLabel}
            </Button>
          </div>
        )}
      </div>
    );
  };

  renderProducts = () => {
    const userDidSelectProduct = Boolean(this.state.mode === "plan");
    const productsToShow = userDidSelectProduct
      ? [this.state.product]
      : this.state.productList;

    const items = productsToShow.map((product, index) =>
      this.renderOneProduct(product, index)
    );

    return <Carousel slidesCount={items.length}>{items}</Carousel>;
  };

  renderProductTabs = () => {
    const productButtonCallback = this.selectProduct;
    const { image, description } = this.state.product;

    return (
      <div className="productTabs">
        <ul className="tabs plc-flex plc-items-center plc-text-center plc-border-b plc-border-gray-300 plc-mb-4 plc-overflow-x-auto">
          {this.state.productList.map((product, index) => (
            <li
              key={product.id}
              id={`${
                product.id === this.state.product?.id
                  ? "activeTab"
                  : ""
              }`}
              className="plc-relative plc-mx-1"
            >
              <button
                onClick={productButtonCallback}
                data-key={product.id}
                className="plc-px-4 plc-py-2 plc-bg-white plc-border plc-border-gray-200 plc-rounded plc-text-gray-600 focus:plc-outline-none plc-whitespace-nowrap"
              >
                {product.name}
              </button>
            </li>
          ))}
        </ul>

        <div className="selectedProduct plc-flex plc-flex-col plc-items-center plc-justify-center">
          {image && (
            <figure className="plc-mb-2">
              <img src={image} alt="Product Image" />
            </figure>
          )}
          {description && (
            <p className="plc-text-center">{description}</p>
          )}
        </div>
      </div>
    );
  };

  renderMatchingProductsFirst = () => {
    const isPlanMode = Boolean(this.state.mode === "plan");
    if (isPlanMode) {
      return this.renderProductTabs();
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
  };

  renderPlans = () => {
    const items = this.state.planList.map((plan) => {
      const isChecked = this.state.plan.id === plan.id ? true : false;

      return (
        <div
          key={plan.id}
          className={`${
            this.state?.plan.id === plan.id
              ? "plc-border-2 plc-border-primary-800"
              : "plc-border plc-border-gray-300"
          } plc-h-full plc-flex plc-flex-col plc-items-start plc-text-gray-900 plc-border-solid plc-rounded-md plc-bg-white pelcro-select-plan-wrapper`}
        >
          <Radio
            wrapperClassName="plc-w-full plc-flex plc-h-full"
            className="plc-hidden pelcro-select-plan-radio"
            labelClassName="plc-cursor-pointer plc-w-full plc-h-full plc-m-0 plc-flex-1 plc-flex plc-flex-col"
            id={`pelcro-select-plan-${plan.id}`}
            name="plan"
            checked={isChecked}
            data-key={plan.id}
            onChange={this.selectPlan}
          >
            <div className="plc-p-4 plc-text-center plc-flex plc-flex-col plc-justify-center plc-items-center plc-w-full plc-border-b plc-border-gray-300">
              <h4 className="pelcro-select-plan-title plc-font-medium plc-text-xl plc-break-all">
                {plan.nickname}
              </h4>
              <p className="plc-text-sm plc-mt-1 pelcro-select-plan-description">
                {plan.description}
              </p>
            </div>
            <div className="plc-pt-4 plc-mb-4 plc-font-semibold pelcro-select-plan-price plc-px-4 plc-text-center plc-flex plc-items-end plc-justify-center">
              <p className="plc-font-bold plc-text-4xl">
                {plan.amount_formatted}
              </p>
              <span className="plc-text-gray-400 plc-text-xs plc-flex plc-flex-col plc-font-normal">
                <span className="plc-uppercase">{plan.currency}</span>
                <span className="plc-capitalize">
                  / {plan.interval}
                </span>
              </span>
            </div>
            <div className="plc-mt-auto plc-px-4 plc-mb-4">
              <div
                className={`${
                  this.state?.plan.id === plan.id
                    ? "plc-bg-primary-800 plc-text-white"
                    : "plc-text-primary-800"
                } plc-flex plc-items-center plc-justify-center plc-text-center plc-py-2 plc-px-4 plc-w-full plc-border-2 plc-rounded-md plc-border-primary-800`}
              >
                {this.locale("buttons.select")}
              </div>
            </div>
          </Radio>
        </div>
      );
    });

    return <Carousel slidesCount={items.length}>{items}</Carousel>;
  };

  selectProduct = (e) => {
    const id = e.target.dataset.key;
    for (const product of this.state.productList) {
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
        className="plc-max-w-full sm:plc-max-w-90% md:plc-max-w-70%"
        hideCloseButton={!this.closeButton}
        onClose={this.props.onClose}
        id="pelcro-selection-modal"
      >
        <ModalHeader>
          <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
            {this.state.mode === "plan" && (
              <button
                type="button"
                onClick={this.goBack}
                className="plc-absolute plc-w-6 plc-text-gray-500 focus:plc-text-black plc-z-max plc-top-1/2 plc-left-5 plc-transform plc--translate-y-1/2 plc-border-0 hover:plc-text-black hover:plc-shadow-none plc-bg-transparent hover:plc-bg-transparent focus:plc-bg-transparent"
              >
                <ArrowLeft />
              </button>
            )}

            <h4 className="plc-text-2xl plc-font-semibold">
              {(this.product && this.product.paywall.select_title) ||
                window.Pelcro.product.list()[0]?.paywall.select_title}
            </h4>
            <p>
              {(this.product &&
                this.product.paywall.select_subtitle) ||
                window.Pelcro.product.list()[0]?.paywall
                  .select_subtitle}
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div id="pelcro-selection-view">
            <div className="pelcro-select-products-wrapper">
              {window.Pelcro.site.read()
                ?.restrictive_paywall_metatags_enabled
                ? this.renderMatchingProductsFirst()
                : this.renderProducts()}
            </div>

            {this.state.mode === "plan" && (
              <>
                <div className="pelcro-select-plans-wrapper plc-mt-4">
                  {this.renderPlans()}
                </div>
                {!disableGifting && (
                  <div className="plc-flex plc-justify-center plc-mt-8">
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
            <p className="plc-mb-9">
              <span className="plc-font-medium">
                {this.locale("messages.alreadyHaveAccount") + " "}
              </span>
              <Link
                id="pelcro-link-login"
                onClick={this.displayLoginView}
              >
                {this.locale("messages.loginHere")}
              </Link>
            </p>
          )}
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
