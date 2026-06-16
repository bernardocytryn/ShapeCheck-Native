import React, { createContext, useState, useCallback } from "react";

export const ErrorContext = createContext(null);

export function ErrorProvider({ children }) {
  const [msg, setMsg] = useState("");

  const showError = useCallback((message) => {
    const text = String(message);
    setMsg(text);
    console.error(text);
    setTimeout(() => setMsg(""), 5000);
  }, []);

  const clearError = useCallback(() => setMsg(""), []);

  return (
    <ErrorContext.Provider value={{ msg, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}
