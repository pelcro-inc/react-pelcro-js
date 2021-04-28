# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][keep a changelog] and this project adheres to [Semantic Versioning][semantic versioning].

## [Unreleased]

## [Released]

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
