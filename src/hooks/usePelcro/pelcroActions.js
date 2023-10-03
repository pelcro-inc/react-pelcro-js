import { initialState } from "./index";
import {
  userHasAddress,
  userHasPaymentMethod,
  userMustVerifyEmail
} from "../../utils/utils";
import { cartItemAdded } from "../../utils/events";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

export class PelcroActions {
  constructor(storeSetter, storeGetter) {
    this.set = storeSetter;
    this.get = storeGetter;
  }

  /**
   * State actions
   */

  resetState = () => {
    const { view, cartItems, ...otherStateFields } = initialState;
    this.set(otherStateFields);
  };

  /**
   * View Actions
   */

  switchView = (view) => {
    // view switching guards
    if (
      userMustVerifyEmail() &&
      !["dashboard", "meter", "login", null].includes(view)
    ) {
      return this.set({ view: "email-verify" });
    }

    if (
      ["login", "register"].includes(view) &&
      this.get().isAuthenticated()
    ) {
      return this.set({ view: "dashboard" });
    }

    if (
      ["dashboard", "password-change"].includes(view) &&
      !this.get().isAuthenticated()
    ) {
      return this.set({ view: "login" });
    }
    if (
      ["passwordless-request"].includes(view) &&
      (this.get().isAuthenticated() ||
        !window.Pelcro.site.read()?.passwordless_enabled)
    ) {
      return this.set({ view: null });
    }

    this.set({ view });
  };

  resetView = () => {
    const { switchView, resetState } = this.get();

    switchView(null);
    resetState();
  };

  switchToPaymentView = () => {
    const {
      switchView,
      resetView,
      switchToCheckoutForm,
      product,
      order,
      invoice
    } = this.get();

    if (product || order || invoice) {
      // direct user to stripe checkout form when there are no existing cards
      if (!userHasPaymentMethod()) {
        return switchToCheckoutForm();
      }

      return switchView("payment-method-select");
    }

    return resetView();
  };

  switchToCheckoutForm = () => {
    const {
      switchView,
      product,
      subscriptionIdToRenew,
      order,
      invoice
    } = this.get();

    if (product && subscriptionIdToRenew) {
      return switchView("subscription-renew");
    }

    if (product && !subscriptionIdToRenew) {
      return switchView("subscription-create");
    }

    if (order) {
      return switchView("order-create");
    }

    if (invoice) {
      return switchView("invoice-payment");
    }
  };

  switchToAddressView = () => {
    const { switchView } = this.get();

    if (userHasAddress()) {
      switchView("address-select");
    } else {
      switchView("address-create");
    }
  };

  /**
   * Subscription Actions
   */

  setProduct = (id) => {
    const product = window.Pelcro.product.getById(id);
    if (!product) return console.error("invalid product id");
    this.set({ product });
  };

  setPlan = (id) => {
    const plan = window.Pelcro.plan.getById(id);
    if (!plan) return console.error("invalid plan id");
    this.set({ plan });
  };

  setSubscriptionToCancel = (id) => {
    const subscriptions = window.Pelcro.subscription.list() ?? [];
    const subscriptionToCancel = subscriptions.filter(
      (sub) => String(sub.id) === String(id)
    )[0];
    if (!subscriptionToCancel) {
      return console.error("invalid subscription id");
    }
    this.set({ subscriptionToCancel });
  };

  setSubscriptionToSuspend = (id) => {
    const subscriptions = window.Pelcro.subscription.list() ?? [];
    const subscriptionToSuspend = subscriptions.filter(
      (sub) => String(sub.id) === String(id)
    )[0];
    if (!subscriptionToSuspend) {
      return console.error("invalid subscription id");
    }
    this.set({ subscriptionToSuspend });
  };

  setSubscriptionToManageMembers = (id) => {
    const subscriptions = window.Pelcro.subscription.list() ?? [];
    const subscriptionToManageMembers = subscriptions.filter(
      (sub) => String(sub.id) === String(id)
    )[0];
    if (!subscriptionToManageMembers) {
      return console.error("invalid subscription id");
    }
    if (subscriptionToManageMembers?.plan?.type !== "membership") {
      return console.error(
        "subscription is not from type membership"
      );
    }
    this.set({ subscriptionToManageMembers });
    return true;
  };

  setInvoice = (id) => {
    const invoices = window.Pelcro.invoice.list() ?? [];
    const invoice = invoices.find(
      (inv) => String(inv.id) === String(id)
    );

    if (!invoice) {
      console.error("invalid invoice id");
      return false;
    }

    this.set({ invoice });
    return true;
  };

  setSelectedMembership = (id) => {
    const memberships = window.Pelcro.user.read()?.memberships ?? [];
    const membership = memberships.find(
      (membership) => String(membership.id) === String(id)
    );

    if (!membership) {
      console.error("invalid membership id");
      return false;
    }

    this.set({ selectedMembership: membership });
    return true;
  };

  setCouponCode = (couponCode) => {
    if (!couponCode) return console.error("invalid coupon code");
    this.set({ couponCode });
  };

  /**
   * User Actions
   */

  logout = (displayLogin = true) => {
    const { switchView, resetView, isAuthenticated } = this.get();
    const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;
    // if user is not authenticated function execution is terminated
    if (!isAuthenticated()) {
      return console.warn("You are already logged out.");
    }

    window.Pelcro.user.logout();
    if (enableReactGA4) {
      ReactGA4.event("Logged out", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Logged out",
        nonInteraction: true
      });
    }

    resetView();
    if (displayLogin) {
      switchView("login");
    }
  };

  /**
   * E-commerce Actions
   */

  addToCart = (itemSkuId) => {
    const itemToAdd = window.Pelcro.ecommerce.products.getBySkuId(
      Number(itemSkuId)
    );

    if (!itemToAdd) {
      console.error("invalid item SKU id");
      return false;
    }

    // Dispatch PelcroElementsCartItemAdded when an item added successfully to the
    document.dispatchEvent(cartItemAdded(itemToAdd));

    const { cartItems } = this.get();

    const itemAlreadyExists = cartItems.some(
      (item) => item.id === itemToAdd.id
    );

    if (itemAlreadyExists) {
      // increase quantity of item
      const itemsWithIncreasedQuantity = cartItems.map((item) => {
        if (item.id === itemToAdd.id) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }

        return item;
      });

      this.set({ cartItems: itemsWithIncreasedQuantity });
      return true;
    }

    // add new item
    const newItemWithQuantity = { ...itemToAdd, quantity: 1 };

    this.set((prevState) => ({
      cartItems: [...prevState.cartItems, newItemWithQuantity]
    }));
    return true;
  };

  removeFromCart = (itemSkuId) => {
    const { cartItems } = this.get();

    const itemToRemoveIdx = cartItems.findIndex(
      (item) => item.id === Number(itemSkuId)
    );

    if (itemToRemoveIdx === -1) {
      console.error("invalid item SKU id");
      return false;
    }

    const itemToRemove = cartItems[itemToRemoveIdx];

    if (itemToRemove.quantity > 1) {
      // reduce quantity of item
      const newItems = cartItems.map((item, i) => {
        if (i === itemToRemoveIdx) {
          return {
            ...item,
            quantity: item.quantity - 1
          };
        }

        return item;
      });

      this.set({ cartItems: newItems });
      return true;
    }

    // remove the item
    const newItems = cartItems.filter(
      (item) => item !== itemToRemove
    );

    this.set({ cartItems: newItems });
    return true;
  };

  purchaseItem = (itemSkuId) => {
    const quickPurchaseItem =
      window.Pelcro.ecommerce.products.getBySkuId(Number(itemSkuId));

    if (!quickPurchaseItem) {
      console.error("invalid item SKU id");
      return false;
    }

    const skusMatchingUserCurrency =
      window.Pelcro.ecommerce.products.getSkus();

    const itemMatchesUserCurrency = skusMatchingUserCurrency.some(
      (sku) => sku.id === quickPurchaseItem.id
    );

    if (!itemMatchesUserCurrency) {
      const userCurrency = window.Pelcro.user.read().currency;
      console.error(
        `SKU currency (${quickPurchaseItem.currency}) doesn't match user account's currency (${userCurrency}). users can only purchase SKUs that match their account's currency`
      );
      return false;
    }

    const quickPurchaseItemWithQuantity = {
      ...quickPurchaseItem,
      quantity: 1
    };

    this.set({ order: quickPurchaseItemWithQuantity });

    const { isAuthenticated, switchView, switchToAddressView } =
      this.get();

    if (!isAuthenticated()) {
      return switchView("register");
    }
    switchToAddressView();
  };

  /**
   * Payment Methods Actions
   */

  setPaymentMethodToEdit = (id) => {
    window.Pelcro.paymentMethods.getPaymentMethod(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        payment_method_id: id
      },
      (err, res) => {
        if (err) {
          return console.error("invalid payment method id");
        }

        if (res) {
          const paymentMethodToEdit = res.data;

          this.set({ paymentMethodToEdit });
        }
      }
    );
  };

  setPaymentMethodToDelete = (id) => {
    window.Pelcro.paymentMethods.getPaymentMethod(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        payment_method_id: id
      },
      (err, res) => {
        if (err) {
          return console.error("invalid payment method id");
        }

        if (res) {
          const paymentMethodToDelete = res.data;

          this.set({ paymentMethodToDelete });
        }
      }
    );
  };
}
