# 🎮 Live Demos

Interactive demonstrations of **adelson-localization** in action.

---

## 🚀 Try It Now!

Experience adelson-localization instantly in your browser - no installation required!

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitejs-vite-chbhmn8l)

**Click the button above** to open the interactive demo. You can:
- ✅ Edit the code in real-time
- ✅ See changes instantly
- ✅ Fork and customize
- ✅ Share your modifications

---

## 📋 What's Demonstrated

### Core Features

✅ **Basic Translations**
```tsx
ln('app.title')              // Simple translation
ln('welcome.message')        // Nested keys
```

✅ **Language Switching**
```tsx
setLanguage({ key: 'fr' })   // Switch to French
setLanguage({ key: 'es' })   // Switch to Spanish
```

✅ **Indexed Placeholders**
```tsx
ln('greeting', 'John')                    // "Hello, John!"
ln('message', 'Alice', 5)                 // "Hi Alice! You have 5 messages"
```

✅ **Named Placeholders**
```tsx
ln('profile', { firstName: 'John', lastName: 'Doe' })
// "John Doe"
```

✅ **Plural Forms**
```tsx
lnPlural('messages.notification', 1)      // "1 new message"
lnPlural('messages.notification', 5)      // "5 new messages"
```

✅ **TypeScript Generics**
```tsx
const maxItems = ln<number>('config.maxItems')
const features = ln<string[]>('config.features')
```

✅ **Multiple Resource Files** (v1.1.0+)
```tsx
useLanguage({
  resourceFiles: ['common.json', 'auth.json', 'dashboard.json']
})
```

---

## 🎯 Demo Scenarios

### 1. **Basic Setup** (Beginner)
Perfect for getting started. Shows:
- Simple hook setup
- Basic translations
- Language switcher

### 2. **Advanced Features** (Intermediate)
Demonstrates:
- Multiple resource files
- TypeScript generics
- Dynamic placeholders
- Plural forms

### 3. **Real-World Application** (Advanced)
Complete example with:
- User authentication flow
- Data tables with mock data
- Form validation
- Complex nested translations

---

## 🔧 How to Use the Demo

### Explore the Code
1. Click the StackBlitz link above
2. Navigate through the file structure
3. Check `src/App.tsx` for the main component
4. View translation files in `public/locales/`

### Modify and Test
1. Edit translation files to see live updates
2. Change the code to experiment
3. Add new languages
4. Try different placeholder patterns

### Fork Your Own Version
1. Click "Fork" in StackBlitz
2. Save your modifications
3. Share your custom demo
4. Use as a starter template

---

## 📦 Quick Installation

After trying the demo, install in your project:

```bash
npm install adelson-localization
```

Or:

```bash
yarn add adelson-localization
```

---

## 🌟 More Examples

### Local Development with HMR

```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: '/locales',
  enableHMR: true  // Auto-reload translations every 2s
});
```

### CDN Loading

```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: 'https://cdn.example.com/i18n'
});
```

### Custom Configuration

```tsx
const { ln } = useLanguage({
  lang: 'en',
  translationsUrl: '/locales',
  managedLanguages: ['en', 'fr', 'es', 'de', 'it'],
  resourceFiles: ['common.json', 'auth.json', 'features.json'],
  enableHMR: process.env.NODE_ENV === 'development'
});
```

---

## 📚 Related Documentation

- [📖 Full Documentation](./README.md)
- [📘 API Reference](./docs/API_REFERENCE.md)
- [💡 Usage Examples](./docs/EXAMPLES.md)
- [🎨 Advanced Features](./docs/ADVANCED_FEATURES.md)
- [✅ Best Practices](./docs/BEST_PRACTICES.md)

---

## 🤝 Community Demos

Have you created something cool with adelson-localization? 

**Share your demo!**
- Open an issue with the "demo" label
- Tweet with #adelsonlocalization
- Submit a PR to add your demo here

---

## 💬 Get Help

- 🐛 [Report Issues](https://github.com/adelsonjnjr/adelson-localization/issues)
- 💬 [Discussions](https://github.com/adelsonjnjr/adelson-localization/discussions)
- 📧 Email: [adelsonjnjr+adelson@gmail.com](mailto:adelsonjnjr+adelson@gmail.com)

---

**Made with ❤️ by Jean Junior Adelson**

[← Back to README](./README.md)
