import React, { useContext, useEffect } from "react";
import { Loader } from "../SubComponents/Loader";
import { SET_GIFT_CODE } from "../utils/action-types";

/**
 *
 */
export function GiftCode({
  placeholder,
  style,
  className,
  id,
  store,
  ...otherProps
}) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_GIFT_CODE, payload: value });
  };

  useEffect(() => {
    const giftCode = window.Pelcro.helpers.getURLParameter(
      "gift_code"
    )
      ? window.Pelcro.helpers.getURLParameter("gift_code")
      : "";

    handleInputChange(giftCode);
  }, []);

  if (state.loading) {
    return (
      <div className="state-select-loader">
        <Loader />
      </div>
    );
  }

  return (
    <input
      type="text"
      id={id}
      style={{ ...style }}
      className={className}
      value={state.giftCode || null}
      onChange={(e) => handleInputChange(e.target.value)}
      placeholder={placeholder || "Enter Your Gift Code"}
      {...otherProps}
    ></input>
  );
}
