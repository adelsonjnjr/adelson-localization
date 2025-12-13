/**
 * Deep merge multiple objects (designed for translation objects)
 * Later values overwrite earlier ones for primitive types and arrays.
 * Nested objects are merged recursively.
 * 
 * @param objects - Objects to merge
 * @returns Merged object
 * 
 * @example
 * ```typescript
 * const obj1 = { app: { title: "App" }, user: { name: "John" } };
 * const obj2 = { app: { version: "1.0" }, user: { age: 30 } };
 * const result = deepMerge(obj1, obj2);
 * // { app: { title: "App", version: "1.0" }, user: { name: "John", age: 30 } }
 * ```
 */
export function deepMerge(...objects: any[]): any {
  const result: any = {};
  
  for (const obj of objects) {
    if (!obj || typeof obj !== 'object') continue;
    
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      
      if (
        typeof obj[key] === 'object' && 
        obj[key] !== null && 
        !Array.isArray(obj[key])
      ) {
        // Recursively merge nested objects
        result[key] = deepMerge(result[key] || {}, obj[key]);
      } else {
        // Overwrite primitive values and arrays
        result[key] = obj[key];
      }
    }
  }
  
  return result;
}

/**
 * Strict deep merge: only updates existing keys in the target object recursively.
 * Does not add new keys from source objects. Useful for partial updates
 * while maintaining a strict schema.
 * 
 * @param target - The target object to extend (will be mutated)
 * @param sources - Source objects to merge from
 * @returns The extended target object
 * 
 * @example
 * ```typescript
 * const target = { 
 *   api: { baseUrl: "http://localhost", timeout: 5000 },
 *   ui: { theme: "light" }
 * };
 * const source = { 
 *   api: { timeout: 10000, newField: "ignored" },
 *   ui: { theme: "dark" },
 *   extra: "ignored"
 * };
 * strictDeepMerge(target, source);
 * // { 
 * //   api: { baseUrl: "http://localhost", timeout: 10000 },
 * //   ui: { theme: "dark" }
 * // }
 * // 'newField' and 'extra' are not added
 * ```
 */
export function strictDeepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: any[]
): T {
  if (!target || Object.keys(target).length === 0) {
    return target;
  }

  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;
    
    for (const key in target) {
      if (!target.hasOwnProperty(key) || !source.hasOwnProperty(key)) continue;
      
      if (
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !Array.isArray(target[key]) &&
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        // Recursively merge nested objects
        strictDeepMerge(target[key], source[key]);
      } else {
        // Overwrite primitive values and arrays
        target[key] = source[key];
      }
    }
  }

  return target;
}
