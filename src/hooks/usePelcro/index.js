import create from "zustand";
import createVanilla from "zustand/vanilla";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { PelcroActions } from "./pelcroActions";

const createPelcroStore = (set, get) => {
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
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    logout: actions.logout,
    selectedAddressId: null,
    addressIdToEdit: null,

    // store setter
    set
  };
};

const pelcroStore = createVanilla(createPelcroStore);

export const usePelcroVanilla = () => {
  return {
    isAuthenticated: () => pelcroStore.getState().isAuthenticated,
    switchView: (view) => pelcroStore.setState({ view })
  };
};

// Creates the react store hook
export const usePelcro = create(pelcroStore);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", usePelcro);
}
