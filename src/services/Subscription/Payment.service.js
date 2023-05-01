/**
 * @TODO: All payment related business logic should end up moving
 * to this service, and out of react components.
 */

/**
 * Enum for payment types
 * @readonly
 * @enum {string}
 */
export const PAYMENT_TYPES = {
  CREATE_SUBSCRIPTION: "CREATE_SUBSCRIPTION",
  CREATE_GIFTED_SUBSCRIPTION: "CREATE_GIFTED_SUBSCRIPTION",
  RENEW_SUBSCRIPTION: "RENEW_SUBSCRIPTION",
  RENEW_GIFTED_SUBSCRIPTION: "RENEW_GIFTED_SUBSCRIPTION",
  PURCHASE_ECOMMERCE_ORDER: "PURCHASE_ECOMMERCE_ORDER",
  PAY_INVOICE: "PAY_INVOICE"
};

export class Payment {
  /**
   * @param {(StripeGateway|PaypalGateway|VantivGateway|TapGateway|CybersourceGateway)} paymentGateway
   */
  constructor(paymentGateway) {
    if (this.#isPaymentGatewayInvalid(paymentGateway)) {
      this.paymentGateway = null;
      console.error("Incompatible payment gateway");
    } else {
      this.paymentGateway = paymentGateway;
    }
  }

  /**
   * @typedef paymentOptions
   * @property {PAYMENT_TYPES} type
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
   * @property {Array} items
   */

  /**
   * @callback executeCallback
   * @param  {object} error error object
   * @param  {object} response response object
   * @return {void}
   */

  /**
   * Payment execution method
   * @param {paymentOptions} options payment options
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
      return console.error("No payment type provided");
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
        gateway instanceof VantivGateway ||
        gateway instanceof TapGateway || 
        gateway instanceof CybersourceGateway
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
        "An error has occured in the payment service, please try again later"
      )
    };
  };
}

const PAYMENT_GATEWAYS_ENUM = {
  stripe: "stripe",
  paypal: "braintree",
  vantiv: "vantiv",
  tap: "tap",
  cybersource: "cybersource"
};

/**
 * Payment Strategies
 */

/**
 * Stripe gateway strategy
 */
export class StripeGateway {
  #paymentGateway = PAYMENT_GATEWAYS_ENUM["stripe"];

  /**
   * Payment execution method
   * @param {paymentOptions} options payment options
   * @param {executeCallback} callback
   * @return {void}
   */
  execute = (options, callback) => {
    const types = PAYMENT_TYPES;

    switch (options.type) {
      case types.CREATE_SUBSCRIPTION:
        return this.#createSubscription(options, callback);
      case types.RENEW_SUBSCRIPTION:
        return this.#renewSubscription(options, callback);
      case types.CREATE_GIFTED_SUBSCRIPTION:
        return this.#createGiftedSubscription(options, callback);
      case types.RENEW_GIFTED_SUBSCRIPTION:
        return this.#renewGiftedSubscription(options, callback);
      case types.PURCHASE_ECOMMERCE_ORDER:
        return this.#purchaseEcommerceOrder(options, callback);
      case types.PAY_INVOICE:
        return this.#payInvoice(options, callback);

      default:
        console.error("Unsupported payment method: Stripe Gateway");
    }
  };

  /**
   * Create a new subscription
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
        address_id: product.address_required ? addressId : null
      },
      (err, res) => {
        callback(err, res);
      }
    );
  };

  /**
   * Create a new gifted subscription
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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

  /**
   * purchase an Ecommerce order
   * @param {paymentOptions} options payment options
   * @param {executeCallback} callback
   * @return {void}
   */
  #purchaseEcommerceOrder = (options, callback) => {
    const { token, items, couponCode, addressId, isExistingSource } =
      options;

    const params = isExistingSource
      ? {
          source_id: token
        }
      : {
          payment_gateway: this.#paymentGateway,
          gateway_token: token
        };

    window.Pelcro.ecommerce.order.create(
      {
        items,
        coupon_code: couponCode,
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
        ...params,
        ...(addressId && { address_id: addressId })
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
   * Payment execution method
   * @param {paymentOptions} options payment options
   * @param {executeCallback} callback
   * @return {void}
   */
  execute = (options, callback) => {
    const types = PAYMENT_TYPES;

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
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * Payment execution method
   * @param {paymentOptions} options payment options
   * @param {executeCallback} callback
   * @return {void}
   */
  execute = (options, callback) => {
    const types = PAYMENT_TYPES;

    switch (options.type) {
      case types.CREATE_SUBSCRIPTION:
        return this.#createSubscription(options, callback);
      case types.RENEW_SUBSCRIPTION:
        return this.#renewSubscription(options, callback);
      case types.CREATE_GIFTED_SUBSCRIPTION:
        return this.#createGiftedSubscription(options, callback);
      case types.RENEW_GIFTED_SUBSCRIPTION:
        return this.#renewGiftedSubscription(options, callback);
      case types.PURCHASE_ECOMMERCE_ORDER:
        return this.#purchaseEcommerceOrder(options, callback);
      case types.PAY_INVOICE:
        return this.#payInvoice(options, callback);

      default:
        console.error("Unsupported payment method: vantiv Gateway");
    }
  };

  /**
   * Create a new subscription
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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

  /**
   * purchase an Ecommerce order
   * @param {paymentOptions} options payment options
   * @param {executeCallback} callback
   * @return {void}
   */
  #purchaseEcommerceOrder = (options, callback) => {
    const { token, items, couponCode, addressId, isExistingSource } =
      options;

    const params = isExistingSource
      ? {
          source_id: token
        }
      : {
          payment_gateway: this.#paymentGateway,
          gateway_token: token
        };

    window.Pelcro.ecommerce.order.create(
      {
        items,
        coupon_code: couponCode,
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
        ...params,
        ...(addressId && { address_id: addressId })
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
export class TapGateway {
  #paymentGateway = PAYMENT_GATEWAYS_ENUM["tap"];

  /**
   * Payment execution method
   * @param {paymentOptions} options payment options
   * @param {executeCallback} callback
   * @return {void}
   */
  execute = (options, callback) => {
    const types = PAYMENT_TYPES;

    switch (options.type) {
      case types.CREATE_SUBSCRIPTION:
        return this.#createSubscription(options, callback);
      case types.RENEW_SUBSCRIPTION:
        return this.#renewSubscription(options, callback);
      case types.CREATE_GIFTED_SUBSCRIPTION:
        return this.#createGiftedSubscription(options, callback);
      case types.RENEW_GIFTED_SUBSCRIPTION:
        return this.#renewGiftedSubscription(options, callback);
      case types.PURCHASE_ECOMMERCE_ORDER:
        return this.#purchaseEcommerceOrder(options, callback);
      case types.PAY_INVOICE:
        return this.#payInvoice(options, callback);

      default:
        console.error("Unsupported payment method: tap Gateway");
    }
  };

  /**
   * Create a new subscription
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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

  /**
   * purchase an Ecommerce order
   * @param {paymentOptions} options payment options
   * @param {executeCallback} callback
   * @return {void}
   */
  #purchaseEcommerceOrder = (options, callback) => {
    const { token, items, couponCode, addressId, isExistingSource } =
      options;

    const params = isExistingSource
      ? {
          source_id: token
        }
      : {
          payment_gateway: this.#paymentGateway,
          gateway_token: token
        };

    window.Pelcro.ecommerce.order.create(
      {
        items,
        coupon_code: couponCode,
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
        ...params,
        ...(addressId && { address_id: addressId })
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
 * Cybersource gateway strategy
 */
export class CybersourceGateway {
  #paymentGateway = PAYMENT_GATEWAYS_ENUM["cybersource"];

  /**
   * Payment execution method
   * @param {paymentOptions} options payment options
   * @param {executeCallback} callback
   * @return {void}
   */
  execute = (options, callback) => {
    const types = PAYMENT_TYPES;

    switch (options.type) {
      case types.CREATE_SUBSCRIPTION:
        return this.#createSubscription(options, callback);
      case types.RENEW_SUBSCRIPTION:
        return this.#renewSubscription(options, callback);
      case types.CREATE_GIFTED_SUBSCRIPTION:
        return this.#createGiftedSubscription(options, callback);
      case types.RENEW_GIFTED_SUBSCRIPTION:
        return this.#renewGiftedSubscription(options, callback);
      case types.PURCHASE_ECOMMERCE_ORDER:
        return this.#purchaseEcommerceOrder(options, callback);
      case types.PAY_INVOICE:
        return this.#payInvoice(options, callback);

      default:
        console.error("Unsupported payment method: cybersource Gateway");
    }
  };

  /**
   * Create a new subscription
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
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
   * @param {paymentOptions} options payment options
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

  /**
   * purchase an Ecommerce order
   * @param {paymentOptions} options payment options
   * @param {executeCallback} callback
   * @return {void}
   */
  #purchaseEcommerceOrder = (options, callback) => {
    const { token, items, couponCode, addressId, isExistingSource } =
      options;

    const params = isExistingSource
      ? {
          source_id: token
        }
      : {
          payment_gateway: this.#paymentGateway,
          gateway_token: token
        };

    window.Pelcro.ecommerce.order.create(
      {
        items,
        coupon_code: couponCode,
        campaign_key:
          window.Pelcro.helpers.getURLParameter("campaign_key"),
        ...params,
        ...(addressId && { address_id: addressId })
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
