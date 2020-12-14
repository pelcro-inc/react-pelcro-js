/**
 * @TODO: All subscription related business logic should end up moving
 * to this service, and out of react components.
 */

/**
 * Enum for subscription types
 * @readonly
 * @enum {string}
 */
export const SUBSCRIPTION_TYPES = {
  CREATE_SUBSCRIPTION: "CREATE_SUBSCRIPTION",
  CREATE_GIFTED_SUBSCRIPTION: "CREATE_GIFTED_SUBSCRIPTION",
  RENEW_SUBSCRIPTION: "RENEW_SUBSCRIPTION",
  RENEW_GIFTED_SUBSCRIPTION: "RENEW_GIFTED_SUBSCRIPTION"
};

import { getUserLatestAddress } from "../../utils/utils";

export class Subscription {
  /**
   * Subscription service  constructor
   * @param {("paypal"|"stripe")} paymentGateway
   */
  constructor(paymentGateway) {
    const PAYMENT_GATEWAYS_ENUM = {
      stripe: "stripe",
      paypal: "braintree"
    };

    this.paymentGateway = PAYMENT_GATEWAYS_ENUM[paymentGateway];
  }

  /**
   * @typedef subscriptionOptions
   * @property {SUBSCRIPTION_TYPES} type
   * @property {string} token
   * @property {object} plan
   * @property {object} [product]
   * @property {object} [couponCode]
   * @property {object} [giftRecipient]
   * @property {number} [subscriptionIdToRenew]
   */

  /**
   * @callback executeCallback
   * @param  {object} error error object
   * @param  {object} response response object
   * @return {void}
   */

  /**
   * Subscription execution method
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  execute = (options, callback) => {
    if (!this.paymentGateway) {
      callback(this.#generateUserError(), null);
      return console.error("No payment gateway provided");
    }

    if (!options.type) {
      callback(this.#generateUserError(), null);
      return console.error("No subscription type provided");
    }

    const types = SUBSCRIPTION_TYPES;

    switch (options.type) {
      case types.CREATE_SUBSCRIPTION:
        return this.#createSubscription(options, callback);
      case types.RENEW_SUBSCRIPTION:
        return this.#renewSubscription(options, callback);
      case types.CREATE_GIFTED_SUBSCRIPTION:
        return this.#createGiftedSubscription(options, callback);
      case types.RENEW_GIFTED_SUBSCRIPTION:
        return this.#renewGiftedSubscription(options, callback);

      default:
        console.error("Invalid subscription type given");
    }
  };

  /**
   * Create a new subscription
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  #createSubscription = (options, callback) => {
    const { token, plan, couponCode, product } = options;

    window.Pelcro.subscription.create(
      {
        gateway_token: token,
        payment_gateway: this.paymentGateway,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        address_id: product.address_required
          ? getUserLatestAddress().id
          : null
      },
      (err, res) => {
        callback(err, res);
      }
    );
  };

  /**
   * Create a new gifted subscription
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  #createGiftedSubscription = (options, callback) => {
    const {
      token,
      plan,
      couponCode,
      product,
      giftRecipient
    } = options;

    window.Pelcro.subscription.create(
      {
        gateway_token: token,
        payment_gateway: this.paymentGateway,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        gift_recipient_email: giftRecipient.email,
        gift_recipient_first_name: giftRecipient?.firstName,
        gift_recipient_last_name: giftRecipient?.lastName,
        address_id: product.address_required
          ? getUserLatestAddress().id
          : null
      },
      (err, res) => {
        callback(err, res);
      }
    );
  };

  /**
   * Renews a subscription
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  #renewSubscription = (options, callback) => {
    const {
      subscriptionIdToRenew,
      token,
      plan,
      couponCode,
      product
    } = options;

    window.Pelcro.subscription.renew(
      {
        gateway_token: token,
        payment_gateway: this.paymentGateway,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        subscription_id: subscriptionIdToRenew,
        address_id: product.address_required
          ? getUserLatestAddress().id
          : null
      },
      (err, res) => {
        callback(err, res);
      }
    );
  };

  /**
   * Renews a gifted subscription
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  #renewGiftedSubscription = (options, callback) => {
    const {
      subscriptionIdToRenew,
      token,
      plan,
      couponCode
    } = options;

    window.Pelcro.subscription.renewGift(
      {
        gateway_token: token,
        payment_gateway: this.paymentGateway,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        subscription_id: subscriptionIdToRenew
      },
      (err, res) => {
        callback(err, res);
      }
    );
  };

  /**
   * Generates a generic error for payment modal
   * @return {Object} error object
   */
  #generateUserError = () => {
    return {
      error: new Error(
        "An error has occured in the subscription service, please try again later"
      )
    };
  };
}
