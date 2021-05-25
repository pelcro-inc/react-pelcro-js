import { usePelcro } from "../hooks/usePelcro";
import {
  displayAddressView,
  displayPaymentView,
  isValidViewFromURL
} from "../utils/utils";

/**
 * Takes site's color config on pelcro and applies it to the UI
 */
export const applyPelcroTheme = () => {
  // copied from https://css-tricks.com/converting-color-spaces-in-javascript/#hex-to-hsl
  const hexToHsl = (H) => {
    // Convert hex to RGB first
    let r = 0;
    let g = 0;
    let b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {
      hue: String(h),
      saturation: `${s}%`,
      lightness: `${l}%`
    };
  };

  const { whenSiteReady } = usePelcro.getState();

  whenSiteReady(() => {
    const primaryColorHex = window.Pelcro.site.read()?.design_settings
      ?.primary_color;
    if (!primaryColorHex) {
      return;
    }

    const primaryColorHsl = hexToHsl(primaryColorHex);
    document.documentElement.style.setProperty(
      "--plc-primary-hue",
      primaryColorHsl.hue
    );
    document.documentElement.style.setProperty(
      "--plc-primary-saturation",
      primaryColorHsl.saturation
    );
    document.documentElement.style.setProperty(
      "--plc-primary-lightness",
      primaryColorHsl.lightness
    );
  });
};

/**
 * Initializes a specific modal according to the url 'view' param
 */
export const initViewFromURL = () => {
  const view = window.Pelcro.helpers.getURLParameter("view");
  const { switchView, whenSiteReady } = usePelcro.getState();
  if (isValidViewFromURL()) {
    whenSiteReady(() => {
      switchView(view);
    });
  }
};

/**
 * Initializes the subscription flow if 'product_id' & 'plan_id' params exist
 * with valid IDs. Otherwise, switches to the product selection flow
 */
export const initSubscriptionFromURL = () => {
  const { switchView, whenSiteReady, set } = usePelcro.getState();
  whenSiteReady(() => {
    const productsList = window.Pelcro.product.list();
    if (!productsList?.length) return;

    const [productId, planId, isGift] = [
      window.Pelcro.helpers.getURLParameter("product_id"),
      window.Pelcro.helpers.getURLParameter("plan_id"),
      window.Pelcro.helpers.getURLParameter("is_gift")
    ];

    const selectedProduct = productsList.find(
      (product) => product.id === Number(productId)
    );
    const selectedPlan = selectedProduct?.plans?.find(
      (plan) => plan.id === Number(planId)
    );

    set({
      product: selectedProduct,
      plan: selectedPlan,
      isGift: Boolean(isGift)
    });

    if (!selectedProduct || !selectedPlan) {
      if (productId && planId) {
        return switchView("select");
      }

      return;
    }

    const { isAuthenticated } = usePelcro.getState();

    if (!isAuthenticated()) {
      return switchView("register");
    }

    if (isGift) {
      return switchView("gift");
    }

    const requiresAddress = Boolean(selectedProduct.address_required);

    if (!requiresAddress) {
      return displayPaymentView();
    }

    return displayAddressView();
  });
};
