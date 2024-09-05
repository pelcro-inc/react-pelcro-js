import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Button } from "../../SubComponents/Button";
import ImageSelect from "../../SubComponents/ImageSelect";
import { Carousel } from "../../SubComponents/Carousel";
import { usePelcro } from "../../hooks/usePelcro";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
import {
  getEntitlementsFromElem,
  notifyBugsnag
} from "../../utils/utils";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

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
      setItem={(itemId) => set({ itemId })}
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

SelectModalWithHook.viewId = "plan-select";
class SelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {},
      plan: {},
      itemId: "",
      isGift: props.isGift,
      disabled: true,
      mode: "product",
      initialTabSlide: 0,
      scrollToTab: true,
      prodDescExpanded: false,
      productsDescriptionsExpanded: [],
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

    this.productsTabRef = React.createRef();
    this.enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;
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

      notifyBugsnag(() => {
        // eslint-disable-next-line no-undef
        Bugsnag.notify("SelectModal - No data viewed", (event) => {
          event.addMetadata("MetaData", {
            site: window.Pelcro?.site?.read(),
            user: window.Pelcro?.user?.read(),
            uiVersion: window.Pelcro?.uiSettings?.uiVersion,
            environment: window.Pelcro?.environment,
            matchingEntitlementsProps:
              this.props?.matchingEntitlements,
            productListState: this.state.productList,
            methods: {
              productsWithMatchedTaggedFirst:
                productsWithMatchedTaggedFirst(),
              pelcroSDKProductsListMethod:
                window.Pelcro.product.list(),
              pelcroSDKGetByEntitlements: this.props
                .matchingEntitlements
                ? window.Pelcro.product.getByEntitlements(
                    this.props.matchingEntitlements
                  )
                : null
            },
            userCurrency: userCurrency,
            userCountry: userCountry,
            userLanguage: userLanguage,
            siteLanguage:
              window.Pelcro?.helpers?.getHtmlLanguageAttribute(),
            products: window.Pelcro?.site?.read().products.length,
            currency_matching_filter: `${productsMatchingUserCurrency.length} Products Passed`,
            country_matching_filter: `${productsMatchingUserCountry.length} Products Passed`,
            language_matching_filter: `${
              productsMatchingUserCountry.filter(
                productMatchPageLanguage
              ).length
            } Products Passed`
          });
        });
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

  onItemChange = (e) => {
    this.setState({ itemId: e.value });
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
        <span className="plc-text-xs plc-ml-1 plc-text-gray-400">
          /{" "}
          {startingPlan.interval_count > 1
            ? `${startingPlan.interval_count} ${startingPlan.interval_translated}`
            : `${startingPlan.interval_translated}`}
        </span>
      </h5>
    );
  };

  renderOneProduct = (product, index, options) => {
    const isPlanMode = Boolean(this.state.mode === "plan");
    const productButtonLabel = this.locale("buttons.view");
    const productButtonCallback = this.selectProduct;
    const { productsDescriptionsExpanded } = this.state;
    const productObject = {
      id: product.id,
      index: index,
      expanded: false
    };
    if (!this.state.productsDescriptionsExpanded[index]) {
      productsDescriptionsExpanded.push(productObject);
    }

    const toggleProductDescriptionExpanded = () => {
      this.setState({
        productsDescriptionsExpanded:
          this.state.productsDescriptionsExpanded.map((obj) =>
            obj.index === index
              ? Object.assign(obj, { expanded: !obj.expanded })
              : obj
          )
      });
    };

    return (
      <div
        key={product.id}
        className="pelcro-product plc-w-84 plc-relative plc-overflow-hidden plc-h-full plc-min-h-card plc-flex plc-flex-col plc-items-center plc-justify-center plc-pt-5 plc-text-gray-900 plc-border plc-border-solid plc-rounded-sm plc-border-gray-200 plc-bg-white pelcro-select-product-wrapper"
      >
        {product.image && (
          <figure className="plc-w-full plc-mb-4 plc-h-28 plc-relative plc-overflow-hidden plc-flex plc-items-stretch">
            <img
              alt={`image of ${product.name}`}
              src={product.image}
              className="plc-object-contain plc-max-w-50% plc-object-center plc-mx-auto plc-max-h-full pelcro-select-product-image plc-rounded-sm"
            />
          </figure>
        )}

        <div className="plc-flex plc-flex-col plc-flex-wrap plc-w-full plc-flex-1 plc-text-center">
          <div className="plc-w-full pelcro-select-product-header">
            <h4 className="plc-font-medium plc-text-xl pelcro-select-product-title">
              {product.name}
            </h4>
            {product?.description?.length <= 105 && (
              <p className="plc-text-xs plc-mt-1 pelcro-select-product-description plc-px-8">
                {product.description}
              </p>
            )}
            {product?.description?.length > 105 && (
              <div className="plc-text-xs plc-mt-1 pelcro-select-product-description plc-px-8">
                <div
                  className={`plc-overflow-x-hidden ${
                    productsDescriptionsExpanded[index].expanded
                      ? "md:plc-whitespace-normal plc-whitespace-normal"
                      : "plc-whitespace-normal"
                  }`}
                >
                  {productsDescriptionsExpanded[index].expanded ? (
                    <span>
                      {product.description}{" "}
                      <button
                        onClick={toggleProductDescriptionExpanded}
                        className="plc-text-primary plc-underline plc-cursor-pointer plc-outline-none focus:plc-outline-none hover:plc-no-underline"
                      >
                        Read less
                      </button>
                    </span>
                  ) : (
                    <span>
                      {product.description.slice(0, 105)}
                      {" ... "}
                      <button
                        onClick={toggleProductDescriptionExpanded}
                        className="plc-text-primary plc-underline plc-cursor-pointer plc-outline-none focus:plc-outline-none hover:plc-no-underline"
                      >
                        Read more
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="plc-mt-auto plc-w-full plc-text-center">
          <div className="plc-mt-3 plc-mb-6">
            {product.plans && (
              <>
                {/* <p className="plc-mb-2 plc-text-sm plc-text-gray-600 plc-font-bold">
                  {this.locale("labels.startingAt")}
                </p> */}

                {this.countStartPrice(product.plans)}
              </>
            )}
          </div>

          {isPlanMode || (
            <Button
              onClick={productButtonCallback}
              data-key={product.id}
              id="pelcro-select-product-back-button"
              className="plc-w-full plc-capitalize plc-border-2 plc-border-primary plc-rounded-none plc-rounded-b-sm hover:plc-bg-primary-600 hover:plc-border-primary-600 plc-transition-all focus:plc-outline-none"
            >
              {productButtonLabel}
            </Button>
          )}
        </div>
      </div>
    );
  };

  renderProducts = () => {
    const isPlanMode = Boolean(this.state.mode === "plan");
    if (isPlanMode) {
      return this.renderProductTabs();
    }

    const userDidSelectProduct = Boolean(this.state.mode === "plan");
    const productsToShow = userDidSelectProduct
      ? [this.state.product]
      : this.state.productList;

    const items = productsToShow.map((product, index) =>
      this.renderOneProduct(product, index)
    );

    if (items.length > 3) {
      return (
        <Carousel slidesCount={items.length} mobileArrowDown={true}>
          {items}
        </Carousel>
      );
    } else {
      return (
        <div className="plc-flex plc-flex-col md:plc-flex-row plc-gap-4 plc-items-center sm:plc-px-8 plc-px-0">
          {items}
        </div>
      );
    }
  };

  handleScrollLeft = () => {
    this.productsTabRef.current.scrollLeft -= 100; // Adjust the scroll value as needed
  };

  handleScrollRight = () => {
    this.productsTabRef.current.scrollLeft += 100; // Adjust the scroll value as needed
  };

  toggleProdDescExpanded = () => {
    this.setState({ prodDescExpanded: !this.state.prodDescExpanded });
  };

  renderProductTabs = () => {
    const { prodDescExpanded } = this.state;
    // const productButtonCallback = (e) => {
    //   this.setState({ scrollToTab: false });
    //   this.selectProduct(e);
    // };

    const {
      name,
      //  image,
      description
    } = this.state.product;
    // const tabs = this.state.productList.map((product, index) => {
    //   if (
    //     product.id === this.state.product.id &&
    //     this.state.scrollToTab
    //   ) {
    //     this.setState((oldState) => {
    //       if (+oldState.initialTabSlide !== +index) {
    //         return { initialTabSlide: index };
    //       }
    //     });
    //   }

    //   return (
    //     <div
    //       key={product.id}
    //       className="plc-flex plc-w-full plc-justify-center plc-text-center"
    //     >
    //       <button
    //         onClick={(e) => productButtonCallback(e)}
    //         data-key={product.id}
    //         data-index={index}
    //         className={`plc-px-4 plc-py-2 focus:plc-outline-none plc-border-b-4 hover:plc-text-primary hover:plc-border-primary plc-transition-all plc-h-full plc-block plc-w-full ${
    //           product.id === this.state.product.id
    //             ? "plc-border-primary plc-text-primary"
    //             : "plc-border-transparent plc-font-normal plc-text-gray-500"
    //         }`}
    //       >
    //         {product.name}
    //       </button>
    //     </div>
    //   );
    // });

    return (
      <div className="plc-flex plc-flex-col">
        {/* <div className="productTabs plc-relative md:plc-max-w-xl md:plc-mx-auto plc-w-full">
          <Carousel
            slidesCount={tabs.length}
            initialSlide={this.state.initialTabSlide}
            dots={false}
            arrowsSize="small"
          >
            {tabs}
          </Carousel>
        </div> */}

        <div className="selectedProduct plc-flex plc-flex-col plc-max-w-3xl plc-ml-11">
          <h3 className="plc-text-2xl plc-font-extrabold plc-mb-3">
            {name}
          </h3>
          {/* {image && (
            <figure className="plc-mb-2">
              <img src={image} alt="Product Image" />
            </figure>
          )} */}
          {description && (
            <div className="plc-text-left plc-text-sm">
              <div
                className={`plc-overflow-x-hidden ${
                  prodDescExpanded
                    ? "md:plc-whitespace-normal plc-whitespace-normal"
                    : "md:plc-whitespace-nowrap plc-whitespace-normal"
                }`}
              >
                {prodDescExpanded ? (
                  <span>
                    {description}{" "}
                    <button
                      onClick={this.toggleProdDescExpanded}
                      className="plc-text-primary plc-underline plc-cursor-pointer plc-outline-none focus:plc-outline-none hover:plc-no-underline"
                    >
                      Read less
                    </button>
                  </span>
                ) : (
                  <span>
                    {description.slice(0, 50)}
                    {" ... "}
                    <button
                      onClick={this.toggleProdDescExpanded}
                      className="plc-text-primary plc-underline plc-cursor-pointer plc-outline-none focus:plc-outline-none hover:plc-no-underline"
                    >
                      Read more
                    </button>
                  </span>
                )}
              </div>
            </div>
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

    const matchingItems = productsThatMatchArticleTag.map(
      (product, index) =>
        this.renderOneProduct(product, index, { emphasize: true })
    );

    const otherItems = allProductsMinusMatched.map((product, index) =>
      this.renderOneProduct(product, index)
    );

    return (
      <div>
        <h3 className="plc-text-sm plc-font-semibold plc-mb-6">
          {this.locale("labels.restrictiveArticles.subscribeTo")}
        </h3>
        {matchingItems.length > 3 ? (
          <Carousel
            slidesCount={matchingItems.length}
            mobileArrowDown={true}
          >
            {matchingItems}
          </Carousel>
        ) : (
          <div className="plc-flex plc-flex-col md:plc-flex-row plc-gap-4 plc-items-center sm:plc-px-8 plc-px-0">
            {matchingItems}
          </div>
        )}

        {allProductsMinusMatched?.length > 0 && (
          <>
            <hr className="plc-my-4" />

            <h3 className="plc-text-sm plc-font-semibold plc-mb-6">
              {this.locale("labels.restrictiveArticles.or")}
            </h3>
            {otherItems.length > 3 ? (
              <Carousel
                slidesCount={otherItems.length}
                mobileArrowDown={true}
              >
                {otherItems}
              </Carousel>
            ) : (
              <div className="plc-flex plc-flex-col md:plc-flex-row plc-gap-4 plc-items-center sm:plc-px-8 plc-px-0">
                {otherItems}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  renderPlans = () => {
    const { disableGifting } = this.props;

    const items = this.state.planList.map((plan) => {
      // const isChecked = this.state.plan.id === plan.id ? true : false;
      let itemsArray = [];
      if (plan.entitlements && plan.entitlements?.length > 0) {
        itemsArray = plan.entitlements.map((itemSkuId) =>
          window.Pelcro.ecommerce.products.getBySkuId(
            Number(itemSkuId)
          )
        );
      }

      return (
        <div
          key={plan.id}
          className={`${
            this.state?.plan.id === plan.id
              ? "plc-border-2 plc-border-primary"
              : "plc-border plc-border-gray-300"
          } plc-h-full plc-w-84 plc-min-h-card plc-flex plc-flex-col plc-items-start plc-text-gray-900 plc-border-solid plc-rounded-sm plc-bg-white pelcro-select-plan-wrapper`}
        >
          <div
            className="plc-w-full plc-flex plc-flex-col plc-flex-1 plc-h-full plc-justify-between"
            id={`pelcro-select-plan-${plan.id}`}
          >
            <div className="plc-py-4 plc-text-center plc-flex plc-justify-center plc-items-center plc-w-full plc-border-b plc-border-gray-300">
              <h4 className="pelcro-select-plan-title plc-font-medium plc-text-xl plc-break-all">
                {plan.nickname}
              </h4>
            </div>
            <div className="plc-flex plc-flex-col plc-flex-1 plc-justify-between">
              <div className="plc-px-8 plc-py-6 plc-text-center plc-w-full">
                <p className="plc-text-xs plc-mt-1 pelcro-select-plan-description plc-text-gray-500">
                  {plan.description}
                </p>
              </div>

              {plan.entitlements && (
                <ImageSelect
                  optionsArray={itemsArray}
                  onChange={(e) => {
                    console.log(e.value);
                    this.onItemChange(e);
                  }}
                />
              )}

              <div className="plc-pt-4 plc-mb-4 plc-font-semibold pelcro-select-plan-price plc-px-4 plc-text-center plc-flex plc-items-end plc-justify-center">
                <p className="plc-font-bold plc-text-3xl">
                  {plan.amount_formatted}
                </p>
                <span className="plc-text-gray-400 plc-text-xs plc-flex plc-flex-col plc-font-normal plc-ml-1">
                  <span className="plc-uppercase">
                    {plan.currency}
                  </span>
                  {plan.auto_renew && (
                    <span>
                      / {plan.interval_count} {plan.interval}
                    </span>
                  )}
                </span>
              </div>
              <div
                className={`plc-grid plc-bg-primary ${
                  disableGifting
                    ? "plc-grid-cols-1"
                    : "plc-grid-cols-2"
                }`}
              >
                <button
                  className={`plc-flex plc-items-center plc-justify-center plc-text-center plc-py-2 plc-px-4 plc-w-full plc-border-2 plc-rounded-sm plc-border-primary focus:plc-outline-none plc-text-white plc-bg-primary hover:plc-bg-primary-600 hover:plc-border-primary-600 plc-transition-all`}
                  data-key={plan.id}
                  onClick={(e) => {
                    this.selectPlan(e, false);
                    if (
                      itemsArray.some(
                        (item) => item.id === this.state.itemId
                      )
                    ) {
                      this.props.setItem(this.state.itemId);
                    }
                  }}
                >
                  {this.locale("buttons.select")}
                </button>

                {!disableGifting && (
                  <button
                    className={`plc-flex plc-items-center plc-justify-center plc-text-center plc-py-2 plc-px-4 plc-w-full plc-border-2 plc-rounded-sm plc-border-primary focus:plc-outline-none plc-text-primary plc-bg-white hover:plc-border-primary-600 hover:plc-text-primary-600 hover:plc-shadow-sm plc-transition-all`}
                    data-key={plan.id}
                    onClick={(e) => this.selectPlan(e, true)}
                  >
                    {this.locale("buttons.gift")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });

    if (items.length > 3) {
      return (
        <Carousel slidesCount={items.length} mobileArrowDown={true}>
          {items}
        </Carousel>
      );
    } else {
      return (
        <div className="plc-flex plc-flex-col md:plc-flex-row plc-gap-4 plc-items-center sm:plc-px-8 plc-px-0">
          {items}
        </div>
      );
    }
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

  selectPlan = (e, isGift) => {
    const id = e.target.dataset.key;
    for (const plan of this.state.planList) {
      if (+plan.id === +id) {
        this.setState({ plan: plan, isGift: isGift });
        this.props.setProductAndPlan(
          this.state.product,
          plan,
          isGift
        );

        this.submitOption(this.state.product, isGift);
      }
    }
  };

  goBack = () => {
    this.setState({
      disabled: true,
      mode: "product",
      scrollToTab: true
    });
  };

  submitOption = (product, isGift) => {
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
    if (this.state.mode === "product") {
      if (this.enableReactGA4) {
        ReactGA4.event("Product Modal Viewed", {
          nonInteraction: true
        });
      } else {
        ReactGA?.event?.({
          category: "VIEWS",
          action: "Product Modal Viewed",
          nonInteraction: true
        });
      }
    } else if (this.state.mode === "plan") {
      if (this.enableReactGA4) {
        ReactGA4.event("Plan Modal Viewed", {
          nonInteraction: true
        });
      } else {
        ReactGA?.event?.({
          category: "VIEWS",
          action: "Plan Modal Viewed",
          nonInteraction: true
        });
      }
    }

    return (
      <Modal
        className="plc-max-w-full sm:plc-max-w-90% md:plc-max-w-70% plc-w-auto"
        hideCloseButton={!this.closeButton}
        id="pelcro-selection-modal"
      >
        <ModalHeader
          className="plc-pl-20"
          onCloseModal={this.props.onClose}
        >
          <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
            {this.state.mode === "plan" && (
              <button
                type="button"
                onClick={this.goBack}
                className="plc-absolute plc-w-6 plc-text-gray-500 focus:plc-text-black plc-z-max plc-top-1/2 plc-left-6 plc-transform plc--translate-y-1/2 plc-border-0 hover:plc-text-black hover:plc-shadow-none plc-bg-transparent hover:plc-bg-transparent focus:plc-bg-transparent"
              >
                <ArrowLeft />
              </button>
            )}

            <h4 className="plc-text-xl plc-font-bold">
              {(this.product && this.product.paywall.select_title) ||
                window.Pelcro.product.list()[0]?.paywall.select_title}
            </h4>
            <p className="plc-text-sm">
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
              <div className="pelcro-select-plans-wrapper plc-mt-4">
                {this.renderPlans()}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
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
