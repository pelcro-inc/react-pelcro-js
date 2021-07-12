/* eslint-disable import/no-unused-modules */
import * as React from "react";
import { render, act } from "@testing-library/react";
import { usePelcro as usePelcroHook } from "./index.js";
import { PelcroActions } from "./pelcroActions";
import { setupTests } from "../../../__tests__/testsSetup.js";

const usePelcro = () => {
  const returnVal = {};
  const TestComponent = () => {
    Object.assign(returnVal, usePelcroHook());
    return null;
  };

  render(<TestComponent />);
  return returnVal;
};

beforeAll(() => {
  console.warn = () => {};
  console.debug = () => {};
  return setupTests();
});

beforeEach(() => {
  jest.resetAllMocks();
  act(() => {
    const defaultPelcroActions = new PelcroActions(
      usePelcroHook.setState,
      usePelcroHook.getState
    );

    // reset store state and actions before every test
    usePelcro().resetView();
    usePelcro().set({ cartItems: [] });
    usePelcro().set({ ...defaultPelcroActions });
  });
});

describe("Returns the store with the correct initial state", () => {
  test("react hook", () => {
    const store = usePelcro();

    // assert initial state
    expect(store.view).toEqual(null);
    expect(store.product).toEqual(null);
    expect(store.plan).toEqual(null);
    expect(store.isGift).toEqual(false);
    expect(store.isRenewingGift).toEqual(false);
    expect(store.giftCode).toEqual("");
    expect(store.subscriptionIdToRenew).toEqual(null);
    expect(store.cartItems).toEqual([]);
    expect(store.order).toEqual(null);
    expect(store.selectedAddressId).toEqual(null);
    expect(store.addressIdToEdit).toEqual(null);
    expect(store.selectedPaymentMethodId).toEqual(null);
  });

  test("getStore API", () => {
    const store = usePelcroHook.getStore();

    // assert initial state
    expect(store.view).toEqual(null);
    expect(store.product).toEqual(null);
    expect(store.plan).toEqual(null);
    expect(store.isGift).toEqual(false);
    expect(store.isRenewingGift).toEqual(false);
    expect(store.giftCode).toEqual("");
    expect(store.subscriptionIdToRenew).toEqual(null);
    expect(store.cartItems).toEqual([]);
    expect(store.order).toEqual(null);
    expect(store.selectedAddressId).toEqual(null);
    expect(store.addressIdToEdit).toEqual(null);
    expect(store.selectedPaymentMethodId).toEqual(null);
  });
});

describe("usePelcro.override", () => {
  test("should override default implementation of store methods", () => {
    const store = usePelcroHook.getStore();
    // try to customize switchView logic
    act(() => {
      usePelcroHook.override((set, get) => {
        return {
          switchView: (view) => {
            if (view === "login") {
              set({ view: null });
            }
          }
        };
      });
    });

    act(() => {
      store.switchView("login");
    });

    expect(store.view).toEqual(null);
  });
});

describe("State setter", () => {
  test("set should update current state", () => {
    const store = usePelcro();

    act(() => {
      store.set({ selectedAddressId: 1234, isGift: true });
    });

    expect(store.selectedAddressId).toEqual(1234);
    expect(store.isGift).toEqual(true);
  });

  test("resetState should reset all state", () => {
    const store = usePelcro();

    act(() => {
      store.set({ selectedAddressId: 1234, isGift: true });
    });

    act(() => {
      store.resetState();
    });

    expect(store.selectedAddressId).toEqual(null);
    expect(store.isGift).toEqual(false);
  });
});

describe("Actions", () => {
  describe("switchView", () => {
    test("switchView should change the view state", () => {
      const store = usePelcro();

      act(() => {
        store.switchView("plan-select");
      });

      expect(store.view).toEqual("plan-select");
    });

    test("switchView('dashboard') should switch to login view when user is not authenticated", () => {
      const store = usePelcro();

      act(() => {
        store.switchView("dashboard");
      });

      expect(store.view).toEqual("login");
    });

    test("switchView('password-change') should switch to login view when is user not authenticated", () => {
      const store = usePelcro();

      act(() => {
        store.switchView("password-change");
      });

      expect(store.view).toEqual("login");
    });

    test("switchView('login') should switch to dashboard view when user is authenticated", () => {
      const store = usePelcro();
      act(() => {
        store.set({ isAuthenticated: () => true });
      });

      act(() => {
        store.switchView("login");
      });

      expect(store.view).toEqual("dashboard");
    });

    test("switchView('register') should switch to dashboard view when user is authenticated", () => {
      const store = usePelcro();
      act(() => {
        store.set({ isAuthenticated: () => true });
      });

      act(() => {
        store.switchView("register");
      });

      expect(store.view).toEqual("dashboard");
    });
  });

  describe("setProduct", () => {
    test("should set the product by id", () => {
      const testProduct = {
        id: 1234,
        name: "test-product",
        plans: [
          {
            id: 45184,
            nickname: "test-plan"
          }
        ]
      };

      jest
        .spyOn(window.Pelcro.product, "list")
        .mockImplementation(() => [testProduct]);

      const store = usePelcro();

      act(() => {
        store.setProduct(1234);
      });

      expect(store.product).toEqual(testProduct);
    });
  });

  describe("setPlan", () => {
    test("should set the plan by id", () => {
      const testProduct = {
        id: 1234,
        name: "test-product",
        plans: [
          {
            id: 45184,
            nickname: "test-plan"
          }
        ]
      };

      jest
        .spyOn(window.Pelcro.product, "list")
        .mockImplementation(() => [testProduct]);

      const store = usePelcro();

      act(() => {
        store.setPlan(45184);
      });

      expect(store.plan).toEqual(testProduct.plans[0]);
    });
  });

  describe("resetView", () => {
    test("resetView should reset view state", () => {
      const store = usePelcro();

      act(() => {
        store.switchView("plan-select");
      });

      act(() => {
        store.resetView();
      });

      expect(store.view).toEqual(null);
    });
  });

  describe("switchToPaymentView", () => {
    test("switch to payment-method-select view when the user has existing payment methods", () => {
      // test setup
      jest
        .spyOn(window.Pelcro.user, "read")
        .mockImplementation(() => ({
          sources: [{ id: "source-1" }]
        }));
      // test setup end

      const store = usePelcro();
      act(() => {
        store.set({
          product: { id: 1234 }
        });
      });

      act(() => {
        store.switchToPaymentView();
      });

      expect(store.view).toEqual("payment-method-select");
    });

    test("switch to the suitable checkout form when the user has no existing payment methods", () => {
      // test setup
      jest
        .spyOn(window.Pelcro.user, "read")
        .mockImplementation(() => ({
          sources: []
        }));
      // test setup end

      const store = usePelcro();
      act(() => {
        store.set({ product: { id: 1234 } });
      });

      act(() => {
        store.switchToPaymentView();
      });

      expect(store.view).toEqual("subscription-create");
    });
  });

  describe("switchToCheckoutForm", () => {
    test("switch to subscription-create view when there is a selected product", () => {
      const store = usePelcro();
      act(() => {
        store.set({ product: { id: 1234 } });
      });

      act(() => {
        store.switchToCheckoutForm();
      });

      expect(store.view).toEqual("subscription-create");
    });

    test("switch to subscription-renew view when there is a selected product and a subscriptionIdToRenew", () => {
      const store = usePelcro();
      act(() => {
        store.set({
          product: { id: 1234 },
          subscriptionIdToRenew: 12345
        });
      });

      act(() => {
        store.switchToCheckoutForm();
      });

      expect(store.view).toEqual("subscription-renew");
    });

    test("switch to order-create view when there is an order", () => {
      const store = usePelcro();
      act(() => {
        store.set({ order: [{ id: "test-item" }] });
      });

      act(() => {
        store.switchToCheckoutForm();
      });

      expect(store.view).toEqual("order-create");
    });

    test("reset the view to when there is neither a product nor items in the cart", () => {
      const store = usePelcro();

      act(() => {
        store.switchToCheckoutForm();
      });

      expect(store.view).toEqual(null);
    });
  });

  describe("switchToAddressView", () => {
    test("switch to address creation view when the user doesn't have any address", () => {
      console.log("useerrrrr", Pelcro.user.read());
      const store = usePelcro();

      act(() => {
        store.switchToAddressView();
      });

      expect(store.view).toEqual("address-create");
    });

    test("switch to address-select when the user has at least one address", () => {
      const store = usePelcro();
      jest
        .spyOn(window.Pelcro.user, "read")
        .mockImplementation(() => ({
          addresses: [{ id: "test-address" }]
        }));

      act(() => {
        store.switchToAddressView();
      });

      expect(store.view).toEqual("address-select");
    });
  });

  describe("logout", () => {
    test("should reset all state and switch to the login view", () => {
      const store = usePelcro();
      const originalSwitchView = store.switchView;

      // test setup
      jest
        // don't actually call the sdk method
        .spyOn(window.Pelcro.user, "logout")
        .mockImplementation(() => {});
      act(() => {
        // temporarily remove the view switching guards
        store.set({ switchView: (view) => store.set({ view }) });
      });
      // test setup end

      act(() => {
        store.set({
          selectedAddressId: 1234,
          isGift: true,
          isAuthenticated: () => true
        });
      });

      act(() => {
        store.logout();
      });

      expect(store.selectedAddressId).toEqual(null);
      expect(store.isGift).toEqual(false);
      expect(store.view).toEqual("login");

      act(() => {
        store.set({
          switchView: originalSwitchView
        });
      });
    });

    test("should do nothing if user is already not authenticated", () => {
      const store = usePelcro();

      act(() => {
        store.set({
          selectedAddressId: 1234,
          isGift: true,
          isAuthenticated: () => false
        });
      });

      act(() => {
        store.logout();
      });

      expect(store.selectedAddressId).toEqual(1234);
      expect(store.isGift).toEqual(true);
    });
  });

  describe("addToCart", () => {
    test("should add new item", () => {
      const testSku = {
        currency: "cad",
        id: 34,
        image:
          "https://uploads.pelcro.com/images/site/ecommerce/product/sku/image/random.jpeg",
        name: "Model 1",
        price: 1000,
        product_id: 1522
      };

      jest
        .spyOn(window.Pelcro.ecommerce.products, "getBySkuId")
        .mockImplementation(() => testSku);

      const store = usePelcro();

      act(() => {
        store.addToCart(testSku.id);
      });

      expect(store.cartItems[0]).toEqual({ ...testSku, quantity: 1 });
    });

    test("should increase quantity of item if it already exists", () => {
      const testSku = {
        currency: "cad",
        id: 34,
        image:
          "https://uploads.pelcro.com/images/site/ecommerce/product/sku/image/random.jpeg",
        name: "Model 1",
        price: 1000,
        product_id: 1522
      };

      jest
        .spyOn(window.Pelcro.ecommerce.products, "getBySkuId")
        .mockImplementation(() => testSku);

      const store = usePelcro();

      act(() => {
        store.addToCart(testSku.id);
        store.addToCart(testSku.id);
      });

      expect(store.cartItems[0]).toEqual({
        ...testSku,
        quantity: 2
      });
    });

    test("should not add the item if the id is invalid", () => {
      const invalidSkuId = 999;
      jest
        .spyOn(window.Pelcro.ecommerce.products, "getBySkuId")
        .mockImplementation(() => null);
      // suppress real errors
      jest.spyOn(console, "error").mockImplementation(() => {});

      const store = usePelcro();

      act(() => {
        store.addToCart(invalidSkuId);
      });

      expect(store.cartItems.length).toEqual(0);
    });
  });

  describe("removeFromCart", () => {
    test("should remove item from cart if the quantity is only 1", () => {
      const testSku = {
        currency: "cad",
        id: 34,
        image:
          "https://uploads.pelcro.com/images/site/ecommerce/product/sku/image/random.jpeg",
        name: "Model 1",
        price: 1000,
        product_id: 1522
      };
      const store = usePelcro();

      act(() => {
        store.set({ cartItems: [{ ...testSku, quantity: 1 }] });
        store.removeFromCart(testSku.id);
      });

      expect(store.cartItems.length).toEqual(0);
    });

    test("should decrease quantity of item if it quantity is more than 1", () => {
      const testSku = {
        currency: "cad",
        id: 34,
        image:
          "https://uploads.pelcro.com/images/site/ecommerce/product/sku/image/random.jpeg",
        name: "Model 1",
        price: 1000,
        product_id: 1522
      };
      const store = usePelcro();

      act(() => {
        store.set({ cartItems: [{ ...testSku, quantity: 2 }] });
        store.removeFromCart(testSku.id);
      });

      expect(store.cartItems[0]).toEqual({
        ...testSku,
        quantity: 1
      });
    });

    test("should not remove anything if the id is invalid", () => {
      // suppress real errors
      jest.spyOn(console, "error").mockImplementation(() => {});

      const testSku = {
        currency: "cad",
        id: 34,
        image:
          "https://uploads.pelcro.com/images/site/ecommerce/product/sku/image/random.jpeg",
        name: "Model 1",
        price: 1000,
        product_id: 1522
      };
      const store = usePelcro();
      const invalidSkuId = 999;

      act(() => {
        store.set({ cartItems: [{ ...testSku, quantity: 1 }] });
        store.removeFromCart(invalidSkuId);
      });

      expect(store.cartItems[0]).toEqual({
        ...testSku,
        quantity: 1
      });
    });
  });

  describe("purchaseItem", () => {
    test("should create an order for this single item", () => {
      const testSku = {
        currency: "cad",
        id: 34,
        image:
          "https://uploads.pelcro.com/images/site/ecommerce/product/sku/image/random.jpeg",
        name: "Model 1",
        price: 1000,
        product_id: 1522
      };

      jest
        .spyOn(window.Pelcro.ecommerce.products, "getBySkuId")
        .mockImplementation(() => testSku);

      const store = usePelcro();

      act(() => {
        store.purchaseItem(testSku.id);
      });

      expect(store.order).toEqual({ ...testSku, quantity: 1 });
    });

    test("should not order item if the sku id is invalid", () => {
      // suppress real errors
      jest.spyOn(console, "error").mockImplementation(() => {});

      const invalidSkuId = 999;
      jest
        .spyOn(window.Pelcro.ecommerce.products, "getBySkuId")
        .mockImplementation(() => null);

      const store = usePelcro();

      act(() => {
        store.purchaseItem(invalidSkuId);
      });

      expect(store.order).toBeNull;
    });
  });
});

describe("Event callbacks", () => {
  describe("whenSiteReady should call the callback method with the site object", () => {
    test("waits for the event", (done) => {
      // test setup
      // mock as if site isn't loaded yet
      const spy = jest
        .spyOn(window.Pelcro.site, "read")
        .mockImplementation(() => undefined);

      setTimeout(() => {
        // mock dispatching PelcroSiteLoaded event
        document.dispatchEvent(new Event("PelcroSiteLoaded"));
        // restore site object
        spy.mockRestore();
      });
      // test setup end

      const store = usePelcro();

      let siteObject = null;
      store.whenSiteReady((site) => {
        siteObject = site;

        expect(siteObject).not.toBeNull();
        done();
      });
    });

    test("site is already loaded", (done) => {
      // test setup
      jest
        .spyOn(window.Pelcro.site, "read")
        .mockImplementation(() => ({
          settings: { id: "test-site" }
        }));

      let siteObject = null;
      // test setup end

      const store = usePelcro();

      store.whenSiteReady((site) => {
        siteObject = site;

        expect(siteObject).not.toBeNull();
        done();
      });
    });
  });

  describe("whenEcommerceLoaded should call the callback method with the ecommerce products array", () => {
    test("waits for the event", (done) => {
      // test setup
      // mock as if ecommerce products aren't loaded yet
      const spy = jest
        .spyOn(window.Pelcro.ecommerce.products, "read")
        .mockImplementation(() => undefined);

      setTimeout(() => {
        // mock dispatching PelcroEcommerceProductsLoaded event
        document.dispatchEvent(
          new Event("PelcroEcommerceProductsLoaded")
        );
        // restore ecommerce products array
        spy.mockRestore();
      });
      // test setup end

      const store = usePelcro();

      let productsArray = null;
      store.whenEcommerceLoaded((products) => {
        productsArray = products;

        expect(productsArray).not.toBeNull();
        done();
      });
    });

    test("products are already loaded", () => {
      // test setup
      jest
        .spyOn(window.Pelcro.ecommerce.products, "read")
        .mockImplementation(() => [{ id: "test-product" }]);
      // test setup end

      const store = usePelcro();

      let productsArray = null;
      store.whenEcommerceLoaded((products) => {
        productsArray = products;
      });

      expect(productsArray).not.toBeNull();
    });
  });

  describe("whenUserReady should call the callback method with the user object", () => {
    test("waits for the event", (done) => {
      // test setup
      // mock as if user isn't loaded yet
      const spy = jest
        .spyOn(window.Pelcro.user, "read")
        .mockImplementation(() => undefined);

      setTimeout(() => {
        // mock dispatching PelcroUserLoaded event
        document.dispatchEvent(new Event("PelcroUserLoaded"));
        // restore user object
        spy.mockRestore();
      });
      // test setup end

      const store = usePelcro();

      let userObject = null;
      store.whenUserReady((products) => {
        userObject = products;

        expect(userObject).not.toBeNull();
        done();
      });
    });

    test("user is already loaded", () => {
      // test setup
      jest
        .spyOn(window.Pelcro.user, "read")
        .mockImplementation(() => ({ id: "test-user-id" }));
      // test setup end

      const store = usePelcro();

      let userObject = null;
      store.whenUserReady((products) => {
        userObject = products;
      });

      expect(userObject).not.toBeNull();
    });
  });
});
