import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Scheme = "neutral" | "inverted" | "white" | "black" | "magenta";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultScheme?: Scheme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  scheme: Scheme;
  setScheme: (scheme: Scheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  scheme: "neutral",
  setScheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultScheme = "neutral",
  storageKey = "app-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [scheme, setScheme] = useState<Scheme>(
    () => (localStorage.getItem(`${storageKey}-scheme`) as Scheme) || defaultScheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.setAttribute("data-scheme", scheme);

    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-mode", "dark");
    } else {
      root.setAttribute("data-mode", "light");
    }
  }, [theme, scheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    scheme,
    setScheme: (scheme: Scheme) => {
      localStorage.setItem(`${storageKey}-scheme`, scheme);
      setScheme(scheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};