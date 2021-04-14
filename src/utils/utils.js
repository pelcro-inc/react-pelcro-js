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
 * Gets user last submited pelcro shipping address
 * @return {object?} User address
 */
export const getUserLatestAddress = () => {
  const addressesLength = window.Pelcro.address.list()?.length;
  return window.Pelcro.address.list()?.[addressesLength - 1];
};

/**
 * Transforms locale names stored in our backend like
 * "en_US" into the standerd accepted in core i18n methods: "en-US"
 * @param {string} localeName
 * @return {string}
 * @example getCanonicalLocaleFormat("en_US") => "en-US"
 */
export const getCanonicalLocaleFormat = (localeName) =>
  localeName.replace("_", "-");

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
 * @returns {boolean} true if the user have at least one address, false otherwise
 */
export const userHasAddress = () => {
  const addresses = window.Pelcro.user.read().addresses ?? [];
  return addresses.length > 0;
};
