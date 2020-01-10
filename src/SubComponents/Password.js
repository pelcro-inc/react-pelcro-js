import React, { useContext } from "react";

export default function Password({ placeholder, style, className, id, store }) {
  const { dispatch, state } = useContext(store);

  const handleInputChange = value => {
    dispatch({ type: "setPassword", payload: value });
  };

  return (
    <input
      type="password"
      id={id}
      style={{ ...style }}
      className={className}
      value={state.password}
      onChange={e => handleInputChange(e.target.value)}
      placeholder={placeholder || "Enter Your Password"}
    ></input>
  );
}
