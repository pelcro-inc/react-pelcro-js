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
    if (window.Pelcro.user.read()?.id) {
      callback(window.Pelcro.user.read());
    } else {
      window.document.addEventListener("PelcroUserLoaded", (e) => {
        callback(window.Pelcro.user.read());
      });
    }
  };
}
