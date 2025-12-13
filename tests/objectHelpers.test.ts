import { deepMerge, strictDeepMerge } from '../src/objectHelpers';

describe('objectHelpers', () => {
  describe('deepMerge', () => {
    it('should merge flat objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = deepMerge(obj1, obj2);
      
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested objects', () => {
      const obj1 = { app: { title: "App", version: "1.0" } };
      const obj2 = { app: { version: "2.0", author: "John" } };
      const result = deepMerge(obj1, obj2);
      
      expect(result).toEqual({ 
        app: { title: "App", version: "2.0", author: "John" } 
      });
    });

    it('should merge multiple objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      const result = deepMerge(obj1, obj2, obj3);
      
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should overwrite arrays instead of merging them', () => {
      const obj1 = { items: [1, 2, 3] };
      const obj2 = { items: [4, 5] };
      const result = deepMerge(obj1, obj2);
      
      expect(result).toEqual({ items: [4, 5] });
    });

    it('should handle null and undefined values', () => {
      const obj1 = { a: 1, b: null };
      const obj2 = { b: 2, c: undefined };
      const result = deepMerge(obj1, obj2);
      
      expect(result).toEqual({ a: 1, b: 2, c: undefined });
    });

    it('should skip null and undefined source objects', () => {
      const obj1 = { a: 1 };
      const result = deepMerge(obj1, null, undefined, { b: 2 });
      
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle deeply nested objects', () => {
      const obj1 = {
        level1: {
          level2: {
            level3: {
              value: "original"
            }
          }
        }
      };
      const obj2 = {
        level1: {
          level2: {
            level3: {
              value: "updated",
              newValue: "added"
            }
          }
        }
      };
      const result = deepMerge(obj1, obj2);
      
      expect(result).toEqual({
        level1: {
          level2: {
            level3: {
              value: "updated",
              newValue: "added"
            }
          }
        }
      });
    });

    it('should handle empty objects', () => {
      const obj1 = { a: 1 };
      const obj2 = {};
      const result = deepMerge(obj1, obj2);
      
      expect(result).toEqual({ a: 1 });
    });

    it('should merge translation-like structures', () => {
      const base = {
        app: { title: "My App" },
        user: { greeting: "Hello" }
      };
      const additional = {
        app: { description: "A great app" },
        user: { farewell: "Goodbye" }
      };
      const result = deepMerge(base, additional);
      
      expect(result).toEqual({
        app: { title: "My App", description: "A great app" },
        user: { greeting: "Hello", farewell: "Goodbye" }
      });
    });
  });

  describe('strictDeepMerge', () => {
    it('should update only existing keys in flat objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      strictDeepMerge(target, source);
      
      expect(target).toEqual({ a: 1, b: 3 });
      expect(target).not.toHaveProperty('c');
    });

    it('should update only existing keys in nested objects', () => {
      const target = {
        api: { baseUrl: "http://localhost", timeout: 5000 },
        ui: { theme: "light" }
      };
      const source = {
        api: { timeout: 10000, newField: "ignored" },
        ui: { theme: "dark" },
        extra: "ignored"
      };
      strictDeepMerge(target, source);
      
      expect(target).toEqual({
        api: { baseUrl: "http://localhost", timeout: 10000 },
        ui: { theme: "dark" }
      });
      expect(target.api).not.toHaveProperty('newField');
      expect(target).not.toHaveProperty('extra');
    });

    it('should handle multiple source objects', () => {
      const target = { a: 1, b: 2, c: 3 };
      const source1 = { a: 10 };
      const source2 = { b: 20 };
      strictDeepMerge(target, source1, source2);
      
      expect(target).toEqual({ a: 10, b: 20, c: 3 });
    });

    it('should return target unchanged if empty', () => {
      const target = {};
      const source = { a: 1 };
      const result = strictDeepMerge(target, source);
      
      expect(result).toEqual({});
    });

    it('should handle null and undefined sources', () => {
      const target = { a: 1, b: 2 };
      strictDeepMerge(target, null, undefined, { b: 3 });
      
      expect(target).toEqual({ a: 1, b: 3 });
    });

    it('should merge deeply nested structures while maintaining strict mode', () => {
      const target = {
        translations: {
          auth: {
            login: "Login",
            logout: "Logout"
          },
          dashboard: {
            welcome: "Welcome"
          }
        }
      };
      const source = {
        translations: {
          auth: {
            login: "Sign In",
            newField: "Should be ignored"
          },
          dashboard: {
            welcome: "Welcome Back"
          },
          newSection: {
            title: "Should be ignored"
          }
        }
      };
      strictDeepMerge(target, source);
      
      expect(target).toEqual({
        translations: {
          auth: {
            login: "Sign In",
            logout: "Logout"
          },
          dashboard: {
            welcome: "Welcome Back"
          }
        }
      });
      expect(target.translations.auth).not.toHaveProperty('newField');
      expect(target.translations).not.toHaveProperty('newSection');
    });

    it('should overwrite arrays', () => {
      const target = { items: [1, 2, 3] };
      const source = { items: [4, 5] };
      strictDeepMerge(target, source);
      
      expect(target).toEqual({ items: [4, 5] });
    });

    it('should handle primitive value updates', () => {
      const target = {
        string: "old",
        number: 1,
        boolean: false,
        nullValue: null
      };
      const source = {
        string: "new",
        number: 2,
        boolean: true,
        nullValue: "not null"
      };
      strictDeepMerge(target, source);
      
      expect(target).toEqual({
        string: "new",
        number: 2,
        boolean: true,
        nullValue: "not null"
      });
    });

    it('should not add missing keys even in nested objects', () => {
      const target = {
        config: {
          api: { timeout: 5000 }
        }
      };
      const source = {
        config: {
          api: { timeout: 10000, retries: 3 },
          cache: { enabled: true }
        }
      };
      strictDeepMerge(target, source);
      
      expect(target).toEqual({
        config: {
          api: { timeout: 10000 }
        }
      });
      expect(target.config.api).not.toHaveProperty('retries');
      expect(target.config).not.toHaveProperty('cache');
    });

    it('should mutate the target object and return it', () => {
      const target = { a: 1 };
      const result = strictDeepMerge(target, { a: 2 });
      
      expect(result).toBe(target);
      expect(target).toEqual({ a: 2 });
    });
  });
});
