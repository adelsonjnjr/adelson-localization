# 🔧 Utility Functions

Standalone utility functions exported by Adelson Localization.

---

## Table of Contents

- [deepMerge](#deepmerge)
- [strictDeepMerge](#strictdeepmerge)
- [Comparison](#comparison)
- [Use Cases](#use-cases)

---

## deepMerge

Recursively merges multiple objects. Later objects override earlier ones.

### Signature

```typescript
function deepMerge(...objects: any[]): any
```

### Parameters

- `...objects` - Variable number of objects to merge

### Returns

- New merged object (does not mutate inputs)

### Basic Usage

```typescript
import { deepMerge } from 'adelson-localization';

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const result = deepMerge(obj1, obj2);
// { a: 1, b: 3, c: 4 }
```

### Nested Objects

```typescript
const base = {
  user: {
    name: 'John',
    age: 30
  },
  settings: {
    theme: 'light'
  }
};

const updates = {
  user: {
    age: 31,
    email: 'john@example.com'
  },
  settings: {
    notifications: true
  }
};

const result = deepMerge(base, updates);
// {
//   user: {
//     name: 'John',
//     age: 31,
//     email: 'john@example.com'
//   },
//   settings: {
//     theme: 'light',
//     notifications: true
//   }
// }
```

### Multiple Sources

```typescript
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = { c: 3 };
const obj4 = { d: 4 };

const result = deepMerge(obj1, obj2, obj3, obj4);
// { a: 1, b: 2, c: 3, d: 4 }
```

### Array Handling

Arrays are **replaced**, not merged:

```typescript
const obj1 = { items: [1, 2, 3] };
const obj2 = { items: [4, 5] };

const result = deepMerge(obj1, obj2);
// { items: [4, 5] }  ← obj2's array replaces obj1's
```

### Null and Undefined

```typescript
const obj1 = { a: 1, b: null };
const obj2 = { b: 2, c: undefined };

const result = deepMerge(obj1, obj2);
// { a: 1, b: 2, c: undefined }
```

### Empty Objects

```typescript
deepMerge({}, { a: 1 });  // { a: 1 }
deepMerge({ a: 1 }, {});  // { a: 1 }
deepMerge({});            // {}
```

### Type Safety

```typescript
interface Config {
  api: {
    url: string;
    timeout: number;
  };
  features: string[];
}

const base: Config = {
  api: { url: 'https://api.example.com', timeout: 5000 },
  features: ['auth', 'analytics']
};

const overrides: Partial<Config> = {
  api: { timeout: 10000 } as any,
  features: ['auth', 'reporting']
};

const result = deepMerge(base, overrides) as Config;
```

---

## strictDeepMerge

Like `deepMerge`, but only updates **existing keys** in the target object. New keys in source objects are ignored.

### Signature

```typescript
function strictDeepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: any[]
): T
```

### Parameters

- `target` - The base object (defines the allowed schema)
- `...sources` - Variable number of source objects

### Returns

- The modified `target` object (**mutates target!**)

### Basic Usage

```typescript
import { strictDeepMerge } from 'adelson-localization';

const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };  // 'c' is new

strictDeepMerge(target, source);
// target is now: { a: 1, b: 3 }
// 'c' was ignored (not in original target)
```

### Schema Enforcement

```typescript
const schema = {
  user: {
    name: '',
    age: 0
  },
  settings: {
    theme: 'light'
  }
};

const updates = {
  user: {
    name: 'John',
    age: 30,
    email: 'john@example.com'  // New key, will be ignored
  },
  settings: {
    theme: 'dark',
    notifications: true  // New key, will be ignored
  },
  newSection: {  // New key, will be ignored
    data: 'value'
  }
};

strictDeepMerge(schema, updates);
// schema is now:
// {
//   user: {
//     name: 'John',
//     age: 30
//   },
//   settings: {
//     theme: 'dark'
//   }
// }
```

### Mutates Target

**Important:** Unlike `deepMerge`, `strictDeepMerge` mutates the target!

```typescript
const target = { a: 1, b: 2 };
const source = { b: 3 };

strictDeepMerge(target, source);

console.log(target);  // { a: 1, b: 3 } ← MUTATED
```

### Multiple Sources

```typescript
const target = { a: 1, b: 2, c: 3 };

strictDeepMerge(
  target,
  { a: 10 },          // Update 'a'
  { b: 20 },          // Update 'b'
  { c: 30, d: 40 }    // Update 'c', ignore 'd'
);

// target is now: { a: 10, b: 20, c: 30 }
```

### Configuration Patching

```typescript
interface AppConfig {
  api: {
    url: string;
    timeout: number;
  };
  features: {
    auth: boolean;
    analytics: boolean;
  };
}

const defaultConfig: AppConfig = {
  api: {
    url: 'https://api.example.com',
    timeout: 5000
  },
  features: {
    auth: true,
    analytics: false
  }
};

// User can only update existing config keys
const userConfig = {
  api: {
    timeout: 10000,
    retries: 3  // Ignored (new key)
  },
  features: {
    analytics: true
  },
  newFeature: {  // Ignored (new key)
    enabled: true
  }
};

strictDeepMerge(defaultConfig, userConfig);
// defaultConfig is now:
// {
//   api: {
//     url: 'https://api.example.com',
//     timeout: 10000  ← Updated
//   },
//   features: {
//     auth: true,
//     analytics: true  ← Updated
//   }
// }
```

---

## Comparison

| Feature | `deepMerge` | `strictDeepMerge` |
|---------|-------------|-------------------|
| **Mutates input?** | No (returns new object) | Yes (modifies target) |
| **New keys allowed?** | Yes (adds all keys) | No (only updates existing) |
| **Use case** | Merging configurations | Schema enforcement |
| **Performance** | Slower (creates new objects) | Faster (in-place updates) |
| **Type safety** | Loose | Strict (preserves schema) |

### Side-by-Side Example

```typescript
const base = { a: 1, b: 2 };
const updates = { b: 3, c: 4 };

// deepMerge - Non-mutating, adds new keys
const result1 = deepMerge(base, updates);
console.log(base);    // { a: 1, b: 2 } ← Unchanged
console.log(result1); // { a: 1, b: 3, c: 4 } ← New object

// strictDeepMerge - Mutating, rejects new keys
const base2 = { a: 1, b: 2 };
strictDeepMerge(base2, updates);
console.log(base2);   // { a: 1, b: 3 } ← Mutated, 'c' ignored
```

---

## Use Cases

### Use `deepMerge` when:

✅ **Combining translation files**
```typescript
import { deepMerge } from 'adelson-localization';

const common = await fetch('/locales/en/common.json').then(r => r.json());
const auth = await fetch('/locales/en/auth.json').then(r => r.json());

const translations = deepMerge(common, auth);
```

✅ **Building configuration objects**
```typescript
const defaultConfig = { ... };
const userConfig = { ... };
const envConfig = { ... };

const finalConfig = deepMerge(defaultConfig, userConfig, envConfig);
```

✅ **Merging API responses**
```typescript
const baseData = await fetchBaseData();
const additionalData = await fetchAdditionalData();

const completeData = deepMerge(baseData, additionalData);
```

✅ **Redux/state management**
```typescript
const newState = deepMerge(currentState, updates);
```

### Use `strictDeepMerge` when:

✅ **Enforcing configuration schemas**
```typescript
import { strictDeepMerge } from 'adelson-localization';

const configSchema = {
  api: { url: '', timeout: 0 },
  features: { auth: false }
};

// Only allow updates to existing keys
strictDeepMerge(configSchema, userProvidedConfig);
```

✅ **Updating settings with validation**
```typescript
const appSettings = { theme: 'light', language: 'en' };

// User can only change existing settings
strictDeepMerge(appSettings, userInput);
```

✅ **Patching objects in-place**
```typescript
const user = { name: 'John', age: 30 };

// Update only existing fields
strictDeepMerge(user, formData);
```

✅ **Form data updates**
```typescript
const formState = {
  firstName: '',
  lastName: '',
  email: ''
};

// User can only fill existing fields
strictDeepMerge(formState, inputData);
```

---

## Internal Usage

These functions are used internally by `useLanguage` for the `resourceFiles` feature:

```typescript
// Inside useLanguage hook
const results = await Promise.all(
  resourceFiles.map(file => 
    fetch(`${translationsUrl}/${lang}/${file}`).then(r => r.json())
  )
);

// Merge all files together
const mergedTranslations = deepMerge({}, ...results);
```

---

## Performance Notes

### `deepMerge`

- **Time complexity:** O(n) where n = total keys across all objects
- **Space complexity:** O(n) - creates new objects at each level
- **Best for:** < 1000 keys, infrequent operations

### `strictDeepMerge`

- **Time complexity:** O(n) where n = keys in target
- **Space complexity:** O(1) - in-place modification
- **Best for:** Any size, frequent updates

### Benchmarks

```typescript
// deepMerge: ~0.5ms for 100 keys
const result = deepMerge(obj1, obj2, obj3);

// strictDeepMerge: ~0.2ms for 100 keys
strictDeepMerge(target, source1, source2);
```

---

[← Back to README](../README.md) | [Advanced Features →](./ADVANCED_FEATURES.md)
