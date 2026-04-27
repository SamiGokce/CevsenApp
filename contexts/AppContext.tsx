import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFontSize,
  saveFontSize,
  getEasyReadMode,
  saveEasyReadMode,
  FontSize,
} from "../utils/storage";

interface AppContextValue {
  fontSize: FontSize;
  easyReadMode: boolean;
  setFontSize: (s: FontSize) => void;
  setEasyReadMode: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue>({
  fontSize: "medium",
  easyReadMode: false,
  setFontSize: () => {},
  setEasyReadMode: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [easyReadMode, setEasyReadModeState] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([getFontSize(), getEasyReadMode()]).then(([fs, easy]) => {
      setFontSizeState(fs);
      setEasyReadModeState(easy);
    });
  }, []);

  function setFontSize(s: FontSize) {
    setFontSizeState(s);
    saveFontSize(s);
  }

  function setEasyReadMode(v: boolean) {
    setEasyReadModeState(v);
    saveEasyReadMode(v);
  }

  return (
    <AppContext.Provider
      value={{ fontSize, easyReadMode, setFontSize, setEasyReadMode }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppContext);
}
