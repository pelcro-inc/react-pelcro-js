import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import common_fr from "./translations/fr/common.json";
import common_en from "./translations/en/common.json";
import paymentCreate_en from "./translations/en/paymentCreate.json";
import paymentCreate_fr from "./translations/fr/paymentCreate.json";
import newsletter_en from "./translations/en/newsletter.json";
import newsletter_fr from "./translations/fr/newsletter.json";
import success_en from "./translations/en/success.json";
import success_fr from "./translations/fr/success.json";

const resources = {
  en_US: {
    common: common_en,
    paymentCreate: paymentCreate_en,
    newsletter: newsletter_en,
    success: success_en
  },
  fr_CA: {
    common: common_fr,
    paymentCreate: paymentCreate_fr,
    newsletter: newsletter_fr,
    success: success_fr
  }
};

let locale = window.Pelcro.site.read().default_locale;

if (!locale) locale = "en_US";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next,
  .init({
    resources,
    lng: locale,
    // debug: true,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
