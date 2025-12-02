# Migration Guide - Adelson Localization v1.1

This guide helps you upgrade from v1.0 to v1.1 with the new PLURAL_RULES configuration and managedLanguages parameter.

## What's New in v1.1?

### 🎯 Key Improvements

1. **PLURAL_RULES Configuration**: Centralized plural rules for 7 languages
2. **managedLanguages Parameter**: Configure which languages your app supports
3. **Extended Language Support**: Added German, Italian, Portuguese, and Dutch
4. **Better Performance**: O(1) lookup for plural rules (previously O(n))
5. **Improved Type Safety**: Enhanced TypeScript interfaces

---

## Breaking Changes

**Good news!** There are **NO breaking changes**. The update is fully backward compatible.

If you don't specify managedLanguages, the default value ["en", "fr", "es"] is used, maintaining the same behavior as v1.0.

---

## Migration Steps

### Step 1: Update Your Package

\\\ash
npm update adelson-localization
# or
yarn upgrade adelson-localization
\\\

### Step 2: Review Your Usage

#### ✅ No Changes Needed (Backward Compatible)

\\\	sx
// This still works exactly as before
const { ln, lnPlural } = useLanguage({ lang: "en" });
\\\

#### ⚡ Recommended: Add managedLanguages (Optional)

If you want to add more languages or be explicit about supported languages:

\\\	sx
// Before (v1.0)
const { ln, lnPlural } = useLanguage({ lang: "en" });

// After (v1.1) - Explicit language management
const { ln, lnPlural } = useLanguage({ 
  lang: "en",
  managedLanguages: ["en", "fr", "es", "de", "it"]
});
\\\

---

## New Features You Can Use

### 1. Extended Language Support

v1.1 adds built-in plural rules for 4 new languages:

| Language | Code | Plural Rule |
|----------|------|-------------|
| German | \de\ | count === 1 → singular |
| Italian | \it\ | count === 1 → singular |
| Portuguese | \pt\ | count === 1 → singular |
| Dutch | \
l\ | count === 1 → singular |

**Example:**

\\\	sx
const { lnPlural, setLanguage } = useLanguage({ 
  lang: "de",
  managedLanguages: ["en", "fr", "es", "de", "it", "pt", "nl"]
});

// German plural support
const msg = lnPlural("messages.notification", count);
\\\

### 2. managedLanguages Parameter

Control which languages your app loads to prevent 404 errors:

\\\	sx
const { ln } = useLanguage({ 
  lang: "en",
  managedLanguages: ["en", "fr"] // Only load English and French
});

// If user tries to switch to "de", a warning will be logged
// and no HTTP request will be made
\\\

**Benefits:**
- 🎯 **Prevent 404 errors** for non-existent translation files
- ⚡ **Improve performance** by not loading unsupported languages
- 🛡️ **Better error handling** with clear console warnings

### 3. PLURAL_RULES Configuration

The plural logic is now centralized and extensible. If you need custom plural rules for a language not included, you can fork and extend the \PLURAL_RULES\ object in the source code.

**Current Implementation:**

\\\	ypescript
const PLURAL_RULES: Record<string, (count: number) => 'singular' | 'plural'> = {
  fr: (count) => count <= 1 ? 'singular' : 'plural',
  es: (count) => count === 1 ? 'singular' : 'plural',
  en: (count) => count === 1 ? 'singular' : 'plural',
  de: (count) => count === 1 ? 'singular' : 'plural',
  it: (count) => count === 1 ? 'singular' : 'plural',
  pt: (count) => count === 1 ? 'singular' : 'plural',
  nl: (count) => count === 1 ? 'singular' : 'plural',
  default: (count) => count === 1 ? 'singular' : 'plural',
};
\\\

---

## Before & After Examples

### Example 1: Basic Usage (No Changes)

\\\	sx
// ✅ v1.0 - Still works in v1.1
function App() {
  const { ln, lnPlural } = useLanguage({ lang: "en" });
  
  return (
    <div>
      <h1>{ln("app.title")}</h1>
      <p>{lnPlural("messages.notification", 5)}</p>
    </div>
  );
}
\\\

### Example 2: Adding New Languages

\\\	sx
// Before (v1.0) - Only en, fr, es supported
const { ln, setLanguage } = useLanguage({ lang: "en" });

// After (v1.1) - Add German and Italian support
const { ln, setLanguage } = useLanguage({ 
  lang: "en",
  managedLanguages: ["en", "fr", "es", "de", "it"]
});

// Now you can safely switch to German or Italian
<button onClick={() => setLanguage({ key: "de" })}>
  Deutsch
</button>
\\\

### Example 3: Preventing 404 Errors

\\\	sx
// Before (v1.0) - No control over which languages are loaded
// If user switched to unsupported language, 404 error occurred

// After (v1.1) - Explicit language control
const { ln, setLanguage } = useLanguage({ 
  lang: "en",
  managedLanguages: ["en", "fr"] // Only support English and French
});

// If user tries: setLanguage({ key: "de" })
// Console warning: "Language 'de' is not in managedLanguages array. Skipping translation load."
// No 404 error!
\\\

---

## TypeScript Changes

### Updated Interfaces

\\\	ypescript
// New: managedLanguages property added
export interface UseLanguageConfig {
  lang?: string;
  translationsUrl?: string;
  managedLanguages?: string[]; // ← NEW
}
\\\

**IntelliSense Improvements:**

Your IDE will now suggest the \managedLanguages\ parameter with proper type checking.

---

## Performance Improvements

### Plural Rule Lookup

**v1.0 (if/else chain):**
\\\	ypescript
// O(n) complexity - checks each condition sequentially
if (language.key === "fr") {
  // ...
} else if (language.key === "en") {
  // ...
} else if (language.key === "es") {
  // ...
}
\\\

**v1.1 (Object lookup):**
\\\	ypescript
// O(1) complexity - direct object property access
const pluralRule = PLURAL_RULES[language.key] || PLURAL_RULES.default;
const form = pluralRule(count);
\\\

**Result:** Faster plural handling, especially with many languages.

---

## Testing Your Migration

### 1. Test Existing Functionality

Ensure your existing translations still work:

\\\	sx
const { ln, lnPlural } = useLanguage({ lang: "en" });

console.log(ln("app.title")); // Should work as before
console.log(lnPlural("messages.notification", 1)); // Should work as before
\\\

### 2. Test New Languages (Optional)

If you added new languages:

\\\	sx
const { ln, lnPlural, setLanguage } = useLanguage({ 
  lang: "en",
  managedLanguages: ["en", "fr", "es", "de"]
});

setLanguage({ key: "de" });
console.log(ln("app.title")); // Should load German translation
console.log(lnPlural("messages.notification", 5)); // Should use German plural rules
\\\

### 3. Test managedLanguages Validation

Try switching to an unsupported language:

\\\	sx
const { setLanguage } = useLanguage({ 
  lang: "en",
  managedLanguages: ["en", "fr"]
});

setLanguage({ key: "it" }); // Should log warning in console
\\\

---

## Troubleshooting

### Issue: Translations not loading for new language

**Solution:** Make sure the language is in \managedLanguages\:

\\\	sx
const { ln } = useLanguage({ 
  lang: "de",
  managedLanguages: ["en", "fr", "es", "de"] // ← Add "de" here
});
\\\

### Issue: Console warning about language not managed

**Expected Behavior:** This is a feature! The hook warns you when trying to load translations for a language not in \managedLanguages\.

**Solution:** Either:
1. Add the language to \managedLanguages\
2. Ignore the warning if intentional

---

## Need Help?

- 📚 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/jjadelson/adelson-localization/issues)
- 💬 [Discussions](https://github.com/jjadelson/adelson-localization/discussions)

---

**Happy Internationalizing! ��**
