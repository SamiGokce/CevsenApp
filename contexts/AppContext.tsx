import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFontSize,
  getLanguage,
  saveFontSize,
  saveLanguage,
  getShowTranslation,
  saveShowTranslation,
  getEasyReadMode,
  saveEasyReadMode,
  FontSize,
  Language,
} from "../utils/storage";

interface AppContextValue {
  fontSize: FontSize;
  language: Language;
  showTranslation: boolean;
  easyReadMode: boolean;
  setFontSize: (s: FontSize) => void;
  setLanguage: (l: Language) => void;
  setShowTranslation: (v: boolean) => void;
  setEasyReadMode: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue>({
  fontSize: "medium",
  language: "tr",
  showTranslation: false,
  easyReadMode: false,
  setFontSize: () => {},
  setLanguage: () => {},
  setShowTranslation: () => {},
  setEasyReadMode: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [language, setLanguageState] = useState<Language>("tr");
  const [showTranslation, setShowTranslationState] = useState<boolean>(false);
  const [easyReadMode, setEasyReadModeState] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      getFontSize(),
      getLanguage(),
      getShowTranslation(),
      getEasyReadMode(),
    ]).then(([fs, lang, showTr, easy]) => {
      setFontSizeState(fs);
      setLanguageState(lang);
      setShowTranslationState(showTr);
      setEasyReadModeState(easy);
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

  function setShowTranslation(v: boolean) {
    setShowTranslationState(v);
    saveShowTranslation(v);
  }

  function setEasyReadMode(v: boolean) {
    setEasyReadModeState(v);
    saveEasyReadMode(v);
  }

  return (
    <AppContext.Provider
      value={{
        fontSize,
        language,
        showTranslation,
        easyReadMode,
        setFontSize,
        setLanguage,
        setShowTranslation,
        setEasyReadMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppContext);
}
