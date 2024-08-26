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
