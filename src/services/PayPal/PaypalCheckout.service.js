import {
  getFormattedPriceByLocal,
  getUserLatestAddress
} from "../../utils/utils";

/**
 * @typedef {Object} paypalConstructorOptions
 * @property {string} [buttonElementID=pelcro-paypal-button] element for paypal button to mount on
 * @property {boolean} [enableShippingAddress=true] enable using user shipping address
 * @property {boolean} [shippingAddressEditable=true] enable user to edit address
 * @property {string} [displayName] merchant display name,  default is client's site name
 * @property {string} [locale] flow locale, default is client's default locale
 * @property {string} [billingAgreementDescription] agreement paragraph shown to user, max 255 chars
 * @property {object} [style] button style
 */
export class PaypalClient {
  /**
   * @static
   * @return {boolean}
   */
  static isPaypalEnabled = () =>
    Boolean(window.Pelcro.site.read().braintree_tokenization);

  /**
   * Paypal client constructor
   * @param {paypalConstructorOptions} paypalClientConfig
   */
  constructor(paypalClientConfig) {
    this.client = null;
    this.paypalButton = null;
    this.product = null;
    this.amount = null;
    this.config = paypalClientConfig;
    this.braintreeToken = window.Pelcro.site.read().braintree_tokenization;
    this.isPaypalEnabled = PaypalClient.isPaypalEnabled();
  }

  /**
   * Builds PayPal checkout instance
   */
  build = async () => {
    if (!this.isPaypalEnabled) {
      console.error(
        "Braintree/Paypal integration is currently not enabled on this site's config"
      );

      return;
    }

    // initialize braintree/paypal clients
    const braintreeClient = await window.braintree.client.create({
      authorization: this.braintreeToken
    });

    const paypalCheckoutInstance = await window.braintree.paypalCheckout.create(
      {
        client: braintreeClient
      }
    );

    const paypalClient = await paypalCheckoutInstance.loadPayPalSDK({
      vault: true,
      intent: "tokenize"
    });

    this.client = paypalClient;
  };

  /**
   * @typedef {Object} paymentCreationOptions
   * @property {object} product e-commerce product / plan to checkout
   * @property {number} amount optional amount (has higher precidence over "amount" in product object)
   * @property {() => void} onButtonClick paypal button click callback
   * @property {(data: object) => void} onPaymentApprove payment approved callback
   * @property {(data: object) => void} onPaymentCancel payment cancelled callback
   * @property {(error: object) => void} onPaymentError payment error callback
   */

  /**
   * Builds PayPal checkout instance
   * @param {paymentCreationOptions} options
   * @return {void}
   */
  createPayment = (options) => {
    if (!this.client) {
      return console.error(
        "No PayPal instance found, initialize an instance using PaypalClient.build method"
      );
    }

    if (!options.product) {
      return console.error(
        "No product/plan selected, pass selected product/plan to PaypalClient.createPayment method"
      );
    }

    this.siteInfo = window.Pelcro.site.read();
    this.product = options.product;
    this.amount = options.amount;

    const defaultButtonStyle = {
      layout: "vertical",
      color: "gold",
      shape: "rect",
      label: "paypal"
    };

    this.paypalButton = window.paypal.Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL,
      // button locale
      locale: this.config.locale ?? this.siteInfo.default_locale,
      // button style
      style: this.config.style ?? defaultButtonStyle,
      // create payment handler
      createBillingAgreement: this.#createPayment,
      // paypal button click callback
      onClick: () => {
        options?.onButtonClick?.();
      },
      // payment approved callback
      onApprove: (data) => {
        this.#onPaymentApprove(data, options?.onPaymentApprove);
      },
      // payment canceled callback
      onCancel: (data) => {
        this.#onPaymentCancel(data);
        options?.onPaymentCancel?.(data);
      },
      // payment error callback
      onError: (error) => {
        this.#onPaymentError(error);
        options?.onPaymentError?.(error);
      }
    });
  };

  /**
   * Renders paypal button inside specified wrapper
   * @return {void}
   */
  render = () => {
    if (!this.paypalButton) {
      return console.error(
        "No payment request, create a payment before rendering the button using PaypalClient.createPayment method"
      );
    }

    this.paypalButton.render(
      `#${this.config.buttonElementID ?? "pelcro-paypal-button"}`
    );
  };

  /**
   * Private methods
   */

  /**
   * Payment creation handler, invoked on paypal button click
   * @return {void}
   */
  #createPayment = () => {
    return this.client.createPayment(this.#computePaymentOptions());
  };

  /**
   * payment approved callback
   * @param {object} data payment data
   * @param {function} [callback] optional callback function
   * @return {void}
   */
  #onPaymentApprove = (data, callback) => {
    return this.client.tokenizePayment(data).then((payload) => {
      callback?.(payload);
    });
  };

  /**
   * payment cancelled callback
   * @param {object} data
   */
  #onPaymentCancel = (data) => {
    console.log(
      "PayPal payment cancelled",
      JSON.stringify(data, 0, 2)
    );
  };

  /**
   * payment error callback
   * @param {object} error
   */
  #onPaymentError = (error) => {
    console.error("PayPal error", error);
  };

  /**
   * Helper methods
   */

  /**
   *
   * Computes and returns payment options for paypalClient.createPayment()
   * @return {object} payment options
   */
  #computePaymentOptions = () => {
    // get user's shipping address
    const address = getUserLatestAddress();
    const billingWording = this.#getFormattedAmount();

    return {
      flow: "vault",
      billingAgreementDescription:
        this.config.billingAgreementDescription ??
        `${this.product.nickname} - ${billingWording}`,

      enableShippingAddress:
        this.config.enableShippingAddress ?? true,

      shippingAddressOverride: this.config.enableShippingAddress
        ? {
            recipientName: address.first_name + address.last_name,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            countryCode: address.country,
            postalCode: address.postal_code,
            state: address.state,
            phone: address.phone
          }
        : undefined,

      shippingAddressEditable: this.config.shippingAddressEditable,
      displayName: this.config.displayName ?? this.siteInfo.name,
      locale: this.config.locale ?? this.siteInfo.default_locale
    };
  };

  /**
   * Returns formatted billing amount text to a product/plan
   * @return {string} formatted string
   * @example auto_renew === true => "CA$ 10.00 per 1 month"
   * @example auto_renew === false => "CA$ 10.00"
   */
  #getFormattedAmount = () => {
    const totalAmount = (this.product.quantity || 1) * this.amount;
    const priceFormatted = getFormattedPriceByLocal(
      totalAmount,
      this.product.currency,
      this.siteInfo.default_locale
    );

    const autoRenewed = this.product.auto_renew;
    const { interval, intervalCount } = this.product;

    const formattedInterval =
      intervalCount > 1
        ? `${intervalCount} ${interval}s`
        : `${interval}`;

    if (autoRenewed) {
      return `${priceFormatted} per ${formattedInterval}`;
    }

    return priceFormatted;
  };
}
