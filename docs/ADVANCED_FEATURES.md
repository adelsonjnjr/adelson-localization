# ⚡ Advanced Features

Deep dive into advanced features of Adelson Localization.

---

## Table of Contents

- [Multiple Resource Files](#multiple-resource-files-v110)
- [Hot Module Replacement (HMR)](#hot-module-replacement-hmr)
- [CDN and External Resources](#cdn-and-external-resources)
- [TypeScript Generics](#typescript-generics)
- [Custom Merge Strategies](#custom-merge-strategies)

---

## Multiple Resource Files (v1.1.0)

🆕 Load and automatically merge multiple translation files for better code organization and modularity.

### Why Use Multiple Files?

**Benefits:**
- ✅ **Modular organization** - Separate translations by feature/domain
- ✅ **Team collaboration** - Multiple devs can work on different files
- ✅ **Lazy loading potential** - Load only what you need (future feature)
- ✅ **Override pattern** - Base files + theme/brand overrides
- ✅ **Easier maintenance** - Smaller, focused files

### Basic Usage

```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: '/locales',
  resourceFiles: ['common.json', 'auth.json', 'dashboard.json']
});
```

**Files loaded in parallel:**
- `/locales/en/common.json`
- `/locales/en/auth.json`
- `/locales/en/dashboard.json`

### Merge Behavior

Files are merged left-to-right using deep merge. Later files override earlier ones.

**Example:**

**common.json:**
```json
{
  "app": {
    "title": "My App",
    "version": "1.0.0"
  },
  "buttons": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

**dashboard.json:**
```json
{
  "app": {
    "version": "2.0.0"  // Overrides common.json
  },
  "dashboard": {
    "welcome": "Welcome to Dashboard"
  }
}
```

**Merged result:**
```json
{
  "app": {
    "title": "My App",           // From common.json
    "version": "2.0.0"            // From dashboard.json (override)
  },
  "buttons": {
    "save": "Save",               // From common.json
    "cancel": "Cancel"            // From common.json
  },
  "dashboard": {
    "welcome": "Welcome to Dashboard"  // From dashboard.json
  }
}
```

### Organization Patterns

#### 1. Feature-Based Organization

Organize by application features:

```tsx
const { ln } = useLanguage({
  resourceFiles: [
    'common.json',      // Shared across app
    'auth.json',        // Authentication/authorization
    'products.json',    // Product catalog
    'checkout.json',    // Checkout flow
    'admin.json'        // Admin panel
  ]
});
```

**File structure:**
```
/locales/
  en/
    common.json       → { "common": {...}, "buttons": {...} }
    auth.json         → { "auth": { "login": ..., "register": ... } }
    products.json     → { "products": { "list": ..., "details": ... } }
    checkout.json     → { "checkout": { "cart": ..., "payment": ... } }
    admin.json        → { "admin": { "users": ..., "settings": ... } }
  fr/
    common.json
    auth.json
    ... (same structure)
```

#### 2. Layer-Based Organization

Organize by abstraction layers:

```tsx
const { ln } = useLanguage({
  resourceFiles: [
    'base.json',        // Foundation layer
    'components.json',  // Component-specific
    'pages.json',       // Page-specific
    'brand.json'        // Brand/theme overrides
  ]
});
```

#### 3. Domain-Driven Organization

Organize by business domains:

```tsx
const { ln } = useLanguage({
  resourceFiles: [
    'core.json',          // Core domain
    'customer.json',      // Customer domain
    'inventory.json',     // Inventory domain
    'reporting.json'      // Reporting domain
  ]
});
```

### Performance Considerations

**Parallel Loading:**
All files are loaded in parallel using `Promise.all()`, not sequentially.

```typescript
// Internally:
const results = await Promise.all(
  resourceFiles.map(file => fetch(`${translationsUrl}/${lang}/${file}`))
);
```

**Typical loading times:**
- 1 file: ~50ms
- 3 files: ~60ms (parallel)
- 5 files: ~70ms (parallel)

**Best practices:**
- Keep individual files under 50KB
- Use 3-7 files for optimal balance
- More files = better organization, slightly more HTTP requests
- Fewer files = simpler structure, single HTTP request

### Real-World Example

```tsx
// Multi-tenant SaaS application
function SaaSApp() {
  const tenantId = useTenantId();
  
  const { ln, loadingResource } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales',
    resourceFiles: [
      'base.json',                    // Default translations
      'features.json',                // Feature descriptions
      `tenants/${tenantId}.json`      // Tenant-specific overrides
    ]
  });

  if (loadingResource) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>{ln('app.title')}</h1>      {/* May be overridden by tenant */}
      <p>{ln('features.analytics')}</p>
    </div>
  );
}
```

### Migration from Single File

**Before (v1.0.x):**
```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: '/locales'
  // Loads: /locales/en/translation.json
});
```

**After (v1.1.0) - Backward compatible:**
```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: '/locales'
  // Still loads: /locales/en/translation.json (default)
});
```

**After (v1.1.0) - Multiple files:**
```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: '/locales',
  resourceFiles: ['common.json', 'app.json']
  // Loads: /locales/en/common.json + /locales/en/app.json
});
```

---

## Hot Module Replacement (HMR)

🔥 Auto-reload translations during development without refreshing the page.

### How It Works

When `enableHMR: true`:
1. Translations reload every 2 seconds
2. Changes to JSON files are detected automatically
3. UI updates without full page refresh
4. `loadingResource` briefly becomes `true` during reload

### Usage

```tsx
function DevApp() {
  const { ln, loadingResource } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales',
    enableHMR: true  // Enable HMR
  });

  return (
    <div>
      <h1>{ln('app.title')}</h1>
      {loadingResource && <span className="hmr-badge">Reloading...</span>}
    </div>
  );
}
```

### Environment-Specific Configuration

```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: '/locales',
  enableHMR: process.env.NODE_ENV === 'development'  // Only in dev
});
```

### Visual Feedback

Add a subtle indicator when translations reload:

```tsx
function AppWithHMR() {
  const { ln, loadingResource } = useLanguage({
    lang: 'en',
    enableHMR: true
  });

  return (
    <div>
      {loadingResource && (
        <div className="hmr-indicator">
          <span>↻</span> Reloading translations...
        </div>
      )}
      <h1>{ln('app.title')}</h1>
    </div>
  );
}
```

**CSS:**
```css
.hmr-indicator {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Workflow

**Developer workflow with HMR:**

1. Start dev server:
```bash
npm run dev
```

2. Component with HMR enabled:
```tsx
const { ln } = useLanguage({ enableHMR: true });
```

3. Edit translation file:
```json
{
  "app": {
    "title": "My Application"  // Edit this
  }
}
```

4. Save file → Translations auto-reload (within 2 seconds) → UI updates

### Performance Impact

**Development:**
- Polls every 2 seconds
- Network request every 2s (cached if unchanged)
- Minimal impact on dev experience

**Production:**
- **NEVER enable in production!**
- Unnecessary network requests
- Potential performance degradation

### Best Practices

✅ **Do:**
- Use `enableHMR: true` only in development
- Use environment variable: `process.env.NODE_ENV === 'development'`
- Add visual feedback for reload state
- Test translations before committing

❌ **Don't:**
- Enable in production builds
- Rely on HMR for testing (write proper tests)
- Use with CDN (defeats purpose of HMR)

---

## CDN and External Resources

Load translations from CDN, external servers, or cloud storage.

### Basic CDN Usage

```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: 'https://cdn.example.com/i18n',
  managedLanguages: ['en', 'fr', 'es']
});

// Loads: https://cdn.example.com/i18n/en/translation.json
```

### Popular CDN Providers

#### AWS S3 + CloudFront

```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: 'https://d1234abcd.cloudfront.net/translations',
  resourceFiles: ['common.json', 'app.json']
});

// Loads:
// https://d1234abcd.cloudfront.net/translations/en/common.json
// https://d1234abcd.cloudfront.net/translations/en/app.json
```

#### Azure CDN

```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: 'https://mycdn.azureedge.net/locales'
});
```

#### Cloudflare CDN

```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: 'https://translations.example.com/i18n'
});
```

### Cache Control

**Recommended cache headers for CDN:**

```http
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
Content-Type: application/json
```

**S3 metadata example:**
```json
{
  "CacheControl": "public, max-age=3600",
  "ContentType": "application/json"
}
```

### Versioned URLs

Add version to cache-bust:

```tsx
const VERSION = '1.2.0';

const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: `https://cdn.example.com/i18n/v${VERSION}`
});

// Loads: https://cdn.example.com/i18n/v1.2.0/en/translation.json
```

### Environment-Based URLs

```tsx
const getTranslationsUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://cdn.production.com/i18n';
  }
  if (process.env.NODE_ENV === 'staging') {
    return 'https://cdn.staging.com/i18n';
  }
  return '/locales';  // Local development
};

const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: getTranslationsUrl()
});
```

### Error Handling for CDN

```tsx
function CDNApp() {
  const { ln, loadingResource, resource } = useLanguage({
    lang: 'en',
    translationsUrl: 'https://cdn.example.com/i18n'
  });

  // Check if translations loaded
  if (!loadingResource && Object.keys(resource).length === 0) {
    return (
      <div className="error">
        <h1>Translation Loading Error</h1>
        <p>Failed to load translations from CDN.</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (loadingResource) {
    return <LoadingSpinner />;
  }

  return <div>{ln('app.title')}</div>;
}
```

---

## TypeScript Generics

Type-safe translations with full TypeScript support.

### Basic Generic Usage

```tsx
// String (default)
const title = ln('app.title');  // string

// Number
const maxItems = ln<number>('config.maxItems');  // number

// Boolean
const isEnabled = ln<boolean>('features.analytics');  // boolean

// Array
const languages = ln<string[]>('config.languages');  // string[]
```

### Complex Types

```tsx
interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

interface AppConfig {
  maxUploadSize: number;
  allowedFormats: string[];
  settings: UserSettings;
}

function ConfigComponent() {
  const { ln } = useLanguage({ lang: 'en' });
  
  const config = ln<AppConfig>('app.config');
  
  return (
    <div>
      <p>Theme: {config.settings.theme}</p>
      <p>Max Upload: {config.maxUploadSize}MB</p>
      <p>Formats: {config.allowedFormats.join(', ')}</p>
    </div>
  );
}
```

### Type Guards

```tsx
function isValidConfig(value: unknown): value is AppConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    'maxUploadSize' in value &&
    'allowedFormats' in value
  );
}

function SafeConfigComponent() {
  const { ln } = useLanguage({ lang: 'en' });
  
  const configValue = ln('app.config');
  
  if (!isValidConfig(configValue)) {
    return <div>Invalid configuration</div>;
  }
  
  // Now TypeScript knows configValue is AppConfig
  return <div>{configValue.maxUploadSize}</div>;
}
```

---

## Custom Merge Strategies

Advanced merging with `deepMerge` and `strictDeepMerge` utilities.

### Using deepMerge Directly

```tsx
import { deepMerge } from 'adelson-localization';

const base = { a: 1, b: { c: 2 } };
const override = { b: { d: 3 }, e: 4 };

const result = deepMerge(base, override);
// { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

[See full documentation →](./UTILITY_FUNCTIONS.md)

### Using strictDeepMerge

```tsx
import { strictDeepMerge } from 'adelson-localization';

const schema = { a: 1, b: { c: 2 } };
const updates = { b: { c: 99, d: 3 }, e: 4 };

strictDeepMerge(schema, updates);
// schema is now: { a: 1, b: { c: 99 } }
// Keys 'd' and 'e' were ignored (not in original)
```

[See full documentation →](./UTILITY_FUNCTIONS.md)

---

[← Back to README](../README.md) | [Examples →](./EXAMPLES.md)
