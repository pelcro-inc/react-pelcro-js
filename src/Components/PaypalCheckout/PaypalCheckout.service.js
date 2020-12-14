import { getUserLatestAddress } from "../../utils/utils";

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
  static isPaypalEnabled = () => Boolean(this.braintreeToken);

  /**
   * Paypal client constructor
   * @param {paypalConstructorOptions} paypalClientConfig
   */
  constructor(paypalClientConfig) {
    this.client = null;
    this.paypalButton = null;
    this.product = null;
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

    this.product = options.product;

    const siteInfo = window.Pelcro.site.read();
    const defaultButtonStyle = {
      layout: "vertical",
      color: "gold",
      shape: "rect",
      label: "paypal"
    };

    this.paypalButton = window.paypal.Buttons({
      fundingSource: window.paypal.FUNDING.PAYPAL,
      // button locale
      locale: this.config.locale ?? siteInfo.default_locale,
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
        this.#onPaymentApprove(
          data,
          options?.onPaymentApprove?.(data)
        );
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
      console.log(payload);
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
    const siteInfo = window.Pelcro.site.read();

    // get user's shipping address
    const address = getUserLatestAddress();
    const billingWording = this.#getFormattedAmount(this.product);

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
      displayName: this.config.displayName ?? siteInfo.name,
      locale: this.config.locale ?? siteInfo.default_locale
    };
  };

  /**
   * Returns formatted billing amount text to a product/plan
   * @param {object} product pelcro product/plan
   * @return {string} formatted string
   * @example auto_renew === true => "CA$ 10.00 per 1 month"
   * @example auto_renew === false => "CA$ 10.00"
   */
  #getFormattedAmount = (product) => {
    const priceFormatted = product.amount_formatted;
    const autoRenewed = product.auto_renew;
    const { interval } = product;
    const intervalCount = product.interval_count;
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

export const initiatePaypalClient = () => {
  window.braintree.client
    .create({
      authorization: "sandbox_38ksghrh_jq3yssjrg22xkxfc"
    })
    .then(function (clientInstance) {
      // window.braintree.dataCollector
      //   .create({
      //     client: clientInstance,
      //     kount: true,
      //     paypal: true
      //   })
      //   .then(function (dataCollectorInstance) {
      //     var deviceDataInput = dataCollectorInstance.deviceData;
      //     console.log(deviceDataInput);
      //   })
      //   .catch(function (err) {
      //     console.log("Error on collecting Data " + err);
      //     // Handle error in data collector creation
      //   });
      // Create a PayPal Checkout component.
      return window.braintree.paypalCheckout.create({
        client: clientInstance
      });
    })
    .then(function (paypalCheckoutInstance) {
      return paypalCheckoutInstance.loadPayPalSDK({
        vault: true
      });
    })
    .then(function (paypalCheckoutInstance) {
      console.log(
        "🚀 ~ file: PaypalCheckout.service.js ~ line 120 ~ paypalCheckoutInstance",
        paypalCheckoutInstance
      );
      return window.paypal
        .Buttons({
          fundingSource: window.paypal.FUNDING.PAYPAL,

          createBillingAgreement: function () {
            const address = window.Pelcro.user.read().addresses?.[0];
            return paypalCheckoutInstance.createPayment({
              flow: "vault",
              // The following are optional params
              billingAgreementDescription:
                "Your agreement description",
              enableShippingAddress: true,
              shippingAddressOverride: {
                recipientName: address.first_name + address.last_name,
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                countryCode: address.country,
                postalCode: address.postalCode,
                state: address.state,
                phone: address.phone
              }
            });
          },

          onApprove: function (data, actions) {
            return paypalCheckoutInstance
              .tokenizePayment(data)
              .then(function (payload) {
                // Submit `payload.nonce` to your server
                alert(payload.nonce);
                console.log(payload.nonce);
              });
          },

          onCancel: function (data) {
            console.log(
              "PayPal payment cancelled",
              JSON.stringify(data, 0, 2)
            );
          },

          onError: function (err) {
            console.error("PayPal error", err);
          }
        })
        .render("#paypal-button");
    })
    .then(function () {
      // The PayPal button will be rendered in an html element with the ID
      // `paypal-button`. This function will be called when the PayPal button
      // is set up and ready to be used
    })
    .catch(function (err) {
      // Handle component creation error
    });
};
