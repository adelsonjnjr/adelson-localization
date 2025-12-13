# 📚 Examples

Complete examples demonstrating all features of Adelson Localization.

---

## Table of Contents

- [Basic Usage](#basic-usage)
- [Language Switching](#language-switching)
- [Indexed Placeholders](#indexed-placeholders)
- [Named Placeholders](#named-placeholders)
- [Mixed Placeholders](#mixed-placeholders)
- [Default Fallback](#default-fallback)
- [Plural Forms](#plural-forms)
- [TypeScript Generics](#typescript-generics)
- [Loading States](#loading-states)
- [CDN Usage](#cdn-usage)
- [Multiple Resource Files](#multiple-resource-files-v110)
- [Hot Module Replacement](#hot-module-replacement-development)

---

## Basic Usage

```tsx
import React from 'react';
import { useLanguage } from 'adelson-localization';

function App() {
  const { ln, loadingResource } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales'
  });

  if (loadingResource) {
    return <div>Loading translations...</div>;
  }

  return (
    <div>
      <h1>{ln('app.title')}</h1>
      <p>{ln('app.description')}</p>
    </div>
  );
}
```

**Translation file** (`/locales/en/translation.json`):
```json
{
  "app": {
    "title": "My Application",
    "description": "Welcome to our amazing app!"
  }
}
```

---

## Language Switching

```tsx
import React from 'react';
import { useLanguage } from 'adelson-localization';

function LanguageSwitcher() {
  const { ln, language, setLanguage, loadingResource } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales',
    managedLanguages: ['en', 'fr', 'es', 'de']
  });

  const handleLanguageChange = (langCode: string) => {
    setLanguage({ key: langCode });
  };

  return (
    <div>
      <h1>{ln('settings.selectLanguage')}</h1>
      
      <div>
        <button 
          onClick={() => handleLanguageChange('en')}
          disabled={language.key === 'en'}
        >
          English
        </button>
        <button 
          onClick={() => handleLanguageChange('fr')}
          disabled={language.key === 'fr'}
        >
          Français
        </button>
        <button 
          onClick={() => handleLanguageChange('es')}
          disabled={language.key === 'es'}
        >
          Español
        </button>
        <button 
          onClick={() => handleLanguageChange('de')}
          disabled={language.key === 'de'}
        >
          Deutsch
        </button>
      </div>

      {loadingResource && <p>Changing language...</p>}
      
      <p>{ln('settings.currentLanguage')}: {language.key}</p>
    </div>
  );
}
```

---

## Indexed Placeholders

Use `{{}}` for indexed placeholders in translations.

```tsx
function Greeting() {
  const { ln } = useLanguage({ lang: 'en' });
  
  const userName = "Alice";
  const messageCount = 5;
  
  return (
    <div>
      <p>{ln('greetings.simple', userName)}</p>
      <p>{ln('notifications.multiple', userName, messageCount)}</p>
    </div>
  );
}
```

**Translation file:**
```json
{
  "greetings": {
    "simple": "Hello, {{}}!"
  },
  "notifications": {
    "multiple": "Hi {{}}! You have {{}} new messages."
  }
}
```

**Output:**
- "Hello, Alice!"
- "Hi Alice! You have 5 new messages."

---

## Named Placeholders

Use `{{name}}` for named placeholders in translations.

```tsx
function UserProfile() {
  const { ln } = useLanguage({ lang: 'en' });
  
  const user = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    city: "New York"
  };
  
  return (
    <div>
      <h2>{ln('profile.fullName', user)}</h2>
      <p>{ln('profile.details', user)}</p>
    </div>
  );
}
```

**Translation file:**
```json
{
  "profile": {
    "fullName": "{{firstName}} {{lastName}}",
    "details": "{{firstName}} is {{age}} years old and lives in {{city}}."
  }
}
```

**Output:**
- "John Doe"
- "John is 30 years old and lives in New York."

---

## Mixed Placeholders

Combine indexed and named placeholders.

```tsx
function OrderSummary() {
  const { ln } = useLanguage({ lang: 'en' });
  
  const orderId = "#12345";
  const details = {
    customer: "Alice",
    total: 99.99,
    items: 3
  };
  
  return (
    <div>
      <h3>{ln('orders.title', orderId)}</h3>
      <p>{ln('orders.summary', orderId, details)}</p>
    </div>
  );
}
```

**Translation file:**
```json
{
  "orders": {
    "title": "Order {{}}",
    "summary": "Order {{}} for {{customer}} - {{items}} items - Total: ${{total}}"
  }
}
```

**Output:**
- "Order #12345"
- "Order #12345 for Alice - 3 items - Total: $99.99"

---

## Default Fallback

Provide fallback text when keys might not exist.

```tsx
function DynamicContent() {
  const { ln } = useLanguage({ lang: 'en' });
  
  // Key might not exist in translations
  const customMessage = ln('custom.message', { 
    defaultTxt: 'This is a fallback message' 
  });
  
  return (
    <div>
      <p>{customMessage}</p>
      <p>{ln('missing.key', { defaultTxt: 'Default text here' })}</p>
    </div>
  );
}
```

**Translation file:**
```json
{
  "custom": {
    // "message" key doesn't exist
  }
}
```

**Output:** (Shows fallback text)
- "This is a fallback message"
- "Default text here"

---

## Plural Forms

Use `lnPlural` for proper singular/plural handling based on count.

```tsx
function NotificationCenter() {
  const { lnPlural } = useLanguage({ lang: 'en' });
  
  const [messageCount, setMessageCount] = React.useState(0);
  
  return (
    <div>
      <h2>Notifications</h2>
      <p>{lnPlural('messages.notification', messageCount)}</p>
      
      <button onClick={() => setMessageCount(messageCount + 1)}>
        Add Message
      </button>
      <button onClick={() => setMessageCount(Math.max(0, messageCount - 1))}>
        Remove Message
      </button>
    </div>
  );
}
```

**Translation file (English):**
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

**Translation file (French):**
```json
{
  "messages": {
    "notification": {
      "singular": "Vous avez {{}} nouveau message",
      "plural": "Vous avez {{}} nouveaux messages"
    }
  }
}
```

**Output (English):**
- 0 → "You have 0 new messages"
- 1 → "You have 1 new message"
- 5 → "You have 5 new messages"

**Output (French):**
- 0 → "Vous avez 0 nouveau message" (FR rule: 0 and 1 are singular)
- 1 → "Vous avez 1 nouveau message"
- 5 → "Vous avez 5 nouveaux messages"

---

## TypeScript Generics

Type-safe translations with TypeScript generics.

```tsx
interface AppConfig {
  maxItems: number;
  features: string[];
  theme: 'light' | 'dark';
}

function ConfigComponent() {
  const { ln } = useLanguage({ lang: 'en' });
  
  // Type-safe number
  const maxItems = ln<number>('config.maxItems');
  
  // Type-safe array
  const features = ln<string[]>('config.features');
  
  // Type-safe object
  const config = ln<AppConfig>('app.config');
  
  return (
    <div>
      <p>Max Items: {maxItems}</p>
      <p>Features: {features.join(', ')}</p>
      <p>Theme: {config.theme}</p>
    </div>
  );
}
```

**Translation file:**
```json
{
  "config": {
    "maxItems": 100,
    "features": ["search", "export", "analytics"]
  },
  "app": {
    "config": {
      "maxItems": 50,
      "features": ["dashboard", "reports"],
      "theme": "light"
    }
  }
}
```

---

## Loading States

Handle loading states elegantly.

```tsx
function LoadingExample() {
  const { ln, loadingResource, language } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales'
  });

  if (loadingResource) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading translations for {language.key}...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{ln('app.title')}</h1>
      <p>{ln('app.description')}</p>
    </div>
  );
}
```

---

## CDN Usage

Load translations from a CDN or external server.

```tsx
function CDNExample() {
  const { ln, loadingResource } = useLanguage({
    lang: 'en',
    translationsUrl: 'https://cdn.example.com/i18n',
    managedLanguages: ['en', 'fr', 'es']
  });

  if (loadingResource) {
    return <div>Loading...</div>;
  }

  return <div>{ln('app.welcome')}</div>;
}
```

**Translation URLs loaded:**
- `https://cdn.example.com/i18n/en/translation.json`
- (or when switching to French: `https://cdn.example.com/i18n/fr/translation.json`)

---

## Multiple Resource Files (v1.1.0)

🆕 Load and merge multiple translation files for better organization.

### Example 1: Modular Translations

```tsx
function ModularApp() {
  const { ln, loadingResource } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales',
    resourceFiles: ['common.json', 'auth.json', 'dashboard.json']
  });

  if (loadingResource) {
    return <div>Loading translations...</div>;
  }

  return (
    <div>
      {/* From common.json */}
      <h1>{ln('common.appTitle')}</h1>
      
      {/* From auth.json */}
      <button>{ln('auth.login')}</button>
      
      {/* From dashboard.json */}
      <p>{ln('dashboard.welcome')}</p>
    </div>
  );
}
```

**File structure:**
```
/locales/
  en/
    common.json      → { "common": { "appTitle": "My App" } }
    auth.json        → { "auth": { "login": "Login" } }
    dashboard.json   → { "dashboard": { "welcome": "Welcome" } }
```

### Example 2: Base + Feature Files

```tsx
function FeatureBasedApp() {
  const { ln } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales',
    resourceFiles: [
      'base.json',      // Common translations
      'products.json',  // Product-specific
      'checkout.json'   // Checkout-specific
    ]
  });

  return (
    <div>
      <h1>{ln('base.header')}</h1>
      <div className="products">
        <h2>{ln('products.title')}</h2>
        <button>{ln('products.addToCart')}</button>
      </div>
      <div className="checkout">
        <h2>{ln('checkout.title')}</h2>
        <button>{ln('checkout.complete')}</button>
      </div>
    </div>
  );
}
```

### Example 3: Override Pattern

```tsx
function ThemeOverrideApp() {
  const { ln } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales',
    resourceFiles: [
      'default.json',    // Default translations
      'theme-dark.json'  // Dark theme overrides
    ]
  });

  return <div>{ln('app.title')}</div>;
}
```

**default.json:**
```json
{
  "app": {
    "title": "My App",
    "theme": "light"
  }
}
```

**theme-dark.json:**
```json
{
  "app": {
    "theme": "dark"  // Overrides default
  }
}
```

**Merged result:**
```json
{
  "app": {
    "title": "My App",    // From default.json
    "theme": "dark"       // From theme-dark.json (override)
  }
}
```

[Learn more about multiple resource files →](./ADVANCED_FEATURES.md#multiple-resource-files)

---

## Hot Module Replacement (Development)

Enable HMR to auto-reload translations during development.

```tsx
function DevelopmentApp() {
  const { ln, loadingResource } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales',
    enableHMR: true  // Reloads every 2 seconds in dev
  });

  return (
    <div>
      <h1>{ln('app.title')}</h1>
      {loadingResource && <span className="hmr-indicator">↻</span>}
    </div>
  );
}
```

**⚠️ Important:** Only use `enableHMR: true` in development, not production!

[Learn more about HMR →](./ADVANCED_FEATURES.md#hot-module-replacement-hmr)

---

## Complete Real-World Example

A full-featured app demonstrating multiple features.

```tsx
import React, { useState } from 'react';
import { useLanguage } from 'adelson-localization';

interface User {
  name: string;
  email: string;
}

function RealWorldApp() {
  const { ln, lnPlural, language, setLanguage, loadingResource } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales',
    managedLanguages: ['en', 'fr', 'es'],
    resourceFiles: ['common.json', 'messages.json', 'notifications.json']
  });

  const [user] = useState<User>({ 
    name: 'Alice', 
    email: 'alice@example.com' 
  });
  const [messageCount, setMessageCount] = useState(3);

  if (loadingResource) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>{ln('common.loading', { defaultTxt: 'Loading...' })}</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header with language switcher */}
      <header>
        <h1>{ln('common.appTitle')}</h1>
        <div className="lang-switcher">
          {['en', 'fr', 'es'].map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage({ key: lang })}
              className={language.key === lang ? 'active' : ''}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* User greeting */}
      <section className="user-section">
        <h2>{ln('common.greeting', user.name)}</h2>
        <p>{ln('common.welcome', user)}</p>
      </section>

      {/* Notifications with plurals */}
      <section className="notifications">
        <h3>{ln('notifications.title')}</h3>
        <p>{lnPlural('messages.notification', messageCount)}</p>
        <div>
          <button onClick={() => setMessageCount(messageCount + 1)}>
            {ln('notifications.add')}
          </button>
          <button onClick={() => setMessageCount(Math.max(0, messageCount - 1))}>
            {ln('notifications.remove')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>{ln('common.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
}

export default RealWorldApp;
```

---

[← Back to README](../README.md) | [API Reference →](./API_REFERENCE.md)
