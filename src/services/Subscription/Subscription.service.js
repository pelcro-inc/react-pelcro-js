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
  RENEW_GIFTED_SUBSCRIPTION: "RENEW_GIFTED_SUBSCRIPTION",
  PAY_INVOICE: "PAY_INVOICE"
};

export class Subscription {
  /**
   * Subscription service  constructor
   * @param {(StripeGateway|PaypalGateway|VantivGateway)} paymentGateway
   */
  constructor(paymentGateway) {
    if (this.#isPaymentGatewayInvalid(paymentGateway)) {
      this.paymentGateway = null;
      console.error("Incompatible subscription gateway");
    } else {
      this.paymentGateway = paymentGateway;
    }
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
   * @property {number} [quantity]
   * @property {string} addressId
   * @property {number} invoiceId
   * @property {boolean} isExistingSource
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

    // delegate execution to paymentgateway
    return this.paymentGateway.execute(options, callback);
  };

  /**
   * Check if payment gateway is valid
   * @param {any} gateway
   * @return {boolean}
   */
  #isPaymentGatewayInvalid = (gateway) => {
    return (
      gateway &&
      !(
        gateway instanceof StripeGateway ||
        gateway instanceof PaypalGateway ||
        gateway instanceof VantivGateway
      )
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

const PAYMENT_GATEWAYS_ENUM = {
  stripe: "stripe",
  paypal: "braintree",
  vantiv: "vantiv"
};

/**
 * Subscription Strategies
 */

/**
 * Stripe gateway strategy
 */
export class StripeGateway {
  #paymentGateway = PAYMENT_GATEWAYS_ENUM["stripe"];

  /**
   * Subscription execution method
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  execute = (options, callback) => {
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
      case types.PAY_INVOICE:
        return this.#payInvoice(options, callback);

      default:
        console.error(
          "Unsupported subscriptiion method: Stripe Gateway"
        );
    }
  };

  /**
   * Create a new subscription
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  #createSubscription = (options, callback) => {
    const {
      token,
      plan,
      couponCode,
      product,
      quantity = 1,
      addressId
    } = options;

    window.Pelcro.subscription.create(
      {
        quantity,
        gateway_token: token,
        payment_gateway: this.#paymentGateway,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        address_id: product.address_required ? addressId : null
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
      giftRecipient,
      quantity = 1,
      addressId
    } = options;

    window.Pelcro.subscription.create(
      {
        quantity,
        gateway_token: token,
        payment_gateway: this.#paymentGateway,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        gift_recipient_email: giftRecipient.email,
        gift_recipient_first_name: giftRecipient?.firstName,
        gift_recipient_last_name: giftRecipient?.lastName,
        gift_start_date: giftRecipient?.startDate,
        gift_message: giftRecipient?.giftMessage,
        address_id: product.address_required ? addressId : null
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
      product,
      addressId
    } = options;

    window.Pelcro.subscription.renew(
      {
        stripe_token: token,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        subscription_id: subscriptionIdToRenew,
        address_id: product.address_required ? addressId : null
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
      product,
      plan,
      couponCode,
      addressId
    } = options;

    window.Pelcro.subscription.renewGift(
      {
        stripe_token: token,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        subscription_id: subscriptionIdToRenew,
        address_id: product.address_required ? addressId : null
      },
      (err, res) => {
        callback(err, res);
      }
    );
  };

  #payInvoice = (options, callback) => {
    const { token, invoiceId } = options;

    const params = options.isExistingSource
      ? {
          source_id: token,
          invoice_id: invoiceId
        }
      : {
          payment_gateway: this.#paymentGateway,
          gateway_token: token,
          invoice_id: invoiceId
        };

    window.Pelcro.invoice.pay(params, (err, res) => {
      callback(err, res);
    });
  };
}

/**
 * Paypal gateway strategy
 */
export class PaypalGateway {
  #paymentGateway = PAYMENT_GATEWAYS_ENUM["paypal"];

  /**
   * Subscription execution method
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  execute = (options, callback) => {
    const types = SUBSCRIPTION_TYPES;

    switch (options.type) {
      case types.CREATE_SUBSCRIPTION:
        return this.#createSubscription(options, callback);
      case types.CREATE_GIFTED_SUBSCRIPTION:
        return this.#createGiftedSubscription(options, callback);
      case types.PAY_INVOICE:
        return this.#payInvoice(options, callback);

      default:
        console.error(
          "Unsupported subscriptiion method: PayPal Gateway"
        );
    }
  };

  /**
   * Create a new subscription
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  #createSubscription = (options, callback) => {
    const {
      token,
      plan,
      couponCode,
      product,
      quantity = 1,
      addressId
    } = options;

    window.Pelcro.subscription.create(
      {
        quantity,
        gateway_token: token,
        payment_gateway: this.#paymentGateway,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        address_id: product.address_required ? addressId : null
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
      giftRecipient,
      quantity = 1,
      addressId
    } = options;

    window.Pelcro.subscription.create(
      {
        quantity,
        gateway_token: token,
        payment_gateway: this.#paymentGateway,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        gift_recipient_email: giftRecipient.email,
        gift_recipient_first_name: giftRecipient?.firstName,
        gift_recipient_last_name: giftRecipient?.lastName,
        gift_start_date: giftRecipient?.startDate,
        gift_message: giftRecipient?.giftMessage,
        address_id: product.address_required ? addressId : null
      },
      (err, res) => {
        callback(err, res);
      }
    );
  };

  #payInvoice = (options, callback) => {
    const { token, invoiceId } = options;

    window.Pelcro.invoice.pay(
      {
        payment_gateway: this.#paymentGateway,
        gateway_token: token,
        invoice_id: invoiceId
      },
      (err, res) => {
        callback(err, res);
      }
    );
  };
}

export class VantivGateway {
  #paymentGateway = PAYMENT_GATEWAYS_ENUM["vantiv"];

  /**
   * Subscription execution method
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  execute = (options, callback) => {
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
      // TODO: implement paying invoices as well
      // case types.PAY_INVOICE:
      //   return this.#payInvoice(options, callback);

      default:
        console.error(
          "Unsupported subscriptiion method: vantiv Gateway"
        );
    }
  };

  /**
   * Create a new subscription
   * @param {subscriptionOptions} options subscription options
   * @param {executeCallback} callback
   * @return {void}
   */
  #createSubscription = (options, callback) => {
    const {
      token,
      plan,
      couponCode,
      product,
      quantity = 1,
      addressId,
      isExistingSource
    } = options;

    const params = isExistingSource
      ? {
          source_id: token
        }
      : {
          payment_gateway: this.#paymentGateway,
          gateway_token: token
        };

    window.Pelcro.subscription.create(
      {
        quantity,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        address_id: product.address_required ? addressId : null,
        ...params
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
      product,
      addressId,
      isExistingSource
    } = options;

    const params = isExistingSource
      ? {
          source_id: token
        }
      : {
          payment_gateway: this.#paymentGateway,
          gateway_token: token
        };

    window.Pelcro.subscription.renew(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        subscription_id: subscriptionIdToRenew,
        address_id: product.address_required ? addressId : null,
        ...params
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
      giftRecipient,
      quantity = 1,
      addressId,
      isExistingSource
    } = options;

    const params = isExistingSource
      ? {
          source_id: token
        }
      : {
          payment_gateway: this.#paymentGateway,
          gateway_token: token
        };

    window.Pelcro.subscription.create(
      {
        quantity,
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        gift_recipient_email: giftRecipient.email,
        gift_recipient_first_name: giftRecipient?.firstName,
        gift_recipient_last_name: giftRecipient?.lastName,
        gift_start_date: giftRecipient?.startDate,
        gift_message: giftRecipient?.giftMessage,
        address_id: product.address_required ? addressId : null,
        ...params
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
      product,
      plan,
      couponCode,
      addressId,
      isExistingSource
    } = options;

    const params = isExistingSource
      ? {
          source_id: token
        }
      : {
          payment_gateway: this.#paymentGateway,
          gateway_token: token
        };

    window.Pelcro.subscription.renewGift(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: couponCode,
        subscription_id: subscriptionIdToRenew,
        address_id: product.address_required ? addressId : null,
        ...params
      },
      (err, res) => {
        callback(err, res);
      }
    );
  };
}
