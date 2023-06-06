import { LoginResponse } from "@/models/auth";
import { IUser } from "@/models/trading";
import { getHQAccessProfile, getMembers, submitLogin } from "@/utils/api";
import { Base64 } from "js-base64";
import { defineStore } from "pinia";

interface State {
  login: LoginResponse | null;
  hq: IUser | null;
  members: any[];
}

interface HQ {
  _id: number;
  userId: string;
  uniqueCode: string;
  setup: string;
  // default for member in trading modals
  branch: string[];
  // default for dealer in trading modals
  dealer: string[];
  safexCodes: string[];
  client: string[];
  tradingSystem: string;
  defaultCode: string;
  username: string;
  masterdealer: boolean;
  admin: boolean;
  // when enabled. Cant see trade on contract table ( Bid / offer )
  viewOnly: boolean;
  onScreenLimit: number;
  optionLimit: number;
  reportOnlyLimit: number;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

// Function to decode a JWT
function decodeJwt(token: string) {
  if (!token) {
    return null;
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/") + "==";
  const jsonPayload = decodeURIComponent(
    Base64.atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const useAuthStore = defineStore("auth", {
  // define the state using the State interface
  state: (): State => ({
    login: null,
    hq: null,
    members: [],
  }),
  // define getters, actions, and mutations
  getters: {
    isLoggedIn: (state) => state.login !== null,
    token: (state) => state.login?.token || null,
    getHQ: (state) => state.hq || null,
    getMembers: (state) => state.members,
    decodedToken(state) {
      if (!state.login) return null;
      return decodeJwt(state.login.token);
    },

    isTokenExpired(state) {
      if (!state.login) return true;
      const decodedToken = decodeJwt(state.login.token);

      if (!decodedToken) return true;

      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    },
  },
  actions: {
    setLoginResponse(loginResponse: LoginResponse) {
      this.login = loginResponse;
    },
    logout() {
      this.clearToken();
      this.clearLoginResponse();
    },
    setHQ(hq: any) {
      console.log("Set hq ", hq);
      this.hq = hq;
    },
    setMembers(items: any[]) {
      console.log("Set members ", items);
      this.members = items;
    },
    clearLoginResponse() {
      this.login = null;
    },
    setToken(token: string) {
      console.log("Set token ", token);
      if (this.login) {
        this.login.token = token;
      } else {
        this.login = {
          token: token,
          expiration: "2222-05-05",
        };
      }
      localStorage.setItem("jwt", token);
    },

    clearToken() {
      if (this.login) {
        this.login = null;
        localStorage.removeItem("jwt");
      }
    },
    async loadHQAccess(): Promise<boolean> {
      if (this.token == null) return false;
      const hq = await getHQAccessProfile();
      this.setHQ(hq);
      return true;
    },
    async loadMembers(): Promise<boolean> {
      if (this.token == null) return false;
      const members = await getMembers();
      this.setMembers(members);
      return true;
    },
    async loginUser(username: string, password: string) {
      const login = await submitLogin(username, password);
      if (login) {
        this.setLoginResponse(login);
        if (login.token) {
          this.setToken(login.token);
        }
        return true;
      } else {
        this.clearLoginResponse();
        return false;
      }
    },
  },
});
