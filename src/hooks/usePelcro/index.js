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

const createPelcroHook = (store) => {
  // initiate hook with zustand creator
  const pelcroHook = createHook(store);

  /**
   * Override internal implementation inside pelcro store
   * @param {function(storeSetter, storeGetter): object} fn
   */
  pelcroHook.override = (fn) => {
    const partialState = fn(store.setState, store.getState);

    usePelcro.setState(partialState);
  };

  return pelcroHook;
};

const pelcroStore = createPelcroStore();
export const usePelcro = createPelcroHook(pelcroStore);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Pelcro Store", usePelcro);
}
