# Changelog

All notable changes to `Decide.` will be documented in this file.

The format is inspired by Keep a Changelog and uses semantic version tags where practical.

## [Unreleased]

### Changed

- Ongoing UI, copy, motion, and readability polish across the decision flow and settings screens.

## [1.0.0] - 2026-03-19

### Added

- Initial public release of `Decide.`, a local-first psychological decision engine built with Expo Router and React Native.
- Multi-step decision flow for title, pros, cons, weights, and review.
- Weighted pros and cons with emotional tags such as logic, desire, fear, comfort, growth, and status.
- Final verdict screen with visual balance, reality checks, cost reframing, pattern memory, and outcome tracking.
- Decision history with outcome loop and pattern summary on the home screen.
- Desire-vs-logic success-rate insight block on the home screen.
- English and Russian localization with persisted language selection.
- Dark, light, and system themes with centralized theme tokens.
- Material You accent support on Android 12+.
- Android dynamic app icon support with an in-app toggle between dynamic and static launcher icon modes.
- Local persistence with Zustand and AsyncStorage.
- Reminder scheduling support through `expo-notifications` for delayed decisions.
- Premium app branding assets, adaptive icons, splash assets, and a polished project README.

### Changed

- Refined Russian copy to sound more natural and less literal.
- Redesigned the interface toward a calmer Material You-inspired visual direction.
- Reworked the price and currency block in the creation flow for better clarity and balance.
- Simplified the settings screen and removed low-value preview content.
- Reduced splash screen duration so the app reaches content faster.

### Fixed

- Fixed localization key issues on the result screen.
- Fixed theme transition behavior and reduced visible flicker during theme switching.
- Fixed Metro / Expo startup issues on Windows by simplifying config and aligning dependency setup.
- Fixed Android icon handling, including adaptive icon resources, themed icon support, and launcher-specific behavior.
- Fixed weight controls and improved the decision factor slider experience.
- Fixed Android build issues caused by invalid Gradle project naming after `prebuild`.

### Removed

- Removed the `Alternative path` block from the result experience.
- Removed unused visual and dependency leftovers from earlier iterations.

[Unreleased]: https://github.com/asphodelius/decide/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/asphodelius/decide/releases/tag/v1.0.0
## 2026-02-21
- fix: handle equal weight arguments correctly

