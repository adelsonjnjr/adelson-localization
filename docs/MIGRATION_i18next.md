# 🔄 Migration from react-i18next

Complete guide for migrating from react-i18next to Adelson Localization.

---

## Why Migrate?

### Benefits
- ⚡ **85% smaller** - From ~31KB to ~5KB
- 🚀 **Faster setup** - From 15-20 lines to 3-5 lines
- 📦 **Zero dependencies** - No i18next core dependency
- 🎯 **Simpler API** - One hook instead of multiple
- 🔥 **Built-in HMR** - No plugin needed

### Trade-offs
- ⚠️ **Fewer plural forms** - 7 languages vs 200+
- ⚠️ **No namespaces** - Use multiple resource files instead
- ⚠️ **No formatters** - No built-in number/date formatting
- ⚠️ **No context** - Not supported

---

## Quick Migration Checklist

- [ ] Install adelson-localization
- [ ] Remove react-i18next and i18next
- [ ] Update initialization code
- [ ] Replace `useTranslation` with `useLanguage`
- [ ] Replace `t()` with `ln()`
- [ ] Update translation file structure
- [ ] Update plural forms
- [ ] Test all translations
- [ ] Update tests

---

## Installation

```bash
# Uninstall react-i18next
npm uninstall react-i18next i18next i18next-http-backend

# Install Adelson Localization
npm install adelson-localization
```

---

## Code Migration

### 1. Initialization

**Before (react-i18next):**
```tsx
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

// index.tsx
import './i18n';
import App from './App';
```

**After (Adelson):**
```tsx
// No separate i18n file needed!
// Just use the hook directly in components
import { useLanguage } from 'adelson-localization';

function App() {
  const { ln } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales'
  });
  
  return <div>{ln('app.title')}</div>;
}
```

### 2. Hook Usage

**Before (react-i18next):**
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <button onClick={() => i18n.changeLanguage('fr')}>
        French
      </button>
    </div>
  );
}
```

**After (Adelson):**
```tsx
import { useLanguage } from 'adelson-localization';

function MyComponent() {
  const { ln, setLanguage } = useLanguage({ lang: 'en' });
  
  return (
    <div>
      <h1>{ln('app.title')}</h1>
      <button onClick={() => setLanguage({ key: 'fr' })}>
        French
      </button>
    </div>
  );
}
```

### 3. Placeholders

**Before (react-i18next):**
```tsx
// Named parameters
t('greeting', { name: 'John' });

// Multiple parameters
t('message', { user: 'Alice', count: 5 });
```

**After (Adelson):**
```tsx
// Named parameters (same syntax!)
ln('greeting', { name: 'John' });

// Multiple parameters (same!)
ln('message', { user: 'Alice', count: 5 });

// Bonus: Indexed parameters
ln('greeting', 'John');  // Simpler for single param
ln('message', 'Alice', 5);  // Simpler for ordered params
```

### 4. Plural Forms

**Before (react-i18next):**
```tsx
// Translation file
{
  "messages": "You have {{count}} message",
  "messages_plural": "You have {{count}} messages"
}

// Usage
t('messages', { count: 1 });  // "You have 1 message"
t('messages', { count: 5 });  // "You have 5 messages"
```

**After (Adelson):**
```tsx
// Translation file (nested structure)
{
  "messages": {
    "singular": "You have {{}} message",
    "plural": "You have {{}} messages"
  }
}

// Usage (dedicated function)
lnPlural('messages', 1);  // "You have 1 message"
lnPlural('messages', 5);  // "You have 5 messages"
```

### 5. Namespaces → Multiple Resource Files

**Before (react-i18next):**
```tsx
// With namespaces
const { t } = useTranslation(['common', 'auth', 'dashboard']);

t('common:app.title');
t('auth:login.button');
t('dashboard:welcome');
```

**After (Adelson):**
```tsx
// With multiple resource files (v1.1.0)
const { ln } = useLanguage({
  lang: 'en',
  resourceFiles: ['common.json', 'auth.json', 'dashboard.json']
});

ln('app.title');        // From common.json
ln('login.button');     // From auth.json
ln('welcome');          // From dashboard.json
```

**Note:** No namespace prefixes needed. Keys are merged automatically.

### 6. Fallback Text

**Before (react-i18next):**
```tsx
t('missing.key', 'Fallback text');
```

**After (Adelson):**
```tsx
ln('missing.key', { defaultTxt: 'Fallback text' });
```

---

## Translation File Migration

### File Structure

**Before (react-i18next):**
```
locales/
  en/
    translation.json
    common.json
    auth.json
  fr/
    translation.json
    common.json
    auth.json
```

**After (Adelson):**
```
locales/
  en/
    translation.json  (or specify custom files)
    common.json
    auth.json
  fr/
    translation.json
    common.json
    auth.json
```

Same structure! Just update the hook configuration if using multiple files.

### Translation File Format

**Before (react-i18next):**
```json
{
  "app": {
    "title": "My App",
    "description": "Welcome"
  },
  "messages": "You have {{count}} message",
  "messages_plural": "You have {{count}} messages",
  "greeting": "Hello {{name}}!"
}
```

**After (Adelson):**
```json
{
  "app": {
    "title": "My App",
    "description": "Welcome"
  },
  "messages": {
    "singular": "You have {{}} message",
    "plural": "You have {{}} messages"
  },
  "greeting": "Hello {{name}}!"
}
```

Changes:
- Plurals use nested `singular`/`plural` structure
- Can use `{{}}` for indexed placeholders (optional)

---

## Context Provider Pattern

### Before (react-i18next)

**Provider:**
```tsx
// Not needed - i18n is global singleton
import './i18n';

function App() {
  return <MyApp />;
}
```

**Usage:**
```tsx
function MyComponent() {
  const { t } = useTranslation();
  return <div>{t('app.title')}</div>;
}
```

### After (Adelson)

**Option 1: Use hook directly (simplest)**
```tsx
function MyComponent() {
  const { ln } = useLanguage({ lang: 'en' });
  return <div>{ln('app.title')}</div>;
}
```

**Option 2: Context Provider (for app-wide config)**
```tsx
// Create context
import React, { createContext, useContext } from 'react';
import { useLanguage, UseLanguageReturn } from 'adelson-localization';

const LanguageContext = createContext<UseLanguageReturn | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const languageApi = useLanguage({
    lang: 'en',
    translationsUrl: '/locales',
    managedLanguages: ['en', 'fr', 'es']
  });

  return (
    <LanguageContext.Provider value={languageApi}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation requires LanguageProvider');
  return context;
}

// App.tsx
function App() {
  return (
    <LanguageProvider>
      <MyApp />
    </LanguageProvider>
  );
}

// Component.tsx
function MyComponent() {
  const { ln } = useTranslation();
  return <div>{ln('app.title')}</div>;
}
```

---

## Feature Mapping

| react-i18next Feature | Adelson Equivalent | Notes |
|-----------------------|-------------------|-------|
| `t(key)` | `ln(key)` | Basic translation |
| `t(key, { name })` | `ln(key, { name })` | Named params (same!) |
| `t(key, { count })` | `lnPlural(key, count)` | Different function |
| `i18n.changeLanguage()` | `setLanguage({ key })` | Different API |
| `i18n.language` | `language.key` | Different property |
| Namespaces | Multiple resource files | v1.1.0 feature |
| `t(key, 'fallback')` | `ln(key, { defaultTxt })` | Different syntax |
| Context | ❌ Not supported | Remove or refactor |
| Backend plugins | Built-in fetch | Simpler |
| Language detector | Manual | Implement yourself |

---

## Testing Migration

### Before (react-i18next)

```tsx
import { render } from '@testing-library/react';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn()
    }
  })
}));

test('renders component', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MyComponent />
    </I18nextProvider>
  );
});
```

### After (Adelson)

```tsx
import { render } from '@testing-library/react';

// Mock fetch
const mockFetch = (translations: any) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(translations)
    } as Response)
  );
};

test('renders component', async () => {
  mockFetch({
    app: { title: 'Test Title' }
  });

  render(<MyComponent />);
  
  // Wait for translations to load
  await waitFor(() => {
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

---

## Common Patterns

### 1. Language Persistence

**Before (react-i18next with detector):**
```tsx
// Automatic via i18next-browser-languagedetector
```

**After (Adelson):**
```tsx
function App() {
  const [lang, setLang] = React.useState(
    () => localStorage.getItem('language') || 'en'
  );

  const { ln, setLanguage } = useLanguage({ lang });

  const changeLanguage = (newLang: string) => {
    localStorage.setItem('language', newLang);
    setLang(newLang);
    setLanguage({ key: newLang });
  };

  return (
    <div>
      <button onClick={() => changeLanguage('fr')}>FR</button>
    </div>
  );
}
```

### 2. Missing Translation Handler

**Before (react-i18next):**
```tsx
i18n.init({
  saveMissing: true,
  missingKeyHandler: (lng, ns, key) => {
    console.warn(`Missing translation: ${key}`);
  }
});
```

**After (Adelson):**
```tsx
// Create wrapper
function safeLn(ln: Function, key: string, ...args: any[]) {
  const result = ln(key, ...args);
  if (!result) {
    console.warn(`Missing translation: ${key}`);
    return key; // Return key as fallback
  }
  return result;
}

// Usage
const result = safeLn(ln, 'missing.key');
```

---

## Step-by-Step Migration Process

### Phase 1: Preparation
1. ✅ Audit current i18n usage
2. ✅ Document all translation keys
3. ✅ List features used (namespaces, context, etc.)
4. ✅ Create migration branch

### Phase 2: Setup
1. ✅ Install adelson-localization
2. ✅ Keep react-i18next temporarily (parallel mode)
3. ✅ Create custom hook wrapper if needed
4. ✅ Set up testing utilities

### Phase 3: Migration
1. ✅ Migrate translation files (plural structure)
2. ✅ Update one component at a time
3. ✅ Update tests for migrated components
4. ✅ Test thoroughly

### Phase 4: Cleanup
1. ✅ Remove react-i18next imports
2. ✅ Delete i18n config files
3. ✅ Uninstall dependencies
4. ✅ Update documentation

---

## Troubleshooting

### Issue: Plurals not working

**Problem:**
```tsx
ln('messages', { count: 5 });  // Doesn't work
```

**Solution:**
```tsx
// Use lnPlural instead
lnPlural('messages', 5);

// Update translation structure
{
  "messages": {
    "singular": "...",
    "plural": "..."
  }
}
```

### Issue: Namespace not found

**Problem:**
```tsx
ln('common:app.title');  // Doesn't work
```

**Solution:**
```tsx
// Remove namespace prefix
ln('app.title');

// Use multiple resource files
const { ln } = useLanguage({
  resourceFiles: ['common.json', 'other.json']
});
```

### Issue: Context not supported

**Problem:**
```tsx
t('friend', { context: 'male' });  // Feature doesn't exist
```

**Solution:**
```tsx
// Create separate keys
ln('friend.male');
ln('friend.female');

// Or use conditional logic
const key = isMale ? 'friend.male' : 'friend.female';
ln(key);
```

---

## Performance Comparison

After migration, you should see:

**Bundle size:**
- Before: ~31KB (react-i18next + i18next)
- After: ~5KB (adelson-localization)
- **Savings: 26KB (84% reduction)**

**Initial load:**
- Before: ~120ms
- After: ~50ms
- **Improvement: 70ms faster**

---

## Need Help?

- 📖 [Full Documentation](../README.md)
- 💬 [GitHub Issues](https://github.com/adelson/adelson-localization/issues)
- 📧 Email support

---

[← Back to Comparison](./COMPARISON.md) | [README →](../README.md)
