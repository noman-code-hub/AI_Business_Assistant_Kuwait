import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type Locale = "en" | "ar";

type UiContextValue = {
  theme: Theme;
  locale: Locale;
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  searchOpen: boolean;
  toggleTheme: () => void;
  toggleLocale: () => void;
  toggleSidebar: () => void;
  setMobileNavOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
};

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [locale, setLocale] = useState<Locale>("en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo(
    () => ({
      theme,
      locale,
      sidebarCollapsed,
      mobileNavOpen,
      searchOpen,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      toggleLocale: () => setLocale((l) => (l === "en" ? "ar" : "en")),
      toggleSidebar: () => setSidebarCollapsed((v) => !v),
      setMobileNavOpen,
      setSearchOpen,
    }),
    [theme, locale, sidebarCollapsed, mobileNavOpen, searchOpen]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
