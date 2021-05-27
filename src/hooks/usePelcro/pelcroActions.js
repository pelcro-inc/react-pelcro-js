import ReactGA from "react-ga";

export class PelcroActions {
  constructor(storeSetter, storeGetter) {
    this.set = storeSetter;
    this.get = storeGetter;
  }

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
    const { switchView } = this.get();
    switchView(null);

    // Other pelcro state to reset
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
