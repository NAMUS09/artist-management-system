"use client";

import { useEffect, useState } from "react";

function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Initialize state with value from localStorage or the provided initial value
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing to localStorage key:", key, error);
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistedState;
