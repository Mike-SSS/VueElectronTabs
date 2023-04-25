import { LoginResponse } from '@/models/auth';
import { defineStore } from 'pinia';

interface State {
  login: LoginResponse | null;
  hq: any;
}

export const useAuthStore = defineStore('auth', {
  // define the state using the State interface
  state: (): State => ({
    login: null,
    hq: null,
  }),
  // define getters, actions, and mutations
  getters: {
    isLoggedIn: (state) => state.login !== null,
    token: (state) => state.login?.token || null,
    getHQ: (state) => state.hq || null,
  },
  actions: {
    setLoginResponse(loginResponse: LoginResponse) {
      this.login = loginResponse;
    },
    setHQ(hq: any) {
      console.log("Set hq ", hq);
      this.hq = hq;
    },
    clearLoginResponse() {
      this.login = null;
    },
  },
});