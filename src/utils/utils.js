import { usePelcro } from "../hooks/usePelcro";
import ReactGA from "react-ga";

export const formatDiscountedPrice = (planAmount, percentageOff) =>
  parseFloat(
    parseFloat(
      (parseInt(planAmount) / 100) *
        (1 - parseInt(percentageOff) / 100)
    )
      .toString()
      .match(/^-?\d+(?:\.\d{0,2})?/)[0]
  );

export const sortCountries = (countries) => {
  const sortable = [];
  delete countries.CA;
  delete countries.US;

  for (const abbr in countries) {
    sortable.push([abbr, countries[abbr]]);
  }

  sortable.sort((a, b) => {
    if (a[1] > b[1]) return 1;
    return -1;
  });

  sortable.unshift(["US", "United States"], ["CA", "Canada"]);

  return sortable;
};

/**
 * Recursively filters out null values (null, undefined)
 * @param {object} obj
 * @return {object} filtered object
 * @example
 *  cleanObjectNullValues({one: "not empty", two: null, three: {nested: null}})
 *
 *  {
 *    one: "not empty",
 *    three: {}
 *  }
 */
export const cleanObjectNullValues = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => [
      k,
      v && typeof v === "object" ? cleanObjectNullValues(v) : v
    ])
    .reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});

/**
 * get an address using it's id
 * @param {number} id id of the wanted address
 * @return {object?} address with the matching id
 */
export const getAddressById = (id) => {
  const addresses = window.Pelcro.user.read().addresses ?? [];
  return addresses.find((address) => address.id === Number(id));
};

/**
 * Transforms locale names stored in our backend like
 * "en_US" into the standerd accepted in core i18n methods: "en-US"
 * @param {string} localeName
 * @return {string | undefined}
 * @example getCanonicalLocaleFormat("en_US") => "en-US"
 */
export const getCanonicalLocaleFormat = (localeName) =>
  localeName?.replace("_", "-");

/**
 * Returns a formatted price string depending on locale
 * @param {number} amount
 * @param {string} currency
 * @param {string} locale
 * @return {string}
 * @example getFormattedPriceByLocal(10, 'USD', 'en-US') => "$10.00"
 */
export const getFormattedPriceByLocal = (
  amount,
  currency = "USD",
  locale = "en-US"
) => {
  const formatter = new Intl.NumberFormat(
    getCanonicalLocaleFormat(locale),
    {
      style: "currency",
      currency
    }
  );

  return formatter.format(amount / 100);
};

/** check wether or not the user have any addresses
 * @return {boolean} true if the user have at least one address, false otherwise
 */
export const userHasAddress = () => {
  const addresses = window.Pelcro.user.read().addresses ?? [];
  return addresses.length > 0;
};

export const calcAndFormatItemsTotal = (items, currency) => {
  if (!Array.isArray(items)) return;

  let totalWithoutDividingBy100 = 0;
  for (const item of items) {
    totalWithoutDividingBy100 += parseFloat(
      item.price
        ? (item.price * item.quantity).toFixed(2)
        : item.amount.toFixed(2)
    );
  }

  const locale = window.Pelcro.site.read().default_locale;
  return getFormattedPriceByLocal(
    totalWithoutDividingBy100,
    currency,
    locale
  );
};

/**
 * returns true if the URL contains a supported view trigger URL
 * @param {string} viewID
 * @return {boolean}
 */
export const isValidViewFromURL = (viewID) => {
  if (
    [
      "login",
      "register",
      "plan-select",
      "gift-redeem",
      "password-forgot",
      "password-reset",
      "password-change",
      "payment-method-update",
      "user-edit",
      "newsletter",
      "address-create",
      "order-create",
      "cart"
    ].includes(viewID)
  ) {
    return true;
  }

  return false;
};

/**
 * Returns the current stable viewID from all old variations
 * @param {string} view
 * @return {string}
 */
export const getStableViewID = (view) => {
  if (view === "select") {
    return "plan-select";
  }

  if (view === "redeem") {
    return "gift-redeem";
  }

  if (view === "address") {
    return "address-create";
  }

  return view;
};

export const enableScroll = () => {
  document.body.classList.remove("pelcro-modal-open");
};

export const disableScroll = () => {
  if (!document.body.classList.contains("pelcro-modal-open")) {
    document.body.classList.add("pelcro-modal-open");
  }
};

export const trackSubscriptionOnGA = () => {
  const { product, plan, couponCode } = usePelcro.getStore();

  const subscriptions = window.Pelcro.subscription.list();
  const lastSubscription = subscriptions?.[subscriptions.length - 1];

  if (!lastSubscription) {
    return;
  }

  ReactGA?.set?.({
    currencyCode: window.Pelcro.user.read()?.currency ?? plan.currency
  });

  ReactGA?.plugin?.execute?.("ecommerce", "addTransaction", {
    id: lastSubscription.id,
    affiliation: "Pelcro",
    revenue: plan?.amount ? plan.amount / 100 : 0,
    coupon: couponCode
  });

  ReactGA?.plugin?.execute?.("ecommerce", "addItem", {
    id: lastSubscription.id,
    name: product.name,
    category: product.description,
    variant: plan.nickname,
    price: plan?.amount ? plan.amount / 100 : 0,
    quantity: 1
  });

  ReactGA?.plugin?.execute?.("ecommerce", "send");

  ReactGA?.event?.({
    category: "ACTIONS",
    action: "Subscribed",
    nonInteraction: true
  });
};
