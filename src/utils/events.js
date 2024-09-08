/* eslint-disable valid-jsdoc */
// Polyfill
(() => {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(
    event,
    params = { bubbles: false, cancelable: false, detail: undefined }
  ) {
    const evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

/**
 * Should fire when the cart is opened and expects the cartItems inside the card to be sent
 */
export const cartOpened = (detail) =>
  createCustomEvent("PelcroElementsCartOpened", detail);

/**
 * Should fire when an item added to the cart and expects the added item to be sent
 */
export const cartItemAdded = (detail) =>
  createCustomEvent("PelcroElementsCartItemAdded", detail);

/**
 * Should fire when an item removed from the cart and expects the removed item to be sent
 */
export const cartItemRemoved = (detail) =>
  createCustomEvent("PelcroElementsCartItemRemoved", detail);

/**
 * Should fire when the order gets checked out and expects the order details
 */
export const orderCheckedOut = (detail) =>
  createCustomEvent("PelcroElementsOrderCheckedOut", detail);

export const displayLogin = (detail) =>
  createCustomEvent("PelcroLoginDisplayed", detail);

export const displayRegister = (detail) =>
  createCustomEvent("PelcroRegisterDisplayed", detail);

export const displayPaywall = (detail) =>
  createCustomEvent("PelcroPaywallDisplayed", detail);

export const displaySelect = (detail) =>
  createCustomEvent("PelcroSelectDisplayed", detail);

export const displayProduct = (detail) =>
  createCustomEvent("PelcroProductDisplayed", detail);

export const displayPlan = (detail) =>
  createCustomEvent("PelcroPlanDisplayed", detail);

export const displayAddressCreate = (detail) =>
  createCustomEvent("PelcroAddressCreateDisplayed", detail);

export const displayAddressSelect = (detail) =>
  createCustomEvent("PelcroAddressSelectDisplayed", detail);

export const displayPaymentForm = (detail) =>
  createCustomEvent("PelcroPaymentFormDisplayed", detail);

export const submitLogin = (detail) =>
  createCustomEvent("PelcroLoginSubmitted", detail);

export const submitRegister = (detail) =>
  createCustomEvent("PelcroRegisterSubmitted", detail);

export const submitPaywall = (detail) =>
  createCustomEvent("PelcroPaywallSubmitted", detail);

export const submitSelect = (detail) =>
  createCustomEvent("PelcroSelectSubmitted", detail);

export const submitProduct = (detail) =>
  createCustomEvent("PelcroProductSubmitted", detail);

export const submitPlan = (detail) =>
  createCustomEvent("PelcroPlanSubmitted", detail);

export const submitAddressCreate = (detail) =>
  createCustomEvent("PelcroAddressCreateSubmitted", detail);

export const submitAddressSelect = (detail) =>
  createCustomEvent("PelcroAddressSelectSubmitted", detail);

export const submitPaymentForm = (detail) =>
  createCustomEvent("PelcroPaymentFormSubmitted", detail);

/**
 * Check if the browser support custom events
 */
function createCustomEvent(name, detail) {
  try {
    return new CustomEvent(name, { detail });
  } catch (e) {
    console.warn("Pelcro - Events are not supported in the browser");
  }
}
