import { usePelcro } from "../../hooks/usePelcro";

/**
 * Extracts error message from the response error object
 * @param {Object} error Error object
 * @return {string}
 */
export const getErrorMessages = (error) => {
  if (error?.error?.message) {
    return error.error.message;
  }

  if (error?.response?.data?.message) {
    return error?.response?.data?.message;
  }

  if (error?.response?.data?.error?.message) {
    return error?.response?.data?.error?.message;
  }

  if (error?.response?.data?.errors) {
    const errorMessages = [];

    // enumerable error (ex: validation errors)
    Object.values(error?.response?.data?.errors).forEach(
      ([errorMessage]) => {
        errorMessages.push(errorMessage);
      }
    );

    // convert to multiline string
    return errorMessages.join("\n");
  }

  if (error?.message) {
    return error.message;
  }
};

/**
 * Executes function after a wait time of inactivity
 * @param {function} func
 * @param {number} waitTime
 */
export const debounce = (func, waitTime) => {
  let timeout;

  return function executedFunction(...args) {
    // The callback function to be executed after
    // the debounce time has elapsed
    const later = () => {
      // null timeout to indicate the debounce ended
      timeout = null;
      func(...args);
    };
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);

    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs Node)
    timeout = setTimeout(later, waitTime);
  };
};

export function getSiteCardProcessor() {
  if (window.Pelcro.site.read()?.vantiv_gateway_settings) {
    return "vantiv";
  }

  if (window.Pelcro.site.read()?.tap_gateway_settings) {
    return "tap";
  }

  if (window.Pelcro.site.read()?.cybersource_gateway_settings) {
    return "cybersource";
  }

  if (window.Pelcro.site.read()?.braintree_gateway_settings) {
    return "braintree";
  }

  return "stripe";
}

export function getFourDigitYear(lastTwoDigits) {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Extract the current century (first two digits)
  const currentCentury = Math.floor(currentYear / 100);

  // Combine the century and the provided last two digits
  const fourDigitYear = currentCentury * 100 + lastTwoDigits;

  return fourDigitYear;
}

/**
 * Loads Braintree Drop-in UI script
 * @returns {Promise} Promise that resolves when script is loaded
 */
export function loadBraintreeScript() {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.braintree) {
      console.log("Braintree script already loaded");
      resolve(window.braintree);
      return;
    }

    console.log("Loading Braintree script...");
    const script = document.createElement("script");
    script.src =
      "https://js.braintreegateway.com/web/dropin/1.45.1/js/dropin.js";
    script.onload = () => {
      console.log("Braintree script loaded successfully");
      resolve(window.braintree);
    };
    script.onerror = (error) => {
      console.error("Failed to load Braintree script:", error);
      reject(new Error("Failed to load Braintree script"));
    };
    document.head.appendChild(script);
  });
}

/**
 * Creates Braintree Drop-in UI instance
 * @param {string} authorization - Braintree authorization token
 * @param {string} selector - CSS selector for the container
 * @param {Object} options - Additional options for dropin creation
 * @returns {Promise} Promise that resolves with the dropin instance
 */
export function createBraintreeDropin(
  authorization,
  selector,
  options = {}
) {
  console.log("Creating Braintree Drop-in with:", {
    authorization: authorization ? "present" : "missing",
    selector,
    options
  });

  return loadBraintreeScript().then(() => {
    console.log("Braintree script loaded, creating dropin...");
    return new Promise((resolve, reject) => {
      window.braintree.dropin.create(
        {
          authorization,
          selector,
          ...options
        },
        (err, instance) => {
          if (err) {
            console.error("Braintree dropin creation failed:", err);
            reject(err);
          } else {
            console.log(
              "Braintree dropin created successfully:",
              instance
            );
            resolve(instance);
          }
        }
      );
    });
  });
}

/**
 * Requests payment method from Braintree Drop-in UI
 * @param {Object} instance - Braintree dropin instance
 * @returns {Promise} Promise that resolves with payment method payload
 */
export function requestBraintreePaymentMethod(instance) {
  return new Promise((resolve, reject) => {
    instance.requestPaymentMethod((err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
}

/**
 * Requests payment method from Braintree Hosted Fields
 * @param {Object} hostedFieldsInstance - Braintree hosted fields instance
 * @returns {Promise} Promise that resolves with payment method payload
 */
export function requestBraintreeHostedFieldsPaymentMethod(hostedFieldsInstance) {
  return new Promise((resolve, reject) => {
    hostedFieldsInstance.tokenize((err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
}
