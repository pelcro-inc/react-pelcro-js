/* eslint-disable import/no-unused-modules */
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

// Mock the PaymentMethodContainer module BEFORE importing the component
// under test, so we don't pull in the (very large) container and its
// SVG/asset imports — we only need its `store` context for the component.
jest.mock("../../PaymentMethod/PaymentMethodContainer", () => {
  const ReactLocal = require("react");
  return {
    __esModule: true,
    store: ReactLocal.createContext({
      state: { isDefault: false },
      dispatch: () => {}
    })
  };
});

// eslint-disable-next-line import/first
import { PaymentMethodCreateSetDefault } from "../PaymentMethodCreateSetDefault";
// eslint-disable-next-line import/first
import { store } from "../../PaymentMethod/PaymentMethodContainer";
// eslint-disable-next-line import/first
import {
  HANDLE_CHECKBOX_CHANGE,
  SET_IS_DEFAULT_PAYMENT_METHOD
} from "../../../utils/action-types";

const renderWithStore = ({
  isDefault = false,
  dispatch = jest.fn()
} = {}) => {
  const value = {
    state: { isDefault },
    dispatch
  };

  const utils = render(
    <store.Provider value={value}>
      <PaymentMethodCreateSetDefault
        id="pelcro-input-is-default"
        label="Set as default"
      />
    </store.Provider>
  );

  return { ...utils, dispatch };
};

describe("PaymentMethodCreateSetDefault", () => {
  beforeEach(() => {
    // Reset uiSettings between tests so each case is isolated.
    // Default both flags to absent — opt-in is per-tenant.
    window.Pelcro = window.Pelcro || {};
    window.Pelcro.uiSettings = {};
  });

  test("renders a checkbox input with the provided label", () => {
    renderWithStore();
    const checkbox = screen.getByLabelText("Set as default");
    expect(checkbox).not.toBeNull();
    expect(checkbox.tagName).toBe("INPUT");
    expect(checkbox.type).toBe("checkbox");
  });

  test("checkbox is unchecked when defaultCheckedSetAsDefaultOnCreate is absent", () => {
    renderWithStore({ isDefault: false });
    const checkbox = screen.getByLabelText("Set as default");
    expect(checkbox.checked).toBe(false);
  });

  test("checkbox is unchecked when defaultCheckedSetAsDefaultOnCreate is explicitly false", () => {
    window.Pelcro.uiSettings.defaultCheckedSetAsDefaultOnCreate = false;
    renderWithStore({ isDefault: false });
    const checkbox = screen.getByLabelText("Set as default");
    expect(checkbox.checked).toBe(false);
  });

  test("dispatches SET_IS_DEFAULT_PAYMENT_METHOD on mount when defaultCheckedSetAsDefaultOnCreate is true", () => {
    window.Pelcro.uiSettings.defaultCheckedSetAsDefaultOnCreate = true;
    const { dispatch } = renderWithStore({ isDefault: false });

    expect(dispatch).toHaveBeenCalledWith({
      type: SET_IS_DEFAULT_PAYMENT_METHOD,
      payload: { isDefault: true }
    });
  });

  test("does NOT dispatch SET_IS_DEFAULT_PAYMENT_METHOD on mount when the flag is absent", () => {
    const { dispatch } = renderWithStore({ isDefault: false });

    const wasCalledWithSetIsDefault = dispatch.mock.calls.some(
      ([action]) => action.type === SET_IS_DEFAULT_PAYMENT_METHOD
    );
    expect(wasCalledWithSetIsDefault).toBe(false);
  });

  test("toggling the checkbox dispatches HANDLE_CHECKBOX_CHANGE with the new value", () => {
    const { dispatch } = renderWithStore({ isDefault: false });
    const checkbox = screen.getByLabelText("Set as default");

    fireEvent.click(checkbox);

    expect(dispatch).toHaveBeenCalledWith({
      type: HANDLE_CHECKBOX_CHANGE,
      payload: { isDefault: true }
    });
  });
});
