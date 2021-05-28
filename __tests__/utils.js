import { locallyUpdatePelcroSDK } from "./sdkDownloader.js";

export const setupTests = () => {
  return new Promise((resolve) => {
    locallyUpdatePelcroSDK(() => {
      import("./initPelcroSDK.js");

      document.addEventListener("PelcroSiteLoaded", () => {
        resolve();
      });
    });
  });
};
