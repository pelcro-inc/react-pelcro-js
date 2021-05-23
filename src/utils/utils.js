import { usePelcro } from "../hooks/usePelcro";

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

export const getEcommerceOrderTotal = (order) => {
  if (!order) {
    return null;
  }

  const allSkus = window.Pelcro.ecommerce.products
    .read()
    .flatMap((prod) => prod.skus.map((sku) => sku))
    .reduce((obj, item) => ({ ...obj, [item.id]: { ...item } }), {});

  const totalAmount = order.reduce((total, orderItem) => {
    const product = allSkus[orderItem.sku_id];

    return total + product.price * orderItem.quantity;
  }, 0);

  return totalAmount;
};

/** check wether or not the user have any addresses
 * @return {boolean} true if the user have at least one address, false otherwise
 */
export const userHasAddress = () => {
  const addresses = window.Pelcro.user.read().addresses ?? [];
  return addresses.length > 0;
};

export const displayAddressView = () => {
  const { switchView } = usePelcro.getState();

  if (userHasAddress()) {
    switchView("address-select");
  } else {
    switchView("address");
  }
};

export const displayPaymentView = () => {
  const {
    switchView,
    resetView,
    product,
    subscriptionIdToRenew,
    order
  } = usePelcro.getState();

  if (product && subscriptionIdToRenew) {
    return switchView("subscription-renew");
  }

  if (product && !subscriptionIdToRenew) {
    return switchView("subscription-create");
  }

  if (order) {
    return switchView("order-create");
  }

  return resetView();
};
