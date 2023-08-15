import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  Update,
  UpdateWithSideEffect
} from "use-reducer-with-side-effects";
import { notify } from "../../SubComponents/Notification";
import {
  SET_IS_OPEN,
  CLOSE_DASHBOARD,
  SET_ACTIVE_DASHBOARD_LINK,
  SET_DISABLESUBMIT,
  SET_ADDRESSES,
  CANCEL_SUBSCRIPTION,
  REACTIVATE_SUBSCRIPTION,
  UNSUSPEND_SUBSCRIPTION
} from "../../utils/action-types";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

const initialState = {
  isOpen: false,
  activeDashboardLink: null,
  subscriptions: window.Pelcro.subscription.list(),
  giftRecipients: window.Pelcro.user.read()?.gift_recipients ?? [],
  disableSubmit: false,
  addresses: []
};
const store = createContext(initialState);
const { Provider } = store;

const DashboardContainer = ({
  onClose,
  style,
  className = "",
  children,
  ...props
}) => {
  const { t } = useTranslation("dashboard");
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

  useEffect(() => {
    dispatch({ type: SET_IS_OPEN, payload: true });

    window.Pelcro.insight.track("Modal Displayed", {
      name: "dashboard"
    });

    if (enableReactGA4) {
      ReactGA4.event("Dashboard Modal Viewed", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "VIEWS",
        action: "Dashboard Modal Viewed",
        nonInteraction: true
      });
    }

    const { addresses } = window.Pelcro.user.read();
    if (addresses)
      dispatch({ type: SET_ADDRESSES, payload: addresses });

    return () => {};
  }, []);

  /**
   *
   * @param {*} payload
   * @param {*} dispatch
   */
  const cancelSubscription = (
    { subscription_id, onSuccess, onFailure },
    dispatch
  ) => {
    window.Pelcro.subscription.cancel(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: subscription_id
      },
      (err, res) => {
        dispatch({ type: SET_DISABLESUBMIT, payload: false });
        if (err) {
          return onFailure?.(err);
        }

        if (enableReactGA4) {
          ReactGA4.event("Canceled", {
            nonInteraction: true
          });
        } else {
          ReactGA?.event?.({
            category: "ACTIONS",
            action: "Canceled",
            nonInteraction: true
          });
        }
        onSuccess?.(res);
      }
    );
  };

  /**
   *
   * @param {*} payload
   * @param {*} dispatch
   */
  const unSuspendSubscription = (
    { subscription_id, onSuccess, onFailure },
    dispatch
  ) => {
    window.Pelcro.subscription.update(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: subscription_id,
        suspend: 0
      },
      (err, res) => {
        dispatch({ type: SET_DISABLESUBMIT, payload: false });
        if (err) {
          return onFailure?.(err);
        }

        if (enableReactGA4) {
          ReactGA4.event("UnSuspended", {
            nonInteraction: true
          });
        } else {
          ReactGA?.event?.({
            category: "ACTIONS",
            action: "UnSuspended",
            nonInteraction: true
          });
        }
        onSuccess?.(res);
      }
    );
  };

  /**
   *
   * @param {*} payload
   * @param {*} dispatch
   */
  const reactivateSubscription = (
    { subscription_id, onSuccess, onFailure },
    dispatch
  ) => {
    window.Pelcro.subscription.reactivate(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: subscription_id
      },
      (err, res) => {
        dispatch({ type: SET_DISABLESUBMIT, payload: false });
        onClose();
        if (err) {
          onFailure?.(err);
          return notify.error(t("messages.subReactivation.error"));
        }
        onSuccess?.(res);
        return notify.success(t("messages.subReactivation.success"));
      }
    );
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_IS_OPEN:
          return Update({
            ...state,
            isOpen: action.payload
          });

        case CLOSE_DASHBOARD:
          return Update({
            ...state,
            isOpen: false,
            activeDashboardLink: null
          });

        case SET_ACTIVE_DASHBOARD_LINK:
          return Update({
            ...state,
            activeDashboardLink: action.payload
          });

        case SET_DISABLESUBMIT: {
          return Update({
            ...state,
            disableSubmit: action.payload
          });
        }

        case CANCEL_SUBSCRIPTION:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true },
            (state, dispatch) =>
              cancelSubscription(action.payload, dispatch)
          );

        case UNSUSPEND_SUBSCRIPTION:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true },
            (state, dispatch) =>
              unSuspendSubscription(action.payload, dispatch)
          );

        case REACTIVATE_SUBSCRIPTION:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true },
            (state, dispatch) =>
              reactivateSubscription(action.payload, dispatch)
          );

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-dashboard-container ${className}`}
    >
      <Provider value={{ state, dispatch }}>
        {children.length
          ? children.map((child, i) =>
              React.cloneElement(child, { store, key: i })
            )
          : React.cloneElement(children, { store })}
      </Provider>
    </div>
  );
};

export { DashboardContainer, store };
