# 🌍 Adelson Localization

> A lightweight, dynamic React localization hook with **live translation updates** without redeployment.

[![npm version](https://img.shields.io/npm/v/adelson-localization.svg)](https://www.npmjs.com/package/adelson-localization)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Why Adelson Localization?

| Feature | Adelson Localization | i18next |
|---------|---------------------|---------|
| **Live Updates** | ✅ Change translations in production without redeployment | ❌ Requires rebuild |
| **Dynamic Formatting** | ✅ Mix indexed `{{}}` and named `{{name}}` placeholders | ⚠️ Only named placeholders |
| **Plural Rules** | ✅ Built-in with language-specific rules (FR, EN, ES) | ✅ Via plugins |
| **TypeScript Generics** | ✅ `ln<T>()` for any return type | ⚠️ Limited type inference |
| **Bundle Size** | 🪶 ~5KB minified | 📦 ~15KB+ with plugins |
| **Setup Complexity** | 🚀 Single hook, zero config | 🔧 Requires provider setup |
| **JSON Structure** | 📁 Simple nested JSON | 📁 Nested with namespaces |

### 🔥 Key Advantage: Hot-Reload Translations in Production

Update your translation files on the server, and users get the latest content **instantly** without app redeployment. Perfect for:
- 🎯 A/B testing different translations
- 🐛 Quick fixes to typos or incorrect translations
- 🌐 Marketing campaigns with time-sensitive content
- 🔄 Continuous translation improvements

---

## 📦 Installation

```bash
npm install adelson-localization
```

or

```bash
yarn add adelson-localization
```

---

## 🎯 Quick Start

### 1. Create translation files

```
/public/locales
  ├── en/
  │   └── translation.json
  ├── fr/
  │   └── translation.json
  └── es/
      └── translation.json
```

**Example: `/public/locales/en/translation.json`**

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

### 2. Use the hook in your React component

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

---

## 📖 API Reference

### `useLanguage(config)`

**Parameters:**

```typescript
interface UseLanguageConfig {
  lang?: string;              // Initial language (default: "en")
  translationsUrl?: string;   // Base URL for translation files (default: "/locales")
  emptyString?: string;       // String to return when loading (default: "")
  managedLanguages?: string[]; // Array of supported languages (default: ["en", "fr", "es"])
}
```

**Returns:**

```typescript
interface UseLanguageReturn {
  resource: any;                                              // Raw translation data
  ln: <T = string>(key: string, ...args: any[]) => T;       // Localization function
  lnPlural: <T = string>(key: string, count: number, ...args: any[]) => T;  // Plural function
  language: { key: string };                                 // Current language
  setLanguage: (lang: { key: string }) => void;             // Change language
  loadingResource: boolean;                                  // Loading state
}
```

---

## 💡 Usage Examples

### Basic Translation

```tsx
const { ln } = useLanguage({ lang: "en" });

const title = ln("app.title");
// Output: "My Application"
```

### Translation with Indexed Placeholders

```tsx
// translation.json
{
  "greetings": {
    "hello": "Hello {{}}! You have {{}} messages."
  }
}

// Component
const greeting = ln("greetings.hello", "Alice", 5);
// Output: "Hello Alice! You have 5 messages."
```

### Translation with Named Placeholders

```tsx
// translation.json
{
  "profile": {
    "info": "{{firstName}} {{lastName}}, {{age}} years old"
  }
}

// Component
const profile = ln("profile.info", { 
  firstName: "John", 
  lastName: "Doe", 
  age: 30 
});
// Output: "John Doe, 30 years old"
```

### Mix Indexed and Named Placeholders

```tsx
// translation.json
{
  "orders": {
    "summary": "Order {{}} for {{customerName}} - Total: ${{total}}"
  }
}

// Component
const order = ln("orders.summary", "#12345", { 
  customerName: "Alice", 
  total: 99.99 
});
// Output: "Order #12345 for Alice - Total: $99.99"
```

### Plural Support

```tsx
const { lnPlural } = useLanguage({ lang: "en" });

// translation.json
{
  "messages": {
    "notification": {
      "singular": "You have {{}} new message",
      "plural": "You have {{}} new messages"
    }
  }
}

// Usage
const msg1 = lnPlural("messages.notification", 1);
// Output: "You have 1 new message"

const msg5 = lnPlural("messages.notification", 5);
// Output: "You have 5 new messages"
```

### TypeScript Generics

Return non-string types from your translations:

```tsx
// translation.json
{
  "config": {
    "maxItems": 100,
    "features": ["chat", "notifications", "analytics"]
  }
}

// Component
const maxItems = ln<number>("config.maxItems");
// Type: number, Value: 100

const features = ln<string[]>("config.features");
// Type: string[], Value: ["chat", "notifications", "analytics"]
```

### Default Text Fallback

```tsx
const text = ln("missing.key", { defaultTxt: "Default text" });
// If "missing.key" doesn't exist, returns: "Default text"
```

### Language Switching

```tsx
function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage({ lang: "en" });

  return (
    <select 
      value={language.key} 
      onChange={(e) => setLanguage({ key: e.target.value })}
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
    </select>
  );
}
```

---

## 🌐 Plural Rules by Language

The package includes built-in plural rules for multiple languages. You can easily extend support by adding new rules to the `PLURAL_RULES` configuration:

| Language | Code | Rule | Example |
|----------|------|------|---------|
| **French** | `fr` | `count <= 1` → singular, else plural | 0, 1 → singular; 2+ → plural |
| **English** | `en` | `count === 1` → singular, else plural | 1 → singular; 0, 2+ → plural |
| **Spanish** | `es` | `count === 1` → singular, else plural | 1 → singular; 0, 2+ → plural |
| **German** | `de` | `count === 1` → singular, else plural | 1 → singular; 0, 2+ → plural |
| **Italian** | `it` | `count === 1` → singular, else plural | 1 → singular; 0, 2+ → plural |
| **Portuguese** | `pt` | `count === 1` → singular, else plural | 1 → singular; 0, 2+ → plural |
| **Dutch** | `nl` | `count === 1` → singular, else plural | 1 → singular; 0, 2+ → plural |

### Adding Custom Languages

You can easily support additional languages by specifying them in the `managedLanguages` parameter:

```tsx
const { ln, lnPlural } = useLanguage({ 
  lang: "de",
  managedLanguages: ["en", "fr", "es", "de", "it", "pt", "nl"]
});
```

**Note:** The plural rule will automatically use the built-in rules for these 7 languages. For languages not listed, it falls back to the default rule (`count === 1` for singular).

---

## 🎨 Advanced Features

### Custom Translation URL

Host your translations on a CDN or external server:

```tsx
const { ln } = useLanguage({ 
  lang: "en",
  translationsUrl: "https://cdn.example.com/translations"
});
```

### Manage Multiple Languages

Specify which languages your application supports:

```tsx
const { ln, lnPlural, language, setLanguage } = useLanguage({ 
  lang: "en",
  managedLanguages: ["en", "fr", "es", "de", "it", "pt", "nl"]
});

// The hook will only attempt to load translations for languages in the managedLanguages array
// This prevents unnecessary network requests for unsupported languages
```

**Benefits:**
- 🎯 **Performance**: Only load translations for supported languages
- 🛡️ **Error Prevention**: Avoid 404 errors for non-existent translation files
- 📊 **Extensibility**: Easily add/remove supported languages without code changes

### Loading State

```tsx
const { ln, loadingResource } = useLanguage({ lang: "en" });

if (loadingResource) {
  return <div>Loading translations...</div>;
}

return <div>{ln("app.title")}</div>;
```

### Dynamic Translation Updates

Simply update your translation files on the server, and users will receive the new translations on the next language change or page refresh. No app redeployment needed!

---

## 📚 Translation File Structure

### Simple Structure

```json
{
  "app": {
    "title": "My App",
    "description": "Welcome to my app"
  },
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  }
}
```

### With Plurals

```json
{
  "items": {
    "cart": {
      "singular": "{{}} item in your cart",
      "plural": "{{}} items in your cart"
    }
  }
}
```

### Complex Values

```json
{
  "config": {
    "maxItems": 100,
    "features": ["feature1", "feature2"],
    "settings": {
      "enabled": true,
      "theme": "dark"
    }
  }
}
```

---

## 🔧 Best Practices

1. **Organize keys logically**: Use dot notation for nested structures
   ```
   app.header.title
   app.header.subtitle
   app.footer.copyright
   ```

2. **Use named placeholders for clarity**: Prefer `{{name}}` over `{{}}`
   ```json
   "greeting": "Hello {{firstName}} {{lastName}}"
   ```

3. **Always provide defaults**: Use `defaultTxt` for critical text
   ```tsx
   ln("key", { defaultTxt: "Fallback text" })
   ```

4. **Keep translations consistent**: Use the same structure across all language files

5. **Version your translations**: Include version numbers for cache busting
   ```
   /locales/v1/en/translation.json
   ```

---

## 🆚 When to Use Adelson Localization vs i18next

### Choose **Adelson Localization** if you need:
- ✅ Simple, quick setup
- ✅ Live translation updates without redeployment
- ✅ Lightweight bundle size
- ✅ Mix of indexed and named placeholders
- ✅ TypeScript-first approach with generics

### Choose **i18next** if you need:
- ⚠️ Complex namespace management
- ⚠️ Extensive plugin ecosystem
- ⚠️ Backend integration (i18next-http-backend)
- ⚠️ Advanced formatting (i18next-icu)

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

MIT © [Jean Junior Adelson](https://github.com/jjadelson)

---

## 🙏 Acknowledgments

Created by **Jean Junior Adelson** as a modern, lightweight alternative to existing i18n solutions.

---

## 📞 Support

- 🐛 [Report Issues](https://github.com/jjadelson/adelson-localization/issues)
- 💬 [Discussions](https://github.com/jjadelson/adelson-localization/discussions)
- 📧 Email: your.email@example.com

---

**Made with ❤️ by Jean Junior Adelson**
