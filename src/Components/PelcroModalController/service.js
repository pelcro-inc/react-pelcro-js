import { usePelcro } from "../../hooks/usePelcro";

export const initPaywalls = () => {
  const { switchView } = usePelcro.getState();

  const paywallMethods = window.Pelcro.paywall;

  if (window.Pelcro.subscription.isSubscribedToSite()) {
    return;
  }

  if (paywallMethods?.displayMeterPaywall()) {
    switchView("meter");
  } else if (paywallMethods?.displayNewsletterPaywall()) {
    switchView("newsletter");
  } else if (paywallMethods?.displayPaywall()) {
    switchView("select");
  }
};
