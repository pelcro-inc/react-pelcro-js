import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import common_en from "./translations/en/common.json";
import paymentMethod_en from "./translations/en/paymentMethod.json";
import newsletter_en from "./translations/en/newsletter.json";
import success_en from "./translations/en/success.json";
import meter_en from "./translations/en/meter.json";
import checkoutForm_en from "./translations/en/checkoutForm.json";
import messages_en from "./translations/en/messages.json";
import login_en from "./translations/en/login.json";
import verifyLinkToken_en from "./translations/en/verifyLinkToken.json";
import register_en from "./translations/en/register.json";
import userEdit_en from "./translations/en/userEdit.json";
import address_en from "./translations/en/address.json";
import passwordReset_en from "./translations/en/passwordReset.json";
import passwordForgot_en from "./translations/en/passwordForgot.json";
import passwordChange_en from "./translations/en/passwordChange.json";
import passwordlessRequest_en from "./translations/en/passwordlessRequest.json";
import cart_en from "./translations/en/cart.json";
import shop_en from "./translations/en/shop.json";
import payment_en from "./translations/en/payment.json";
import dashboard_en from "./translations/en/dashboard.json";
import select_en from "./translations/en/select.json";
import donation_en from "./translations/en/donation.json";
import notification_en from "./translations/en/notification.json";
import verifyEmail_en from "./translations/en/verifyEmail.json";
import invoiceDetails_en from "./translations/en/InvoiceDetails.json";
import subscriptionCancel_en from "./translations/en/subscriptionCancel.json";
import subscriptionCancel_fr from "./translations/fr/subscriptionCancel.json";
import subscriptionCancel_ko from "./translations/ko/subscriptionCancel.json";
import subscriptionManageMembers_en from "./translations/en/subscriptionManageMembers.json";
import subscriptionManageMembers_fr from "./translations/fr/subscriptionManageMembers.json";
import subscriptionManageMembers_ko from "./translations/ko/subscriptionManageMembers.json";
import subscriptionSuspend_en from "./translations/en/subscriptionSuspend.json";

import common_fr from "./translations/fr/common.json";
import paymentMethod_fr from "./translations/fr/paymentMethod.json";
import newsletter_fr from "./translations/fr/newsletter.json";
import success_fr from "./translations/fr/success.json";
import meter_fr from "./translations/fr/meter.json";
import checkoutForm_fr from "./translations/fr/checkoutForm.json";
import messages_fr from "./translations/fr/messages.json";
import login_fr from "./translations/fr/login.json";
import verifyLinkToken_fr from "./translations/fr/verifyLinkToken.json";
import register_fr from "./translations/fr/register.json";
import userEdit_fr from "./translations/fr/userEdit.json";
import address_fr from "./translations/fr/address.json";
import passwordReset_fr from "./translations/fr/passwordReset.json";
import passwordForgot_fr from "./translations/fr/passwordForgot.json";
import passwordChange_fr from "./translations/fr/passwordChange.json";
import passwordlessRequest_fr from "./translations/fr/passwordlessRequest.json";
import cart_fr from "./translations/fr/cart.json";
import shop_fr from "./translations/fr/shop.json";
import payment_fr from "./translations/fr/payment.json";
import dashboard_fr from "./translations/fr/dashboard.json";
import select_fr from "./translations/fr/select.json";
import donation_fr from "./translations/fr/donation.json";
import notification_fr from "./translations/fr/notification.json";
import verifyEmail_fr from "./translations/fr/verifyEmail.json";
import invoiceDetails_fr from "./translations/fr/InvoiceDetails.json";
import subscriptionSuspend_fr from "./translations/fr/subscriptionSuspend.json";

import common_ko from "./translations/ko/common.json";
import paymentMethod_ko from "./translations/ko/paymentMethod.json";
import newsletter_ko from "./translations/ko/newsletter.json";
import success_ko from "./translations/ko/success.json";
import meter_ko from "./translations/ko/meter.json";
import checkoutForm_ko from "./translations/ko/checkoutForm.json";
import messages_ko from "./translations/ko/messages.json";
import login_ko from "./translations/ko/login.json";
import verifyLinkToken_ko from "./translations/ko/verifyLinkToken.json";
import register_ko from "./translations/ko/register.json";
import userEdit_ko from "./translations/ko/userEdit.json";
import address_ko from "./translations/ko/address.json";
import passwordReset_ko from "./translations/ko/passwordReset.json";
import passwordForgot_ko from "./translations/ko/passwordForgot.json";
import passwordChange_ko from "./translations/ko/passwordChange.json";
import passwordlessRequest_ko from "./translations/ko/passwordlessRequest.json";
import cart_ko from "./translations/ko/cart.json";
import shop_ko from "./translations/ko/shop.json";
import payment_ko from "./translations/ko/payment.json";
import dashboard_ko from "./translations/ko/dashboard.json";
import select_ko from "./translations/ko/select.json";
import donation_ko from "./translations/ko/donation.json";
import notification_ko from "./translations/ko/notification.json";
import verifyEmail_ko from "./translations/ko/verifyEmail.json";
import invoiceDetails_ko from "./translations/ko/InvoiceDetails.json";
import subscriptionSuspend_ko from "./translations/ko/subscriptionSuspend.json";

import common_es from "./translations/es/common.json";
import paymentMethod_es from "./translations/es/paymentMethod.json";
import newsletter_es from "./translations/es/newsletter.json";
import success_es from "./translations/es/success.json";
import meter_es from "./translations/es/meter.json";
import checkoutForm_es from "./translations/es/checkoutForm.json";
import messages_es from "./translations/es/messages.json";
import login_es from "./translations/es/login.json";
import verifyLinkToken_es from "./translations/es/verifyLinkToken.json";
import register_es from "./translations/es/register.json";
import userEdit_es from "./translations/es/userEdit.json";
import address_es from "./translations/es/address.json";
import passwordReset_es from "./translations/es/passwordReset.json";
import passwordForgot_es from "./translations/es/passwordForgot.json";
import passwordChange_es from "./translations/es/passwordChange.json";
import passwordlessRequest_es from "./translations/es/passwordlessRequest.json";
import cart_es from "./translations/es/cart.json";
import shop_es from "./translations/es/shop.json";
import payment_es from "./translations/es/payment.json";
import dashboard_es from "./translations/es/dashboard.json";
import select_es from "./translations/es/select.json";
import donation_es from "./translations/es/donation.json";
import notification_es from "./translations/es/notification.json";
import verifyEmail_es from "./translations/es/verifyEmail.json";
import invoiceDetails_es from "./translations/es/InvoiceDetails.json";
import subscriptionCancel_es from "./translations/es/subscriptionCancel.json";
import subscriptionSuspend_es from "./translations/es/subscriptionSuspend.json";

import { getPageOrDefaultLanguage } from "./utils/utils";

const resources = {
  en: {
    common: common_en,
    paymentMethod: paymentMethod_en,
    newsletter: newsletter_en,
    success: success_en,
    meter: meter_en,
    checkoutForm: checkoutForm_en,
    messages: messages_en,
    login: login_en,
    verifyLinkToken: verifyLinkToken_en,
    register: register_en,
    userEdit: userEdit_en,
    address: address_en,
    passwordReset: passwordReset_en,
    passwordForgot: passwordForgot_en,
    passwordChange: passwordChange_en,
    passwordlessRequest: passwordlessRequest_en,
    verifyEmail: verifyEmail_en,
    cart: cart_en,
    shop: shop_en,
    payment: payment_en,
    dashboard: dashboard_en,
    select: select_en,
    donation: donation_en,
    notification: notification_en,
    invoiceDetails: invoiceDetails_en,
    subscriptionCancel: subscriptionCancel_en,
    subscriptionSuspend: subscriptionSuspend_en,
    subscriptionManageMembers: subscriptionManageMembers_en
  },
  fr: {
    common: common_fr,
    paymentMethod: paymentMethod_fr,
    newsletter: newsletter_fr,
    success: success_fr,
    meter: meter_fr,
    checkoutForm: checkoutForm_fr,
    messages: messages_fr,
    login: login_fr,
    verifyLinkToken: verifyLinkToken_fr,
    register: register_fr,
    userEdit: userEdit_fr,
    address: address_fr,
    passwordReset: passwordReset_fr,
    passwordForgot: passwordForgot_fr,
    passwordChange: passwordChange_fr,
    passwordlessRequest: passwordlessRequest_fr,
    verifyEmail: verifyEmail_fr,
    cart: cart_fr,
    shop: shop_fr,
    payment: payment_fr,
    dashboard: dashboard_fr,
    select: select_fr,
    donation: donation_fr,
    notification: notification_fr,
    invoiceDetails: invoiceDetails_fr,
    subscriptionCancel: subscriptionCancel_fr,
    subscriptionSuspend: subscriptionSuspend_fr,
    subscriptionManageMembers: subscriptionManageMembers_fr
  },
  ko: {
    common: common_ko,
    paymentMethod: paymentMethod_ko,
    newsletter: newsletter_ko,
    success: success_ko,
    meter: meter_ko,
    checkoutForm: checkoutForm_ko,
    messages: messages_ko,
    login: login_ko,
    verifyLinkToken: verifyLinkToken_ko,
    register: register_ko,
    userEdit: userEdit_ko,
    address: address_ko,
    passwordReset: passwordReset_ko,
    passwordForgot: passwordForgot_ko,
    passwordChange: passwordChange_ko,
    passwordlessRequest: passwordlessRequest_ko,
    verifyEmail: verifyEmail_ko,
    cart: cart_ko,
    shop: shop_ko,
    payment: payment_ko,
    dashboard: dashboard_ko,
    select: select_ko,
    donation: donation_ko,
    notification: notification_ko,
    invoiceDetails: invoiceDetails_ko,
    subscriptionCancel: subscriptionCancel_ko,
    subscriptionSuspend: subscriptionSuspend_ko,
    subscriptionManageMembers: subscriptionManageMembers_ko
  },
  es: {
    common: common_es,
    paymentMethod: paymentMethod_es,
    newsletter: newsletter_es,
    success: success_es,
    meter: meter_es,
    checkoutForm: checkoutForm_es,
    messages: messages_es,
    login: login_es,
    verifyLinkToken: verifyLinkToken_es,
    register: register_es,
    userEdit: userEdit_es,
    address: address_es,
    passwordReset: passwordReset_es,
    passwordForgot: passwordForgot_es,
    passwordChange: passwordChange_es,
    passwordlessRequest: passwordlessRequest_es,
    verifyEmail: verifyEmail_es,
    cart: cart_es,
    shop: shop_es,
    payment: payment_es,
    dashboard: dashboard_es,
    select: select_es,
    donation: donation_es,
    notification: notification_es,
    invoiceDetails: invoiceDetails_es,
    subscriptionCancel: subscriptionCancel_es,
    subscriptionSuspend: subscriptionSuspend_es
  }
};

// set UI language to the page language or default to the language in site settings
const locale = getPageOrDefaultLanguage();

i18n
  .use(initReactI18next) // passes i18n down to react-i18next,
  .init({
    resources,
    lng: locale,
    fallbackLng: "en",
    // debug: true,
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      bindI18nStore: "added" // the key is 'bindI18nStore' not 'bindStore', the types are wrong
    }
  });

const pageLanguageObserver = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutationRecord) => {
    if (mutationRecord.attributeName === "lang") {
      i18n.changeLanguage(
        window.Pelcro.helpers.getHtmlLanguageAttribute()
      );
    }
  });
});

pageLanguageObserver.observe(document.documentElement, {
  attributes: true
});

export default i18n;
