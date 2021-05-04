import create from "zustand";
import { default as createVanilla } from "zustand/vanilla";
import { mountStoreDevtool } from "simple-zustand-devtools";

export const usePelcroStore = createVanilla((set) => ({
  // View
  view: null,
  switchView: (view) => set({ view }),
  resetView: () => set({ view: null }),

  // Plans
  product: null,
  plan: null,
  setProductAndPlan: (product, plan, isGift) =>
    set({ product, plan, isGift }),
  giftCode: "",
  isGift: false,
  isRenewingGift: false,

  // E-commerce
  products: [],
  order: null,

  // User
  isAuthenticated: window.Pelcro.user.isAuthenticated(),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  selectedAddressId: null
}));

export const usePelcroVanilla = () => {
  const store = usePelcroStore;

  return {
    isAuthenticated: () => store.getState().isAuthenticated,
    switchView: (view) => store.setState({ view })
  };
};

export const usePelcro = create(usePelcroStore);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", usePelcro);
}
