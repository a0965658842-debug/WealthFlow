
/**
 * Safely retrieves environment variables across different environments (Vite, Webpack, etc.)
 * Prevents "process is not defined" errors in browser.
 */
export const getEnv = (key: string): string => {
  // 1. Try Vite (import.meta.env)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
    // Also try VITE_ prefix if the key doesn't have it
    const viteKey = key.startsWith('VITE_') ? key : `VITE_${key}`;
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
      // @ts-ignore
      return import.meta.env[viteKey];
    }
  } catch (e) {
    // Ignore error
  }

  // 2. Try Process (Webpack/CRA/Node)
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[key]) return process.env[key] || '';
      
      // Also try REACT_APP_ prefix for CRA
      const reactKey = key.startsWith('REACT_APP_') ? key : `REACT_APP_${key}`;
      if (process.env[reactKey]) return process.env[reactKey] || '';
    }
  } catch (e) {
    // process is not defined
  }

  return '';
};
