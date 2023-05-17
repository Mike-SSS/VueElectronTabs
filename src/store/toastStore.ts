import { defineStore } from "pinia";
interface Toast {
  id: string | number;
  message: string;
  showing: boolean;
}
interface State {
  toasts: Toast[];
  currentToast: undefined | Toast;
}
export const useToastStore = defineStore("toasts", {
  // define the state using the State interface
  state: (): State => ({
    toasts: [
      {
        id: "abc",
        message: "Test",
        showing: true,
      },
    ],
    currentToast: undefined,
  }),
  // define getters, actions, and mutations
  getters: {
    getToasts: (state) => state.toasts,
  },
  actions: {
    addToast(message: string) {
      const id = Date.now();
      const toast = { id, message, showing: false };
      this.toasts.push(toast);

      if (!this.currentToast) {
        this.showNextToast();
      }
    },

    showNextToast() {
      if (this.toasts.length > 0) {
        this.currentToast = this.toasts.shift();
        if (this.currentToast) {
          console.log("Show next toast: ", this.currentToast);
          this.currentToast.showing = true;
        }
      }
    },

    removeToast(id: string | number) {
      if (this.currentToast) {
        console.log("Remove toast", this.currentToast, id);
        if (this.currentToast.id === id) {
          this.currentToast = undefined;
          this.showNextToast();
        }
      }
    },
  },
});
