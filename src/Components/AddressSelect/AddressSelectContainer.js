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
  SHOW_ALERT
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const getDefaultAddress = (addresses) => {
  return addresses.find((address) => address.is_default);
};

const moveDefaultAddressToStart = (addresses) => {
  const defaultAddress = getDefaultAddress(addresses);
  const addressesWithoutDefault = addresses.filter(
    (address) => !address.is_default
  );

  return [defaultAddress, ...addressesWithoutDefault];
};

const initialState = {
  addresses: [],
  selectedAddressId: null,
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
  onGiftRedemptionSuccess = () => {},
  onMembershipAdressUpdateSuccess = () => {},
  onSuccess = () => {},
  onFailure = () => {},
  children,
  ...props
}) => {
  const { t } = useTranslation("address");
  const {
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

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SELECT_ADDRESS:
          return Update({
            ...state,
            selectedAddressId: action.payload
          });

        case LOAD_ADDRESSES:
          return Update({
            ...state,
            addresses: moveDefaultAddressToStart(action.payload),
            selectedAddressId: String(
              getDefaultAddress(action.payload).id
            )
          });

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
            (state, dispatch) => submitAddress(state, dispatch)
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
  }, []);

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
