// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    //
    drawer: false,
    items: [
      { title: 'Home', icon: 'mdi-home', link: '/' },
      { title: 'About', icon: 'mdi-information', link: '/about' },
      { title: 'Contact', icon: 'mdi-email', link: '/contact' },
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
    setLanguage(language: string) {
      this.language = language;
    },
    login() {
      this.isLoggedIn = true;
    },
    logout() {
      this.isLoggedIn = false;
    },
  },

  getters: {
    greeting: (state) => (state.language === "en" ? "Hello!" : "¡Hola!"),
  },
});
