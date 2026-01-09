'use client';

import {
  
  
  
  
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type {Dispatch, PropsWithChildren, ReactNode, SetStateAction} from "react";

// --- Custom Logic: Color Presets & Composite Themes ---

export const COLOR_PRESETS = [
    { name: 'violet', label: 'Violet', primary: '0.59 0.14 242', foreground: '0.98 0.01 237' },
    { name: 'blue', label: 'Blue', primary: '0.59 0.14 260', foreground: '0.98 0.01 237' },
    { name: 'emerald', label: 'Emerald', primary: '0.65 0.14 150', foreground: '0.98 0.01 237' },
    { name: 'rose', label: 'Rose', primary: '0.6 0.16 10', foreground: '0.98 0.01 237' },
    { name: 'orange', label: 'Orange', primary: '0.65 0.16 45', foreground: '0.98 0.01 237' },
    { name: 'slate', label: 'Slate', primary: '0.25 0.02 260', foreground: '0.98 0.01 237' }
];

const generatedThemes = ['light', 'dark', 'system'];
const generatedValueMap: Record<string, string> = {
  'light': 'light',
  'dark': 'dark',
  'system': 'system', 
};

COLOR_PRESETS.forEach(p => {
  if (p.name === 'violet') return; // Default
  const lightKey = `light-${p.name}`;
  const darkKey = `dark-${p.name}`;
  generatedThemes.push(lightKey, darkKey);
  generatedValueMap[lightKey] = `light theme-${p.name}`;
  generatedValueMap[darkKey] = `dark theme-${p.name}`;
});

// --- End Custom Logic ---

type ValueObject = {
  [themeName: string]: string;
};

export type UseThemeProps = {
  themes: Array<string>;
  forcedTheme?: string | undefined;
  setTheme: Dispatch<SetStateAction<string>>;
  theme?: string | undefined;
  systemTheme?: "dark" | "light" | undefined;
  // Custom extensions
  color: string;
  setColor: (color: string) => void;
  presets: typeof COLOR_PRESETS;
};

export type Attribute = `data-${string}` | "class";

export interface ThemeProviderProps extends PropsWithChildren {
  themes?: Array<string> | undefined;
  forcedTheme?: string | undefined;
  enableSystem?: boolean | undefined;
  disableTransitionOnChange?: boolean | undefined;
  enableColorScheme?: boolean | undefined;
  storageKey?: string | undefined;
  defaultTheme?: string | undefined;
  attribute?: Attribute | Array<Attribute> | undefined;
  value?: ValueObject | undefined;
  nonce?: string | undefined;
}

const colorSchemes = ["light", "dark"];
const MEDIA = "(prefers-color-scheme: dark)";
const isServer = typeof window === "undefined";
const ThemeContext = createContext<UseThemeProps | undefined>(undefined);

const defaultContext: UseThemeProps = {
  setTheme: () => {},
  themes: [],
  color: 'violet',
  setColor: () => {},
  presets: COLOR_PRESETS
};

export const useTheme = () => useContext(ThemeContext) ?? defaultContext;

export const ThemeProvider = (props: ThemeProviderProps): ReactNode => {
  const context = useContext(ThemeContext);
  if (context) return props.children;
  
  // Merge defaults with generated composite configuration
  return (
      <Theme 
          {...props} 
          themes={props.themes ?? generatedThemes} 
          value={props.value ?? generatedValueMap} 
          attribute={props.attribute ?? "class"}
      />
  );
};

const defaultThemes = ["light", "dark"];

const Theme = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = "theme",
  themes = defaultThemes,
  defaultTheme = enableSystem ? "system" : "light",
  attribute = "data-theme",
  value,
  children,
  nonce,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState(() =>
    getTheme(storageKey, defaultTheme)
  );

  const applyClassAttribute = useCallback(
    (name: string | undefined, attrValues: Array<string>) => {
      const d = document.documentElement;
      
      // FIX: Handle space-separated classes safely
      // Flatten all potential values to ensure clean removal
      const classesToRemove = attrValues.flatMap(v => v.split(/\s+/)).filter(Boolean);
      d.classList.remove(...classesToRemove);

      if (name) {
          const classesToAdd = name.split(/\s+/).filter(Boolean);
          d.classList.add(...classesToAdd);
      }
    },
    []
  );

  const applyDataAttribute = useCallback(
    (attr: string, name: string | undefined) => {
      const d = document.documentElement;
      if (name) {
        d.setAttribute(attr, name);
      } else {
        d.removeAttribute(attr);
      }
    },
    []
  );

  const applyAttributesToDOM = useCallback(
    (resolved: string) => {
      const attributeList = Array.isArray(attribute) ? attribute : [attribute];
      const attrValues = value ? Object.values(value) : themes;
      const name = value ? value[resolved] : resolved;

      for (const attr of attributeList) {
        if (attr === "class") {
          applyClassAttribute(name, attrValues);
        } else if (attr.startsWith("data-")) {
          applyDataAttribute(attr, name);
        }
      }
    },
    [attribute, themes, value, applyClassAttribute, applyDataAttribute]
  );

  const applyColorScheme = useCallback(
    (resolved: string) => {
      if (!enableColorScheme) {
        return;
      }
      const fallback = colorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;
      const colorScheme = colorSchemes.includes(resolved) ? resolved : fallback;
      document.documentElement.style.colorScheme = colorScheme || "";
    },
    [enableColorScheme, defaultTheme]
  );

  const applyTheme = useCallback(
    (nextTheme: string | undefined) => {
      if (!nextTheme) {
        return;
      }

      const resolved =
        nextTheme === "system" && enableSystem ? getSystemTheme() : nextTheme;

      const enable = disableTransitionOnChange ? disableAnimation() : null;

      applyAttributesToDOM(resolved);
      applyColorScheme(resolved);

      enable?.();
    },
    [
      enableSystem,
      disableTransitionOnChange,
      applyAttributesToDOM,
      applyColorScheme,
    ]
  );

  const setTheme = useCallback(
    (newValue: SetStateAction<string>) => {
      const newTheme =
        typeof newValue === "function" ? newValue(theme ?? "") : newValue;
      setThemeState(newTheme);

      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // localStorage might not be available
      }
    },
    [theme, storageKey]
  );

  const handleMediaQuery = useCallback(
    (_event: MediaQueryListEvent | MediaQueryList) => {
      if (theme === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [applyTheme, enableSystem, forcedTheme, theme]
  );

  useEffect(() => {
    if (isServer) {
      return;
    }

    const media = window.matchMedia(MEDIA);
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  useEffect(() => {
    if (isServer) {
      return;
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }
      const newTheme = e.newValue || defaultTheme;
      setTheme(newTheme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, setTheme, storageKey]);

  useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [applyTheme, forcedTheme, theme]);

  // --- Extended Context Value logic ---
  const extendedProviderValue = useMemo(() => {
      // Logic from custom hook
      const [mode, colorPart] = (theme || 'system').split('-');
      const currentColor = colorPart || 'violet';
      const currentMode = mode;

      const setColor = (newColor: string) => {
        if (newColor === 'violet') {
          setTheme(currentMode);
        } else {
          if (currentMode === 'system') {
             // Default to light if system is selected and color is forced, 
             // to ensure deterministic class application
             setTheme(`light-${newColor}`);
          } else {
             setTheme(`${currentMode}-${newColor}`);
          }
        }
      };

      // Wrap setTheme to preserve color
      const setMode = (newMode: string | ((curr: string) => string)) => {
          // Note: newMode here is expected to be 'light'|'dark'|'system'
          // If functional update, we resolve it first (simplification: assume string for mode switch)
          if (typeof newMode === 'function') {
               // Complex case, user shouldn't use functional update for mode switching typically
               // Fallback to direct set
               setTheme(newMode);
               return;
          }

          if (newMode === 'system') {
              setTheme('system');
          } else {
              if (currentColor === 'violet') {
                  setTheme(newMode);
              } else {
                  setTheme(`${newMode}-${currentColor}`);
              }
          }
      };

      return {
        theme: currentMode,
        setTheme: setMode as Dispatch<SetStateAction<string>>,
        forcedTheme,
        themes: enableSystem ? [...themes, "system"] : themes,
        systemTheme: enableSystem
            ? (getSystemTheme())
            : undefined,
        color: currentColor,
        setColor,
        presets: COLOR_PRESETS
      };
  }, [theme, forcedTheme, enableSystem, themes, setTheme]);

  return (
    <ThemeContext.Provider value={extendedProviderValue}>
      <ThemeScript
        {...{
          forcedTheme,
          storageKey,
          attribute,
          enableSystem,
          enableColorScheme,
          defaultTheme,
          value,
          themes,
          nonce,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeScript = memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    themes,
    nonce,
  }: Omit<ThemeProviderProps, "children"> & { defaultTheme: string }) => {
    const scriptArgs = JSON.stringify([
      attribute,
      storageKey,
      defaultTheme,
      forcedTheme,
      themes,
      value,
      enableSystem,
      enableColorScheme,
    ]).slice(1, -1);

    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `(${script.toString()})(${scriptArgs})`,
        }}
        nonce={nonce}
        suppressHydrationWarning
      />
    );
  }
);

ThemeScript.displayName = "ThemeScript";

const getTheme = (key: string, fallback?: string) => {
  if (isServer) {
    return fallback;
  }
  let theme: string | undefined;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch {
    // localStorage might not be available
  }
  return theme || fallback;
};

const disableAnimation = () => {
  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  );
  document.head.appendChild(css);

  return () => {
    window.getComputedStyle(document.body);
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  if (isServer) {
    return "light";
  }
  const event = e ?? window.matchMedia(MEDIA);
  const isDark = event.matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};

export const script = (
  attribute: Attribute | Array<Attribute>,
  storageKey: string,
  defaultTheme: string,
  forcedTheme: string | undefined,
  themes: Array<string>,
  value: ValueObject | undefined,
  enableSystem: boolean,
  enableColorScheme: boolean
) => {
  const el = document.documentElement;
  const systemThemes = ["light", "dark"];
  const attributes = Array.isArray(attribute) ? attribute : [attribute];
  const attrValues = value ? Object.values(value) : themes;

  function applyClassAttr(name: string | undefined) {
    // FIX: Remove all classes by splitting composite values
    // Assuming Object.values might return strings with spaces
    // We iterate and remove them
    // Note: In script environment, we need to be careful with ES6 features if targetting old browsers, 
    // but ES6 is fine for modern.
    attrValues.forEach(function(v) {
        v.split(/\s+/).forEach(function(c) {
            if(c) el.classList.remove(c);
        });
    });

    if (name) {
      name.split(/\s+/).forEach(function(c) {
          if (c) el.classList.add(c);
      });
    }
  }

  function applyDataAttr(attr: string, name: string | undefined) {
    if (name) {
      el.setAttribute(attr, name);
    } else {
      el.removeAttribute(attr);
    }
  }

  function updateDOM(theme: string) {
    const name = value ? value[theme] : theme;

    for (const attr of attributes) {
      if (attr === "class") {
        applyClassAttr(name);
      } else if (attr.startsWith("data-")) {
        applyDataAttr(attr, name);
      }
    }

    setColorScheme(theme);
  }

  function setColorScheme(theme: string) {
    if (!enableColorScheme) {
      return;
    }

    const fallback = systemThemes.includes(defaultTheme) ? defaultTheme : null;
    const colorScheme = systemThemes.includes(theme) ? theme : fallback;
    el.style.colorScheme = colorScheme || "";
  }

  function resolveSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  if (forcedTheme) {
    const resolvedForcedTheme =
      forcedTheme === "system" && enableSystem
        ? resolveSystemTheme()
        : forcedTheme;
    updateDOM(resolvedForcedTheme);
  } else {
    try {
      const themeName = localStorage.getItem(storageKey) || defaultTheme;
      const isSystem = enableSystem && themeName === "system";
      const theme = isSystem ? resolveSystemTheme() : themeName;
      updateDOM(theme);
    } catch {
      // localStorage might not be available
    }
  }
};
