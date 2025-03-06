// context/themecontext.js

"use client";

import { createContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Ensure the imports are correct
import { CssBaseline } from "@mui/material";

export const ThemeContext = createContext();

export default function ThemeContextProvider({ children }) {
  const [themeMode, setThemeMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: { main: themeMode === "light" ? "#1976d2" : "#90caf9" },
          background: { default: themeMode === "light" ? "#ffffff" : "#121212" },
          text: { primary: themeMode === "light" ? "#000000" : "#ffffff" },
        },
      }),
    [themeMode]
  );

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
