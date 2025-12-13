# 🌍 Adelson Localization

> A lightweight, dynamic React localization hook with **live translation updates** without redeployment.

[![npm version](https://img.shields.io/npm/v/adelson-localization.svg)](https://www.npmjs.com/package/adelson-localization)
[![npm downloads](https://img.shields.io/npm/dm/adelson-localization.svg)](https://www.npmjs.com/package/adelson-localization)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🎉 What's New in v1.1.0

- 📁 **Multiple Resource Files** - Split translations across multiple files for better organization
- 🔧 **Utility Functions** - Export `deepMerge` and `strictDeepMerge` for custom use cases  
- ✅ **64 Tests** - Comprehensive test coverage for reliability
- 🔒 **Zero Dependencies** - Lightweight and secure (dev dependencies only)

[📋 See full changelog →](./CHANGELOG.md)

---

## 🚀 Why Adelson Localization?

| Feature | Adelson Localization | i18next |
|---------|---------------------|---------|
| **Live Updates** | ✅ Update translations on server, users get updates on next load | ⚠️ Requires rebuild |
| **Dynamic Formatting** | ✅ Mix indexed `{{}}` and named `{{name}}` placeholders | ✅ Named only |
| **Plural Rules** | ✅ Built-in (7 languages) | ✅ Via plugins |
| **TypeScript Generics** | ✅ `ln<T>()` for any type | ⚠️ Limited |
| **Bundle Size** | 🪶 ~5KB minified | 📦 Varies with plugins |
| **Setup** | 🚀 Single hook, zero config | 🔧 Provider setup required |

### 🔥 Key Advantage: Update Translations Without Redeployment

Update your translation files on the server, and users get the latest content **on next page load or language change** without app redeployment.

[📖 See detailed comparison with i18next →](./docs/COMPARISON.md)

---

## 📦 Installation

```bash
npm install adelson-localization
# or
yarn add adelson-localization
```

---

## 🎯 Quick Start

### 1. Create translation files

```
/public/locales/en/translation.json
```

```json
{
  "app": {
    "title": "My Application",
    "welcome": "Welcome {{}}!"
  },
  "messages": {
    "notification": {
      "singular": "You have {{}} new message",
      "plural": "You have {{}} new messages"
    }
  }
}
```

### 2. Use the hook in your component

```tsx
import { useLanguage } from 'adelson-localization';

function App() {
  const { ln, lnPlural, language, setLanguage } = useLanguage({ lang: "en" });

  return (
    <div>
      <h1>{ln("app.title")}</h1>
      <p>{ln("app.welcome", "John")}</p>
      <p>{lnPlural("messages.notification", 5)}</p>
      
      <button onClick={() => setLanguage({ key: "fr" })}>
        Switch to French
      </button>
    </div>
  );
}
```

[📚 See more examples →](./docs/EXAMPLES.md)

---

## 📖 Documentation

### Core Features
- [📘 API Reference](./docs/API_REFERENCE.md) - Complete API documentation
- [💡 Usage Examples](./docs/EXAMPLES.md) - Placeholders, plurals, TypeScript generics
- [🌐 Plural Rules](./docs/PLURAL_RULES.md) - Language-specific plural rules

### Advanced Features (v1.1.0+)
- [🎨 Advanced Features](./docs/ADVANCED_FEATURES.md) - HMR, CDN, multiple files, multiple languages
- [🔧 Utility Functions](./docs/UTILITY_FUNCTIONS.md) - `deepMerge` and `strictDeepMerge`
- [🎭 Mock Data Guide](./docs/MOCK_DATA_GUIDE.md) - Type-safe mock data in translations

### Migration & Best Practices
- [📝 Best Practices](./docs/BEST_PRACTICES.md) - Recommendations and tips
- [🔄 Migration from i18next](./docs/MIGRATION_i18next.md) - Step-by-step migration guide

---

## ⚡ Key Features

### Multiple Resource Files (v1.1.0+)

Split translations across multiple files for better organization:

```tsx
const { ln } = useLanguage({ 
  lang: "en",
  resourceFiles: ["common.json", "auth.json", "dashboard.json"]
});

ln("common.buttons.save")      // from common.json
ln("auth.login.title")         // from auth.json
ln("dashboard.stats.users")    // from dashboard.json
```

[📁 Learn more about multiple resource files →](./docs/ADVANCED_FEATURES.md#multiple-resource-files)

### Hot Module Replacement (HMR)

Auto-reload translations during development:

```tsx
const { ln } = useLanguage({ 
  lang: "en",
  enableHMR: true  // ⚡ Translations update automatically
});
```

[🔥 Learn more about HMR →](./docs/ADVANCED_FEATURES.md#hot-module-replacement)

### TypeScript Generics

Type-safe data retrieval:

```tsx
const maxItems = ln<number>("config.maxItems");
const features = ln<string[]>("config.features");
const settings = ln<AppSettings>("app.settings");
```

[💡 See TypeScript examples →](./docs/EXAMPLES.md#typescript-generics)

### Plural Support

Built-in plural rules for 7 languages (EN, FR, ES, DE, IT, PT, NL):

```tsx
lnPlural("messages.notification", 1);  // "You have 1 new message"
lnPlural("messages.notification", 5);  // "You have 5 new messages"
```

[🌐 Learn about plural rules →](./docs/PLURAL_RULES.md)

---

## 🔧 Utility Functions (v1.1.0+)

Export utility functions for your own use:

```typescript
import { deepMerge, strictDeepMerge } from 'adelson-localization';

// Deep merge objects
const config = deepMerge(defaults, userPrefs, overrides);

// Strict merge (only updates existing keys)
strictDeepMerge(schema, updates);
```

[🔨 See utility functions documentation →](./docs/UTILITY_FUNCTIONS.md)

---

## 📋 API Quick Reference

```typescript
interface UseLanguageConfig {
  lang?: string;              // Initial language (default: "en")
  translationsUrl?: string;   // Base URL (default: "/locales")
  managedLanguages?: string[]; // Supported languages (default: ["en", "fr", "es"])
  enableHMR?: boolean;         // Enable HMR in dev (default: false)
  resourceFiles?: string[];    // 🆕 Files to load (default: ["translation.json"])
}

const { 
  ln,                    // Localization function
  lnPlural,              // Plural localization
  language,              // Current language
  setLanguage,           // Change language
  resource,              // Raw translation data
  loadingResource        // Loading state
} = useLanguage(config);
```

[📘 Full API Reference →](./docs/API_REFERENCE.md)

---

## 🆚 Comparison with i18next

| Scenario | Choose Adelson Localization | Choose i18next |
|----------|----------------------------|----------------|
| Simple setup needed | ✅ | ❌ |
| Live updates without rebuild | ✅ | ❌ |
| Lightweight bundle | ✅ | ❌ |
| Complex namespaces | ❌ | ✅ |
| Extensive plugins | ❌ | ✅ |
| Backend integration | ⚠️ Manual | ✅ Built-in |

[📊 Detailed comparison →](./docs/COMPARISON.md)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT © [Jean Junior Adelson](https://github.com/adelsonjnjr)

---

## 🙏 Acknowledgments

Created by **Jean Junior Adelson** as a modern, lightweight alternative to existing i18n solutions.

---

## 📞 Support

- 🐛 [Report Issues](https://github.com/adelsonjnjr/adelson-localization/issues)
- 💬 [Discussions](https://github.com/adelsonjnjr/adelson-localization/discussions)
- 📧 Email: [adelsonjnjr+adelson@gmail.com](mailto:adelsonjnjr+adelson@gmail.com)

---

**Made with ❤️ by Jean Junior Adelson**
