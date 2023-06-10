import { IUserPref, UserLayout, UserPreferences } from "@/models/UI";
import { LoginResponse } from "@/models/auth";
import { LAYOUT } from "@/models/layout";
import { IUser } from "@/models/trading";
import {
  getHQAccessProfile,
  createUserPref,
  updateUserPref,
  loadUserLayouts,
  loadUserPref,
  getMembers,
  submitLogin,
  saveLayout,
  updateLayout,
  deletePreferences as deletePref,
} from "@/utils/api";
import { Base64 } from "js-base64";
import { defineStore } from "pinia";

interface State {
  login: LoginResponse | null;
  hq: IUser | null;
  userPreferenceJson: UserPreferences | null;
  userLayoutJson: UserLayout[];
  members: any[];
  loaders: {
    hq: boolean;
    login: boolean;
    members: boolean;
    saveLayout: boolean;
    updateLayout: boolean;
    createUserPref: boolean;
    updateUserPref: boolean;
  };
}

// interface HQ {
//   _id: number;
//   userId: string;
//   uniqueCode: string;
//   setup: string;
//   // default for member in trading modals
//   branch: string[];
//   // default for dealer in trading modals
//   dealer: string[];
//   safexCodes: string[];
//   client: string[];
//   tradingSystem: string;
//   defaultCode: string;
//   username: string;
//   masterdealer: boolean;
//   admin: boolean;
//   // when enabled. Cant see trade on contract table ( Bid / offer )
//   viewOnly: boolean;
//   onScreenLimit: number;
//   optionLimit: number;
//   reportOnlyLimit: number;
//   createdBy: string;
//   createdDate: string;
//   updatedBy: string;
//   updatedDate: string;
// }

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
    userLayoutJson: [],
    userPreferenceJson: null,
    members: [],
    loaders: {
      hq: false,
      login: false,
      members: false,
      updateLayout: false,
      saveLayout: false,
      updateUserPref: false,
      createUserPref: false,
    },
  }),
  // define getters, actions, and mutations
  getters: {
    isLoggedIn: (state) => state.login !== null,
    token: (state) => state.login?.token || null,
    getHQ: (state) => state.hq || null,
    getMembers: (state) => state.members,
    getUserPref: (state) => state.userPreferenceJson,
    getUserLayouts: (state) => state.userLayoutJson,
    decodedToken(state) {
      if (!state.login) return null;
      return decodeJwt(state.login.token);
    },
    currentLoaders(state) {
      return state.loaders;
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
    setUserPref(item: UserPreferences) {
      console.log("Set user pref ", item);
      this.userPreferenceJson = item;
    },
    setUserLayouts(items: LAYOUT[]) {
      console.log("Set saved layouts ", items);
      this.members = items;
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
    async createUserPreference(item?: UserPreferences) {
      let t = item;
      if (!this.getHQ)
        return Promise.reject("No HQ when trying to create a preference");
      if (!t) {
        // default
        t = {
          userId: this.getHQ.userId,
          userPreferenceJson: {
            flags: {
              insertOrderOrDouble: false,
              cancelAllActiveOrders: false,
              suspendAllActiveOrders: false,
              deleteActiveOrder: false,
              suspendActiveOrder: false,
              reduceActiveOrder: false,
              resubmitActiveOrder: false,
              editSuspendOrder: false,
              insertUnmatchedDeal: false,
              deleteUnmatchedDeal: false,
              acceptUnmatchedDeal: false,
              editUnmatchedDeal: false,
              splitDeal: false,
              assignDealToMember: false,
              tripartiteDeal: false,
              cumulateDeal: false,
              correctDealPrinciple: false,
              exerciseOption: false,
              abandonOption: false,
              subAccountChange: false,
              deleteSiloCertAuctionBid: false,
            },
            profile: {
              branch: "computedBranch[0]",
              dealer: "computedDealer[0]",
              client: "computedClient[0]",
            },
            defaults: {
              price: "0000",
            },
          },
        };
      }

      const res = await createUserPref(t);
      return res;
    },
    async updateUserPreference(item: IUserPref) {
      const res = await updateUserPref(item);
    },
    async loadUserPreference() {
      const res = await loadUserPref().catch(async () => {
        return await this.createUserPreference();
      });
      if (res) this.setUserPref(res);
    },
    async saveUserLayout(item: UserLayout) {
      const res = await saveLayout(item);
    },
    async updateUserLayout(item: UserLayout) {
      const res = await updateLayout(item);
    },
    async loadUserLayouts() {
      const res = await loadUserLayouts();
      this.setUserLayouts(res);
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
    async deletePreferences() {
      const res = await deletePref();
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
