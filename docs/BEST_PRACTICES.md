# 📋 Best Practices

Production-ready patterns and recommendations for using Adelson Localization.

---

## File Organization

### Recommended Structure

```
project/
├── public/
│   └── locales/
│       ├── en/
│       │   ├── common.json
│       │   ├── auth.json
│       │   └── dashboard.json
│       ├── fr/
│       │   ├── common.json
│       │   ├── auth.json
│       │   └── dashboard.json
│       └── es/
│           ├── common.json
│           ├── auth.json
│           └── dashboard.json
├── src/
│   ├── hooks/
│   │   └── useAppLanguage.ts  ← Custom wrapper
│   ├── contexts/
│   │   └── LanguageContext.tsx
│   └── types/
│       └── translations.ts
└── package.json
```

---

## Custom Hook Wrapper

Create a custom wrapper for project-specific configuration:

```tsx
// hooks/useAppLanguage.ts
import { useLanguage } from 'adelson-localization';

const APP_CONFIG = {
  translationsUrl: process.env.REACT_APP_I18N_URL || '/locales',
  managedLanguages: ['en', 'fr', 'es', 'de'],
  resourceFiles: ['common.json', 'auth.json', 'dashboard.json'],
  enableHMR: process.env.NODE_ENV === 'development'
};

export function useAppLanguage(initialLang: string = 'en') {
  return useLanguage({
    lang: initialLang,
    ...APP_CONFIG
  });
}
```

**Usage:**
```tsx
// Instead of:
const { ln } = useLanguage({ lang: 'en', translationsUrl: '/locales', ... });

// Use:
const { ln } = useAppLanguage('en');
```

---

## Context Provider Pattern

Provide translations across your entire app:

```tsx
// contexts/LanguageContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useLanguage, UseLanguageReturn } from 'adelson-localization';

const LanguageContext = createContext<UseLanguageReturn | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
  initialLang?: string;
}

export function LanguageProvider({ 
  children, 
  initialLang = 'en' 
}: LanguageProviderProps) {
  const languageApi = useLanguage({
    lang: initialLang,
    translationsUrl: '/locales',
    managedLanguages: ['en', 'fr', 'es'],
    resourceFiles: ['common.json', 'app.json'],
    enableHMR: process.env.NODE_ENV === 'development'
  });

  return (
    <LanguageContext.Provider value={languageApi}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}
```

**App setup:**
```tsx
// App.tsx
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider initialLang="en">
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
```

**Usage in components:**
```tsx
// components/Header.tsx
import { useTranslation } from '../contexts/LanguageContext';

function Header() {
  const { ln, language, setLanguage } = useTranslation();

  return (
    <header>
      <h1>{ln('app.title')}</h1>
      <LanguageSwitcher 
        current={language.key}
        onChange={setLanguage}
      />
    </header>
  );
}
```

---

## TypeScript Integration

### Strong Typing for Translation Keys

```typescript
// types/translations.ts
export type TranslationKey = 
  | 'app.title'
  | 'app.description'
  | 'buttons.save'
  | 'buttons.cancel'
  | 'messages.success'
  | 'errors.required';

// Custom typed hook
export function useTypedTranslation() {
  const { ln, ...rest } = useTranslation();

  const typedLn = (key: TranslationKey, ...args: any[]) => {
    return ln(key, ...args);
  };

  return { ln: typedLn, ...rest };
}
```

**Usage:**
```tsx
const { ln } = useTypedTranslation();

ln('app.title');  // ✅ Valid
ln('invalid.key');  // ❌ TypeScript error
```

### Strict Translation Schema

```typescript
// types/translations.ts
export interface TranslationSchema {
  app: {
    title: string;
    description: string;
    version: string;
  };
  buttons: {
    save: string;
    cancel: string;
    delete: string;
  };
  messages: {
    success: string;
    error: string;
  };
}

// Validation function
export function validateTranslation(data: unknown): data is TranslationSchema {
  // Add validation logic
  return true;
}
```

---

## Environment Configuration

### Multi-Environment Setup

```typescript
// config/i18n.ts
const configs = {
  development: {
    translationsUrl: '/locales',
    enableHMR: true,
    managedLanguages: ['en', 'fr']
  },
  staging: {
    translationsUrl: 'https://cdn-staging.example.com/i18n',
    enableHMR: false,
    managedLanguages: ['en', 'fr', 'es']
  },
  production: {
    translationsUrl: 'https://cdn.example.com/i18n',
    enableHMR: false,
    managedLanguages: ['en', 'fr', 'es', 'de', 'it']
  }
};

export const i18nConfig = configs[process.env.NODE_ENV as keyof typeof configs] 
  || configs.development;
```

**Usage:**
```tsx
import { i18nConfig } from './config/i18n';

const { ln } = useLanguage({
  lang: 'en',
  ...i18nConfig
});
```

---

## Performance Optimization

### Memoization

```tsx
import React, { useMemo } from 'react';

function ExpensiveComponent({ data }: { data: any[] }) {
  const { ln } = useTranslation();

  // Memoize translations
  const translatedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      title: ln(`items.${item.id}.title`),
      description: ln(`items.${item.id}.description`)
    }));
  }, [data, ln]);

  return (
    <div>
      {translatedData.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Lazy Loading Components

```tsx
import React, { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  const { ln, loadingResource } = useTranslation();

  if (loadingResource) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}
```

---

## Error Handling

### Comprehensive Error Boundaries

```tsx
// components/TranslationErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class TranslationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Translation error:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h1>Translation Error</h1>
          <p>Failed to load translations. Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage:**
```tsx
function App() {
  return (
    <TranslationErrorBoundary>
      <LanguageProvider>
        <YourApp />
      </LanguageProvider>
    </TranslationErrorBoundary>
  );
}
```

### Graceful Fallbacks

```tsx
function SafeTranslation({ keyPath, defaultText }: { 
  keyPath: string; 
  defaultText: string;
}) {
  const { ln, resource } = useTranslation();

  // Check if translation exists
  const hasTranslation = keyPath
    .split('.')
    .reduce((obj, key) => obj?.[key], resource);

  if (!hasTranslation) {
    console.warn(`Missing translation: ${keyPath}`);
  }

  return <>{ln(keyPath, { defaultTxt: defaultText })}</>;
}
```

---

## Testing Strategies

### Unit Test Setup

```tsx
// test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { LanguageProvider } from './contexts/LanguageContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <LanguageProvider initialLang="en">
      {children}
    </LanguageProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Integration Tests

```tsx
// App.integration.test.tsx
import { render, screen, fireEvent, waitFor } from './test-utils';
import App from './App';

describe('App Integration', () => {
  it('switches languages and updates all translations', async () => {
    render(<App />);

    // Check initial language (English)
    await waitFor(() => {
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });

    // Switch to French
    const frButton = screen.getByRole('button', { name: 'FR' });
    fireEvent.click(frButton);

    // Check French translations
    await waitFor(() => {
      expect(screen.getByText('Bienvenue')).toBeInTheDocument();
    });
  });
});
```

---

## Security Best Practices

### Sanitize User Input

```tsx
import DOMPurify from 'dompurify';

function SafeMessage({ messageKey, userName }: { 
  messageKey: string; 
  userName: string;
}) {
  const { ln } = useTranslation();

  // Sanitize user input before using in translations
  const sanitizedName = DOMPurify.sanitize(userName);
  const message = ln(messageKey, sanitizedName);

  return <div>{message}</div>;
}
```

### Validate Translation URLs

```tsx
const ALLOWED_DOMAINS = [
  'cdn.example.com',
  'translations.example.com'
];

function validateTranslationUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some(domain => 
      parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

// Usage
const translationsUrl = process.env.REACT_APP_I18N_URL;

if (!validateTranslationUrl(translationsUrl)) {
  throw new Error('Invalid translations URL');
}
```

---

## Accessibility (a11y)

### Language Attribute

```tsx
function App() {
  const { language } = useTranslation();

  React.useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language.key;
  }, [language.key]);

  return <div>{/* Your app */}</div>;
}
```

### Screen Reader Support

```tsx
function LanguageSwitcher() {
  const { ln, language, setLanguage } = useTranslation();

  return (
    <div role="region" aria-label={ln('accessibility.languageSwitcher')}>
      <label id="lang-label">{ln('settings.language')}</label>
      <select
        aria-labelledby="lang-label"
        value={language.key}
        onChange={(e) => setLanguage({ key: e.target.value })}
      >
        <option value="en">{ln('languages.english')}</option>
        <option value="fr">{ln('languages.french')}</option>
        <option value="es">{ln('languages.spanish')}</option>
      </select>
    </div>
  );
}
```

---

## Monitoring and Analytics

### Track Language Usage

```tsx
import { useEffect } from 'react';
import { analytics } from './analytics';

function App() {
  const { language } = useTranslation();

  useEffect(() => {
    // Track language changes
    analytics.track('language_changed', {
      language: language.key,
      timestamp: new Date().toISOString()
    });
  }, [language.key]);

  return <div>{/* Your app */}</div>;
}
```

### Monitor Translation Loading

```tsx
function App() {
  const { loadingResource, language } = useTranslation();

  useEffect(() => {
    if (!loadingResource) {
      const loadTime = performance.now();
      analytics.track('translations_loaded', {
        language: language.key,
        loadTime
      });
    }
  }, [loadingResource, language.key]);

  return <div>{/* Your app */}</div>;
}
```

---

## Documentation

### Maintain Translation Keys Documentation

```markdown
# Translation Keys Reference

## App
- `app.title` - Main application title
- `app.description` - Application description
- `app.version` - Current version number

## Buttons
- `buttons.save` - Save button label
- `buttons.cancel` - Cancel button label
- `buttons.delete` - Delete button label (confirm before use)

## Messages
- `messages.success` - Generic success message
- `messages.error` - Generic error message
```

### Code Comments

```tsx
/**
 * User profile component
 * 
 * Translation keys used:
 * - user.profile.title
 * - user.profile.email
 * - user.profile.phone
 * - buttons.save
 * - buttons.cancel
 */
function UserProfile() {
  const { ln } = useTranslation();
  // ...
}
```

---

## Checklist

### ✅ Production Readiness

- [ ] All translation files exist for all managed languages
- [ ] No `enableHMR: true` in production
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Fallback text for missing keys
- [ ] TypeScript types for translation keys
- [ ] Unit tests for translated components
- [ ] Integration tests for language switching
- [ ] CDN configured with proper caching
- [ ] Analytics tracking language usage
- [ ] Documentation up to date

---

[← Back to README](../README.md) | [Comparison →](./COMPARISON.md)
