import { useCallback, useEffect, useMemo, useState } from "react";

// Initialize string helpers
import { stringHelpExtensions } from "./stringHelpers";
import { deepMerge } from "./objectHelpers";
stringHelpExtensions();

// Règles de pluriel par langue
const PLURAL_RULES: Record<string, (count: number) => 'singular' | 'plural'> = {
  fr: (count) => count <= 1 ? 'singular' : 'plural',
  es: (count) => count === 1 ? 'singular' : 'plural',
  en: (count) => count === 1 ? 'singular' : 'plural',
  de: (count) => count === 1 ? 'singular' : 'plural', // Allemand
  it: (count) => count === 1 ? 'singular' : 'plural', // Italien
  pt: (count) => count === 1 ? 'singular' : 'plural', // Portugais
  nl: (count) => count === 1 ? 'singular' : 'plural', // Néerlandais
  // Règle par défaut pour langues non listées
  default: (count) => count === 1 ? 'singular' : 'plural',
};

/**
 * Fonction pour détecter le mode développement (agnostique du bundler)
 */
const isDevelopmentMode = (): boolean => {
  // Vite
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV !== undefined) {
    return (import.meta as any).env.DEV;
  }
  
  // Webpack / Create React App
  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== undefined) {
    return process.env.NODE_ENV === 'development';
  }
  
  // Next.js
  if (typeof process !== 'undefined' && (process.env as any)?.NEXT_PUBLIC_NODE_ENV !== undefined) {
    return (process.env as any).NEXT_PUBLIC_NODE_ENV === 'development';
  }
  
  // Fallback : localhost detection
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('.local');
  }
  
  // Par défaut, considérer comme production (plus sûr)
  return false;
};

export interface UseLanguageConfig {
  lang?: string;
  translationsUrl?: string;
  managedLanguages?: string[];
  enableHMR?: boolean;
  resourceFiles?: string[];
}

export interface UseLanguageReturn {
  /** Raw translation data loaded from the translation file */
  resource: any;
  
  /**
   * Localization function to retrieve translated strings.
   * 
   * Supports dot notation for nested keys and dynamic formatting with indexed `{{}}` or named `{{name}}` placeholders.
   * 
   * @template T - The expected return type, defaults to string.
   * @param key - The key representing the string to be localized (supports dot notation for nested keys).
   * @param args - Additional arguments for formatting the string. Can be:
   *   - Indexed values: `ln("key", value1, value2)`
   *   - Named object: `ln("key", { name: "John" })`
   *   - Mixed: `ln("key", value1, { name: "John" })`
   *   - With default: `ln("key", { defaultTxt: "Fallback" })`
   * @returns The localized string or the value corresponding to the key.
   * 
   * @example
   * ```tsx
   * // Simple translation
   * const title = ln("app.title");
   * 
   * // Indexed placeholders
   * const greeting = ln("greetings.hello", "John");
   * // "Hello {{}}!" → "Hello John!"
   * 
   * // Named placeholders
   * const profile = ln("profile.info", { firstName: "John", lastName: "Doe" });
   * // "{{firstName}} {{lastName}}" → "John Doe"
   * 
   * // TypeScript generics for non-string types
   * const count = ln<number>("config.maxItems");
   * const features = ln<string[]>("config.features");
   * 
   * // With default fallback
   * const text = ln("missing.key", { defaultTxt: "Default text" });
   * ```
   */
  ln: <T = string>(key: string, ...args: any[]) => T;
  
  /**
   * Localization function with plural support.
   * 
   * Automatically selects singular or plural form based on the count and language-specific plural rules.
   * 
   * @template T - The expected return type, defaults to string.
   * @param key - The base key (without .singular/.plural suffix).
   * @param count - The count to determine singular/plural form.
   * @param args - Additional arguments for formatting the string.
   * @returns The localized string in singular or plural form.
   * 
   * @example
   * ```tsx
   * // translation.json:
   * // {
   * //   "messages": {
   * //     "notification": {
   * //       "singular": "You have {{}} new message",
   * //       "plural": "You have {{}} new messages"
   * //     }
   * //   }
   * // }
   * 
   * const msg1 = lnPlural("messages.notification", 1);
   * // Output: "You have 1 new message"
   * 
   * const msg5 = lnPlural("messages.notification", 5);
   * // Output: "You have 5 new messages"
   * ```
   */
  lnPlural: <T = string>(key: string, count: number, ...args: any[]) => T;
  
  /** Current language state */
  language: { key: string };
  
  /**
   * Function to change the current language.
   * 
   * @param lang - Object containing the language key.
   * 
   * @example
   * ```tsx
   * setLanguage({ key: "fr" });
   * ```
   */
  setLanguage: (lang: { key: string }) => void;
  
  /** Loading state for translation resources */
  loadingResource: boolean;
}

/**
 * Adelson Localization Hook
 * 
 * A dynamic React localization hook with live translation updates without redeployment.
 * 
 * @param {UseLanguageConfig} config - Configuration object
 * @param {string} config.lang - Initial language (default: "en")
 * @param {string} config.translationsUrl - Base URL for translation files (default: "/locales")
 * @param {string[]} config.managedLanguages - Array of supported languages (default: ["en", "fr", "es"])
 * @param {boolean} config.enableHMR - Enable Hot Module Replacement for translations in development (default: false)
 * @param {string[]} config.resourceFiles - Array of translation file names to load and merge (default: ["translation.json"])
 * 
 * @returns {UseLanguageReturn} Object containing localization functions and state
 * 
 * @example
 * ```tsx
 * const { ln, lnPlural, language, setLanguage } = useLanguage({ 
 *   lang: "en",
 *   managedLanguages: ["en", "fr", "es", "de"]
 * });
 * 
 * // Simple translation
 * const title = ln("app.title");
 * 
 * // With formatting
 * const greeting = ln("greetings.hello", "John");
 * 
 * // Plural support
 * const messages = lnPlural("messages.notification", count);
 * ```
 */
export const useLanguage = ({ 
  lang = "en", 
  translationsUrl = "/locales",
  managedLanguages = ["en", "fr", "es"],
  enableHMR = false,
  resourceFiles = ["translation.json"]
}: UseLanguageConfig): UseLanguageReturn => {
  const [data, setData] = useState<any>();
  const [language, setLanguage] = useState<{
    /** Current language key */
    key: string
   }>({ key: lang });
  const [loadingResource, setLoadingResource] = useState(true);
  const emptyString = "";
  const stableTranslationUrl = useMemo(() => translationsUrl, [translationsUrl]);
  const stableManagedLanguages = useMemo(() => managedLanguages, [managedLanguages.join(",")]);
  const stableResourceFiles = useMemo(() => resourceFiles, [resourceFiles.join(",")]);

  // Implementation of ln - see UseLanguageReturn interface for full documentation
  const ln = useCallback(
    <T = string>(key: string, ...args: any[]): T => {
      let splitKey = key.split(".");
      let defaultTxt = emptyString;
      
      if (args.length > 0 && typeof args[args.length - 1] === "object" && args[args.length - 1].hasOwnProperty("defaultTxt")) {
        defaultTxt = args[args.length - 1].defaultTxt;
        if (!data || loadingResource) return emptyString as T;
      }
      if (!data && loadingResource) return emptyString as T;

      let index = 0;
      let keyPart = splitKey[index].trimStart().trimEnd();
      if (keyPart === "") return "unknown" as T;
      if (!data?.hasOwnProperty(keyPart)) return defaultTxt ? `${defaultTxt}`.format(...args) as T : key as T;
      let value = data?.[keyPart];
      
      try {
        while (index++ < splitKey.length - 1) {
          keyPart = splitKey[index];
          if (!value?.hasOwnProperty(keyPart)) {
            throw `${keyPart} should be a property of the value object`;
          }
          value = value?.[keyPart];
        }
      } catch (e: any) {
        value = defaultTxt ? `${defaultTxt}`.format(...args) as T : key as T;
      }
      
      return typeof value === "string" ? `${value}`.format(...args) as T : value;
    },
    [data]
  );

  // Implementation of lnPlural - see UseLanguageReturn interface for full documentation
  const lnPlural = useCallback(
    <T = string>(key: string, count: number, ...args: any[]): T => {
      // Utiliser la règle de pluriel appropriée pour la langue actuelle
      const pluralRule = PLURAL_RULES[language.key] || PLURAL_RULES.default;
      const form = pluralRule(count);
      const pluralKey = `${key}.${form}`;
      
      // Récupérer la traduction avec la clé appropriée
      const translation = ln<string>(pluralKey, count, ...args);
      
      return translation as T;
    },
    [ln, language.key]
  );

  // Load language resource file
  const loadTranslations = useCallback(async () => {
    setLoadingResource(true);
    
    // Vérifier si la langue est gérée
    if (stableManagedLanguages.indexOf(language.key) === -1) {
      console.warn(`[Adelson Localization] Language "${language.key}" is not in managedLanguages array. Skipping translation load.`);
      setLoadingResource(false);
      return;
    }
    
    try {
      // Charger tous les fichiers de ressources en parallèle
      const filePromises = stableResourceFiles.map(file => 
        fetch(`${stableTranslationUrl}/${language.key}/${file}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          cache: enableHMR ? 'no-cache' : 'default'
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load ${file} for language: ${language.key}`);
          }
          return response.json();
        })
      );
      
      // Attendre que tous les fichiers soient chargés
      const results = await Promise.all(filePromises);
      
      // Fusionner tous les fichiers de traduction
      const mergedData = deepMerge({}, ...results);
      
      setData(mergedData);
    } catch (error) {
      console.error("[Adelson Localization] Error loading translations:", error);
      setData({});
    } finally {
      setLoadingResource(false);
    }
  }, [language.key, stableTranslationUrl, stableManagedLanguages, enableHMR, stableResourceFiles]);

  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

  // HMR : Surveiller les modifications de fichiers en mode dev
  useEffect(() => {
    const isDevMode = isDevelopmentMode();
    
    // Ne fonctionne qu'en mode dev et si enableHMR est true
    if (!enableHMR || !isDevMode) {
      return;
    }

    let intervalId: NodeJS.Timeout;
    let lastModified: string | null = null;

    const checkForUpdates = async () => {
      try {
        const response = await fetch(`${stableTranslationUrl}/${language.key}/translation.json`, {
          method: 'HEAD',
          cache: 'no-cache'
        });

        if (response.ok) {
          const currentModified = response.headers.get('Last-Modified');
          
          if (lastModified && currentModified && lastModified !== currentModified) {
            console.log(`🔄 [Adelson Localization] Translation file modified (${language.key}), reloading...`);
            await loadTranslations();
          }
          
          lastModified = currentModified;
        }
      } catch (error) {
        console.debug('[Adelson Localization] HMR check error:', error);
      }
    };

    intervalId = setInterval(checkForUpdates, 2000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [enableHMR, language.key, stableTranslationUrl, loadTranslations]);

  return { 
    resource: data, 
    ln, 
    lnPlural, 
    language, 
    setLanguage,
    loadingResource 
  };
};
