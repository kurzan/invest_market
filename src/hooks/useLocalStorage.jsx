import { useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  const getValue = () => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      return initialValue;
    }
  };

  const [localStorageValue, setLocalStorageValue] = useState(getValue());

  const setSavedValue = (value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } finally {
      setLocalStorageValue(value);
    }
  };

  return { localStorageValue, setSavedValue };
};
