export const hideError = id => {
  const el = document.getElementById(id);
  el.style.setProperty("display", "none", "important");
  el.firstElementChild.firstElementChild.innerText = "";
};

export const showError = (message, id) => {
  const el = document.getElementById(id);
  el.style.setProperty("display", "", "important");
  el.firstElementChild.firstElementChild.innerText = message;
};

export const hideSuccess = id => {
  const el = document.getElementById(id);
  el.style.setProperty("display", "none", "important");
  el.firstElementChild.firstElementChild.innerText = "";
};

export const showSuccess = (message, id) => {
  const el = document.getElementById(id);
  el.style.setProperty("display", "", "important");
  el.firstElementChild.firstElementChild.innerText = message;
};
