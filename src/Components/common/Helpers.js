/**
 * Extracts error message from the response error object
 * @param {Object} error Error object
 */
export const getErrorMessages = (error) => {
  if (error?.error?.message) {
    return error.message;
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


  values(error?.response?.data?.errors).forEach((message) => {
    messages.push(message[0]);
  });

  return messages.join("\n");
};
