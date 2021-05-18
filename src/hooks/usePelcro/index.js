import createHook from "zustand";
import createStore from "zustand/vanilla";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { PelcroActions } from "./pelcroActions";

const createPelcroStore = () =>
  createStore((set, get) => {
    const actions = new PelcroActions(set, get);

    return {
      // View
      view: null,
      switchView: actions.switchView,
      resetView: actions.resetView,
      flow: "renewal", // TBD

      // Plans
      product: null,
      plan: null,
      isGift: false,
      isRenewingGift: false,
      giftCode: "",
      subscriptionIdToRenew: null,

      // E-commerce
      products: [],
      order: null,

      // User
      isAuthenticated: window.Pelcro.user.isAuthenticated(),
      logout: actions.logout,
      selectedAddressId: null,
      addressIdToEdit: null,

      // Store setter
      set
    };
  });

const pelcroStore = createPelcroStore();

export const usePelcroVanilla = () => {
  return {
    ...pelcroStore.getState()
  };
};

// Creates the react store hook
export const usePelcro = createHook(pelcroStore);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Pelcro Store", usePelcro);
}
