<div align="center">
  <img src="./assets/icon.png" alt="Decide icon" width="144" height="144" />
  <h1>Decide.</h1>
  <p>A psychological decision engine for impulse, friction, and honest tradeoffs.</p>

  <p>
    <a href="https://github.com/asphodelius/decide/releases">
      <img src="https://img.shields.io/github/v/release/asphodelius/decide?style=for-the-badge" alt="Latest release" />
    </a>
    <a href="https://github.com/asphodelius/decide/releases">
      <img src="https://img.shields.io/github/downloads/asphodelius/decide/total?style=for-the-badge" alt="Downloads" />
    </a>
    <a href="https://github.com/asphodelius/decide">
      <img src="https://img.shields.io/github/repo-size/asphodelius/decide?style=for-the-badge" alt="Repo size" />
    </a>
  </p>
</div>

## What It Is

`Decide.` is not a checklist app and not a productivity utility.

It is a local-first mobile app that helps you pressure-test choices before you romanticize them:

- create a decision
- weigh pros and cons
- tag emotional bias
- run reality checks
- review a final verdict
- track how your choices actually turned out

The goal is simple: slow down bad decisions and make good ones easier to recognize.

## Highlights

- Multi-step decision flow built with Expo Router
- English and Russian localization with instant switching
- Dark, light, and system theme modes
- Material You accent support on Android 12+
- Dynamic Android app icon support with in-app toggle
- Weighted pros and cons with emotional tags
- Reality checks based on cost, pressure, impulse, and history
- Cost reframing for money decisions
- Pattern memory from previous decisions
- Outcome loop and decision history
- Fully local data storage with AsyncStorage

## Tech Stack

- React Native
- Expo
- Expo Router
- TypeScript
- Zustand
- Reanimated
- AsyncStorage
- i18next

## Core Experience

### Decision Flow

The main flow is split into separate steps:

1. Title
2. Pros
3. Cons
4. Weights
5. Review

Each step is designed to feel deliberate, animated, and low-noise rather than form-heavy.

### Result Screen

The result screen combines:

- final verdict
- visual balance
- reality checks
- cost reframing
- pattern memory
- outcome tracking

### History and Feedback Loop

`Decide.` remembers what you chose and asks whether it actually held up later.

That turns the app from a one-time decision helper into a personal pattern mirror.

## Localization

Supported languages:

- English
- Russian

All UI strings are localized and language choice is persisted locally.

## Theming

Theme options:

- Dark
- Light
- System

Accent options include Material You on supported Android devices, with fallback accent palettes on other platforms.

## Project Structure

```text
app/
components/
lib/
locales/
store/
theme/
android/
assets/
```

## Development Setup

### Requirements

- Node 22 LTS recommended
- JDK 17 for Android builds
- Android SDK / platform-tools

### Install

```bash
npm install
```

### Run Expo

```bash
npx expo start
```

### Build Android Dev Client

```bash
npx expo run:android --device
```

## Releases

Releases are published on GitHub:

- Latest releases: https://github.com/asphodelius/decide/releases

When APK builds are attached, they should live there rather than in ad-hoc file shares.

## Notes

- The app is currently local-first and does not require a backend.
- Some Android-specific behavior, like themed icons, depends on launcher support.
- Native Android files are committed because the project includes custom icon behavior and native bridge code.

## Credits

Built as a premium React Native / Expo mobile experience focused on psychological decision-making, material motion, and local-first UX.
