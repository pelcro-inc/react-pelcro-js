import React, { Component } from "react";
import ReactGA from "react-ga";
import ReactDOM from "react-dom";

import {
  SelectModal,
  LoginModal,
  RegisterModal,
  DashboardModal,
  SubscriptionUpdateView,
  SubscriptionUpdateModal,
  SubscriptionCreateModal,
  UserUpdateView,
  SubscriptionCreateView,
  NewsLetter,
  PaymentSuccessModal,
  MeterModal,
  DashboardMenu,
  initButtons,
  authenticatedButtons,
  unauthenticatedButtons,
  UserUpdateModal,
  AddressCreateModal,
  PelcroContainer,
  AddressUpdateModal,
} from "./components";

// refactor this then integrate it with the main UI ASAP.
// import AddressEdit from "./Components/modals/address/Edit";

// to be refactored
import Gift from "./Components/modals/Gift";
import Redeem from "./Components/modals/Redeem";
// import Success from "./Components/modals/Success";
// import AddressCreate from "./Components/modals/address/Create";
import PasswordForgot from "./Components/modals/password/Forgot";
import PasswordReset from "./Components/modals/password/Reset";
import UserEdit from "./Components/modals/user/Edit";

import Shop from "./Components/shop/Shop";
import Cart from "./Components/shop/Cart";
import OrderCreate from "./Components/shop/OrderCreate";
import Confirm from "./Components/shop/Confirm";

// import { CustomUpdatePayment } from "./demos/CustomUpdatePayment";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      site: window.Pelcro.site.read(),
      isAuthenticated: window.Pelcro.user.isAuthenticated(), // controls menu button displaying
      isGift: false,
      order: null,
      showUpdateUserView: false,
      addressId: null,
    };

    this.initUI = this.initUI.bind(this);
    this.initViews = this.initViews.bind(this);
    this.setView = this.setView.bind(this);
    this.resetView = this.resetView.bind(this);
    this.displayLoginView = this.displayLoginView.bind(this);
    this.logout = this.logout.bind(this);
    this.displaySelectView = this.displaySelectView.bind(this);
    this.displayDashboardView = this.displayDashboardView.bind(this);
    this.setProductAndPlan = this.setProductAndPlan.bind(this);
    this.setGiftCode = this.setGiftCode.bind(this);
    this.setGiftRecipient = this.setGiftRecipient.bind(this);

    this.loggedIn = this.loggedIn.bind(this);

    window.Pelcro.helpers.loadSDK(
      "https://js.stripe.com/v3/",
      "pelcro-sdk-stripe-id"
    );

    initButtons(this);
  }

  removeHTMLButton = (buttonClass) => {
    const elements = document.getElementsByClassName(buttonClass);
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  };

  componentDidMount = () => {
    this.initUI();
    ReactGA.initialize(window.Pelcro.site.read().google_analytics_id);
  };

  initUI = () => {
    if (this.state.site.settings === "subscription") this.initViews();
  };

  handleShowUpdateUserViewClick = () => {
    this.setState({ showUpdateUserView: true });
  };

  initViewFromUrl = () => {
    const view = window.Pelcro.helpers.getURLParameter("view");

    if (view === "login") {
      this.displayLoginView();
      return true;
    } else if (view === "select") {
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
      this.setView("source-create");
      return true;
    } else if (view === "user-edit") {
      this.setView("user-edit");
      return true;
    } else {
      return false;
    }
  };

  // displays required view
  initViews = () => {
    setTimeout(() => {
      this.renderShop();
      this.removeHTMLButton("pelcro-register-button");

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
    }, 500);
  };

  setView = (view) => {
    console.log("App -> view", view);

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
    if (!document.body.classList.contains("pelcro-prefix-modal-open")) {
      document.body.className += " pelcro-prefix-modal-open";
    }
  };

  resetView = () => {
    this.setState({ product: null, plan: null, isGift: false });
    if (this.state.giftRecipient) this.setState({ giftRecipient: null });
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
      nonInteraction: true,
    });

    this.resetView();

    this.setView("login");
  };

  displaySelectView = () => {
    this.setState({ subscriptionIdToRenew: null });
    this.setView("select");
  };

  displayCartView = () => {
    this.setView("cart");
  };

  displayDashboardView = () => {
    if (window.Pelcro.paywall.displayCloseButton()) this.setView("dashboard");
  };

  setProductAndPlan = (product, plan, isGift) => {
    this.setState({ product, plan, isGift });
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

  loggedIn = () => {
    this.setState({ isAuthenticated: true });
    this.removeHTMLButton("pelcro-register-button");
  };

  renderShop = () => {
    const products = document.getElementById("pelcro-shop");

    if (products)
      ReactDOM.render(
        <Shop setProductsForCart={this.setProductsForCart} />,
        products
      );
  };

  setProductsForCart = (products) => {
    this.setState({ products: products });
  };

  setOrder = (items) => {
    const { order } = this.state;
    order.currency = window.Pelcro.site.read().default_currency;
    order.items = items;
    this.setState({ order: order });
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
    let product = {};
    let plan = {};
    const products = window.Pelcro.product.list();
    for (const productItem of products) {
      if (+productItem.id === +e.target.dataset.productId) {
        product = productItem;
      }
    }
    if (product) {
      for (const planItem of product.plans) {
        if (+planItem.id === +e.target.dataset.planId) {
          plan = planItem;
        }
      }
    }
    this.setState({ product, plan });
    this.setView("select");
  };

  render() {
    return (
      <PelcroContainer>
        <div id="pelcro-app">
          <div id="list">
            {this.state.isAuthenticated && (
              <DashboardMenu openDashboard={this.displayDashboardView} />
            )}

            {this.state.isAuthenticated && authenticatedButtons()}
            {!this.state.isAuthenticated && unauthenticatedButtons()}

            {/* <CustomUpdatePayment ReactGA={ReactGA} /> */}

            {this.state.view === "select" && (
              <SelectModal
                isGift={this.state.isGift}
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
                onSuccess={() => {
                  this.setView("");
                  this.loggedIn();
                }}
              />
            )}
            {this.state.view === "register" && (
              <RegisterModal
                setView={this.setView}
                onSuccess={() => {
                  this.setView("");
                  this.loggedIn();
                }}
              />
            )}
            {this.state.view === "gift" && (
              <Gift
                site={this.state.site}
                isGift={this.state.isGift}
                setGiftRecipient={this.setGiftRecipient}
                plan={this.state.plan}
                product={this.state.product}
                resetView={this.resetView}
                setView={this.setView}
                ReactGA={ReactGA}
              />
            )}
            {this.state.view === "redeem" && (
              <Redeem
                site={this.state.site}
                setGiftCode={this.setGiftCode}
                resetView={this.resetView}
                setView={this.setView}
                ReactGA={ReactGA}
              />
            )}
            {this.state.view === "payment" && (
              <SubscriptionCreateModal
                subscriptionIdToRenew={this.state.subscriptionIdToRenew}
                giftRecipient={this.state.giftRecipient}
                isGift={this.state.isGift}
                plan={this.state.plan}
                product={this.state.product}
                resetView={this.resetView}
                setView={this.setView}
                logout={this.logout}
                ReactGA={ReactGA}
              />
            )}
            {this.state.view === "success" && (
              <PaymentSuccessModal
                order={this.state.order}
                plan={this.state.plan}
                product={this.state.product}
                resetView={this.resetView}
                setView={this.setView}
                ReactGA={ReactGA}
              />
            )}
            {this.state.view === "address" && (
              <AddressCreateModal
                giftCode={this.state.giftCode}
                setView={this.setView}
                onFailure={(error) => console.log(error)}
              />
            )}
            {this.state.view === "newsletter" && (
              <NewsLetter
                plan={this.state.plan}
                product={this.state.product}
                resetView={this.resetView}
                setView={this.setView}
                ReactGA={ReactGA}
              />
            )}
            {this.state.view === "meter" && (
              <MeterModal
                plan={this.state.plan}
                product={this.state.product}
                resetView={this.resetView}
                setView={this.setView}
                ReactGA={ReactGA}
              />
            )}

            {this.state.view === "password-forgot" && (
              <PasswordForgot
                resetView={this.resetView}
                ReactGA={ReactGA}
                setView={this.setView}
              />
            )}
            {this.state.view === "password-reset" && (
              <PasswordReset
                resetView={this.resetView}
                ReactGA={ReactGA}
                setView={this.setView}
              />
            )}

            {this.state.view === "source-create" && (
              <SubscriptionUpdateModal
                resetView={this.resetView}
                setView={this.setView}
              />
            )}

            {this.state.view === "user-edit" && (
              <UserUpdateModal
                setView={this.setView}
                onSuccess={() => console.log("User Updated")}
              />
            )}

            <button onClick={this.handleShowUpdateUserViewClick}>
              Update User
            </button>

            <UserUpdateView
              setView={this.setView}
              onSuccess={() => console.log("User Updated")}
            />

            {this.state.view === "address-edit" && (
              <AddressUpdateModal
                addressId={this.state.addressId}
                setView={this.setView}
                onSuccess={() => this.setView("")}
              />
            )}

            {this.state.view === "cart" && (
              <Cart
                setOrder={this.setOrder}
                setProductsForCart={this.setProductsForCart}
                site={this.state.site}
                isGift={this.state.isGift}
                products={this.state.products}
                resetView={this.resetView}
                setView={this.setView}
                ReactGA={ReactGA}
              />
            )}
            {this.state.view === "checkout" && (
              <OrderCreate
                products={this.state.products}
                setProductsForCart={this.setProductsForCart}
                order={this.state.order}
                resetView={this.resetView}
                setView={this.setView}
                logout={this.logout}
                ReactGA={ReactGA}
              />
            )}
            {this.state.view === "confirm" && (
              <Confirm
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
              <DashboardModal
                setAddress={this.setAddress}
                setSubscriptionIdToRenew={this.setSubscriptionIdToRenew}
                resetView={this.resetView}
                logout={this.logout}
                setView={this.setView}
                setProductAndPlan={this.setProductAndPlan}
                ReactGA={ReactGA}
                getAddressId={(addressId) => {
                  this.setState({ addressId });
                  this.setView("address-edit");
                }}
              />
            )}
            {/* 
          <UpdatePaymentMethodView
            resetView={this.resetView}
            ReactGA={ReactGA}
            setView={this.setView}
          /> */}
          </div>
        </div>
      </PelcroContainer>
    );
  }
}

export default App;
