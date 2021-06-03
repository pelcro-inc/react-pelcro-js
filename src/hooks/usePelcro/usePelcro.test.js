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
    expect(store.order).toEqual(null);
    expect(store.selectedAddressId).toEqual(null);
    expect(store.addressIdToEdit).toEqual(null);
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
    expect(store.order).toEqual(null);
    expect(store.selectedAddressId).toEqual(null);
    expect(store.addressIdToEdit).toEqual(null);
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
        store.switchView("select");
      });

      expect(store.view).toEqual("select");
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
        store.switchView("select");
      });

      act(() => {
        store.resetView();
      });

      expect(store.view).toEqual(null);
    });
  });

  describe("switchToPaymentView", () => {
    test("switch to subscription-create view when there is a selected product", () => {
      const store = usePelcro();
      act(() => {
        store.set({ product: { id: 1234 } });
      });

      act(() => {
        store.switchToPaymentView();
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
        store.switchToPaymentView();
      });

      expect(store.view).toEqual("subscription-renew");
    });

    test("switch to order-create view when there is an ecommerce order", () => {
      const store = usePelcro();
      act(() => {
        store.set({ order: { items: ["test-item"] } });
      });

      act(() => {
        store.switchToPaymentView();
      });

      expect(store.view).toEqual("order-create");
    });

    test("reset the view to when there is neither a product nor an order", () => {
      const store = usePelcro();

      act(() => {
        store.switchToPaymentView();
      });

      expect(store.view).toEqual(null);
    });
  });

  describe("switchToAddressView", () => {
    test("switch to address creation view when the user doesn't have any address", () => {
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
