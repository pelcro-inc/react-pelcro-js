import ReactGA from "react-ga";
import { usePelcroVanilla } from "../../../hooks/usePelcro";

class SaveToMetadataButtonClass {
  init() {
    if (window.Pelcro.user.read().metadata) {
      this.#markAllSavedButtons();
    } else {
      document.addEventListener("PelcroUserLoaded", () => {
        this.#markAllSavedButtons();
      });
    }

    this.#onClick(this.#saveToMetadata);
  }

  /**
   * Authenticated callback
   */
  authenticated = () => {
    this.#onClick(this.#saveToMetadata);
    this.#markAllSavedButtons();
  };

  /**
   * Unauthenticated callback
   */
  unauthenticated = () => {
    const { switchView } = usePelcroVanilla();

    this.#onClick(() => switchView("login"));
    this.#unmarkAllSavedButtons();
  };

  /**
   * PRIVATE METHODS
   */

  /**
   * Checks if the button content is already saved in user metadata
   * @param {HTMLButtonElement} button
   * @return {boolean}
   */
  #isAlreadySaved = (button) => {
    return button.classList.contains("pelcro-is-active");
  };

  /**
   * Inject loading state to the button
   * @param {HTMLButtonElement} button
   */
  #markButtonAsLoading = (button) => {
    button.classList.add("pelcro-is-loading");
    button.disabled = true;
  };

  /**
   * Remove loading state from the button
   * @param {HTMLButtonElement} button
   */
  #removeLoadingState = (button) => {
    button.classList.remove("pelcro-is-loading");
    button.disabled = false;
  };

  /**
   * Inject saved state to the button
   * @param {HTMLButtonElement} button
   */
  #markButtonAsSaved = (button) => {
    button.classList.add("pelcro-is-active");
    this.#removeLoadingState(button);
  };

  /**
   * Remove saved state from the button
   * @param {HTMLButtonElement} button
   */
  #unmarkSavedButton = (button) => {
    button.classList.remove("pelcro-is-active");
    this.#removeLoadingState(button);
  };

  /**
   * Inject saved state to all active buttons
   * @param {HTMLButtonElement} button
   */
  #markAllSavedButtons = () => {
    const userMetadataArray = Object.values(
      window.Pelcro.user.read().metadata ?? {}
    )?.flat();

    this.saveButtons.forEach((button) => {
      const buttonMetadata = button.dataset;

      userMetadataArray?.forEach((value) => {
        if (value?.title === buttonMetadata?.title) {
          this.#markButtonAsSaved(button);
        }
      });
    });
  };

  /**
   * Remove saved state from all buttons
   * @param {HTMLButtonElement} button
   */
  #unmarkAllSavedButtons = () => {
    this.saveButtons.forEach((button) => {
      this.#unmarkSavedButton(button);
    });
  };

  /**
   * Save button content to user metadata
   * @param {MouseEvent} event
   */
  #saveToMetadata = (event) => {
    const button = event.currentTarget;
    const user = window.Pelcro.user.read();
    const { key, ...buttonMetadata } = button.dataset;

    if (this.#isAlreadySaved(button)) {
      this.#removeMetaData(event);
      return;
    }

    let newMetadataValue = [buttonMetadata];
    // if this key already exist in user metadata object, append to it.
    const oldValue = user.metadata[`metadata_saved_${key}`];
    if (oldValue) {
      if (Array.isArray(oldValue)) {
        newMetadataValue = [...oldValue, buttonMetadata];
      } else {
        newMetadataValue = [oldValue, buttonMetadata];
      }
    }

    if (window.Pelcro.user.isAuthenticated()) {
      this.#markButtonAsLoading(button);
      window.Pelcro.user.saveToMetaData(
        {
          key: `saved_${key}`,
          value: newMetadataValue,
          auth_token: window.Pelcro.user.read().auth_token
        },
        (err, resp) => {
          if (err) {
            return this.#removeLoadingState(button);
          }

          this.#markButtonAsSaved(button);
          ReactGA?.event({
            category: "ACTIONS",
            action: "Save/Follow",
            label: buttonMetadata?.title
          });
        }
      );
    }
  };

  /**
   * Remove button content from user metadata
   * @param {MouseEvent} event
   */
  #removeMetaData = (event) => {
    const button = event.currentTarget;
    const user = window.Pelcro.user.read();
    const { key, title } = button.dataset;
    const oldValue = user.metadata[`metadata_saved_${key}`];

    const newMetadataValue = oldValue.filter(
      (metadata) => !(metadata?.title === title)
    );

    if (window.Pelcro.user.isAuthenticated()) {
      this.#markButtonAsLoading(button);
      window.Pelcro.user.saveToMetaData(
        {
          key: `saved_${key}`,
          value: newMetadataValue,
          auth_token: window.Pelcro.user.read().auth_token
        },
        (err, resp) => {
          if (err) {
            return this.#removeLoadingState(button);
          }

          this.#unmarkSavedButton(button);
          ReactGA?.event({
            category: "ACTIONS",
            action: "Unsave/Unfollow",
            label: title
          });
        }
      );
    }
  };

  /**
   * Set click handler on all save buttons
   * @param {function():void} callback
   */
  #onClick = (callback) => {
    this.saveButtons.forEach((button) => {
      button.onclick = callback;
    });
  };

  /**
   * Save buttons getter
   * @return {HTMLButtonElement[]} button elements
   */
  get saveButtons() {
    return Array.from(
      document.getElementsByClassName("pelcro-save-button")
    ).filter((button) => button.dataset.key);
  }
}

const saveToMetadataButton = new SaveToMetadataButtonClass();
export { saveToMetadataButton };
