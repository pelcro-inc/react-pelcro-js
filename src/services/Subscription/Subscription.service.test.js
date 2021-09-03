/* eslint-disable import/no-unused-modules */

import { setupTests } from "../../../__tests__/testsSetup";
import {
  PaypalGateWay,
  StripeGateway,
  Subscription,
  SUBSCRIPTION_TYPES
} from "./Subscription.service";

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
    const subscription = new Subscription();
    const mockCallback = jest.fn();

    subscription.execute(
      {
        type: SUBSCRIPTION_TYPES.CREATE_SUBSCRIPTION,
        token: "test_token",
        plan: 123,
        product: 123
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

    const subscription = new Subscription(new BlaBlaGateway());
    const mockCallback = jest.fn();

    subscription.execute(
      {
        type: SUBSCRIPTION_TYPES.CREATE_SUBSCRIPTION,
        token: "test_token",
        plan: 123,
        product: 123
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
    const subscription = new Subscription(new StripeGateway());
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
    const subscription = new Subscription(new StripeGateway());
    const mockCallback = jest.fn();

    jest
      .spyOn(window.Pelcro.subscription, "create")
      .mockImplementation((_, callback) => callback());

    subscription.execute(
      {
        type: SUBSCRIPTION_TYPES.CREATE_SUBSCRIPTION,
        token: "test_token",
        plan: 123,
        product: 123
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
      const subscription = new Subscription(new StripeGateway());
      const mockCallback = jest.fn();

      subscription.execute(
        {
          type: "BLA BLA INVALID TYPE",
          token: "test_token",
          plan: 123,
          product: 123,
          subscription_id: 123
        },
        mockCallback
      );

      expect(mockCallback).not.toBeCalled();
    });

    test("Should create a subscription", () => {
      const subscription = new Subscription(new StripeGateway());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: SUBSCRIPTION_TYPES.CREATE_SUBSCRIPTION,
          token: "test_token",
          plan: 123,
          product: 123
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalled();
    });

    test("Should create a gift subscription", () => {
      const subscription = new Subscription(new StripeGateway());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: SUBSCRIPTION_TYPES.CREATE_GIFTED_SUBSCRIPTION,
          token: "test_token",
          plan: 123,
          product: 123,
          giftRecipient: {
            gift_recipient_email: "test@email.com",
            gift_recipient_first_name: "Samuel",
            gift_recipient_last_name: "Jackson"
          }
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalled();
    });

    test("Should renew a subscription", () => {
      const subscription = new Subscription(new StripeGateway());

      jest
        .spyOn(window.Pelcro.subscription, "renew")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: SUBSCRIPTION_TYPES.RENEW_SUBSCRIPTION,
          token: "test_token",
          plan: 123,
          product: 123,
          subscription_id: 123
        },
        () => null
      );

      expect(window.Pelcro.subscription.renew).toBeCalled();
    });

    test("Should renew a gift subscription", () => {
      const subscription = new Subscription(new StripeGateway());

      jest
        .spyOn(window.Pelcro.subscription, "renewGift")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: SUBSCRIPTION_TYPES.RENEW_GIFTED_SUBSCRIPTION,
          token: "test_token",
          plan: 123,
          product: 123,
          subscription_id: 123
        },
        () => null
      );

      expect(window.Pelcro.subscription.renewGift).toBeCalled();
    });
  });

  describe("PayPal gateway", () => {
    test("Should not execute given an invalid type of subscription", () => {
      const subscription = new Subscription(new PaypalGateWay());
      const mockCallback = jest.fn();

      subscription.execute(
        {
          type: "BLA BLA INVALID TYPE",
          token: "test_token",
          plan: 123,
          product: 123,
          subscription_id: 123
        },
        mockCallback
      );

      expect(mockCallback).not.toBeCalled();
    });

    test("Should create a subscription", () => {
      const subscription = new Subscription(new PaypalGateWay());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: SUBSCRIPTION_TYPES.CREATE_SUBSCRIPTION,
          token: "test_token",
          plan: 123,
          product: 123
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalled();
    });

    test("Should create a gift subscription", () => {
      const subscription = new Subscription(new PaypalGateWay());

      jest
        .spyOn(window.Pelcro.subscription, "create")
        .mockImplementation((_, callback) => callback());

      subscription.execute(
        {
          type: SUBSCRIPTION_TYPES.CREATE_GIFTED_SUBSCRIPTION,
          token: "test_token",
          plan: 123,
          product: 123,
          giftRecipient: {
            gift_recipient_email: "test@email.com",
            gift_recipient_first_name: "Samuel",
            gift_recipient_last_name: "Jackson"
          }
        },
        () => null
      );

      expect(window.Pelcro.subscription.create).toBeCalled();
    });
  });
});
