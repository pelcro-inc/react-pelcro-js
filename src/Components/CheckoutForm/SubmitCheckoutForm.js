import React from "react";
import Submit from "../common/Submit";

export const SubmitCheckoutForm = ({ submit, disableSubmit, name }) => {
  return <Submit onClick={submit} text={name} disabled={disableSubmit} />;
};
