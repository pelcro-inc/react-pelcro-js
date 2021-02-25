# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][keep a changelog] and this project adheres to [Semantic Versioning][semantic versioning].

## [Unreleased]

## [Released]

## [2.11.3] - 2021-02-18

### Changed

- Add address_id param to gift renewal. [PRIVATE]
- Always swtich users to create a new address if product has address required enabled.
- Only render PayPal button when product and braintree currencies match

### Fixed

- Use plan currency instead of default currency for discounted amount.
- Using e-commerce one click purchase buttons, not showing total price on confirmation modal.
- Use the correct address for gift redeem.

## [2.11.2] - 2021-02-10

### Added

- Consider quantity of plan on paypal & subscription service.

## [2.11.1] - 2021-02-04

### Added

- Add address id param to coupon submision. [PRIVATE]
- Consider quantity of plan when subscribing.

## [2.11.0] = 2021-01-29

### Added

- Add user password change modal

## [2.10.3] - 2021-01-28

### Added

- Add user dashboard component and button to library exports.

### Fixed

- Coupon field styling issues in some production environments.
- Translation improvements.

### Changed

- Moved out of old translation service into i18n, improving bundle size [PRIVATE]

## [2.10.2] - 2021-01-18

### Added

- Add optional initWithUserEmail prop to Email sub-component.
- Allow leaving card info empty when plan is free.
- Allow using SVGs as React components [PRIVATE]
- Style cart item remove button in the cart view [PRIVATE]

### Fixed

- Remove coupon field from e-commerce flow.
- Use same error elements' names for payment modals.
- Use translation files instead of hardcoded strings for validation errors
- Re-enable submit when e-commerce checkout fails.
- Reset cart items after successful order.

### Changed

- Remove items count from checkout button label in cart modal.

## [Released]

## [2.10.1] - 2021-01-12

### Added

- Add missing update payment button selector. [private]
- PayPal dynamic pricing.

### Fixed

- Login button not clickable in password forget modal.
- Use reset view instead of an empty setView when exiting modals. [PRIVATE]
- Styling conflict among payment vendors' buttons.
- Coupon codes not being applied.
- Discount amount not displayed properly.

## [2.10.0] - 2020-12-23

### Fixed

- Cart modal not exiting.
- Translation wording typo.

## [2.9.9] - 2020-12-16

### Added

- Add missing id selectors for QA requirements. [PRIVATE]
- Add PayPal checkout service to integrate paypal payment gateway. [PRIVATE]
- Add subscription service class to contain all subscription business logic [PRIVATE]
- Add new PaypalSubscribeButton component to pelcro-react-elements.
- Add PaypalSubscribeButton to subscription modals

## [2.9.8] - 2020-12-03

### Fixed

- Gift flow i18n wording issues.
- Scrolling issues after password reset flow.
- Password reset success message showing in error alert.
- After registeration payment redirection issue.

## [2.9.7] - 2020-11-26

### Added

- Added bundle visualizer at build time [private]

### Fixed

- Initialize firstName and lastName elements with empty strings.
- Fixed User update modal from being slow on load time.
- Organized dev-dependencies and external ones [private]
- React and react-dom as peer dependencies [private]

### Changed

- Replaced react-fancy-loader with an in-house loader
- Removed lodash as a dependency and replaced with in-house functions.

## [2.9.5] - 2020-10-20

### Added

- Add missing translation property in french.

### Fixed

- Use resetView instead of setView in address modal header.

## [2.9.4] - 2020-10-15

### Fixed

- Use resetView instead of setView in address modal header

## [2.9.2] - 2020-10-05

### Added

- Added gift recipients subsriptions renewal support

## [2.9.1] - 2020-10-01

### Added

- Added onDisplay prop to most modals to allow logic on component mount

<!-- Links -->

[keep a changelog]: https://keepachangelog.com/
[semantic versioning]: https://semver.org/
