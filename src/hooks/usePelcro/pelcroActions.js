import ReactGA from "react-ga";
import { initialState } from ".";
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
    const { view, cartItems, ...otherStateFields } = initialState;
    this.set(otherStateFields);
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
    if (!product) return console.error("invalid product id");
    this.set({ product });
  };

  setPlan = (id) => {
    const plan = window.Pelcro.plan.getById(id);
    if (!plan) return console.error("invalid plan id");
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
}
