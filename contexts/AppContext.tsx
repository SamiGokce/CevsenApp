import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFontSize,
  getLanguage,
  saveFontSize,
  saveLanguage,
  getShowTranslation,
  saveShowTranslation,
  FontSize,
  Language,
} from "../utils/storage";

interface AppContextValue {
  fontSize: FontSize;
  language: Language;
  showTranslation: boolean;
  setFontSize: (s: FontSize) => void;
  setLanguage: (l: Language) => void;
  setShowTranslation: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue>({
  fontSize: "medium",
  language: "tr",
  showTranslation: true,
  setFontSize: () => {},
  setLanguage: () => {},
  setShowTranslation: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [language, setLanguageState] = useState<Language>("tr");
  const [showTranslation, setShowTranslationState] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([getFontSize(), getLanguage(), getShowTranslation()]).then(
      ([fs, lang, showTr]) => {
        setFontSizeState(fs);
        setLanguageState(lang);
        setShowTranslationState(showTr);
      }
    );
  }, []);

  function setFontSize(s: FontSize) {
    setFontSizeState(s);
    saveFontSize(s);
  }

  function setLanguage(l: Language) {
    setLanguageState(l);
    saveLanguage(l);
  }

  function setShowTranslation(v: boolean) {
    setShowTranslationState(v);
    saveShowTranslation(v);
  }

  return (
    <AppContext.Provider
      value={{ fontSize, language, showTranslation, setFontSize, setLanguage, setShowTranslation }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppContext);
}
