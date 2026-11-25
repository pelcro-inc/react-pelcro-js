/* eslint-disable import/no-unused-modules */
import React from "react";
import { render, screen } from "@testing-library/react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import checkoutForm_en from "../translations/en/checkoutForm.json";
import checkoutForm_de from "../translations/de/checkoutForm.json";
import checkoutForm_fr from "../translations/fr/checkoutForm.json";
import checkoutForm_es from "../translations/es/checkoutForm.json";
import checkoutForm_ko from "../translations/ko/checkoutForm.json";
import { CheckoutForm } from "./StripeElements";
import { getSiteCardProcessor } from "../Components/common/Helpers";

jest.mock(
  "../Components/PaymentMethod/PaymentMethodContainer",
  () => {
    const React = require("react");
    return {
      store: React.createContext({
        state: { isSkeletonLoaded: true }
      })
    };
  }
);

jest.mock("../hooks/usePelcro", () => ({
  usePelcro: () => ({
    selectedPaymentMethodId: null,
    paymentMethodToEdit: { properties: { last4: "4242" } }
  })
}));

jest.mock("../Components/common/Helpers", () => ({
  getSiteCardProcessor: jest.fn()
}));

// The month/year selects need the payment-method store; only their placeholder matters here.
jest.mock("./MonthSelect", () => ({
  MonthSelect: function MonthSelect({ placeholder }) {
    return <span>{placeholder}</span>;
  }
}));
jest.mock("./YearSelect", () => ({
  YearSelect: function YearSelect({ placeholder }) {
    return <span>{placeholder}</span>;
  }
}));

const locales = {
  en: checkoutForm_en,
  de: checkoutForm_de,
  fr: checkoutForm_fr,
  es: checkoutForm_es,
  ko: checkoutForm_ko
};

beforeAll(() =>
  i18n.use(initReactI18next).init({
    resources: Object.fromEntries(
      Object.entries(locales).map(([lng, checkoutForm]) => [
        lng,
        { checkoutForm }
      ])
    ),
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  })
);

describe("CheckoutForm expiry month/year placeholders", () => {
  const cases = [
    ["stripe", "updatePaymentSource"],
    ["cybersource", undefined]
  ];

  it.each(cases)(
    "keeps the English wording on English pages (%s)",
    async (processor, type) => {
      getSiteCardProcessor.mockReturnValue(processor);
      await i18n.changeLanguage("en");
      render(<CheckoutForm type={type} />);

      expect(screen.getByText("Exp Month *")).toBeTruthy();
      expect(screen.getByText("Exp Year *")).toBeTruthy();
    }
  );

  it.each(cases)(
    "shows German on German pages (%s)",
    async (processor, type) => {
      getSiteCardProcessor.mockReturnValue(processor);
      await i18n.changeLanguage("de");
      render(<CheckoutForm type={type} />);

      expect(screen.getByText("Ablaufmonat *")).toBeTruthy();
      expect(screen.getByText("Ablaufjahr *")).toBeTruthy();
      expect(screen.queryByText("Exp Month *")).toBeNull();
    }
  );
});

describe("checkoutForm translations", () => {
  it.each(Object.keys(locales))(
    "%s defines expMonth and expYear",
    (lng) => {
      expect(locales[lng].labels.expMonth).toEqual(
        expect.any(String)
      );
      expect(locales[lng].labels.expYear).toEqual(expect.any(String));
    }
  );
});
