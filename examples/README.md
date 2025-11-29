# Adelson Localization - Examples

This directory contains practical examples demonstrating the usage of Adelson Localization.

## Examples

### 1. BasicExample.tsx
Demonstrates basic translation and language switching functionality.

**Features:**
- Simple translation with `ln()`
- Language selector
- Loading state handling
- Dynamic language switching

### 2. FormattingExample.tsx
Shows different placeholder formatting options.

**Features:**
- Indexed placeholders `{{}}`
- Named placeholders `{{name}}`
- Mixed placeholders
- Multiple value formatting

### 3. PluralExample.tsx
Illustrates plural handling for different languages.

**Features:**
- Dynamic plural forms with `lnPlural()`
- Language-specific plural rules
- Interactive counters
- Real-time plural updates

## Running the Examples

These examples are meant to be integrated into your React application. To use them:

1. Install Adelson Localization:
```bash
npm install adelson-localization
```

2. Set up your translation files in `/public/locales/`:
```
/public/locales
  ├── en/translation.json
  ├── fr/translation.json
  └── es/translation.json
```

3. Import and use the examples in your app:
```tsx
import BasicExample from './examples/BasicExample';
import FormattingExample from './examples/FormattingExample';
import PluralExample from './examples/PluralExample';

function App() {
  return (
    <div>
      <BasicExample />
      <FormattingExample />
      <PluralExample />
    </div>
  );
}
```

## Required Translation Files

For the examples to work, you need these keys in your translation files:

### en/translation.json
```json
{
  "app": {
    "title": "My Application",
    "description": "Welcome to Adelson Localization"
  },
  "greetings": {
    "welcome": "Welcome {{}}!",
    "hello": "Hello {{}}!",
    "time": "It's {{}} hours and {{}} minutes"
  },
  "profile": {
    "fullName": "{{firstName}} {{lastName}}",
    "info": "{{firstName}} {{lastName}}, {{age}} years old, {{city}}"
  },
  "orders": {
    "summary": "Order {{}} for {{customerName}} - Total: ${{total}}"
  },
  "quiz": {
    "result": "Score: {{}}/{{}} - Time: {{}} min - Level: {{}}"
  },
  "messages": {
    "notification": {
      "singular": "You have {{}} new message",
      "plural": "You have {{}} new messages"
    }
  },
  "products": {
    "cart": {
      "singular": "{{}} item in your cart",
      "plural": "{{}} items in your cart"
    }
  }
}
```

## More Examples

For more advanced usage examples, check the main [README.md](../README.md).
