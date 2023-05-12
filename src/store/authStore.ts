import { LoginResponse } from '@/models/auth';
import { defineStore } from 'pinia';

interface State {
  login: LoginResponse | null;
  hq: HQ | null;
}

interface HQ {
  _id: number;
  userId: string;
  uniqueCode: string;
  setup: string;
  branch: string[];
  dealer: string[];
  safexCodes: string[];
  client: string[];
  tradingSystem: string;
  defaultCode: string;
  username: string;
  masterdealer: boolean;
  admin: boolean;
  viewOnly: boolean;
  onScreenLimit: number;
  optionLimit: number;
  reportOnlyLimit: number;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
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