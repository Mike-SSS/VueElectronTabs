// Utilities
import { defineStore } from "pinia";
import { MarketDisplayItemContract } from "@/models/marketData";

type LANGUAGE = "en" | "afr";
type THEME = "light" | "dark";

interface State {
  drawer: boolean;
  items: {
    title: string;
    icon: string;
    link: string;
  }[];
  theme: THEME;
  language: LANGUAGE;
  isLoggedIn: boolean;
}

export const useAppStore = defineStore("app", {
  state: (): State => ({
    drawer: false,
    items: [
      { title: "Home", icon: "mdi-home", link: "/" },
      { title: "About", icon: "mdi-information", link: "/about" },
      { title: "Contact", icon: "mdi-email", link: "/contact" },
    ],
    theme: "light",
    language: "en",
    isLoggedIn: false,
  }),
  actions: {
    toggleDrawer() {
      console.log("State man pinia");
      this.drawer = !this.drawer;
    },
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
    setLanguage(language: LANGUAGE) {
      this.language = language;
    },
  },

  getters: {
    greeting: (state) => (state.language === "en" ? "Hello!" : "¡Hola!"),
  },
});
