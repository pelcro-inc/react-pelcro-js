import createHook from "zustand";
import createStore from "zustand/vanilla";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { PelcroActions } from "./pelcroActions";
import { PelcroCallbacks } from "./pelcroCallbacks";

const createPelcroStore = () =>
  createStore((set, get) => {
    const actions = new PelcroActions(set, get);
    const eventCallbacks = new PelcroCallbacks();
    return {
      // Store setter
      set,

      // View
      view: null,

      // Plans
      product: null,
      plan: null,
      isGift: false,
      isRenewingGift: false,
      giftCode: "",
      subscriptionIdToRenew: null,

      // E-commerce
      order: null,

      // User
      isAuthenticated: () => window.Pelcro.user.isAuthenticated(),
      selectedAddressId: null,
      addressIdToEdit: null,

      // State actions
      ...actions,
      // Callbacks
      ...eventCallbacks
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

  pelcroHook.getStore = pelcroHook.getState;

  return pelcroHook;
};

const pelcroStore = createPelcroStore();
export const usePelcro = createPelcroHook(pelcroStore);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Pelcro Store", usePelcro);
}
