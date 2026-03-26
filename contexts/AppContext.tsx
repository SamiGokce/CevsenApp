import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFontSize,
  getLanguage,
  saveFontSize,
  saveLanguage,
  FontSize,
  Language,
} from "../utils/storage";

interface AppContextValue {
  fontSize: FontSize;
  language: Language;
  setFontSize: (s: FontSize) => void;
  setLanguage: (l: Language) => void;
}

const AppContext = createContext<AppContextValue>({
  fontSize: "medium",
  language: "en",
  setFontSize: () => {},
  setLanguage: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    Promise.all([getFontSize(), getLanguage()]).then(([fs, lang]) => {
      setFontSizeState(fs);
      setLanguageState(lang);
    });
  }, []);

  function setFontSize(s: FontSize) {
    setFontSizeState(s);
    saveFontSize(s);
  }

  function setLanguage(l: Language) {
    setLanguageState(l);
    saveLanguage(l);
  }

  return (
    <AppContext.Provider value={{ fontSize, language, setFontSize, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppContext);
}
