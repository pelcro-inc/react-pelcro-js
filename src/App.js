import React, { Component } from "react";
import ReactGA from "react-ga";
import ReactDOM from "react-dom";

import {
  SelectModal,
  LoginModal,
  RegisterModal,
  DashboardModal,
  PaymentMethodUpdateModal,
  SubscriptionCreateModal,
  UserUpdateView,
  SubscriptionRenewModal,
  NewsLetter,
  PaymentSuccessModal,
  MeterModal,
  DashboardMenu,
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
    this.state = {
      site: window.Pelcro.site.read(),
      isAuthenticated: window.Pelcro.user.isAuthenticated(), // controls menu button displaying
      isGift: false,
      order: {},
      showUpdateUserView: false,
      addressId: null,
      products: []
    };

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
    this.initViews();
    ReactGA.initialize(window.Pelcro.site.read().google_analytics_id);
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
    }, 1000);
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
    this.setState({ product: null, plan: null, isGift: false });
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
    this.setView("select");
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

  getProducts = (products) => this.setState({ products });

  setOrder = (items) => {
    const { order } = this.state;
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
      <div id="pelcro-app">
        <div id="list">
          {this.state.isAuthenticated && (
            <DashboardMenu
              openDashboard={this.displayDashboardView}
            />
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
            <GiftCreateModal
              plan={this.state.plan}
              product={this.state.product}
              setView={this.setView}
              onSuccess={(giftRecipient) => {
                this.setGiftRecipient({
                  email: giftRecipient.email,
                  firstName: giftRecipient.firstName,
                  lastName: giftRecipient.lastName
                });

                if (
                  this.state.product.address_required ||
                  this.state.site.taxes_enabled
                )
                  return this.setView("address");
                else this.setView("payment");
              }}
            />
          )}

          {this.state.view === "redeem" && (
            <GiftRedeemModal
              onSuccess={(giftCode) => {
                this.setGiftCode(giftCode);

                if (window.Pelcro.user.isAuthenticated()) {
                  this.setView("address");
                } else this.setView("register");
              }}
            />
          )}
          {this.state.view === "payment" && (
            <SubscriptionCreateModal
              giftRecipient={this.state.giftRecipient}
              plan={this.state.plan}
              product={this.state.product}
              setView={this.setView}
              logout={this.logout}
              onSuccess={() => {
                this.setView("success");
              }}
              onFailure={(error) => console.log(error)}
            />
          )}
          {this.state.view === "payment" &&
            this.state.subscriptionIdToRenew && (
              <SubscriptionRenewModal
                subscriptionIdToRenew={
                  this.state.subscriptionIdToRenew
                }
                plan={this.state.plan}
                product={this.state.product}
                setView={this.setView}
                logout={this.logout}
                onSuccess={() => console.log("Subscription renewed!")}
                onFailure={(error) => console.log(error)}
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
              onSuccess={() => {
                if (!this.state.product) {
                  this.setView("orderCreate");
                } else {
                  this.setView("payment");
                }
              }}
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
            <PasswordForgotModal setView={this.setView} />
          )}
          {this.state.view === "password-reset" && (
            <PasswordResetModal setView={this.setView} />
          )}

          {this.state.view === "source-create" && (
            <PaymentMethodUpdateModal
              setView={this.setView}
              onFailure={(error) => console.log(error)}
              onSuccess={() => this.setView("")}
            />
          )}

          {this.state.view === "user-edit" && (
            <UserUpdateModal
              setView={this.setView}
              onSuccess={() => console.log("User Updated")}
              onFailure={(error) => console.log(error)}
            />
          )}

          <button onClick={this.handleShowUpdateUserViewClick}>
            Update User
          </button>

          <UserUpdateView
            setView={this.setView}
            onSuccess={() => console.log("User Updated")}
            onFailure={(error) => console.log(error)}
          />

          {this.state.view === "address-edit" && (
            <AddressUpdateModal
              addressId={this.state.addressId}
              setView={this.setView}
              onSuccess={() => null}
              onFailure={(error) => console.log(error)}
            />
          )}

          {this.state.view === "cart" && (
            <CartModal
              getProducts={this.getProducts}
              products={this.state.products}
              setView={this.setView}
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
              onSuccess={(res) => {
                this.setView("confirm");
                console.log(res);
              }}
              onFailure={(err) => console.log(err)}
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
        </div>
        {this.renderShop()}
      </div>
    );
  }
}

export default App;
