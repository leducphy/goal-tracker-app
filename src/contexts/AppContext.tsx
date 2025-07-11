import React, { createContext, ReactNode, useContext, useState } from "react";

// Định nghĩa kiểu dữ liệu cho ngôn ngữ
export type Language = "vi" | "en";

// Định nghĩa kiểu dữ liệu cho theme
export type Theme = "light" | "dark";

interface AppContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const defaultContext: AppContextProps = {
  language: "vi",
  setLanguage: () => {},
  theme: "light",
  setTheme: () => {},
  isDarkMode: false,
  toggleTheme: () => {},
};

export const AppContext = createContext<AppContextProps>(defaultContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("vi");
  const [theme, setTheme] = useState<Theme>("light");

  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook để dễ dàng sử dụng context
export const useAppContext = () => useContext(AppContext);
