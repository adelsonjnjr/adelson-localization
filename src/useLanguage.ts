import { useCallback, useEffect, useMemo, useState } from "react";

// Initialize string helpers
import { stringHelpExtensions } from "./stringHelpers";
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
}

export interface UseLanguageReturn {
  resource: any;
  ln: <T = string>(key: string, ...args: any[]) => T;
  lnPlural: <T = string>(key: string, count: number, ...args: any[]) => T;
  language: { key: string };
  setLanguage: (lang: { key: string }) => void;
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
  enableHMR = false
}: UseLanguageConfig): UseLanguageReturn => {
  const [data, setData] = useState<any>();
  const [language, setLanguage] = useState({ key: lang });
  const [loadingResource, setLoadingResource] = useState(true);
  const emptyString = "";
  const stableTranslationUrl = useMemo(() => translationsUrl, [translationsUrl]);
  const stableManagedLanguages = useMemo(() => managedLanguages, [managedLanguages.join(",")]);

  /**
   * Localization function to retrieve translated strings.
   * @template T The expected return type, defaults to string.
   * @param {string} key The key representing the string to be localized, supports dot notation for nested keys.
   * @param {...any[]} args Additional arguments for formatting the string.
   * @returns {T} The localized string or the value corresponding to the key.
   * @example
   * const greeting = ln("greetings.hello", "John");
   * console.log(greeting); // Output: "Hello, John" (assuming the translation exists)
   */
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
      if (!data?.hasOwnProperty(keyPart)) return key as T;
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
        value = defaultTxt ? defaultTxt : key;
      }
      
      return typeof value === "string" ? `${value}`.format(...args) as T : value;
    },
    [data]
  );

  /**
   * Localization function with plural support.
   * @template T The expected return type, defaults to string.
   * @param {string} key The key representing the base string to be localized (without .singular/.plural suffix).
   * @param {number} count The count to determine singular/plural form.
   * @param {...any[]} args Additional arguments for formatting the string.
   * @returns {T} The localized string in singular or plural form.
   * @example
   * // translation.json: { "messages": { "notification": { "singular": "You have {{}} new message", "plural": "You have {{}} new messages" } } }
   * const msg1 = lnPlural("messages.notification", 1);
   * console.log(msg1); // Output: "You have 1 new message"
   * 
   * const msg5 = lnPlural("messages.notification", 5);
   * console.log(msg5); // Output: "You have 5 new messages"
   */
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
      const response = await fetch(`${stableTranslationUrl}/${language.key}/translation.json`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: enableHMR ? 'no-cache' : 'default'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load translations for language: ${language.key}`);
      }
      
      const translationData = await response.json();
      setData(translationData);
    } catch (error) {
      console.error("[Adelson Localization] Error loading translations:", error);
      setData({});
    } finally {
      setLoadingResource(false);
    }
  }, [language.key, stableTranslationUrl, stableManagedLanguages, enableHMR]);

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

    console.log('🔄 [Adelson Localization] HMR activé pour les traductions');

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
