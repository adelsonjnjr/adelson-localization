# 🎉 Release Notes - Adelson Localization v1.1.0

**Release Date:** December 13, 2025

---

## 🌟 Highlights

Version 1.1.0 brings powerful new features for organizing and managing translations at scale, while maintaining our commitment to zero dependencies and lightweight bundle size.

---

## 📁 Multiple Resource Files

The marquee feature of v1.1.0 is **Multiple Resource Files Support**. You can now split your translations across multiple files and load them together:

```tsx
const { ln } = useLanguage({ 
  lang: "en",
  resourceFiles: ["common.json", "auth.json", "dashboard.json"]
});
```

### Why This Matters

**Before v1.1.0:**
- One massive `translation.json` file (1000+ lines)
- Merge conflicts when multiple teams edit
- Difficult to find specific translations
- All-or-nothing loading

**After v1.1.0:**
- Organized by feature/module
- Each team owns their files
- Easy to locate translations
- Possibility for lazy loading

### Real-World Example

```
/public/locales/en/
  ├── common.json          # Buttons, errors (Team: Core)
  ├── auth.json            # Login, signup (Team: Auth)
  ├── dashboard.json       # Analytics (Team: Analytics)
  ├── settings.json        # User preferences (Team: Settings)
  └── products.json        # E-commerce (Team: Products)
```

Each team can work independently without conflicts!

---

## 🔧 Utility Functions

We've exported our internal merge utilities for your own use:

### `deepMerge(...objects)`

Recursively merge multiple objects:

```typescript
import { deepMerge } from 'adelson-localization';

const config = deepMerge(
  defaultConfig,
  userPreferences,
  environmentOverrides
);
```

### `strictDeepMerge(target, ...sources)`

Update only existing keys (strict schema):

```typescript
import { strictDeepMerge } from 'adelson-localization';

const schema = { api: { timeout: 5000, retries: 3 } };
const overrides = { api: { timeout: 10000, newField: 'ignored' } };

strictDeepMerge(schema, overrides);
// Result: { api: { timeout: 10000, retries: 3 } }
// 'newField' is ignored because it doesn't exist in schema
```

---

## ✅ Testing & Quality

- **64 comprehensive tests** covering all features
- **100% pass rate** on CI/CD
- **Zero dependencies** (dev dependencies only)
- **Security audit passed** (all vulnerabilities resolved)

---

## 🚀 Performance

- **Parallel loading**: Multiple files load simultaneously
- **No bundle size increase**: Still ~5KB minified
- **Efficient merging**: Deep merge algorithm optimized for translation structures

---

## 📖 Documentation Improvements

- New section: "Multiple Resource Files"
- New section: "Utility Functions"
- Enhanced examples with real-world use cases
- Updated TypeScript interfaces
- Added "What's New" section

---

## 🔄 Migration Guide

### From v1.0.x to v1.1.0

**No breaking changes!** Version 1.1.0 is 100% backward compatible.

#### Option 1: Keep Existing Setup (No Changes Required)

```tsx
// This continues to work exactly as before
const { ln } = useLanguage({ lang: "en" });
```

Default behavior: loads `translation.json` (same as v1.0.x)

#### Option 2: Migrate to Multiple Files

1. **Split your `translation.json`:**

```bash
# Before
/locales/en/translation.json  (1000 lines)

# After
/locales/en/common.json       (200 lines)
/locales/en/auth.json         (150 lines)
/locales/en/dashboard.json    (300 lines)
# ... more files
```

2. **Update your hook configuration:**

```tsx
// Old
const { ln } = useLanguage({ lang: "en" });

// New
const { ln } = useLanguage({ 
  lang: "en",
  resourceFiles: ["common.json", "auth.json", "dashboard.json"]
});
```

3. **Your component code stays unchanged:**

```tsx
// No changes needed - keys work the same way
ln("common.buttons.save")
ln("auth.login.title")
```

---

## 🎯 Use Cases

### Team Collaboration

```tsx
// Team A works on auth.json
// Team B works on dashboard.json
// No more merge conflicts!
resourceFiles: ["common.json", "auth.json", "dashboard.json"]
```

### Module-Based Loading

```tsx
// Load only what you need per route
// Login page
resourceFiles: ["common.json", "auth.json"]

// Dashboard page
resourceFiles: ["common.json", "dashboard.json", "analytics.json"]
```

### A/B Testing

```tsx
// Test different translation variants
const variant = Math.random() > 0.5 ? "a" : "b";
resourceFiles: ["common.json", `experiment-${variant}.json`]
```

### Multi-Brand Apps

```tsx
// Different brands, shared translations
resourceFiles: [
  "common.json", 
  `brands/${brandId}.json`
]
```

---

## 🐛 Bug Fixes

- Fixed high severity security vulnerability in `glob` dependency
- Improved error handling for missing translation files
- Enhanced TypeScript type inference for utility functions

---

## 📊 By the Numbers

- **0** breaking changes
- **2** new features (resourceFiles, utility exports)
- **64** tests (19 objectHelpers, 40 stringHelpers, 5 resourceFiles)
- **0** new dependencies
- **~5KB** bundle size (unchanged)

---

## 🙏 Thank You

Thank you to everyone who provided feedback and requested these features. Your input helps make Adelson Localization better for everyone!

---

## 📞 Support

- 🐛 [Report Issues](https://github.com/adelsonjnjr/adelson-localization/issues)
- 💬 [Discussions](https://github.com/adelsonjnjr/adelson-localization/discussions)
- 📧 Email: adelsonjnjr+adelson@gmail.com

---

**Ready to upgrade?**

```bash
npm install adelson-localization@1.1.0
```

**Made with ❤️ by Jean Junior Adelson**
