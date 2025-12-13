# 📘 API Reference

Complete API documentation for Adelson Localization.

---

## `useLanguage(config)`

The main hook for internationalization in your React application.

### Parameters

```typescript
interface UseLanguageConfig {
  lang?: string;
  translationsUrl?: string;
  managedLanguages?: string[];
  enableHMR?: boolean;
  resourceFiles?: string[];
}
```

#### `lang` (optional)
- **Type:** `string`
- **Default:** `"en"`
- **Description:** Initial language to load

```tsx
const { ln } = useLanguage({ lang: "fr" });
```

#### `translationsUrl` (optional)
- **Type:** `string`
- **Default:** `"/locales"`
- **Description:** Base URL where translation files are located

```tsx
// Local files
const { ln } = useLanguage({ 
  translationsUrl: "/locales"
});

// CDN
const { ln } = useLanguage({ 
  translationsUrl: "https://cdn.example.com/i18n"
});
```

#### `managedLanguages` (optional)
- **Type:** `string[]`
- **Default:** `["en", "fr", "es"]`
- **Description:** Array of supported language codes

```tsx
const { ln } = useLanguage({ 
  managedLanguages: ["en", "fr", "es", "de", "it"]
});
```

#### `enableHMR` (optional)
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable Hot Module Replacement for translations in development

```tsx
const { ln } = useLanguage({ 
  enableHMR: true  // Auto-reload translations every 2 seconds in dev
});
```

#### `resourceFiles` (optional) 🆕 v1.1.0
- **Type:** `string[]`
- **Default:** `["translation.json"]`
- **Description:** Array of translation file names to load and merge

```tsx
const { ln } = useLanguage({ 
  resourceFiles: ["common.json", "auth.json", "dashboard.json"]
});
```

---

### Return Value

```typescript
interface UseLanguageReturn {
  resource: any;
  ln: <T = string>(key: string, ...args: any[]) => T;
  lnPlural: <T = string>(key: string, count: number, ...args: any[]) => T;
  language: { key: string };
  setLanguage: (lang: { key: string }) => void;
  loadingResource: boolean;
}
```

#### `resource`
- **Type:** `any`
- **Description:** Raw translation data object

```tsx
const { resource } = useLanguage({ lang: "en" });
console.log(resource);  // { app: { title: "My App" }, ... }
```

#### `ln<T>(key, ...args)`
- **Type:** `<T = string>(key: string, ...args: any[]) => T`
- **Description:** Main localization function with TypeScript generics support

**Parameters:**
- `key`: Dot-notation path to translation (e.g., "app.title")
- `...args`: Variable arguments for placeholders and options

**Supported argument patterns:**

1. **Indexed placeholders:**
```tsx
ln("greeting", "John")  // "Hello {{}}!" → "Hello John!"
ln("message", "Alice", 5)  // "Hello {{}}! You have {{}} messages."
```

2. **Named placeholders:**
```tsx
ln("profile", { firstName: "John", lastName: "Doe" })
// "{{firstName}} {{lastName}}" → "John Doe"
```

3. **Mixed placeholders:**
```tsx
ln("order", "#12345", { customer: "Alice", total: 99.99 })
// "Order {{}} for {{customer}} - Total: ${{total}}"
```

4. **With default fallback:**
```tsx
ln("missing.key", { defaultTxt: "Fallback text" })
// Returns "Fallback text" if key doesn't exist
```

5. **TypeScript generics:**
```tsx
const maxItems = ln<number>("config.maxItems");  // number
const features = ln<string[]>("config.features");  // string[]
const settings = ln<AppSettings>("app.settings");  // AppSettings
```

#### `lnPlural<T>(key, count, ...args)`
- **Type:** `<T = string>(key: string, count: number, ...args: any[]) => T`
- **Description:** Localization function with plural support

**Parameters:**
- `key`: Base key path (e.g., "messages.notification")
- `count`: Number to determine singular/plural form
- `...args`: Additional arguments for placeholders

**Translation structure:**
```json
{
  "messages": {
    "notification": {
      "singular": "You have {{}} new message",
      "plural": "You have {{}} new messages"
    }
  }
}
```

**Usage:**
```tsx
lnPlural("messages.notification", 1)   // "You have 1 new message"
lnPlural("messages.notification", 5)   // "You have 5 new messages"
lnPlural("messages.notification", 0)   // "You have 0 new messages" (EN rule)
```

**Plural rules by language:**
- **English (en):** `count === 1` → singular, else plural
- **French (fr):** `count <= 1` → singular, else plural
- **Spanish (es):** `count === 1` → singular, else plural
- **German (de):** `count === 1` → singular, else plural
- **Italian (it):** `count === 1` → singular, else plural
- **Portuguese (pt):** `count === 1` → singular, else plural
- **Dutch (nl):** `count === 1` → singular, else plural

[See detailed plural rules →](./PLURAL_RULES.md)

#### `language`
- **Type:** `{ key: string }`
- **Description:** Current language object

```tsx
const { language } = useLanguage({ lang: "en" });
console.log(language.key);  // "en"
```

#### `setLanguage(lang)`
- **Type:** `(lang: { key: string }) => void`
- **Description:** Function to change the current language

```tsx
const { setLanguage } = useLanguage({ lang: "en" });

// Change language
setLanguage({ key: "fr" });
```

**Behavior:**
- Triggers a re-fetch of translation files
- Updates all translations in the UI
- Resets `loadingResource` to `true` during loading

#### `loadingResource`
- **Type:** `boolean`
- **Description:** Loading state indicator

```tsx
const { ln, loadingResource } = useLanguage({ lang: "en" });

if (loadingResource) {
  return <div>Loading translations...</div>;
}

return <div>{ln("app.title")}</div>;
```

---

## Exported Utility Functions

### `deepMerge(...objects)`

Recursively merges multiple objects. Later objects override earlier ones.

```typescript
import { deepMerge } from 'adelson-localization';

const result = deepMerge(obj1, obj2, obj3, ...);
```

[See utility functions documentation →](./UTILITY_FUNCTIONS.md)

### `strictDeepMerge(target, ...sources)`

Like `deepMerge`, but only updates existing keys in the target.

```typescript
import { strictDeepMerge } from 'adelson-localization';

strictDeepMerge(target, source1, source2, ...);
```

[See utility functions documentation →](./UTILITY_FUNCTIONS.md)

### `stringHelpExtensions()`

Initializes string helper extensions (called automatically by the hook).

```typescript
import { stringHelpExtensions } from 'adelson-localization';

stringHelpExtensions();
```

---

## TypeScript Types

### Complete Type Definitions

```typescript
// Configuration
export interface UseLanguageConfig {
  lang?: string;
  translationsUrl?: string;
  managedLanguages?: string[];
  enableHMR?: boolean;
  resourceFiles?: string[];
}

// Return type
export interface UseLanguageReturn {
  resource: any;
  ln: <T = string>(key: string, ...args: any[]) => T;
  lnPlural: <T = string>(key: string, count: number, ...args: any[]) => T;
  language: { key: string };
  setLanguage: (lang: { key: string }) => void;
  loadingResource: boolean;
}

// Hook signature
export function useLanguage(config: UseLanguageConfig): UseLanguageReturn;

// Utility functions
export function deepMerge(...objects: any[]): any;
export function strictDeepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: any[]
): T;
```

---

## Error Handling

### Translation Key Not Found

When a key doesn't exist:

```tsx
ln("nonexistent.key")  // Returns empty string ""
```

**With fallback:**
```tsx
ln("nonexistent.key", { defaultTxt: "Fallback" })  // Returns "Fallback"
```

### Language Not in managedLanguages

```tsx
const { ln } = useLanguage({ 
  lang: "de",  // German
  managedLanguages: ["en", "fr", "es"]  // German not included
});
```

**Behavior:**
- Logs warning: `Language "de" is not in managedLanguages array`
- Skips translation loading
- `loadingResource` becomes `false`
- All `ln()` calls return empty strings

### Translation File Not Found (404)

```tsx
const { ln } = useLanguage({ 
  lang: "en",
  translationsUrl: "/wrong-path"
});
```

**Behavior:**
- Logs error: `Error loading translations: ...`
- Sets `resource` to `{}`
- All `ln()` calls return empty strings
- Use `loadingResource` to handle this state

---

## Performance Notes

- **Memoization:** `translationsUrl`, `managedLanguages`, and `resourceFiles` are memoized to prevent unnecessary re-renders
- **Parallel loading:** Multiple resource files are loaded in parallel using `Promise.all()`
- **Cache:** Translation files use browser HTTP cache (unless `enableHMR: true`)
- **Bundle size:** ~5KB minified, zero runtime dependencies

---

[← Back to README](../README.md) | [Examples →](./EXAMPLES.md)
