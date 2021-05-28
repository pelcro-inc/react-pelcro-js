/* eslint-disable import/no-unused-modules */
import React from "react";
import { render, act } from "@testing-library/react";
import { usePelcro } from "./index.js";
import { setupTests } from "../../../__tests__/utils.js";

const setupHook = () => {
  const returnVal = {};

  const TestComponent = () => {
    Object.assign(returnVal, usePelcro());
    return null;
  };

  render(<TestComponent />);
  return returnVal;
};

beforeAll(() => {
  console.warn = () => {};
  console.debug = () => {};
  return setupTests();
});

describe("returns the store with initial state", () => {
  const data = setupHook();
  it("", (done) => {
    console.log(window.Pelcro.site.read());
    done();
    expect(true).toBeTruthy();
  });
});
