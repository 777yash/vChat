import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("vChat-theme") || "night",
  setTheme: (theme) => {
    localStorage.setItem("vChat-theme", theme);
    set({ theme });
  },
}));