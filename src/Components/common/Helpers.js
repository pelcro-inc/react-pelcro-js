import values from "lodash/values";
import get from "lodash/get";

export const getErrorMessages = error => {
  if (get(error, "error.message")) {
    return get(error, "error.message");
  }

  if (get(error, "response.data.error.message")) {
    return get(error, "response.data.error.message");
  }

  const messages = [];

  values(error.response.data.errors).forEach(message => {
    messages.push(message[0]);
  });

  return messages.join("\n");
};
