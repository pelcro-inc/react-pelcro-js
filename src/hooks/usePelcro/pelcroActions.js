export class PelcroActions {
  constructor(storeSetter, storeGetter) {
    this.set = storeSetter;
    this.get = storeGetter;
  }

  switchView = (view) => {
    // view switching guards
    if (
      ["login", "register"].includes(view) &&
      this.get().isAuthenticated
    ) {
      return this.set({ view: "dashboard" });
    }

    if (view === "password-change" && !this.get().isAuthenticated) {
      return this.set({ view: "login" });
    }

    this.set({ view });
  };

  resetView = () => {
    this.set({
      view: null,
      // Other pelcro state to reset
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
    // if user is not authenticated function execution is terminated
    if (!window.Pelcro.user.isAuthenticated()) {
      return console.warning("You are already logged out.");
    }

    this.set({ isAuthenticated: false });
    window.Pelcro.user.logout();
    this.resetView();

    this.switchView("login");
  };
}
