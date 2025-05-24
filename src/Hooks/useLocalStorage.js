import { useState, useEffect } from 'react';

// Prefix to namespace keys in localStorage to avoid collisions
const PREFIX = 'codeeditor-';

// Custom React hook to synchronize a state value with localStorage
export default function useLocalStorage(key, initialValue) {
  // Create a namespaced key for localStorage
  const prefixedKey = PREFIX + key;

  // Initialize state with value from localStorage if available,
  // otherwise use the provided initialValue
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue != null) return JSON.parse(jsonValue);

    if (typeof initialValue === 'function') {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  // Update localStorage whenever the state value or key changes
  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }, [prefixedKey, value]);

  // Return the current state and a setter function
  return [value, setValue];
}
