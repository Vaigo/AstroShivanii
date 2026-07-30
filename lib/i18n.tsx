"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import en from "@/i18n/en.json";
import hi from "@/i18n/hi.json";

type Lang = "en" | "hi";

type NestedValue = string | Record<string, unknown>;

function getPath(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return path;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : path;
}

const translations: Record<Lang, Record<string, unknown>> = { en, hi };

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "hi",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  // Default is Hindi, matching the statically-exported HTML — the stored
  // preference (if any) is applied after mount to avoid a hydration mismatch.
  const [lang, setLangState] = useState<Lang>("hi");

  useEffect(() => {
    const stored = window.localStorage.getItem("as-lang");
    if (stored === "en" || stored === "hi") {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("as-lang", l);
    }
  }, []);

  const t = useCallback(
    (key: string) => getPath(translations[lang] as Record<string, unknown>, key),
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
