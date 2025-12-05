# 🌍 Adelson Localization

> A lightweight, dynamic React localization hook with **live translation updates** without redeployment.

[![npm version](https://img.shields.io/npm/v/adelson-localization.svg)](https://www.npmjs.com/package/adelson-localization)
[![npm downloads](https://img.shields.io/npm/dm/adelson-localization.svg)](https://www.npmjs.com/package/adelson-localization)
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
  managedLanguages?: string[]; // Array of supported languages (default: ["en", "fr", "es"])
  enableHMR?: boolean;         // Enable Hot Module Replacement in development (default: false)
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

### Hot Module Replacement (HMR) for Translations

**Enable live translation updates in development without page refresh!**

When `enableHMR` is enabled, the hook automatically polls your translation files every 2 seconds and reloads them when changes are detected. Perfect for:
- 🔥 Rapid iteration on translations during development
- ✏️ Real-time preview of translation changes
- 🚀 Faster development workflow

```tsx
const { ln, loadingResource } = useLanguage({ 
  lang: "en",
  enableHMR: true  // ⚡ Auto-reload translations in development
});

// Translations update automatically when you edit translation files!
```

**How it works:**
- ✅ Automatically detects development mode (Vite, Webpack, Next.js)
- ✅ Uses `HEAD` requests to check `Last-Modified` header
- ✅ Only reloads when files actually change
- ✅ Minimal performance impact (2-second polling interval)
- ✅ Automatically disabled in production

**Supported environments:**
- Vite (`import.meta.env.DEV`)
- Webpack/CRA (`process.env.NODE_ENV`)
- Next.js (`process.env.NEXT_PUBLIC_NODE_ENV`)
- Localhost detection (fallback)

**Note:** HMR is automatically disabled in production builds for optimal performance.

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

## 🎭 Type-Safe Mock Data in Resources

One unique feature of Adelson Localization is the ability to **store typed mock data** directly in your translation files. This is perfect for rapid prototyping, client demos, and testing without needing a backend.

### 🎯 Why Use Mock Data in Translations?

| Use Case | Benefit |
|----------|---------|
| 🚀 **Rapid Prototyping** | Build UI without backend dependency |
| 🎨 **Client Demos** | Show localized sample data (French names in FR, English names in EN) |
| 🧪 **Stable E2E Tests** | Version-controlled test data, no API flakiness |
| 💻 **Offline Development** | Work without internet or backend connection |
| 🌐 **Localized Examples** | Different example data per language |

### 📝 Example: Employee Dashboard

**Translation file (`/public/locales/en/translation.json`):**

```json
{
  "employees": {
    "headers": ["id", "name", "position", "department", "age", "hireDate", "salary"],
    "id": "ID",
    "name": "Name",
    "position": "Position",
    "department": "Department",
    "age": "Age",
    "hireDate": "Hire Date",
    "salary": "Salary",
    "headerWidths": {
      "id": 100,
      "name": 200,
      "position": 150,
      "department": 230,
      "age": 80,
      "hireDate": 100,
      "salary": 100
    },
    "list": [
      {
        "id": 3223,
        "name": "John Doe",
        "position": "Developer",
        "department": "Information Technology",
        "age": 30,
        "hireDate": "2020-01-15",
        "salary": 75000
      },
      {
        "id": 3334,
        "name": "Jane Smith",
        "position": "Scientist",
        "department": "Research",
        "age": 35,
        "hireDate": "2018-03-22",
        "salary": 85000
      }
    ]
  }
}
```

**French version (`/public/locales/fr/translation.json`):**

```json
{
  "employees": {
    "headers": ["id", "name", "position", "department", "age", "hireDate", "salary"],
    "id": "ID",
    "name": "Nom",
    "position": "Poste",
    "department": "Département",
    "age": "Âge",
    "hireDate": "Date d'embauche",
    "salary": "Salaire",
    "headerWidths": {
      "id": 100,
      "name": 200,
      "position": 150,
      "department": 230,
      "age": 80,
      "hireDate": 100,
      "salary": 100
    },
    "list": [
      {
        "id": 3223,
        "name": "Jean Dupont",
        "position": "Développeur",
        "department": "Technologies de l'information",
        "age": 30,
        "hireDate": "2020-01-15",
        "salary": 75000
      },
      {
        "id": 3334,
        "name": "Marie Curie",
        "position": "Scientifique",
        "department": "Recherche",
        "age": 35,
        "hireDate": "2018-03-22",
        "salary": 85000
      }
    ]
  }
}
```

**React Component with TypeScript:**

```tsx
import { useLanguage } from 'adelson-localization';

interface IEmployee {
  id: number;
  name: string;
  position: string;
  department: string;
  age: number;
  hireDate: string;
  salary: number;
}

function EmployeeTable() {
  const { ln, language, setLanguage, loadingResource } = useLanguage({ 
    lang: "en",
    managedLanguages: ["en", "fr"]
  });

  if (loadingResource) {
    return <div>Loading...</div>;
  }

  // Type-safe data retrieval with generics
  const employees = ln<IEmployee[]>("employees.list");
  const headers = ln<string[]>("employees.headers");
  const headerWidths = ln<{[key: string]: number}>("employees.headerWidths");

  return (
    <div>
      <button onClick={() => setLanguage({ key: language.key === "en" ? "fr" : "en" })}>
        Switch to {language.key === "en" ? "Français" : "English"}
      </button>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th 
                key={header}
                style={{ 
                  width: `${headerWidths[header]}px`,
                  border: '1px solid #ddd',
                  padding: '8px',
                  backgroundColor: '#f2f2f2'
                }}
              >
                {ln(`employees.${header}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              {headers.map((header) => (
                <td 
                  key={header}
                  style={{ border: '1px solid #ddd', padding: '8px' }}
                >
                  {emp[header as keyof IEmployee]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### ✨ What Happens When You Switch Languages?

When you click the button to switch from English to French:
- ✅ **Table headers** translate (Name → Nom, Position → Poste)
- ✅ **Employee names** change (John Doe → Jean Dupont, Jane Smith → Marie Curie)
- ✅ **Departments** translate (Information Technology → Technologies de l'information)
- ✅ **All in one action** - no separate API calls needed!

### 🎨 More Use Cases

#### Chart Configuration

```json
{
  "dashboard": {
    "chartConfig": {
      "type": "bar",
      "colors": ["#FF6384", "#36A2EB", "#FFCE56"],
      "animations": true,
      "datasets": [
        { "label": "Sales", "data": [65, 59, 80, 81, 56] },
        { "label": "Revenue", "data": [28, 48, 40, 19, 86] }
      ]
    }
  }
}
```

```tsx
interface ChartConfig {
  type: string;
  colors: string[];
  animations: boolean;
  datasets: Array<{ label: string; data: number[] }>;
}

const config = ln<ChartConfig>("dashboard.chartConfig");
// Full type safety and autocompletion!
```

#### Application Settings

```json
{
  "app": {
    "settings": {
      "theme": "dark",
      "notifications": {
        "email": true,
        "push": false,
        "sms": true
      },
      "features": {
        "chat": true,
        "analytics": true,
        "beta": false
      }
    }
  }
}
```

```tsx
interface AppSettings {
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  features: {
    chat: boolean;
    analytics: boolean;
    beta: boolean;
  };
}

const settings = ln<AppSettings>("app.settings");
```

### ⚠️ Best Practices

#### ✅ Good Use Cases
- **Small datasets** (<50 items): No performance impact
- **Prototyping**: Develop UI before backend is ready
- **Demos**: Impress clients with localized examples
- **Testing**: Stable, version-controlled test data
- **Configuration**: UI settings, theme configs, feature flags

#### ❌ Not Recommended For
- **Large datasets** (>200 items): Increases bundle size significantly
- **Production data storage**: Use a proper database instead
- **Sensitive information**: Never store passwords, API keys, or PII
- **Frequently changing data**: Use a real API for dynamic content

### 🔄 Migration Path: From Mock to Real API

One of the best aspects of this approach is the **smooth migration path**:

```tsx
// Development Phase: Using mock data
const employees = ln<IEmployee[]>("employees.list");

// Production Phase: Switch to real API
const employees = await fetch('/api/employees').then(r => r.json());

// UI rendering code stays identical! 🎉
return (
  <table>
    {employees.map(emp => (
      <tr key={emp.id}>
        <td>{emp.name}</td>
        <td>{emp.position}</td>
      </tr>
    ))}
  </table>
);
```

You can even use environment variables to toggle between mock and real data:

```tsx
const employees = import.meta.env.DEV 
  ? ln<IEmployee[]>("employees.list")  // Mock data in development
  : await fetchEmployees();             // Real API in production
```

### 📊 Performance Considerations

| Dataset Size | Impact | Recommendation |
|-------------|--------|----------------|
| **Small** (<50 items) | ✅ Negligible | Perfect for mock data |
| **Medium** (50-200 items) | ⚠️ +5-20KB bundle size | Acceptable for demos |
| **Large** (>200 items) | ❌ Significant increase | Use real API instead |

**Note:** Currently, `adelson-localization` loads translations from `translation.json` only. For large datasets, use a separate API call:

```tsx
// Approach for large datasets outside translation files
const largeData = await fetch('/api/large-dataset').then(r => r.json());
```

### 🎯 Summary

Mock data in translation files provides:
- ✅ **Type safety** with TypeScript generics (`ln<T>()`)
- ✅ **Localized examples** (different data per language)
- ✅ **Zero backend dependency** during development
- ✅ **Version control** for test data
- ✅ **Easy migration** to real APIs later

This unique feature makes Adelson Localization more than just an i18n library—it's also a **type-safe mock data provider** for rapid development! 🚀

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
- 📧 Email: [adelsonjnjr+adelson@gmail.com](mailto:adelsonjnjr+adelson@gmail.com)

---

**Made with ❤️ by Jean Junior Adelson**
