import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [selectedTrade, setSelectedTrade] = useState("Painter");
  const [savedQuotes, setSavedQuotes] = useState([]);

  function addQuote(quote) {
    setSavedQuotes((prev) => [
      { ...quote, id: Date.now(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }

  function deleteQuote(id) {
    setSavedQuotes((prev) => prev.filter((q) => q.id !== id));
  }

  return (
    <AppContext.Provider
      value={{ selectedTrade, setSelectedTrade, savedQuotes, addQuote, deleteQuote }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
