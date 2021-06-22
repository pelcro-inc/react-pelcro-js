export const setupTests = () => {
  return new Promise((resolve) => {
    // sdk.helpers.loadSDK expects a script to exist on body to append pelcro script tag after
    document.body.appendChild(document.createElement("script"));

    import("./downloads/pelcro-sdk.js");

    var Pelcro = window.Pelcro || (window.Pelcro = {});
    Pelcro.siteid = "85";
    Pelcro.environment = {};
    Pelcro.environment.stripe = "pk_test_aThAAdvPHgIdAziZweywBWNk";
    Pelcro.environment.domain = "https://staging.pelcro.com";
    Pelcro.environment.ui = "-";
    window.Pelcro.ENABLE_ECOMMERCE = true;

    document.addEventListener("PelcroSiteLoaded", () => {
      resolve();
    });
  });
};
