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
import meter_en from "./translations/en/meter.json";
import meter_fr from "./translations/fr/meter.json";
import checkoutForm_en from "./translations/en/checkoutForm.json";
import checkoutForm_fr from "./translations/fr/checkoutForm.json";
import messages_en from "./translations/en/messages.json";
import messages_fr from "./translations/fr/messages.json";
import login_en from "./translations/en/login.json";
import login_fr from "./translations/fr/login.json";
import register_en from "./translations/en/register.json";
import register_fr from "./translations/fr/register.json";

const resources = {
  en_US: {
    common: common_en,
    paymentCreate: paymentCreate_en,
    newsletter: newsletter_en,
    success: success_en,
    meter: meter_en,
    checkoutForm: checkoutForm_en,
    messages: messages_en,
    login: login_en,
    register: register_en
  },
  fr_CA: {
    common: common_fr,
    paymentCreate: paymentCreate_fr,
    newsletter: newsletter_fr,
    success: success_fr,
    meter: meter_fr,
    checkoutForm: checkoutForm_fr,
    messages: messages_fr,
    login: login_fr,
    register: register_fr
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
