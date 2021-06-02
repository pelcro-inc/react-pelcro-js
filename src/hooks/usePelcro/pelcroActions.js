import ReactGA from "react-ga";
import { userHasAddress } from "../../utils/utils";

export class PelcroActions {
  constructor(storeSetter, storeGetter) {
    this.set = storeSetter;
    this.get = storeGetter;
  }

  /**
   * State actions
   */

  resetState = () => {
    this.set({
      product: null,
      plan: null,
      isGift: false,
      isRenewingGift: false,
      giftCode: "",
      subscriptionIdToRenew: null,
      order: null,
      selectedAddressId: null,
      addressIdToEdit: null
    });
  };

  /**
   * View Actions
   */

  switchView = (view) => {
    // view switching guards
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
      product,
      subscriptionIdToRenew,
      order
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

    return resetView();
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
    this.set({ product });
  };

  setPlan = (id) => {
    const plan = window.Pelcro.plan.getById(id);
    this.set({ plan });
  };

  /**
   * User Actions
   */

  logout = () => {
    const { switchView, resetView, isAuthenticated } = this.get();
    // if user is not authenticated function execution is terminated
    if (!isAuthenticated()) {
      return console.warn("You are already logged out.");
    }

    window.Pelcro.user.logout();
    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Logged out",
      nonInteraction: true
    });

    resetView();
    switchView("login");
  };
}
