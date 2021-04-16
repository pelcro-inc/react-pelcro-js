class SaveToMetadataButtonClass {
  app = null;

  get saveButtons() {
    return Array.from(
      document.getElementsByClassName("pelcro-save-button")
    ).filter((button) => button.dataset.key);
  }

  init(app) {
    this.app = app;

    if (window.Pelcro.user.read().metadata) {
      this.#markAllSavedButtons();
    } else {
      document.addEventListener("PelcroUserLoaded", () => {
        this.#markAllSavedButtons();
      });
    }

    this.#onClick(this.#saveToMetadata);
  }

  authenticated = () => {
    this.#onClick(this.#saveToMetadata);
    this.#markAllSavedButtons();
  };

  unauthenticated = () => {
    this.#onClick(this.app.displayLoginView);
    this.#unmarkAllSavedButtons();
  };

  #isAlreadySaved = (button) => {
    return button.classList.contains("pelcro-is-active");
  };

  #markButtonAsLoading = (button) => {
    button.classList.add("pelcro-is-loading");
    button.disabled = true;
  };

  #markButtonAsSaved = (button) => {
    button.classList.add("pelcro-is-active");
    button.classList.remove("pelcro-is-loading");
    button.disabled = false;
  };

  #unmarkSavedButton = (button) => {
    button.classList.remove("pelcro-is-active");
    button.classList.remove("pelcro-is-loading");
    button.disabled = false;
  };

  #markAllSavedButtons = () => {
    const userMetadataArray = Object.values(
      window.Pelcro.user.read().metadata ?? {}
    )?.flat();

    this.saveButtons.forEach((button) => {
      const buttonMetadata = button.dataset;

      userMetadataArray?.forEach((value) => {
        if (value.title === buttonMetadata.title) {
          this.#markButtonAsSaved(button);
        }
      });
    });
  };

  #unmarkAllSavedButtons = () => {
    this.saveButtons.forEach((button) => {
      this.#unmarkSavedButton(button);
    });
  };

  #saveToMetadata = (e) => {
    const button = e.currentTarget;
    const user = window.Pelcro.user.read();
    const { key, ...buttonMetadata } = button.dataset;

    if (this.#isAlreadySaved(button)) {
      this.#removeMetaData(e);
      return;
    }

    let newMetadataValue = [buttonMetadata];
    // if this key already exist in user metadata object, append to it.
    if (user.metadata?.[`metadata_${key}`]) {
      const oldValue = user.metadata[`metadata_${key}`];

      if (Array.isArray(oldValue)) {
        newMetadataValue = [...oldValue, buttonMetadata];
      } else {
        newMetadataValue = [oldValue, buttonMetadata];
      }
    }

    console.log(newMetadataValue);
    if (window.Pelcro.user.isAuthenticated()) {
      this.#markButtonAsLoading(button);
      window.Pelcro.user.saveToMetaData(
        {
          key,
          value: newMetadataValue,
          auth_token: window.Pelcro.user.read().auth_token
        },
        (err, resp) => {
          this.#markButtonAsSaved(button);
        }
      );
    }
  };

  #removeMetaData = (e) => {
    const button = e.currentTarget;
    const user = window.Pelcro.user.read();
    const { key, title } = button.dataset;

    const oldValue = user.metadata[`metadata_${key}`];

    const newMetadataValue = oldValue.filter(
      (metadata) => !(metadata.title === title)
    );

    if (window.Pelcro.user.isAuthenticated()) {
      this.#markButtonAsLoading(button);
      window.Pelcro.user.saveToMetaData(
        {
          key,
          value: newMetadataValue,
          auth_token: window.Pelcro.user.read().auth_token
        },
        (err, resp) => {
          this.#unmarkSavedButton(button);
        }
      );
    }
  };

  #onClick = (callback) => {
    this.saveButtons.forEach((button) => {
      button.onclick = callback;
    });
  };
}

const saveToMetadataButton = new SaveToMetadataButtonClass();
export { saveToMetadataButton };
