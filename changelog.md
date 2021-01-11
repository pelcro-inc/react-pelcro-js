# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][keep a changelog] and this project adheres to [Semantic Versioning][semantic versioning].

## [Unreleased]

### Added

- Add missing update payment button selector. [private]

### Fixed

- Login button not clickable in password forget modal.
- Use reset view instead of an empty setView when exiting modals. [PRIVATE]
- Styling conflict among payment vendors' buttons.
- Coupon codes not being applied.

## [Released]

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
