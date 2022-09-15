/* eslint-disable import/no-unused-modules */

import { setupTests } from "../../../__tests__/testsSetup";
import {
  PaypalGateway,
  StripeGateway,
  Payment,
  PAYMENT_TYPES,
  VantivGateway,
  TapGateway
} from "./Payment.service";

beforeAll(() => {
  console.warn = () => {};
  console.debug = () => {};
  console.error = () => {};
  return setupTests();
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Initialize a subscription instance with the right gateway", () => {
  test("Should return an error if executed with no gateway instance at construction", () => {
    const subscription = new Payment();
    const mockCallback = jest.fn();

    subscription.execute(
      {
        type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
        token: "test_token",
        plan: { id: 123 },
        product: { id: 123 }
      },
      mockCallback
    );

    expect(mockCallback).toBeCalledWith(
      expect.objectContaining({
        error: expect.any(Error)
      }),
      null
    );
  });

  test("Should return an error if executed with an invalid gateway", () => {
    class BlaBlaGateway {
      execute() {
        return "Get to the Choppa!";
      }
    }

    const subscription = new Payment(new BlaBlaGateway());
    const mockCallback = jest.fn();

    subscription.execute(
      {
        type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
        token: "test_token",
        plan: { id: 123 },
        product: { id: 123 }
      },
      mockCallback
    );

    expect(mockCallback).toBeCalledWith(
      expect.objectContaining({
        error: expect.any(Error)
      }),
      null
    );
  });

  test("Should return an error if executed with no options", () => {
    const subscription = new Payment(new StripeGateway());
    const mockCallback = jest.fn();

    subscription.execute({}, mockCallback);

    expect(mockCallback).toBeCalledWith(
      expect.objectContaining({
        error: expect.any(Error)
      }),
      null
    );
  });

  test("Should not return an error if executed with a valid gateway and options", () => {
    const subscription = new Payment(new StripeGateway());
    const mockCallback = jest.fn();

    jest
      .spyOn(window.Pelcro.subscription, "create")
      .mockImplementation((_, callback) => callback());

    subscription.execute(
      {
        type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
        token: "test_token",
        plan: { id: 123 },
        product: { id: 123 }
      },
      mockCallback
    );

    expect(mockCallback).not.toBeCalledWith(
      expect.objectContaining({
        error: expect.any(Error)
      }),
      null
    );
  });
});

describe("Successfully create any type of subscription", () => {
  describe("Stripe gateway", () => {
    test("Should not execute given an invalid type of subscription", () => {
      const subscription = new Payment(new StripeGateway());
      const mockCallback = jest.fn();

      subscription.execute(
        {
          type: "BLA BLA INVALID TYPE",
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 },
          subscriptionIdToRenew: 123
        },
        mockCallback
      );

      expect(mockCallback).not.toBeCalled();
    });

    test("Should create a subscription", () => {
      const subscription = new Payment(new StripeGateway());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 }
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalledWith(
        expect.objectContaining({
          payment_gateway: "stripe",
          gateway_token: "test_token",
          plan_id: 123
        }),
        expect.anything()
      );
    });

    test("Should create a gift subscription", () => {
      const subscription = new Payment(new StripeGateway());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: PAYMENT_TYPES.CREATE_GIFTED_SUBSCRIPTION,
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 },
          giftRecipient: {
            email: "test@email.com",
            firstName: "Samuel",
            lastName: "Jackson",
            startDate: "2021-09-02",
            giftMessage: "Enjoy your gift"
          }
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalledWith(
        expect.objectContaining({
          payment_gateway: "stripe",
          gift_recipient_email: "test@email.com",
          gift_recipient_first_name: "Samuel",
          gift_recipient_last_name: "Jackson",
          gift_start_date: "2021-09-02",
          gift_message: "Enjoy your gift"
        }),
        expect.anything()
      );
    });

    test("Should renew a subscription", () => {
      const subscription = new Payment(new StripeGateway());

      jest
        .spyOn(window.Pelcro.subscription, "renew")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: PAYMENT_TYPES.RENEW_SUBSCRIPTION,
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 },
          subscriptionIdToRenew: 123
        },
        () => null
      );

      expect(window.Pelcro.subscription.renew).toBeCalledWith(
        expect.objectContaining({
          // TODO: migrate to payment_token
          stripe_token: "test_token",
          subscription_id: 123
        }),
        expect.anything()
      );
    });

    test("Should renew a gift subscription", () => {
      const subscription = new Payment(new StripeGateway());

      jest
        .spyOn(window.Pelcro.subscription, "renewGift")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: PAYMENT_TYPES.RENEW_GIFTED_SUBSCRIPTION,
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 },
          subscriptionIdToRenew: 123
        },
        () => null
      );

      expect(window.Pelcro.subscription.renewGift).toBeCalledWith(
        expect.objectContaining({
          // TODO: migrate to payment_token
          stripe_token: "test_token",
          plan_id: 123,
          subscription_id: 123
        }),
        expect.anything()
      );
    });
  });

  describe("PayPal gateway", () => {
    test("Should not execute given an invalid type of subscription", () => {
      const subscription = new Payment(new PaypalGateway());
      const mockCallback = jest.fn();

      subscription.execute(
        {
          type: "BLA BLA INVALID TYPE",
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 },
          subscriptionIdToRenew: 123
        },
        mockCallback
      );

      expect(mockCallback).not.toBeCalled();
    });

    test("Should create a subscription", () => {
      const subscription = new Payment(new PaypalGateway());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 }
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalledWith(
        expect.objectContaining({
          payment_gateway: "braintree",
          gateway_token: "test_token",
          plan_id: 123
        }),
        expect.anything()
      );
    });

    test("Should create a gift subscription", () => {
      const subscription = new Payment(new PaypalGateway());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: PAYMENT_TYPES.CREATE_GIFTED_SUBSCRIPTION,
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 },
          giftRecipient: {
            email: "test@email.com",
            firstName: "Samuel",
            lastName: "Jackson",
            startDate: "2021-09-02",
            giftMessage: "Enjoy your gift"
          }
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalledWith(
        expect.objectContaining({
          payment_gateway: "braintree",
          gift_recipient_email: "test@email.com",
          gift_recipient_first_name: "Samuel",
          gift_recipient_last_name: "Jackson",
          gift_start_date: "2021-09-02",
          gift_message: "Enjoy your gift"
        }),
        expect.anything()
      );
    });
  });

  describe("Vantiv gateway", () => {
    test("Should not execute given an invalid type of subscription", () => {
      const subscription = new Payment(new VantivGateway());
      const mockCallback = jest.fn();

      subscription.execute(
        {
          type: "BLA BLA INVALID TYPE",
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 },
          subscriptionIdToRenew: 123
        },
        mockCallback
      );

      expect(mockCallback).not.toBeCalled();
    });

    test("Should create a subscription", () => {
      const subscription = new Payment(new VantivGateway());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 }
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalledWith(
        expect.objectContaining({
          payment_gateway: "vantiv",
          gateway_token: "test_token",
          plan_id: 123
        }),
        expect.anything()
      );
    });
  });

  describe("Tap gateway", () => {
    test("Should not execute given an invalid type of subscription", () => {
      const subscription = new Payment(new TapGateway());
      const mockCallback = jest.fn();

      subscription.execute(
        {
          type: "BLA BLA INVALID TYPE",
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 },
          subscriptionIdToRenew: 123
        },
        mockCallback
      );

      expect(mockCallback).not.toBeCalled();
    });

    test("Should create a subscription", () => {
      const subscription = new Payment(new TapGateway());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
          token: "test_token",
          plan: { id: 123 },
          product: { id: 123 }
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalledWith(
        expect.objectContaining({
          payment_gateway: "tap",
          gateway_token: "test_token",
          plan_id: 123
        }),
        expect.anything()
      );
    });
  });
});
