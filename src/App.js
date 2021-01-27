import React, { Component } from "react";
import ReactGA from "react-ga";
import ReactDOM from "react-dom";

import {
  Dashboard,
  DashboardOpenButton,
  SelectModal,
  LoginModal,
  RegisterModal,
  PaymentMethodUpdateModal,
  SubscriptionCreateModal,
  SubscriptionRenewModal,
  NewsLetter,
  PaymentSuccessModal,
  MeterModal,
  initButtons,
  authenticatedButtons,
  unauthenticatedButtons,
  UserUpdateModal,
  AddressCreateModal,
  AddressUpdateModal,
  PasswordResetModal,
  PasswordForgotModal,
  CartModal,
  ShopView,
  OrderConfirmModal,
  OrderCreateModal,
  GiftCreateModal,
  GiftRedeemModal
} from "./components";

class App extends Component {
  constructor(props) {
    super(props);
    this.locale = props.t;
    this.loadPaymentSDKs();
    initButtons(this);
  }

  state = {
    site: window.Pelcro.site.read(),
    isAuthenticated: window.Pelcro.user.isAuthenticated(), // controls menu button displaying
    order: null,
    products: [],
    isRenewingGift: false,
    isGift: false,
    giftCode: ""
  };

  loadPaymentSDKs = () => {
    // Load stripe's SDK
    window.Pelcro.helpers.loadSDK(
      "https://js.stripe.com/v3/",
      "pelcro-sdk-stripe-id"
    );

    // Load PayPal SDK's
    if (
      window.Pelcro.site.read() &&
      window.Pelcro.site.read().settings
    ) {
      this.loadPaypalSDKs();
    } else {
      document.addEventListener("PelcroSiteLoaded", () => {
        this.loadPaypalSDKs();
      });
    }
  };

  loadPaypalSDKs = () => {
    const supportsPaypal = Boolean(
      window.Pelcro.site.read().braintree_tokenization
    );

    if (supportsPaypal) {
      window.Pelcro.helpers.loadSDK(
        "https://js.braintreegateway.com/web/3.69.0/js/client.min.js",
        "braintree-sdk"
      );

      window.Pelcro.helpers.loadSDK(
        "https://js.braintreegateway.com/web/3.69.0/js/paypal-checkout.min.js",
        "braintree-paypal-sdk"
      );
    }
  };

  removeHTMLButton = (buttonClass) => {
    const elements = document.getElementsByClassName(buttonClass);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };

  componentDidMount = () => {
    if (
      window.Pelcro.site.read() &&
      window.Pelcro.site.read().settings
    ) {
      this.initSite();
    } else {
      window.document.addEventListener("PelcroSiteLoaded", (e) => {
        this.initSite();
      });
    }
  };

  initSite = () => {
    this.setState({ site: window.Pelcro.site.read() }, () =>
      this.initUI()
    );

    ReactGA.initialize(window.Pelcro.site.read().google_analytics_id);
    ReactGA.plugin.require("ecommerce");
  };

  initUI = () => {
    if (this.state.site.settings === "subscription") {
      this.initViews();
    }
  };

  initViewFromUrl = () => {
    const view = window.Pelcro.helpers.getURLParameter("view");

    if (view === "login") {
      this.displayLoginView();
      return true;
    } else if (view === "select") {
      this.setProductAndPlanFromUrl();
      this.displaySelectView();
      return true;
    } else if (view === "redeem") {
      this.setView("redeem");
      return true;
    } else if (view === "password-forgot") {
      this.setView("password-forgot");
      return true;
    } else if (view === "password-forget") {
      this.setView("password-forgot");
      return true;
    } else if (view === "password-reset") {
      this.setView("password-reset");
      return true;
    } else if (view === "source-create") {
      // @FIXME - implement a redirect to login first
      this.setView("source-create");
      return true;
    } else if (view === "user-edit") {
      // @FIXME - implement a redirect to login first
      this.setView("user-edit");
      return true;
    } else if (view === "register") {
      this.displayRegisterView();
      return true;
    } else if (view === "newsletter") {
      this.setView("newsletter");
      return true;
    } else {
      return false;
    }
  };

  getProducts = (products) => this.setState({ products });

  // displays required view
  initViews = () => {
    if (
      this.initViewFromUrl() ||
      window.Pelcro.subscription.isSubscribedToSite()
    )
      return;

    if (window.Pelcro.paywall.displayMeterPaywall()) {
      this.setView("meter");
    } else if (window.Pelcro.paywall.displayNewsletterPaywall()) {
      this.setView("newsletter");
    } else if (window.Pelcro.paywall.displayPaywall()) {
      this.setView("select");
    }
  };

  setView = (view) => {
    this.setState({ view: view });

    if (view !== "meter") this.disableScroll();
  };

  enableScroll = () => {
    document.body.className = document.body.className.replace(
      "pelcro-prefix-modal-open",
      ""
    );
  };

  disableScroll = () => {
    if (
      !document.body.classList.contains("pelcro-prefix-modal-open")
    ) {
      document.body.className += " pelcro-prefix-modal-open";
    }
  };

  resetView = () => {
    this.setState({
      product: null,
      plan: null,
      isGift: false,
      isRenewingGift: false,
      giftCode: ""
    });

    if (this.state.giftRecipient)
      this.setState({ giftRecipient: null });
    this.setView(null);
    this.enableScroll();
  };

  displayLoginView = () => {
    // if user is already authenticated the Login view will not be displayed
    if (window.Pelcro.user.isAuthenticated())
      return this.displayDashboardView();

    this.setView("login");
  };

  displayRegisterView = () => {
    // if user is already authenticated the Login view will not be displayed
    if (window.Pelcro.user.isAuthenticated())
      return this.displayDashboardView();

    this.setView("register");
  };

  logout = () => {
    // if user is not authenticated function execution is terminated
    if (!window.Pelcro.user.isAuthenticated())
      return alert("You are already logged out.");

    this.setState({ isAuthenticated: false });

    window.Pelcro.user.logout();

    ReactGA.event({
      category: "ACTIONS",
      action: "Logged out",
      nonInteraction: true
    });

    this.resetView();

    this.setView("login");
  };

  displaySelectView = () => {
    this.setState({ subscriptionIdToRenew: null });
    if (!window.Pelcro.site.read().products) return;
    this.setView("select");
  };

  setProductAndPlanFromUrl = () => {
    const productsList = window.Pelcro.product.list();
    if (!productsList?.length) return;

    const [productId, planId, isGift] = [
      window.Pelcro.helpers.getURLParameter("product_id"),
      window.Pelcro.helpers.getURLParameter("plan_id"),
      window.Pelcro.helpers.getURLParameter("is_gift")
    ];

    const selectedProduct = productsList.find(
      (product) => product.id === Number(productId)
    );
    const selectedPlan = selectedProduct?.plans?.find(
      (plan) => plan.id === Number(planId)
    );

    this.setProductAndPlan(
      selectedProduct,
      selectedPlan,
      Boolean(isGift)
    );
  };

  displayCartView = () => {
    this.setView("cart");
  };

  displayDashboardView = () => {
    if (window.Pelcro.paywall.displayCloseButton())
      this.setView("dashboard");
  };

  setProductAndPlan = (product, plan, isGift) => {
    this.setState({ product, plan, isGift });
  };

  setAddress = (addressId) => {
    this.setState({ addressId });
  };

  setSubscriptionIdToRenew = (subscriptionIdToRenew) => {
    this.setState({ subscriptionIdToRenew });
  };

  setGiftRecipient = (giftRecipient) => {
    this.setState({ giftRecipient });
  };

  setGiftCode = (giftCode) => {
    this.setState({ giftCode });
  };

  setIsRenewingGift = (isRenewingGift) => {
    this.setState({ isRenewingGift });
  };

  loggedIn = () => {
    this.setState({ isAuthenticated: true });
    this.removeHTMLButton("pelcro-register-button");
  };

  renderShop = () => {
    const products = document.getElementById("pelcro-shop");

    if (products) {
      ReactDOM.render(
        <ShopView
          getProducts={this.getProducts}
          products={this.state.products}
        />,
        products
      );
    }
  };

  setProductsForCart = (products) => {
    this.setState({ products: products });
  };

  setOrder = (items) => {
    const order = this.state.order ?? {};
    order.items = items;
    this.setState({ order });
  };

  setProduct = (e) => {
    const products = window.Pelcro.product.list();
    for (const product of products) {
      if (+product.id === +e.target.dataset.productId) {
        this.setState({ product });
      }
    }
    if (e.target.dataset.isGift === "true") {
      this.setState({ isGift: true });
    }
    this.setView("select");
  };

  setGift = (e) => {
    if (e.target.dataset.isGift === "true") {
      this.setState({ isGift: true });
    }
    this.setView("select");
  };

  setProductAndPlanByButton = (e) => {
    const productsList = window.Pelcro.product.list();
    if (!productsList?.length) return;

    const [productId, planId, isGift] = [
      e.target.dataset.productId,
      e.target.dataset.planId,
      e.target.dataset.isGift
    ];

    const selectedProduct = productsList.find(
      (product) => product.id === Number(productId)
    );

    const selectedPlan = selectedProduct?.plans?.find(
      (plan) => plan.id === Number(planId)
    );

    this.setProductAndPlan(
      selectedProduct,
      selectedPlan,
      Boolean(isGift)
    );

    this.setView("select");
  };

  setOfflineProductAndPlanByButton = (e) => {
    this.setState({
      product: {
        id: e.target.dataset.productId,
        address_required: true
      },
      plan: {
        product_id: e.target.dataset.productId,
        id: e.target.dataset.planId
      }
    });
    window.Pelcro.plan.getPlan(
      {
        plan_id: e.target.dataset.planId
      },
      (error, response) => {
        if (error) {
          return;
        }
        this.setState({
          plan: response.data.plan
        });
        const addresses = window.Pelcro.address.list();
        const isAuthenticated = window.Pelcro.user.isAuthenticated();
        if (!isAuthenticated) {
          this.setView("register");
        } else if (addresses && addresses.length) {
          this.setView("payment");
        } else {
          this.setView("address");
        }
      }
    );
  };

  handleAfterRegistrationLogic = () => {
    const { product, order, giftCode, isGift, site } = this.state;

    ReactGA.event({
      category: "ACTIONS",
      action: "Registered",
      nonInteraction: true
    });

    this.loggedIn();

    // If product and plan are not selected
    if (!product && !order && !giftCode) {
      return this.resetView();
    }

    // If this is a redeem gift
    if (giftCode) {
      return this.setView("address");
    }

    // Check if the subscription is meant as a gift (if so, gather recipients info)
    if (isGift) {
      return this.setView("gift");
    }

    if (order) {
      return this.setView("address");
    }

    if (product) {
      if (product.address_required || site.taxes_enabled) {
        return this.setView("address");
      } else {
        return this.setView("payment");
      }
    }

    return this.resetView();
  };

  trackPurchaseOnGA = (res) => {
    ReactGA.set({
      currencyCode:
        window.Pelcro.user.read() &&
        window.Pelcro.user.read().currency
          ? window.Pelcro.user.read().currency
          : !!this.state.plan && this.state.plan.currency
    });

    ReactGA.plugin.execute("ecommerce", "addItem", {
      id: this.state.product.id,
      name: this.state.product.name,
      category: this.state.product.description,
      variant: this.state.plan.nickname,
      price:
        !!this.state.plan && this.state.plan.amount
          ? this.state.plan.amount / 100
          : 0,
      quantity: 1
    });

    const { subscriptions } = res.data;

    ReactGA.plugin.execute("ecommerce", "addTransaction", {
      id:
        subscriptions &&
        subscriptions[
          subscriptions.length ? subscriptions.length - 1 : 0
        ].id,
      affiliation: "Pelcro",
      revenue:
        !!this.state.plan && this.state.plan.amount
          ? this.state.plan.amount / 100
          : 0,
      coupon: this.state.couponCode
    });
    ReactGA.plugin.execute("ecommerce", "send");

    ReactGA.event({
      category: "ACTIONS",
      action: "Subscribed",
      nonInteraction: true
    });
  };

  onSubscriptionCreateSuccess = (res) => {
    try {
      this.trackPurchaseOnGA(res);
    } catch {
      console.error("Caught error on GA");
    }

    if (this.state.giftRecipient) {
      window.alert(
        `${this.locale("confirm.giftSent")} ${
          this.state.giftRecipient.email
        } ${this.locale("confirm.successfully")}`
      );
      this.resetView();
    } else {
      this.setView("success");
    }
  };

  onSubscriptionRenewSuccess = () => {
    ReactGA.event({
      category: "ACTIONS",
      action: "Renewed",
      nonInteraction: true
    });

    this.setView("success");
  };

  render() {
    return (
      <div id="pelcro-app">
        <div id="list">
          {this.state.isAuthenticated && (
            <DashboardOpenButton
              openDashboard={this.displayDashboardView}
            />
          )}

          {this.state.isAuthenticated && authenticatedButtons()}
          {!this.state.isAuthenticated && unauthenticatedButtons()}

          {this.state.view === "select" && (
            <SelectModal
              isGift={this.state.isGift}
              disableGifting={this.state.isRenewingGift}
              plan={this.state.plan}
              product={this.state.product}
              resetView={this.resetView}
              setProductAndPlan={this.setProductAndPlan}
              setView={this.setView}
              subscribe={this.subscribe}
              ReactGA={ReactGA}
            />
          )}
          {this.state.view === "login" && (
            <LoginModal
              setView={this.setView}
              resetView={this.resetView}
              onSuccess={() => {
                this.setView("");
                this.loggedIn();
              }}
            />
          )}
          {this.state.view === "register" && (
            <RegisterModal
              product={this.state.product}
              setView={this.setView}
              resetView={this.resetView}
              onDisplay={() => {
                ReactGA.event({
                  category: "VIEWS",
                  action: "Register Modal Viewed",
                  nonInteraction: true
                });
              }}
              onSuccess={this.handleAfterRegistrationLogic}
            />
          )}
          {this.state.view === "gift" && (
            <GiftCreateModal
              setView={this.setView}
              resetView={this.resetView}
              onDisplay={() => {
                ReactGA.event({
                  category: "VIEWS",
                  action: "Gift Modal Viewed",
                  nonInteraction: true
                });
              }}
              onSuccess={(giftRecipient) => {
                this.setGiftRecipient({
                  email: giftRecipient.email,
                  firstName: giftRecipient.firstName,
                  lastName: giftRecipient.lastName
                });

                if (
                  this.state.product.address_required ||
                  this.state.site.taxes_enabled
                ) {
                  this.setView("address");
                } else {
                  this.setView("payment");
                }
              }}
            />
          )}
          {this.state.view === "redeem" && (
            <GiftRedeemModal
              setView={this.setView}
              resetView={this.resetView}
              onDisplay={() => {
                ReactGA.event({
                  category: "VIEWS",
                  action: "Redeem Gift Modal Viewed",
                  nonInteraction: true
                });
              }}
              onSuccess={(giftCode) => {
                this.setGiftCode(giftCode);

                if (window.Pelcro.user.isAuthenticated()) {
                  this.setView("address");
                } else {
                  this.setView("register");
                }
              }}
            />
          )}
          {this.state.view === "payment" &&
            !this.state.subscriptionIdToRenew && (
              <SubscriptionCreateModal
                giftRecipient={this.state.giftRecipient}
                plan={this.state.plan}
                product={this.state.product}
                resetView={this.resetView}
                logout={this.logout}
                onDisplay={() => {
                  ReactGA.event({
                    category: "VIEWS",
                    action: "Payment Modal Viewed",
                    nonInteraction: true
                  });
                }}
                onSuccess={this.onSubscriptionCreateSuccess}
              />
            )}
          {this.state.view === "payment" &&
            this.state.subscriptionIdToRenew && (
              <SubscriptionRenewModal
                subscriptionIdToRenew={
                  this.state.subscriptionIdToRenew
                }
                isRenewingGift={this.state.isRenewingGift}
                plan={this.state.plan}
                product={this.state.product}
                resetView={this.resetView}
                logout={this.logout}
                onDisplay={() => {
                  ReactGA.event({
                    category: "VIEWS",
                    action: "Payment Modal Viewed",
                    nonInteraction: true
                  });
                }}
                onSuccess={this.onSubscriptionRenewSuccess}
                onGiftRenewalSuccess={() => {
                  ReactGA.event({
                    category: "ACTIONS",
                    action: "Renewed Gift",
                    nonInteraction: true
                  });

                  this.setIsRenewingGift(false);
                  this.setView("success");
                }}
              />
            )}
          {this.state.view === "success" && (
            <PaymentSuccessModal
              onDisplay={() => {
                ReactGA.event({
                  category: "VIEWS",
                  action: "Success Modal Viewed",
                  nonInteraction: true
                });
              }}
              product={this.state.product}
              resetView={this.resetView}
            />
          )}
          {this.state.view === "address" && (
            <AddressCreateModal
              giftCode={this.state.giftCode}
              resetView={this.resetView}
              onSuccess={() => {
                if (!this.state.product) {
                  this.setView("orderCreate");
                } else {
                  this.setView("payment");
                }
              }}
              onGiftRedemptionSuccess={this.resetView}
            />
          )}
          {this.state.view === "newsletter" && (
            <NewsLetter
              product={this.state.product}
              resetView={this.resetView}
              setView={this.setView}
            />
          )}
          {this.state.view === "meter" && (
            <MeterModal
              plan={this.state.plan}
              product={this.state.product}
              resetView={this.resetView}
              setView={this.setView}
            />
          )}

          {this.state.view === "password-forgot" && (
            <PasswordForgotModal
              resetView={this.resetView}
              setView={this.setView}
            />
          )}
          {this.state.view === "password-reset" && (
            <PasswordResetModal resetView={this.resetView} />
          )}

          {this.state.view === "source-create" && (
            <PaymentMethodUpdateModal
              resetView={this.resetView}
              onDisplay={() => {
                ReactGA.event({
                  category: "VIEWS",
                  action: "Payment Modal Viewed",
                  nonInteraction: true
                });
              }}
              onSuccess={() => {
                ReactGA.event({
                  category: "ACTIONS",
                  action: "Updated Payment",
                  nonInteraction: true
                });
              }}
            />
          )}

          {this.state.view === "user-edit" && (
            <UserUpdateModal resetView={this.resetView} />
          )}
          {this.state.view === "address-edit" && (
            <AddressUpdateModal
              addressId={this.state.addressId}
              resetView={this.resetView}
              onSuccess={() => null}
            />
          )}

          {this.state.view === "cart" && (
            <CartModal
              getProducts={this.getProducts}
              products={this.state.products}
              resetView={this.resetView}
              onSuccess={(items) => {
                this.setOrder(items);

                if (window.Pelcro.user.isAuthenticated()) {
                  if (
                    !window?.Pelcro?.user?.read()?.addresses?.length
                  ) {
                    return this.setView("address");
                  } else {
                    this.setView("orderCreate");
                  }
                } else {
                  this.setView("register");
                }
              }}
            />
          )}

          {this.state.view === "orderCreate" && (
            <OrderCreateModal
              order={this.state.order}
              setView={this.setView}
              resetView={this.resetView}
              onDisplay={() => {
                ReactGA.event({
                  category: "VIEWS",
                  action: "Payment Modal Viewed",
                  nonInteraction: true
                });
              }}
              onSuccess={() => {
                this.setOrder(null);
                this.setView("confirm");
              }}
            />
          )}
          {this.state.view === "confirm" && (
            <OrderConfirmModal
              products={this.state.products}
              setProductsForCart={this.setProductsForCart}
              order={this.state.order}
              plan={this.state.plan}
              product={this.state.product}
              resetView={this.resetView}
              ReactGA={ReactGA}
              setView={this.setView}
            />
          )}

          {this.state.view === "dashboard" && (
            <Dashboard
              setAddress={this.setAddress}
              setSubscriptionIdToRenew={this.setSubscriptionIdToRenew}
              setIsRenewingGift={this.setIsRenewingGift}
              resetView={this.resetView}
              logout={this.logout}
              setView={this.setView}
              setProductAndPlan={this.setProductAndPlan}
              ReactGA={ReactGA}
            />
          )}
        </div>
        {this.renderShop()}
      </div>
    );
  }
}

export default App;
