# ⚙️ Adelson Localization - Feature Specifications

**Version:** 1.0.0  
**Last Updated:** November 1, 2025  
**Owner:** Jean Junior Adelson

---

## Table of Contents

1. [Product Vision](#product-vision)
2. [Free Tier Features](#free-tier-features)
3. [Pro Tier Features](#pro-tier-features)
4. [Enterprise Tier Features](#enterprise-tier-features)
5. [Future Features (Roadmap)](#future-features-roadmap)
6. [Technical Specifications](#technical-specifications)

---

## Product Vision

### Mission

> "Rendre la localisation d'applications React aussi simple que `npm install`, tout en offrant la flexibilité des mises à jour en temps réel pour les équipes modernes."

### Core Principles

1. **Developer-First:** API simple, documentation excellente
2. **Type-Safe:** TypeScript avec inférence avancée
3. **Performant:** < 50ms via CDN edge
4. **Flexible:** Auto-hébergé (Free) ou cloud (Pro/Enterprise)
5. **Évolutif:** De 1 à 1M utilisateurs

---

## Free Tier Features

### Overview

**Public cible:** Développeurs individuels, projets personnels, évaluation

**Modèle:** Open source (MIT License), auto-hébergé

---

### Feature 1: React Hook (`useLanguage`)

**Description:** Hook React pour gérer les traductions dans votre application.

**User Story:**
```
En tant que développeur React,
Je veux un hook simple pour accéder aux traductions,
Afin de localiser mon application rapidement.
```

**API:**
```typescript
const {
  currentLanguage,     // 'en', 'fr', 'es'
  ln,                  // Translate function
  lnPlural,            // Plural translate function
  setCurrentLanguage,  // Change language
  isLoading,           // Loading state
  error                // Error state
} = useLanguage({
  lang: 'en',
  translationsUrl: 'https://mycdn.com/translations',
  emptyString: '🚫',
  cacheDuration: 3600000 // 1 hour
});
```

**Usage Example:**
```typescript
function App() {
  const { ln, currentLanguage } = useLanguage({ lang: 'en' });
  
  return (
    <div>
      <h1>{ln('app.title')}</h1>
      <p>{ln('app.welcome', 'John')}</p>
      <span>Current: {currentLanguage}</span>
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Hook initializes with default language
- [ ] `ln()` fetches and caches translations
- [ ] `setCurrentLanguage()` updates language & refetches
- [ ] `isLoading` reflects fetch state
- [ ] `error` captures fetch failures
- [ ] TypeScript types exported

---

### Feature 2: String Formatting

**Description:** Interpolation de variables dans les chaînes traduites.

**User Story:**
```
En tant que développeur,
Je veux insérer des variables dynamiques dans les traductions,
Afin d'éviter la concaténation de chaînes.
```

**Formats Supported:**

**1. Indexed Placeholders:**
```typescript
// Translation file
{
  "greeting": "Hello {{0}}, you have {{1}} messages"
}

// In code
ln('greeting', 'John', 5)
// → "Hello John, you have 5 messages"
```

**2. Named Placeholders:**
```typescript
// Translation file
{
  "greeting": "Hello {{name}}, you have {{count}} messages"
}

// In code
ln('greeting', { name: 'John', count: 5 })
// → "Hello John, you have 5 messages"
```

**Implementation:**
```typescript
String.prototype.format = function(...args: any[]): string {
  let str = this.toString();
  
  if (args.length === 1 && typeof args[0] === 'object') {
    // Named placeholders
    for (const [key, value] of Object.entries(args[0])) {
      str = str.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, 'g'), 
        String(value)
      );
    }
  } else {
    // Indexed placeholders
    args.forEach((arg, i) => {
      str = str.replace(
        new RegExp(`\\{\\{${i}\\}\\}`, 'g'), 
        String(arg)
      );
    });
  }
  
  return str;
};
```

**Acceptance Criteria:**
- [ ] Indexed placeholders work ({{0}}, {{1}})
- [ ] Named placeholders work ({{name}})
- [ ] Handles missing variables gracefully (returns empty string or original)
- [ ] TypeScript-safe

---

### Feature 3: Plural Rules

**Description:** Gestion automatique des formes singulières/plurielles selon la langue.

**User Story:**
```
En tant que développeur,
Je veux afficher la forme correcte (singulier/pluriel) selon le nombre,
Sans conditions manuelles dans mon code.
```

**API:**
```typescript
lnPlural('messages.count', messageCount)
```

**Translation File Structure:**
```json
{
  "messages": {
    "count": {
      "one": "You have {{count}} message",
      "other": "You have {{count}} messages"
    }
  }
}
```

**Supported Languages:**

| Language | Plural Rules |
|----------|--------------|
| **English** | 1 = one, else = other |
| **French** | 0-1 = one, else = other |
| **Spanish** | 1 = one, else = other |
| **Arabic** | Complex (6 forms: zero, one, two, few, many, other) |

**Implementation:**
```typescript
function getPluralForm(language: string, count: number): string {
  switch (language) {
    case 'fr':
      return count <= 1 ? 'one' : 'other';
    case 'en':
    case 'es':
      return count === 1 ? 'one' : 'other';
    case 'ar':
      if (count === 0) return 'zero';
      if (count === 1) return 'one';
      if (count === 2) return 'two';
      if (count % 100 >= 3 && count % 100 <= 10) return 'few';
      if (count % 100 >= 11) return 'many';
      return 'other';
    default:
      return count === 1 ? 'one' : 'other';
  }
}
```

**Acceptance Criteria:**
- [ ] English plural rules work
- [ ] French plural rules work
- [ ] Spanish plural rules work
- [ ] Arabic plural rules work (stretch goal)
- [ ] Handles missing plural forms gracefully

---

### Feature 4: TypeScript Generics

**Description:** Retour de type dynamique pour les traductions.

**User Story:**
```
En tant que développeur TypeScript,
Je veux que `ln()` infère le type de retour,
Pour avoir une sécurité de type complète.
```

**API:**
```typescript
// String return (default)
const title: string = ln('app.title');

// Number return
const maxUsers: number = ln<number>('config.maxUsers');

// Object return
interface Config {
  api: string;
  timeout: number;
}
const config: Config = ln<Config>('app.config');
```

**Implementation:**
```typescript
function ln<T = string>(key: string, ...args: any[]): T {
  // ... fetch translation
  return translation as T;
}
```

**Acceptance Criteria:**
- [ ] Generic parameter works
- [ ] Defaults to `string`
- [ ] Type-safe casting
- [ ] No runtime errors on invalid casts

---

### Feature 5: localStorage Caching

**Description:** Cache des traductions en localStorage pour performance.

**User Story:**
```
En tant qu'utilisateur final,
Je veux que l'app charge instantanément,
Même sur connexions lentes.
```

**Cache Strategy:**
1. Check localStorage for cached translations
2. If valid (< 1 hour old), use cached
3. Else, fetch from CDN
4. Update cache

**Cache Keys:**
```
translations_en → JSON string
translations_en_time → timestamp
translations_fr → JSON string
translations_fr_time → timestamp
```

**Invalidation:**
- Time-based: 1 hour TTL (configurable)
- Manual: `clearCache()` method

**Acceptance Criteria:**
- [ ] Translations cached after first fetch
- [ ] Cache respects TTL
- [ ] Cache cleared on language change
- [ ] Works in incognito mode (fallback to memory)

---

### Feature 6: Multi-Tab Sync

**Description:** Synchroniser les traductions entre onglets ouverts.

**User Story:**
```
En tant qu'utilisateur multi-tab,
Je veux voir les traductions mises à jour dans tous les onglets,
Sans recharger manuellement.
```

**Implementation:**
```typescript
// Tab 1: Updates translations
localStorage.setItem('translations_fr', newTranslations);
window.dispatchEvent(new CustomEvent('translations-updated', {
  detail: { lang: 'fr' }
}));

// Tab 2: Listens for updates
useEffect(() => {
  const handler = (e: CustomEvent) => {
    if (e.detail.lang === currentLanguage) {
      refetchTranslations();
    }
  };
  window.addEventListener('translations-updated', handler);
  return () => window.removeEventListener('translations-updated', handler);
}, [currentLanguage]);
```

**Acceptance Criteria:**
- [ ] Updates in one tab reflect in others
- [ ] No duplicate fetches
- [ ] Works across windows (not just tabs)

---

## Pro Tier Features

### Overview

**Public cible:** Startups, petites équipes, développeurs freelance

**Prix:** $39/mois

---

### Feature 7: Web Dashboard

**Description:** Interface web pour gérer les traductions sans toucher au code.

**User Story:**
```
En tant que product manager,
Je veux modifier les traductions via une interface web,
Sans dépendre des développeurs.
```

**Pages:**

**1. Login/Signup**
- Email/password authentication
- OAuth (Google, GitHub) - Future
- Password reset flow

**2. Projects List**
```
┌────────────────────────────────────────┐
│  My Projects                [+ New]    │
├────────────────────────────────────────┤
│  📁 My SaaS App                        │
│     3 languages • 245 keys             │
│     Last updated: 2 hours ago          │
│     [Open]                             │
├────────────────────────────────────────┤
│  📁 Portfolio Site                     │
│     2 languages • 42 keys              │
│     Last updated: 5 days ago           │
│     [Open]                             │
└────────────────────────────────────────┘
```

**3. Translation Keys**
```
┌──────────────────────────────────────────────┐
│  My SaaS App > Keys          [+ Add Key]     │
├──────────────────────────────────────────────┤
│  Search: [________________]   [English ▼]    │
├──────────────────────────────────────────────┤
│  Key               English        French     │
│  app.title         "My App"       "Mon App"  │
│  app.welcome       "Welcome"      "Bienvenue"│
│  app.subtitle      "Best tool"    [Missing]  │
├──────────────────────────────────────────────┤
│  [Publish Changes]                           │
└──────────────────────────────────────────────┘
```

**4. Manage Languages**
- Add/remove languages
- Set default language
- Language codes (en, fr, es)

**5. Analytics (Basic)**
- Requests per language (bar chart)
- Most used keys (table)
- Usage trends (line chart, 7 days)

**Acceptance Criteria:**
- [ ] CRUD operations on projects
- [ ] CRUD operations on translation keys
- [ ] Multi-language editing in one view
- [ ] "Publish" button updates CDN instantly
- [ ] Search/filter keys
- [ ] Mobile-responsive design

---

### Feature 8: CDN Hosting

**Description:** Hébergement des traductions sur CDN global (Cloudflare).

**User Story:**
```
En tant qu'équipe,
Je veux que les traductions soient servies rapidement partout dans le monde,
Sans gérer l'infrastructure.
```

**Architecture:**
```
Client App
    ↓ HTTPS GET
Cloudflare CDN (Edge)
    ↓ Cache Miss
Origin Server (DigitalOcean)
    ↓ Query
PostgreSQL Database
```

**CDN Configuration:**
- 200+ edge locations worldwide
- 1-hour cache TTL
- Auto-purge on "Publish"
- Brotli compression
- HTTPS only

**URL Structure:**
```
https://cdn.adelson-localization.dev/{projectId}/{lang}.json

Example:
https://cdn.adelson-localization.dev/proj_abc123/en.json
```

**Rate Limits:**
- Pro: 1M requests/month
- Overages: $5 per million

**Acceptance Criteria:**
- [ ] Translations accessible via CDN
- [ ] < 50ms response time (p95)
- [ ] > 99.5% uptime
- [ ] Auto-purge on publish (< 60 seconds)
- [ ] Usage tracking (per project)

---

### Feature 9: Live Updates

**Description:** Mettre à jour les traductions sans redéploiement de l'application.

**User Story:**
```
En tant que product manager,
Je veux corriger une faute de frappe et la voir en prod immédiatement,
Sans attendre un déploiement.
```

**Flow:**
1. User edits translation in dashboard
2. Clicks "Publish"
3. Server updates database
4. Server generates new JSON files
5. Server uploads to CDN
6. Server purges Cloudflare cache
7. Client apps fetch new translations (next request or on interval)

**Client Polling (Optional):**
```typescript
useLanguage({
  pollingInterval: 60000 // Check every 60 seconds
});
```

**Acceptance Criteria:**
- [ ] Changes visible within 60 seconds
- [ ] No app redeployment needed
- [ ] Works for all connected clients
- [ ] Dashboard shows "Publishing..." state

---

### Feature 10: API Keys

**Description:** Clés API pour authentifier les requêtes CDN (sécurité).

**User Story:**
```
En tant que développeur,
Je veux protéger mes traductions avec une clé API,
Pour éviter les abus.
```

**Usage:**
```typescript
useLanguage({
  apiKey: process.env.REACT_APP_ADELSON_API_KEY
});

// Internally:
fetch(translationsUrl, {
  headers: {
    'X-API-Key': apiKey
  }
});
```

**Dashboard:**
- Generate API keys (name: "Production", "Staging")
- Revoke API keys
- View last used date
- 3 keys max per project (Pro)

**Rate Limiting:**
- Per API key: 10,000 requests/hour

**Acceptance Criteria:**
- [ ] API key generation in dashboard
- [ ] API key validation on CDN
- [ ] Invalid key returns 401
- [ ] Usage tracking per key

---

### Feature 11: Version History

**Description:** Historique des modifications de traductions (30 jours).

**User Story:**
```
En tant que product manager,
Je veux voir qui a modifié quelle traduction et quand,
Pour auditer les changements.
```

**UI:**
```
┌──────────────────────────────────────────────┐
│  app.title > History                         │
├──────────────────────────────────────────────┤
│  Nov 1, 2025 10:30 AM - John Adelson         │
│  "My Application" → "My App"                 │
│  [Restore]                                   │
├──────────────────────────────────────────────┤
│  Oct 28, 2025 3:15 PM - Sarah Chen           │
│  "My SaaS" → "My Application"                │
│  [Restore]                                   │
└──────────────────────────────────────────────┘
```

**Acceptance Criteria:**
- [ ] All edits logged with timestamp & user
- [ ] View history per translation key
- [ ] Restore previous version (1-click)
- [ ] Retained for 30 days (Pro), unlimited (Enterprise)

---

## Enterprise Tier Features

### Overview

**Public cible:** Entreprises moyennes/grandes, agences

**Prix:** $299/mois

---

### Feature 12: Team Collaboration

**Description:** Gérer plusieurs membres d'équipe avec rôles et permissions.

**User Story:**
```
En tant que team lead,
Je veux inviter mon équipe et définir qui peut modifier vs. seulement voir,
Pour un workflow sécurisé.
```

**Roles:**
| Role | Permissions |
|------|-------------|
| **Owner** | Full access (billing, team management, all projects) |
| **Admin** | Manage projects, edit translations, invite members |
| **Editor** | Edit translations, publish changes |
| **Viewer** | View translations only (read-only) |

**UI:**
```
┌──────────────────────────────────────────────┐
│  Team Members                [+ Invite]      │
├──────────────────────────────────────────────┤
│  john@example.com          Owner             │
│  sarah@example.com         Admin   [Edit]    │
│  mike@example.com          Editor  [Edit]    │
│  guest@example.com         Viewer  [Remove]  │
└──────────────────────────────────────────────┘
```

**Invite Flow:**
1. Admin enters email + role
2. System sends invite email
3. User accepts, creates account or logs in
4. User added to team

**Acceptance Criteria:**
- [ ] Invite team members via email
- [ ] Assign roles (Owner, Admin, Editor, Viewer)
- [ ] Enforce permissions on API & dashboard
- [ ] Unlimited team members (Enterprise)

---

### Feature 13: AI Translation

**Description:** Traduction automatique via DeepL ou OpenAI GPT-4.

**User Story:**
```
En tant que product manager,
Je veux traduire automatiquement 20 langues en un clic,
Pour accélérer l'expansion internationale.
```

**Providers:**
- **DeepL:** 30+ languages, high quality
- **OpenAI GPT-4:** 100+ languages, contextual

**UI:**
```
┌──────────────────────────────────────────────┐
│  app.title: "My App"                         │
│  ┌────────────────────────────────────────┐  │
│  │  Auto-translate to:                    │  │
│  │  ☐ French  ☐ Spanish  ☐ German        │  │
│  │  ☐ Italian ☐ Portuguese ☐ Japanese    │  │
│  │                                        │  │
│  │  Provider: [DeepL ▼]                   │  │
│  │                                        │  │
│  │  [Translate]                           │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

**Pricing:**
- Included: 10,000 characters/month
- Overages: $10 per 10,000 characters

**Acceptance Criteria:**
- [ ] Integrate DeepL API
- [ ] Integrate OpenAI API (future)
- [ ] Batch translate multiple keys
- [ ] Manual review & edit after AI translation
- [ ] Track usage (characters translated)

---

### Feature 14: Advanced Analytics

**Description:** Analytics détaillées sur l'utilisation des traductions.

**User Story:**
```
En tant que data analyst,
Je veux des insights sur quelles langues sont populaires par région,
Pour optimiser notre stratégie d'expansion.
```

**Metrics:**
- Requests per language (time series)
- Requests per country (map)
- Most/least used translation keys
- Cache hit rate
- Error rate

**UI:**
```
┌──────────────────────────────────────────────┐
│  Analytics > My SaaS App                     │
├──────────────────────────────────────────────┤
│  Time Range: [Last 30 days ▼]               │
│                                              │
│  📊 Requests by Language                     │
│  ┌────────────────────────────────────────┐ │
│  │  English:  450K (68%)                  │ │
│  │  French:   120K (18%)                  │ │
│  │  Spanish:   90K (14%)                  │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  🌍 Requests by Country                      │
│  [Interactive world map]                     │
│                                              │
│  🔑 Top 10 Translation Keys                  │
│  1. app.title         (89K requests)         │
│  2. app.welcome       (76K requests)         │
│  ...                                         │
│                                              │
│  [Export CSV]                                │
└──────────────────────────────────────────────┘
```

**Acceptance Criteria:**
- [ ] Time-series charts (7/30/90 days)
- [ ] Country breakdown (map or table)
- [ ] Top keys (sorted by usage)
- [ ] Export to CSV/JSON

---

### Feature 15: SSO (Single Sign-On)

**Description:** Authentification via SAML 2.0 pour entreprises.

**User Story:**
```
En tant que IT admin,
Je veux que mon équipe se connecte avec notre SSO corporate,
Pour centraliser la gestion des accès.
```

**Supported Providers:**
- Okta
- Azure AD
- Google Workspace
- OneLogin

**Setup Flow:**
1. Admin provides SAML metadata URL
2. System configures SSO
3. Users redirected to corporate login
4. SAML assertion validated
5. User logged in

**Acceptance Criteria:**
- [ ] SAML 2.0 implementation
- [ ] Test with Okta, Azure AD
- [ ] Fallback to email/password if SSO fails
- [ ] Admin can enforce SSO (disable password login)

---

### Feature 16: Audit Logs

**Description:** Logs détaillés de toutes les actions sur la plateforme.

**User Story:**
```
En tant que compliance officer,
Je veux voir qui a fait quoi et quand,
Pour respecter les exigences de sécurité.
```

**Logged Events:**
- User login/logout
- Translation created/updated/deleted
- Project created/updated/deleted
- Team member invited/removed
- API key created/revoked
- Billing changes

**UI:**
```
┌──────────────────────────────────────────────┐
│  Audit Logs                                  │
├──────────────────────────────────────────────┤
│  Filter: [All Events ▼]  [Last 7 days ▼]    │
├──────────────────────────────────────────────┤
│  Nov 1, 10:35 AM - john@example.com          │
│  translation.update: app.title               │
│  "My Application" → "My App"                 │
├──────────────────────────────────────────────┤
│  Nov 1, 9:12 AM - sarah@example.com          │
│  team.invite: mike@example.com (Editor)      │
├──────────────────────────────────────────────┤
│  Oct 31, 4:50 PM - john@example.com          │
│  apikey.create: "Production Key"             │
└──────────────────────────────────────────────┘
```

**Retention:** 1 year (Enterprise)

**Acceptance Criteria:**
- [ ] All critical events logged
- [ ] Searchable & filterable
- [ ] Export to CSV
- [ ] Compliant with GDPR, SOC 2

---

## Future Features (Roadmap)

### Q1 2026

**Feature 17: WebSocket Live Updates**
- Real-time sync without polling
- Instant updates across all clients
- Reduces CDN requests

**Feature 18: Environments**
- Separate prod/staging/dev environments
- Test translations before publishing to prod

---

### Q2 2026

**Feature 19: React Native Support**
- React Native adapter
- AsyncStorage caching
- Offline support

**Feature 20: A/B Testing**
- Test 2 translation variants
- Track conversion rates
- Auto-select winner

---

### Q3 2026

**Feature 21: Vue.js & Svelte Adapters**
- `useLanguage` for Vue Composition API
- Svelte store for i18n

**Feature 22: Translation Marketplace**
- Hire professional translators
- In-platform collaboration
- Commission-based revenue (10%)

---

### Q4 2026

**Feature 23: Visual Editor**
- Chrome extension
- Edit translations directly on your live site
- No need to find translation keys

**Feature 24: Branching & Approval Workflow**
- Create translation branches
- Review & approve changes
- Merge to production

---

## Technical Specifications

### Performance Targets

| Metric | Target |
|--------|--------|
| **CDN Response Time** | < 50ms (p95) |
| **Dashboard Load** | < 2 seconds |
| **Publish Latency** | < 60 seconds (cache purge) |
| **API Response Time** | < 200ms (origin) |

### Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS 14+, Android 10+

### React Compatibility

- React: 16.8+ (hooks support)
- React Native: 0.60+ (future)

### Security

- HTTPS only (TLS 1.3)
- API key authentication
- Rate limiting (per user, per key)
- OWASP Top 10 compliance
- Regular security audits (Enterprise)

---

**Document Owner:** Jean Junior Adelson  
**Last Review:** November 1, 2025  
**Next Review:** February 1, 2026

**Questions?** your.email@example.com
