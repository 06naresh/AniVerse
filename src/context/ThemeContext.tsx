import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
    children: ReactNode;
}

function getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem("aniverse-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    const isDark = theme === "dark";

    useEffect(() => {
        const root = document.documentElement;

        root.classList.toggle("dark", isDark);
        root.style.colorScheme = theme;

        document.body.classList.toggle("dark", isDark);

        localStorage.setItem("aniverse-theme", theme);
    }, [theme, isDark]);

    function toggleTheme() {
        setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
    }

    return (
        <ThemeContext.Provider
            value={{theme,isDark, toggleTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);

    if(context === null) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return context;
}