# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2025-11-27

#### 🔥 Hot Module Replacement (HMR) System
- **`enableHMR` parameter**: New optional configuration to enable automatic translation reloading in development mode
- **`isDevelopmentMode()` function**: Bundler-agnostic environment detection
  - Supports Vite (`import.meta.env.DEV`)
  - Supports Webpack/CRA (`process.env.NODE_ENV`)
  - Supports Next.js (`process.env.NEXT_PUBLIC_NODE_ENV`)
  - Fallback to localhost detection (`localhost`, `127.0.0.1`, `.local`)
- **Automatic translation reloading**: Polls translation files every 2 seconds using `HEAD` requests
- **`Last-Modified` header tracking**: Only reloads when files actually change
- **Console logging**: Informative messages for HMR activation and reload events

#### 🔧 Build System Improvements
- **Updated `@rollup/plugin-terser`**: Replaced deprecated `rollup-plugin-terser` v7.0.2 with `@rollup/plugin-terser` v0.4.4
  - Fixed peer dependency conflict with Rollup v4
  - Updated import statement in `rollup.config.js`

#### 🛡️ Stability Enhancements
- **`useMemo` for managedLanguages**: Stabilized array dependency using `managedLanguages.join(",")`
- **`useMemo` for translationsUrl**: Stabilized URL dependency
- **`useCallback` for loadTranslations**: Extracted translation loading logic to reusable callback
- Fixed infinite loop bug caused by unstable array references in `useEffect` dependencies

### Changed - 2025-11-27

#### 🔄 Hook Architecture Refactoring
- **Extracted `loadTranslations` function**: Moved from inline `useEffect` to `useCallback` for reusability
- **Split useEffect responsibilities**: 
  - One `useEffect` for initial load and language changes
  - One `useEffect` for HMR polling (only in dev mode with `enableHMR: true`)
- **Enhanced fetch options**: Added `cache: enableHMR ? 'no-cache' : 'default'` to prevent browser caching in dev mode

#### 📝 Documentation Updates
- Updated `UseLanguageConfig` interface with `enableHMR?: boolean`
- Enhanced JSDoc comments to document HMR feature
- Improved console warning messages with `[Adelson Localization]` prefix for better log filtering

### Fixed - 2025-11-27

#### 🐛 Critical Bug Fixes
- **Infinite render loop**: Fixed issue where `managedLanguages` array created new reference on every render
  - Root cause: Array passed directly in component props
  - Solution: `useMemo` with content-based comparison (`join(",")`)
- **Rollup terser compatibility**: Fixed build errors with Rollup v4 by upgrading terser plugin

#### 🔒 Security & Packaging
- **`.npmignore` configuration**: Prevents sensitive files from being published
  - Excludes: `src/`, `tests/`, `examples/`, `docs/`, config files
  - Includes: `dist/`, `README.md`, `CHANGELOG.md`, `LICENSE`

### Technical Details - 2025-11-27

#### HMR Implementation Details
```typescript
// HMR activates only when:
// 1. enableHMR: true
// 2. isDevelopmentMode() returns true
// 3. Uses setInterval(checkForUpdates, 2000)
// 4. HEAD request to check Last-Modified header
// 5. Calls loadTranslations() when file changes detected
```

#### Dependency Stabilization Pattern
```typescript
// Before (unstable):
useEffect(() => { ... }, [managedLanguages]); // New array reference each render

// After (stable):
const stableManagedLanguages = useMemo(
  () => managedLanguages, 
  [managedLanguages.join(",")]
);
useEffect(() => { ... }, [stableManagedLanguages]); // Only changes when content changes
```

### Breaking Changes
None - All changes are backward compatible. The `enableHMR` parameter defaults to `false`.

### Migration Guide
No migration required. To enable HMR, simply add `enableHMR: true`:
```typescript
const { ln } = useLanguage({
  lang: "fr",
  managedLanguages: ["en", "fr", "es"],
  enableHMR: true  // New feature, opt-in
});
```

---

## [Previous Releases]

### Added
- **PLURAL_RULES configuration**: Centralized plural rules for 7 languages (fr, es, en, de, it, pt, nl)
- **managedLanguages parameter**: Configure which languages your application supports
- Support for German (\de\), Italian (\it\), Portuguese (\pt\), and Dutch (\
l\) plural rules
- Automatic fallback to default plural rule for unsupported languages
- Warning console message when attempting to load translations for languages not in \managedLanguages\

### Changed
- Refactored \lnPlural\ from if/else chain to lookup pattern using \PLURAL_RULES\
- Improved TypeScript types with \UseLanguageConfig\ interface now including \managedLanguages?: string[]\
- Updated hook signature to accept \managedLanguages\ parameter (default: \["en", "fr", "es"]\)
- Enhanced useEffect to check \managedLanguages\ array before attempting to load translation files

### Improved
- **Performance**: O(1) lookup for plural rules instead of multiple if/else conditions
- **Extensibility**: Add new language support by adding one line to \PLURAL_RULES\ object
- **Maintainability**: Centralized plural logic makes testing and debugging easier
- **Developer Experience**: Better TypeScript IntelliSense with explicit interface for configuration

## [1.0.0] - 2025-11-01

### Added
- Initial release of Adelson Localization
- \useLanguage\ hook with TypeScript support
- \ln()\ function for basic translations
- \lnPlural()\ function for plural handling
- Support for indexed placeholders \{{}}\
- Support for named placeholders \{{name}}\
- Built-in plural rules for French, English, and Spanish
- TypeScript generics for dynamic return types
- Live translation updates without redeployment
- String helper extensions for formatting
- Comprehensive documentation and examples
- Three usage examples (Basic, Formatting, Plural)
- MIT License

### Features
- 🌍 Multi-language support (fr, en, es)
- 🎯 Dynamic placeholder formatting
- 🔄 Live translation updates
- 📦 Lightweight bundle (~5KB minified)
- 🚀 Zero configuration setup
- 💪 TypeScript-first approach
- ⚡ React hooks-based API

[1.0.0]: https://github.com/jjadelson/adelson-localization/releases/tag/v1.0.0
