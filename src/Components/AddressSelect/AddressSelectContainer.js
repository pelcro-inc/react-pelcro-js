import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  Update,
  UpdateWithSideEffect
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import { notify } from "../../SubComponents/Notification";
import {
  HANDLE_SUBMIT,
  LOADING,
  LOAD_ADDRESSES,
  SELECT_ADDRESS,
  SELECT_BILLING_ADDRESS,
  SHOW_ALERT
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const getDefaultShippingAddress = (addresses) => {
  return (
    addresses.find(
      (address) => address.type == "shipping" && address.is_default
    ) || false
  );
};

const getDefaultBillingAddress = (addresses) => {
  return (
    addresses.find(
      (address) => address.type == "billing" && address.is_default
    ) || false
  );
};

// const moveDefaultAddressToStart = (addresses) => {
//   const defaultAddress = getDefaultAddress(addresses);
//   const addressesWithoutDefault = addresses.filter(
//     (address) => !address.is_default
//   );

//   return [defaultAddress, ...addressesWithoutDefault];
// };

const initialState = {
  addresses: [],
  selectedAddressId: null,
  selectedBillingAddressId: null,
  isSubmitting: false,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const AddressSelectContainer = ({
  style,
  className = "",
  type = "shipping",
  onGiftRedemptionSuccess = () => {},
  onMembershipAdressUpdateSuccess = () => {},
  onSuccess = () => {},
  onFailure = () => {},
  children,
  ...props
}) => {
  const { t } = useTranslation("address");
  const {
    switchView,
    giftCode: giftCodeFromStore,
    subscriptionIdToRenew: subscriptionIdToRenewFromStore,
    set,
    selectedMembership
  } = usePelcro();
  const giftCode = props.giftCode ?? giftCodeFromStore;
  const subscriptionIdToRenew =
    props.subscriptionIdToRenew ??
    subscriptionIdToRenewFromStore ??
    undefined;

  const submitAddress = ({ selectedAddressId }, dispatch) => {
    set({ selectedAddressId });

    if (selectedMembership) {
      dispatch({ type: LOADING, payload: true });
      return window.Pelcro.membership.update(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          address_id: selectedAddressId,
          membership_id: selectedMembership.id
        },
        (err, res) => {
          dispatch({ type: LOADING, payload: false });

          if (err) {
            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
            return onFailure(err);
          }
          notify.success(t("messages.addressUpdated"));
          return onMembershipAdressUpdateSuccess(res);
        }
      );
    }

    if (giftCode) {
      dispatch({ type: LOADING, payload: true });
      return window.Pelcro.subscription.redeemGift(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          gift_code: giftCode,
          address_id: selectedAddressId,
          // redeem gift as a future phase of an existing subscription
          subscription_id: subscriptionIdToRenew
        },
        (err, res) => {
          dispatch({ type: LOADING, payload: false });

          if (err) {
            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
            return onFailure(err);
          }

          return onGiftRedemptionSuccess(res);
        }
      );
    }

    onSuccess(selectedAddressId);
  };

  const submitBillingAddress = (
    { selectedBillingAddressId },
    dispatch
  ) => {
    set({ selectedBillingAddressId });

    onSuccess(selectedBillingAddressId);
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SELECT_ADDRESS:
          return Update({
            ...state,
            selectedAddressId: action.payload
          });

        case SELECT_BILLING_ADDRESS:
          return Update({
            ...state,
            selectedBillingAddressId: action.payload
          });

        case LOAD_ADDRESSES:
          if (!getDefaultShippingAddress) {
            return switchView("address-select");
          } else if (!getDefaultBillingAddress) {
            return switchView("billing-address-select");
          } else {
            if (type == "shipping") {
              return Update({
                ...state,
                addresses: action.payload,
                selectedAddressId: String(
                  selectedMembership?.address_id ??
                    getDefaultShippingAddress(action.payload).id
                )
              });
            } else {
              return Update({
                ...state,
                addresses: action.payload,
                selectedBillingAddressId: String(
                  getDefaultBillingAddress(action.payload).id
                )
              });
            }
          }

        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        case LOADING:
          return Update({
            ...state,
            isSubmitting: action.payload
          });

        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, isSubmitting: true },
            (state, dispatch) =>
              type == "shipping"
                ? submitAddress(state, dispatch)
                : submitBillingAddress(state, dispatch)
          );

        default:
          return state;
      }
    },
    initialState
  );

  useEffect(() => {
    dispatch({
      type: LOAD_ADDRESSES,
      payload: window.Pelcro.user.read().addresses ?? []
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-address-select-container ${className}`}
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

export { AddressSelectContainer, store };
