# 🌍 Plural Rules Reference

Complete reference for plural form handling across different languages.

---

## Overview

Different languages have different rules for plural forms. Adelson Localization handles this automatically with the `lnPlural` function.

---

## How Pluralization Works

### Translation Structure

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

### Usage

```tsx
const { lnPlural } = useLanguage({ lang: 'en' });

lnPlural('messages.notification', 0);  // "You have 0 new messages"
lnPlural('messages.notification', 1);  // "You have 1 new message"
lnPlural('messages.notification', 5);  // "You have 5 new messages"
```

---

## Supported Languages

### English (en)

**Rule:** `count === 1` → singular, else plural

```typescript
// Singular: count === 1
lnPlural('items', 1);  // "1 item"

// Plural: count !== 1
lnPlural('items', 0);  // "0 items"
lnPlural('items', 2);  // "2 items"
lnPlural('items', 100);  // "100 items"
```

**Translation:**
```json
{
  "items": {
    "singular": "{{}} item",
    "plural": "{{}} items"
  }
}
```

---

### French (fr)

**Rule:** `count <= 1` → singular, else plural

```typescript
// Singular: count === 0 or count === 1
lnPlural('messages', 0);  // "0 message"
lnPlural('messages', 1);  // "1 message"

// Plural: count > 1
lnPlural('messages', 2);    // "2 messages"
lnPlural('messages', 100);  // "100 messages"
```

**Translation:**
```json
{
  "messages": {
    "singular": "{{}} message",
    "plural": "{{}} messages"
  }
}
```

**Note:** French treats 0 as singular!

---

### Spanish (es)

**Rule:** `count === 1` → singular, else plural

```typescript
// Singular: count === 1
lnPlural('elementos', 1);  // "1 elemento"

// Plural: count !== 1
lnPlural('elementos', 0);  // "0 elementos"
lnPlural('elementos', 2);  // "2 elementos"
```

**Translation:**
```json
{
  "elementos": {
    "singular": "{{}} elemento",
    "plural": "{{}} elementos"
  }
}
```

---

### German (de)

**Rule:** `count === 1` → singular, else plural

```typescript
// Singular: count === 1
lnPlural('nachrichten', 1);  // "1 Nachricht"

// Plural: count !== 1
lnPlural('nachrichten', 0);  // "0 Nachrichten"
lnPlural('nachrichten', 5);  // "5 Nachrichten"
```

**Translation:**
```json
{
  "nachrichten": {
    "singular": "{{}} Nachricht",
    "plural": "{{}} Nachrichten"
  }
}
```

---

### Italian (it)

**Rule:** `count === 1` → singular, else plural

```typescript
// Singular: count === 1
lnPlural('messaggi', 1);  // "1 messaggio"

// Plural: count !== 1
lnPlural('messaggi', 0);  // "0 messaggi"
lnPlural('messaggi', 3);  // "3 messaggi"
```

**Translation:**
```json
{
  "messaggi": {
    "singular": "{{}} messaggio",
    "plural": "{{}} messaggi"
  }
}
```

---

### Portuguese (pt)

**Rule:** `count === 1` → singular, else plural

```typescript
// Singular: count === 1
lnPlural('mensagens', 1);  // "1 mensagem"

// Plural: count !== 1
lnPlural('mensagens', 0);  // "0 mensagens"
lnPlural('mensagens', 4);  // "4 mensagens"
```

**Translation:**
```json
{
  "mensagens": {
    "singular": "{{}} mensagem",
    "plural": "{{}} mensagens"
  }
}
```

---

### Dutch (nl)

**Rule:** `count === 1` → singular, else plural

```typescript
// Singular: count === 1
lnPlural('berichten', 1);  // "1 bericht"

// Plural: count !== 1
lnPlural('berichten', 0);  // "0 berichten"
lnPlural('berichten', 7);  // "7 berichten"
```

**Translation:**
```json
{
  "berichten": {
    "singular": "{{}} bericht",
    "plural": "{{}} berichten"
  }
}
```

---

## Quick Reference Table

| Language | Code | Singular Rule | Examples (Singular) | Examples (Plural) |
|----------|------|---------------|---------------------|-------------------|
| English | `en` | `count === 1` | 1 item | 0, 2, 5, 100 items |
| French | `fr` | `count <= 1` | 0, 1 message | 2, 5, 100 messages |
| Spanish | `es` | `count === 1` | 1 elemento | 0, 2, 5 elementos |
| German | `de` | `count === 1` | 1 Nachricht | 0, 2, 5 Nachrichten |
| Italian | `it` | `count === 1` | 1 messaggio | 0, 2, 5 messaggi |
| Portuguese | `pt` | `count === 1` | 1 mensagem | 0, 2, 5 mensagens |
| Dutch | `nl` | `count === 1` | 1 bericht | 0, 2, 5 berichten |

---

## Special Cases

### French Zero Rule

French is unique in treating 0 as singular:

```tsx
// English
lnPlural('items', 0);  // "0 items" (plural)

// French
lnPlural('articles', 0);  // "0 article" (singular!)
```

### Decimal Numbers

Currently, decimal numbers follow the same rules:

```tsx
lnPlural('items', 1.5);  // Treated as plural in most languages
lnPlural('items', 0.5);  // Treated as plural in most languages
```

---

## Complete Example

Multi-language notification system:

```tsx
function NotificationBadge() {
  const { lnPlural, language } = useLanguage({
    lang: 'en',
    managedLanguages: ['en', 'fr', 'es', 'de']
  });

  const [count, setCount] = React.useState(0);

  return (
    <div className="notification-badge">
      <span className="count">{count}</span>
      <p>{lnPlural('notifications.message', count)}</p>
      
      <div className="controls">
        <button onClick={() => setCount(count + 1)}>+</button>
        <button onClick={() => setCount(Math.max(0, count - 1))}>-</button>
      </div>
    </div>
  );
}
```

**Translation files:**

**en/translation.json:**
```json
{
  "notifications": {
    "message": {
      "singular": "{{}} new notification",
      "plural": "{{}} new notifications"
    }
  }
}
```

**fr/translation.json:**
```json
{
  "notifications": {
    "message": {
      "singular": "{{}} nouvelle notification",
      "plural": "{{}} nouvelles notifications"
    }
  }
}
```

**es/translation.json:**
```json
{
  "notifications": {
    "message": {
      "singular": "{{}} notificación nueva",
      "plural": "{{}} notificaciones nuevas"
    }
  }
}
```

**de/translation.json:**
```json
{
  "notifications": {
    "message": {
      "singular": "{{}} neue Benachrichtigung",
      "plural": "{{}} neue Benachrichtigungen"
    }
  }
}
```

---

## Testing Plural Rules

```tsx
function PluralTester() {
  const { lnPlural, language } = useLanguage({ lang: 'en' });

  const testCounts = [0, 1, 2, 5, 10, 100];

  return (
    <div>
      <h3>Plural Rules Test ({language.key})</h3>
      <table>
        <thead>
          <tr>
            <th>Count</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {testCounts.map(count => (
            <tr key={count}>
              <td>{count}</td>
              <td>{lnPlural('test.items', count)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Best Practices

### ✅ Do:

- Always provide both `singular` and `plural` forms
- Test with counts: 0, 1, 2, and large numbers
- Consider the French zero rule when designing UI
- Use meaningful variable names in translations

### ❌ Don't:

- Hardcode plural rules in your components
- Forget to handle count = 0
- Use string concatenation for plurals
- Assume all languages follow English rules

---

## Adding Custom Languages

To add a language not listed here, you'll need to:

1. Add the language code to `managedLanguages`
2. Create translation files with `singular`/`plural` structure
3. Check if the plural rule matches existing rules (most likely `count === 1`)

**Example for Polish (complex plural rules):**

Polish has 3+ plural forms, which would require extending the library. Current version supports 2-form (singular/plural) languages only.

---

## Future Enhancements

Planned support for:
- Languages with 3+ plural forms (Polish, Russian, Arabic)
- Custom plural rule functions
- Ordinal numbers (1st, 2nd, 3rd)
- Gender-aware pluralization

---

[← Back to README](../README.md) | [API Reference →](./API_REFERENCE.md)
