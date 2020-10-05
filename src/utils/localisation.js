import translations from "./translations";

const localisation = (view) => {
  const module = {};
  let locale = window.Pelcro.site.read().default_locale;

  if (!locale) locale = "en_US";
  const selectedLocale = translations[locale][view];

  module.getLocaleData = function () {
    return selectedLocale;
    // This will be available 'outside'.
    // Authy stuff that can be used outside...
  };

  return module;
};

/**
 * gets the the current locale wording object
 * @return {object} locale object
 */
export const getCurrentLocale = () => {
  const locale = window.Pelcro.site.read()?.default_locale;
  return translations[locale ?? "en_US"];
};

export default localisation;
