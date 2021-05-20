# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][keep a changelog] and this project adheres to [Semantic Versioning][semantic versioning].

## [Unreleased]

## [Released]

## [0.17.4] - 2021-05-20

### Changed

- force radio buttons and checkboxes to have no CSS :before pseudo element. [PRIVATE]

## [0.17.3] - 2021-05-10

### Fixed

- password reset modal not showing any alerts

### Changed

- color and wording of the 'remove profile picture' button in the user profile picture change modal

## [0.17.2] - 2021-05-10

- Include tax calculation in 3D secure flow.

## [0.17.1] - 2021-05-06

- Reject 3D secure requiring cards in source creation flow.

## [0.17.0] - 2021-05-06

### Added

- Add onDisplay prop to order confirmation modal.
- Ability to remove user's profile picture.

### Fixed

- App crashing when there is no primary color set in the platform.

### Changed

- reduced the usage of primary color in the dashboard, and used different grades of gray instead.

## [0.16.0] - 2021-05-04

### Changed

- Use stripe sources & reject 3D secure required cards in pelcro source creation.

### Added

- Ability to show business logo at the top of every modal.

### Fixed

- Triggering coupon flow with empty spaces.

### Changed

- Order confirm and subscription renew modals to use primary color instead of hard-coded green.
- Add address action to be a link instead of an outline button in address selection modal.

## [0.15.0] - 2021-05-03

### Added

- Ability to change profile picture directly from user dashboard header.

### Fixed

- Close button not working on purchace confirm modal.
- Atomic subcomps styling not being overridden by utility classes. [PRIVATE]

### Changed

- Dashboard logout button is now at the bottom of the options list.
- Dashboard header elements (picture, name, email) alignment to be more consistent.

## [0.14.0] - 2021-04-28

### Added

- Implemented 3D secure for payment cards requiring authentication.

### Fixed

- Only skip card if 100% coupon code is set to forever

## [0.13.1] - 2021-04-28

### Fixed

- Circular dependency. [PRIVATE]

## [0.13.0] - 2021-04-28

### Added

- Add missing locale to pelcro's native buttons [PRIVATE]

## [Released]

- Password change modal being opened even if user is not logged in.
- Password change modal submit button stays enabled even after successfully changing the password.
- Login button showing a "My account" label even after the user is signed out after successfully changing their password.
- Icon-only buttons not showing up on chomre [PRIVATE]

## [0.12.1] - 2021-04-26

### Fixed

- profile picture cropper library CSS getting purged [PRIVATE]

## [0.12.0] - 2021-04-26

### Added

- Added profile pictures: users now can select and crop an image and set it as their profile picture
- Allow theming the UI's colors using the platform's design table

## [0.11.0] - 2021-04-21

### Added

- Pelcro save and follow button to support loading/active states via classes.
- Add ecommerce orders section in the user's dashboard.
- Authorship logo in modals footers now links to Pelcro's homepage.

## [0.10.0] - 2021-04-19

- Export i18n instance to allow extending/customizing it.

## [0.9.0] - 2021-04-16

### Added

- Add address selection modal.
- Add empty state for dashboard payment cards section.

### Fixed

- Displaying close button after paywall limit for password reset modal.
- Add email validation to the password forgot view.

## [< 0.9.0]

### Added

- Add profile section to user dashboard.

### Changed

- Place coupon related errors under the coupon field.
- Apply coupon button appearence & Added gap between field and button.
- Replace Pelcro's authorship logo with SVG version.

<!-- Links -->

[keep a changelog]: https://keepachangelog.com/
[semantic versioning]: https://semver.org/
