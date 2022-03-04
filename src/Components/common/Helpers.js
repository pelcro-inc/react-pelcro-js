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

  const errorMessages = [];

  // enumerable error (ex: validation errors)
  Object.values(error?.response?.data?.errors).forEach(
    ([errorMessage]) => {
      errorMessages.push(errorMessage);
    }
  );

  // convert to multiline string
  return errorMessages.join("\n");
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
  const { view } = usePelcro.getStore();
  const temp_ONLY_USE_VANTIV_WITH_SUBSCRIPTION_CREATE =
    view === "subscription-create";

  if (
    temp_ONLY_USE_VANTIV_WITH_SUBSCRIPTION_CREATE &&
    window.Pelcro.site.read()?.vantiv_pay_page_id
  ) {
    return "vantiv";
  }

  return "stripe";
}
