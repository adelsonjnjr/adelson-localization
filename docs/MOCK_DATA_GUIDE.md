# 🧪 Mock Data Guide

Complete guide for testing and developing with mock translation data.

---

## Why Mock Data?

Mock data is essential for:
- 🧪 **Unit testing** - Test components without real translation files
- 🎨 **UI development** - Design interfaces before translations are ready
- 🚀 **Demos** - Create examples and prototypes quickly
- 🔍 **Debugging** - Isolate and test specific scenarios

---

## Table of Contents

- [Basic Mock Setup](#basic-mock-setup)
- [Testing with Mock Data](#testing-with-mock-data)
- [Storybook Integration](#storybook-integration)
- [Mock Data Patterns](#mock-data-patterns)
- [Dynamic Mock Generation](#dynamic-mock-generation)

---

## Basic Mock Setup

### Simple Mock Fetch

```typescript
// mockTranslations.ts
export const mockFetch = (translations: any) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(translations),
    } as Response)
  );
};

// Usage in tests
mockFetch({
  app: {
    title: "Test App",
    description: "Test Description"
  }
});
```

### MSW (Mock Service Worker)

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/locales/en/translation.json', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        app: {
          title: "Mock App Title",
          description: "Mock Description"
        },
        buttons: {
          save: "Save",
          cancel: "Cancel"
        }
      })
    );
  }),

  rest.get('/locales/fr/translation.json', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        app: {
          title: "Titre de l'application simulée",
          description: "Description simulée"
        },
        buttons: {
          save: "Enregistrer",
          cancel: "Annuler"
        }
      })
    );
  }),
];
```

```typescript
// setupTests.ts
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Testing with Mock Data

### Jest Component Test

```tsx
// App.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { mockFetch } from './mockTranslations';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    mockFetch({
      app: {
        title: "Test Application",
        subtitle: "Testing translations"
      },
      buttons: {
        login: "Sign In"
      }
    });
  });

  it('renders translations correctly', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Application')).toBeInTheDocument();
      expect(screen.getByText('Testing translations')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });
});
```

### Testing Language Switching

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('Language Switcher', () => {
  beforeEach(() => {
    // Mock English
    global.fetch = jest.fn((url: string) => {
      if (url.includes('/en/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            greeting: "Hello"
          })
        } as Response);
      }
      // Mock French
      if (url.includes('/fr/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            greeting: "Bonjour"
          })
        } as Response);
      }
      return Promise.reject('Not found');
    });
  });

  it('switches languages', async () => {
    render(<LanguageSwitcher />);

    // Initial language (English)
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    // Switch to French
    const frenchButton = screen.getByText('FR');
    fireEvent.click(frenchButton);

    // Check French translation
    await waitFor(() => {
      expect(screen.getByText('Bonjour')).toBeInTheDocument();
    });
  });
});
```

### Testing Plurals

```tsx
describe('Plural forms', () => {
  beforeEach(() => {
    mockFetch({
      messages: {
        notification: {
          singular: "{{}} new message",
          plural: "{{}} new messages"
        }
      }
    });
  });

  it('uses singular for count = 1', async () => {
    const { getByText } = render(
      <NotificationBadge count={1} />
    );

    await waitFor(() => {
      expect(getByText('1 new message')).toBeInTheDocument();
    });
  });

  it('uses plural for count > 1', async () => {
    const { getByText } = render(
      <NotificationBadge count={5} />
    );

    await waitFor(() => {
      expect(getByText('5 new messages')).toBeInTheDocument();
    });
  });
});
```

---

## Storybook Integration

### Basic Story with Mock

```tsx
// Button.stories.tsx
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useLanguage } from 'adelson-localization';
import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    mockData: [
      {
        url: '/locales/en/translation.json',
        method: 'GET',
        status: 200,
        response: {
          buttons: {
            submit: "Submit",
            cancel: "Cancel",
            save: "Save"
          }
        }
      }
    ]
  }
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => {
  const { ln, loadingResource } = useLanguage({
    lang: 'en',
    translationsUrl: '/locales'
  });

  if (loadingResource) return <div>Loading...</div>;

  return <Button {...args} label={ln('buttons.submit')} />;
};

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary'
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary'
};
```

### Multi-Language Stories

```tsx
// Form.stories.tsx
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useLanguage } from 'adelson-localization';
import LoginForm from './LoginForm';

export default {
  title: 'Forms/LoginForm',
  component: LoginForm,
} as ComponentMeta<typeof LoginForm>;

const mockTranslations = {
  en: {
    form: {
      email: "Email",
      password: "Password",
      login: "Login",
      forgotPassword: "Forgot password?"
    }
  },
  fr: {
    form: {
      email: "E-mail",
      password: "Mot de passe",
      login: "Connexion",
      forgotPassword: "Mot de passe oublié ?"
    }
  },
  es: {
    form: {
      email: "Correo electrónico",
      password: "Contraseña",
      login: "Iniciar sesión",
      forgotPassword: "¿Olvidaste tu contraseña?"
    }
  }
};

const Template: ComponentStory<typeof LoginForm> = (args) => {
  const { ln, language, setLanguage } = useLanguage({
    lang: args.language || 'en',
    translationsUrl: '/locales'
  });

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setLanguage({ key: 'en' })}>EN</button>
        <button onClick={() => setLanguage({ key: 'fr' })}>FR</button>
        <button onClick={() => setLanguage({ key: 'es' })}>ES</button>
      </div>
      <LoginForm {...args} ln={ln} />
    </div>
  );
};

export const English = Template.bind({});
English.args = { language: 'en' };

export const French = Template.bind({});
French.args = { language: 'fr' };

export const Spanish = Template.bind({});
Spanish.args = { language: 'es' };
```

---

## Mock Data Patterns

### Comprehensive Mock Data

```typescript
// mockData/translations.ts
export const mockTranslations = {
  // Application
  app: {
    title: "My Application",
    description: "A comprehensive mock translation set",
    version: "1.0.0"
  },

  // Navigation
  nav: {
    home: "Home",
    about: "About",
    contact: "Contact",
    settings: "Settings"
  },

  // Buttons
  buttons: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    submit: "Submit",
    back: "Back",
    next: "Next"
  },

  // Forms
  forms: {
    email: "Email address",
    password: "Password",
    firstName: "First name",
    lastName: "Last name",
    phone: "Phone number",
    address: "Address",
    city: "City",
    zipCode: "ZIP code"
  },

  // Messages
  messages: {
    success: "Operation successful!",
    error: "An error occurred. Please try again.",
    loading: "Loading...",
    noData: "No data available",
    confirmation: "Are you sure?"
  },

  // Errors
  errors: {
    required: "This field is required",
    invalidEmail: "Invalid email address",
    invalidPhone: "Invalid phone number",
    minLength: "Minimum {{}} characters required",
    maxLength: "Maximum {{}} characters allowed",
    networkError: "Network error. Please check your connection."
  },

  // Notifications
  notifications: {
    message: {
      singular: "{{}} new notification",
      plural: "{{}} new notifications"
    },
    email: {
      singular: "{{}} unread email",
      plural: "{{}} unread emails"
    }
  },

  // User
  user: {
    profile: "User Profile",
    settings: "User Settings",
    logout: "Logout",
    greeting: "Hello, {{}}!",
    welcome: "Welcome back, {{firstName}} {{lastName}}"
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    overview: "Overview",
    statistics: "Statistics",
    recentActivity: "Recent Activity"
  }
};
```

### Hierarchical Mock Data

```typescript
// mockData/nested.ts
export const nestedMockData = {
  ecommerce: {
    products: {
      list: {
        title: "Product Catalog",
        empty: "No products found",
        loading: "Loading products..."
      },
      details: {
        price: "Price: ${{}}",
        stock: {
          singular: "{{}} item in stock",
          plural: "{{}} items in stock"
        },
        addToCart: "Add to Cart",
        buyNow: "Buy Now"
      }
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      total: "Total: ${{}}",
      checkout: "Proceed to Checkout",
      itemCount: {
        singular: "{{}} item",
        plural: "{{}} items"
      }
    },
    checkout: {
      title: "Checkout",
      steps: {
        shipping: "Shipping Information",
        payment: "Payment Method",
        review: "Review Order"
      },
      complete: "Complete Order"
    }
  }
};
```

### Edge Cases Mock Data

```typescript
// mockData/edgeCases.ts
export const edgeCasesMock = {
  // Empty strings
  empty: {
    value: ""
  },

  // Very long text
  long: {
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(20)
  },

  // Special characters
  special: {
    text: "Special: @#$%^&*()_+-=[]{}|;':\",./<>?"
  },

  // HTML entities
  html: {
    text: "&lt;div&gt;HTML &amp; Entities&lt;/div&gt;"
  },

  // Unicode
  unicode: {
    emoji: "Hello 👋 World 🌍",
    rtl: "مرحبا بالعالم",  // Arabic
    chinese: "你好世界",
    mixed: "Hello नमस्ते 你好"
  },

  // Numbers
  numbers: {
    integer: 42,
    decimal: 3.14159,
    large: 1000000,
    array: [1, 2, 3, 4, 5]
  },

  // Nested with missing keys
  partial: {
    exists: "This exists",
    nested: {
      deep: {
        value: "Deep value"
      }
    }
  }
};
```

---

## Dynamic Mock Generation

### Factory Pattern

```typescript
// mockFactory.ts
export class TranslationMockFactory {
  static create(overrides: Partial<any> = {}) {
    const defaults = {
      app: {
        title: "Default App",
        description: "Default Description"
      },
      buttons: {
        save: "Save",
        cancel: "Cancel"
      }
    };

    return { ...defaults, ...overrides };
  }

  static createMultiLanguage(languages: string[] = ['en', 'fr']) {
    return languages.reduce((acc, lang) => {
      acc[lang] = this.create({
        app: {
          title: `App Title (${lang})`,
          description: `Description (${lang})`
        }
      });
      return acc;
    }, {} as Record<string, any>);
  }

  static createForFeature(feature: string) {
    return {
      [feature]: {
        title: `${feature} Title`,
        description: `${feature} Description`,
        actions: {
          create: `Create ${feature}`,
          edit: `Edit ${feature}`,
          delete: `Delete ${feature}`
        }
      }
    };
  }
}

// Usage
const basicMock = TranslationMockFactory.create();
const customMock = TranslationMockFactory.create({
  app: { title: "Custom Title" }
});
const multiLang = TranslationMockFactory.createMultiLanguage(['en', 'fr', 'es']);
const featureMock = TranslationMockFactory.createForFeature('users');
```

### Faker.js Integration

```typescript
// mockGenerator.ts
import { faker } from '@faker-js/faker';

export function generateMockTranslations(locale: string = 'en') {
  faker.setLocale(locale);

  return {
    app: {
      title: faker.company.name(),
      description: faker.company.catchPhrase(),
      tagline: faker.company.bs()
    },
    user: {
      greeting: `Hello, ${faker.name.firstName()}!`,
      profile: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number()
      }
    },
    products: Array.from({ length: 5 }, () => ({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price()
    })),
    addresses: Array.from({ length: 3 }, () => ({
      street: faker.address.streetAddress(),
      city: faker.address.city(),
      country: faker.address.country()
    }))
  };
}

// Usage
const enMock = generateMockTranslations('en');
const frMock = generateMockTranslations('fr');
const esMock = generateMockTranslations('es');
```

---

## Best Practices

### ✅ Do:

- Keep mock data in separate files (`__mocks__/` directory)
- Use realistic data that matches production structure
- Test edge cases (empty strings, very long text, special characters)
- Create reusable mock factories
- Mock multiple languages for i18n testing
- Include plural forms in mock data

### ❌ Don't:

- Hardcode mock data in test files
- Use overly simplistic mock data
- Forget to mock loading states
- Skip testing error scenarios
- Use mock data in production builds

---

[← Back to README](../README.md) | [Examples →](./EXAMPLES.md)
