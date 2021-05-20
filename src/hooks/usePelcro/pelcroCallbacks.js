export class PelcroCallbacks {
  whenSiteReady = (callback) => {
    if (window.Pelcro.site.read()?.settings) {
      callback(window.Pelcro.site.read());
    } else {
      window.document.addEventListener("PelcroSiteLoaded", (e) => {
        callback(window.Pelcro.site.read());
      });
    }
  };

  whenUserReady = (callback) => {
    if (window.Pelcro.site.read()?.settings) {
      callback(window.Pelcro.site.read());
    } else {
      window.document.addEventListener("PelcroSiteLoaded", (e) => {
        callback(window.Pelcro.site.read());
      });
    }
  };
}
