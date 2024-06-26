import React from "react";
import { usePelcro } from "../hooks/usePelcro";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

/**
 * List of zero-decimal currencies.
 * @see https://stripe.com/docs/currencies#zero-decimal
 *
 */
export const ZERO_DECIMAL_CURRENCIES = [
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF"
];

/**
 * @param {string}
 * @return {boolean}
 */
export const isCurrencyZeroDecimal = (currency) =>
  ZERO_DECIMAL_CURRENCIES.includes(currency.toUpperCase());

export const formatDiscountedPrice = (
  planAmount,
  percentageOff,
  planCurrency
) =>
  isCurrencyZeroDecimal(planCurrency)
    ? parseFloat(
        parseFloat(
          parseInt(planAmount) * (1 - parseInt(percentageOff) / 100)
        ).toString()
      )
    : parseFloat(
        parseFloat(
          (parseInt(planAmount) / 100) *
            (1 - parseInt(percentageOff) / 100)
        )
          .toString()
          .match(/^-?\d+(?:\.\d{0,2})?/)[0]
      );

export const sortCountries = (countries) => {
  const sortable = [];
  const { CA, US, ...rest } = countries;

  for (const abbr in rest) {
    sortable.push([abbr, rest[abbr]]);
  }

  sortable.sort((a, b) => {
    if (a[1] > b[1]) return 1;
    return -1;
  });

  sortable.unshift(["US", US], ["CA", CA]);

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
 * "en_US" into the standard accepted in core i18n methods: "en-US"
 * @param {string} localeName
 * @return {string | undefined}
 * @example getCanonicalLocaleFormat("en_US") => "en-US"
 */
export const getCanonicalLocaleFormat = (localeName) =>
  localeName?.replace("_", "-");

/**
 * @param {string} localeName
 * @return {string | undefined}
 * @example getLanguageWithoutRegion("en-US") => "en"
 */
export const getLanguageWithoutRegion = (localeName) => {
  return getCanonicalLocaleFormat(localeName)?.split("-")[0];
};

/**
 * Gets the current page language or fallbacks to site default
 * @return {string | undefined}
 */
export const getPageOrDefaultLanguage = () => {
  return (
    window.Pelcro.helpers.getHtmlLanguageAttribute() ??
    getLanguageWithoutRegion(
      window.Pelcro?.site?.read?.()?.default_locale
    )
  );
};

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
  locale = "en"
) => {
  const formatter = new Intl.NumberFormat(
    getCanonicalLocaleFormat(locale),
    {
      style: "currency",
      currency
    }
  );

  return isCurrencyZeroDecimal(currency)
    ? formatter.format(amount)
    : formatter.format(amount / 100);
};

/** check wether or not the user have any addresses
 * @return {boolean} true if the user have at least one address, false otherwise
 */
export const userHasAddress = () => {
  const addresses = window.Pelcro.user.read()?.addresses ?? [];
  return addresses.length > 0;
};

export const calcAndFormatItemsTotal = (items, currency) => {
  if (!Array.isArray(items)) return;

  let totalWithoutDividingBy100 = 0;
  for (const item of items) {
    totalWithoutDividingBy100 += parseFloat(
      item?.price || item?.price === 0
        ? isCurrencyZeroDecimal(currency)
          ? item.price * item.quantity
          : (item.price * item.quantity).toFixed(2)
        : isCurrencyZeroDecimal(currency)
        ? item.amount
        : item.amount.toFixed(2)
    );
  }

  return getFormattedPriceByLocal(
    totalWithoutDividingBy100,
    currency,
    getPageOrDefaultLanguage()
  );
};

/**
 * @param {object[]} items
 * @returns {number} the total order price
 */
export const calcOrderAmount = (items) => {
  if (!Array.isArray(items)) return;

  return items.reduce((prevAmount, item) => {
    return prevAmount + item.price * item.quantity;
  }, 0);
};

export const getOrderInfo = (order, i18n) => {
  if (!order) {
    return {
      price: null,
      currency: null,
      label: null
    };
  }

  const isQuickPurchase = !Array.isArray(order);

  if (isQuickPurchase) {
    return {
      price: order.price * order.quantity,
      currency: order.currency,
      label: order.name
    };
  }

  if (order.length === 0) {
    return {
      price: null,
      currency: null,
      label: null
    };
  }

  if (order.length === 1) {
    return {
      price: order[0].price * order[0].quantity,
      currency: order[0].currency,
      label: order[0].name
    };
  }

  const price = order.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    price,
    currency: order[0].currency,
    label:
      price === 0 ? i18n("labels.freeItems") : i18n("labels.order")
  };
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
      "donation-select",
      "gift-redeem",
      "password-forgot",
      "password-reset",
      "password-change",
      "passwordless-request",
      "passwordless-login",
      "payment-method-update",
      "user-edit",
      "newsletter",
      "address-create",
      "order-create",
      "cart",
      "email-verify",
      "invoice-details",
      "manage-members"
    ].includes(viewID) ||
    hasValidNewsletterUpdateUrl()
  ) {
    return true;
  }

  return false;

  /**
   *
   */
  function hasValidNewsletterUpdateUrl() {
    if (viewID !== "newsletter-update") return false;

    const newsletters = window.Pelcro?.uiSettings?.newsletters;
    const siteHasNewslettersDefined =
      Array.isArray(newsletters) && newsletters.length > 0;

    if (!siteHasNewslettersDefined) {
      return false;
    }

    const queryParamEmail =
      window.Pelcro.helpers.getURLParameter("email");

    if (queryParamEmail && window.Pelcro.user.isAuthenticated()) {
      if (queryParamEmail !== window.Pelcro.user.read()?.email) {
        console.error(
          "email query parameter and user account email are different, url email query parameter must match user email if user is logged in"
        );
        return false;
      }
    }

    if (!queryParamEmail && !window.Pelcro.user.isAuthenticated()) {
      return false;
    }

    return true;
  }
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

  /*   
  getting the latest subscription id from invoices instead of subscriptions
  to handle gifted subs which are not added to subs list
  */
  const { invoices } = window.Pelcro.user.read();
  const lastSubscriptionId =
    invoices?.[invoices.length - 1].subscription_id;
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

  if (!lastSubscriptionId) {
    return;
  }

  const currencyCode =
    window.Pelcro.user.read()?.currency ?? plan.currency;

  if (enableReactGA4) {
    ReactGA4.event("purchase", {
      transaction_id: lastSubscriptionId,
      affiliation: "Pelcro",
      currency: currencyCode,
      value: plan?.amount
        ? isCurrencyZeroDecimal(currencyCode)
          ? plan.amount
          : plan.amount / 100
        : 0,
      coupon: couponCode,
      items: [
        {
          item_id: lastSubscriptionId,
          item_name: product.name,
          item_category: product.description,
          item_variant: plan.nickname,
          price: plan?.amount
            ? isCurrencyZeroDecimal(currencyCode)
              ? plan.amount
              : plan.amount / 100
            : 0,
          quantity: 1
        }
      ]
    });

    ReactGA4.event("Subscribed", {
      nonInteraction: true
    });
  } else {
    ReactGA?.set?.({
      currencyCode: currencyCode
    });

    ReactGA?.plugin?.execute?.("ecommerce", "addTransaction", {
      id: lastSubscriptionId,
      affiliation: "Pelcro",
      revenue: plan?.amount
        ? isCurrencyZeroDecimal(currencyCode)
          ? plan.amount
          : plan.amount / 100
        : 0,
      coupon: couponCode
    });

    ReactGA?.plugin?.execute?.("ecommerce", "addItem", {
      id: lastSubscriptionId,
      name: product.name,
      category: product.description,
      variant: plan.nickname,
      price: plan?.amount
        ? isCurrencyZeroDecimal(currencyCode)
          ? plan.amount
          : plan.amount / 100
        : 0,
      quantity: 1
    });

    ReactGA?.plugin?.execute?.("ecommerce", "send");

    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Subscribed",
      nonInteraction: true
    });
  }
};

/** check wether or not the user have any existing payment method
 * @return {boolean} true if the user have at least one payment method (source), false otherwise
 */
export const userHasPaymentMethod = () => {
  const sources = window.Pelcro.user.read()?.sources ?? [];
  return sources.length > 0;
};

/**
 * @param {Element} elem html element with data-pelcro-entitlements attribute
 * @return {Array<String>} array of entitlements extracted from the data-pelcro-entitlements
 * attribute
 */
export const getEntitlementsFromElem = (elem) => {
  return elem.dataset.pelcroEntitlements
    .split(",")
    .map((entitlement) => entitlement.trim())
    .filter((entitlement) => entitlement);
};

export const getPaymentCardIcon = (name) => {
  const icons = {
    visa: (
      <svg
        className="plc-w-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#1565C0"
          d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"
        />
        <path
          fill="#FFC107"
          d="M12.212,24.945l-0.966-4.748c0,0-0.437-1.029-1.573-1.029c-1.136,0-4.44,0-4.44,0S10.894,20.84,12.212,24.945z"
        />
      </svg>
    ),
    mastercard: (
      <svg
        className="plc-w-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#ff9800"
          d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
        />
        <path
          fill="#d50000"
          d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
        />
        <path
          fill="#ff3d00"
          d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
        />
      </svg>
    ),
    "american express": (
      <svg
        className="plc-w-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#1976D2"
          d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"
        />
        <path
          fill="#FFF"
          d="M22.255 20l-2.113 4.683L18.039 20h-2.695v6.726L12.341 20h-2.274L7 26.981h1.815l.671-1.558h3.432l.682 1.558h3.465v-5.185l2.299 5.185h1.563l2.351-5.095v5.095H25V20H22.255zM10.135 23.915l1.026-2.44 1.066 2.44H10.135zM37.883 23.413L41 20.018h-2.217l-1.994 2.164L34.86 20H28v6.982h6.635l2.092-2.311L38.767 27h2.21L37.883 23.413zM33.728 25.516h-4.011v-1.381h3.838v-1.323h-3.838v-1.308l4.234.012 1.693 1.897L33.728 25.516z"
        />
      </svg>
    ),
    amex: (
      <svg
        className="plc-w-16"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#1976D2"
          d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"
        />
        <path
          fill="#FFF"
          d="M22.255 20l-2.113 4.683L18.039 20h-2.695v6.726L12.341 20h-2.274L7 26.981h1.815l.671-1.558h3.432l.682 1.558h3.465v-5.185l2.299 5.185h1.563l2.351-5.095v5.095H25V20H22.255zM10.135 23.915l1.026-2.44 1.066 2.44H10.135zM37.883 23.413L41 20.018h-2.217l-1.994 2.164L34.86 20H28v6.982h6.635l2.092-2.311L38.767 27h2.21L37.883 23.413zM33.728 25.516h-4.011v-1.381h3.838v-1.323h-3.838v-1.308l4.234.012 1.693 1.897L33.728 25.516z"
        />
      </svg>
    )
  };

  return name ? (
    icons[name.toLowerCase()]
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="plc-w-16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );
};

/**
 * Gets the current date with time set to 0
 * @param {Date} dateObject
 * @return {Date}
 */
export function getDateWithoutTime(dateObject) {
  const date = new Date(dateObject.getTime());
  date.setHours(0, 0, 0, 0);
  return date;
}

export function userMustVerifyEmail() {
  const isEmailVerificationEnabled =
    window.Pelcro.site.read()?.email_verify_enabled ?? false;

  const isUserEmailVerified =
    window.Pelcro.user.read()?.email_confirm ?? false;

  return (
    window.Pelcro.user.isAuthenticated() &&
    isEmailVerificationEnabled &&
    !isUserEmailVerified
  );
}

export function notifyBugsnag(callback, startOptions) {
  if (
    !window.Bugsnag &&
    !document.querySelector(
      'script[src="https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"]'
    )
  ) {
    // load bugsnag CDN
    window.Pelcro.helpers.loadSDK(
      "https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js",
      "bugsnag-cdn"
    );

    document
      .querySelector(
        'script[src="https://d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"]'
      )
      .addEventListener("load", () => {
        Bugsnag.start({
          apiKey:
            window.Pelcro?.environment?.bugsnagKey ??
            "e8f6852b322540e8c25386048b99ab01",
          autoDetectErrors: false,
          releaseStage:
            window.Pelcro?.environment?.bugsnagReleaseStage,
          redactedKeys: [
            "security_key",
            "password",
            "password_confirmation",
            "auth_token",
            "token"
          ],
          ...startOptions
        });

        callback();
      });
    return;
  }

  callback();
}

//create a safe and strong password string with special characters
export function generatePassword() {
  const length = 16;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?`~";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export const refreshUser = () => {
  window.Pelcro.user.refresh(
    {
      auth_token: window.Pelcro?.user?.read()?.auth_token
    },
    (err, res) => {
      if (err) {
        console.error(err);
      }
      if (res) {
        return res.data;
      }
    }
  );
};
