import { IUserPref, UserLayout, UserPreferences } from "@/models/UI";
import { LoginResponse } from "@/models/auth";
import { LAYOUT } from "@/models/layout";
import { MarketDisplayItemContract } from "@/models/marketData";
import { IUser } from "@/models/trading";
import { axiosInstance, noAuthInstance } from "@/plugins/axios";
import { AxiosError } from "axios";

/**
 * Gets the user profile object from HQ
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if call is successful, false otherwise.
 */
export async function getHQAccessProfile(): Promise<IUser | null> {
  // try {
  // Make call to backend to login - all call need /api/{controller}
  const res = await axiosInstance.get("/api/authenticate/getHQAccess");
  if (res && res.data) {
    // Assign data to the store
    console.log("Data for hq: ", res.data);

    // authStore.setHQ(res.data);
    return res.data;
  }
  // } catch (err) {
  //   return Promise.reject(err);
  // }
  return null;
}

/**
 * Performs user authentication using the provided credentials.
 * Talks to server and then to HQ.
 *
 * Triggers by onClick on button
 *
 * Token should be stored in the auth store to allow boolean to be returned.
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
export async function submitLogin(
  username: string,
  password: string
): Promise<LoginResponse | null> {
  const res = await noAuthInstance.post("/api/authenticate/login", {
    email: username,
    password: password,
  });
  if (res && res.data) {
    return res.data;
  } else {
    return null;
  }
}

/**
 * Gets market display array
 *
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
export async function getMarketDisplay(): Promise<MarketDisplayItemContract[]> {
  // try {
  const res = await axiosInstance.get(
    "/api/MarketSubscription/GetMarketDisplay",
    {
      params: {
        publish: true,
      },
    }
  );
  if (res) return Promise.resolve(res.data);
  return [];
  // } catch (err) {
  //   console.error(err);
  //   return Promise.reject(err);
  // }
}
/**
 * Gets all members array
 *
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
export async function getMembers(): Promise<any[]> {
  try {
    const res = await axiosInstance.get(
      "/api/StaticData/GetAllMembers"
      // {
      //   params: {
      //     publish: true,
      //   },
      // }
    );
    if (res) return Promise.resolve(res.data);
    return [];
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

/**
 * Create user preference - flags, defaults, layouts etc
 *
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
export async function createUserPref(
  item: UserPreferences
): Promise<UserPreferences> {
  const body = JSON.stringify(item.userPreferenceJson);
  const res = await axiosInstance.post(
    "/api/UserSettings/CreateUserPreference",
    {
      ...item,
      userPreferenceJson: body,
    }
  );
  return res.data;
}
/**
 * Laod user preference - flags, defaults, layouts etc
 *
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
export async function loadUserPref(): Promise<UserPreferences | undefined> {
  try {
    const res = await axiosInstance.get("/api/UserSettings/GetUserPreference");

    const temp: UserPreferences = {
      ...res.data,
      userPreferenceJson: JSON.parse(res.data.userPreferenceJson),
    };

    return temp;
  } catch (err) {
    console.error(err);
    if (err instanceof AxiosError) {
      if (err.response && err.response.status == 405) {
        return Promise.resolve(undefined);
      }
    }

    return Promise.reject(err);
  }
}
/**
 * Update user preference - flags, defaults, layouts etc
 *
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
export async function updateUserPref(item: IUserPref): Promise<void> {
  // try {
  const res = await axiosInstance.post(
    "/api/UserSettings/UpdateUserPreference",
    JSON.stringify(item)
  );
  // } catch (err) {
  //   console.error(err);
  //   return Promise.reject(err);
  // }
}
/**
 * Load user layouts
 *
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if .
 */
export async function loadUserLayouts(): Promise<LAYOUT[]> {
  // try {
  const res = await axiosInstance.get("/api/UserSettings/GetAllUserLayouts");
  return res.data;
  // } catch (err) {
  //   console.error(err);
  //   return Promise.reject(err);
  // }
}

/**
 * Create user layout
 *
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if .
 */
export async function saveLayout(item: UserLayout): Promise<void> {
  // try {
  const res = await axiosInstance.post(
    "/api/UserSettings/CreateUserLayout",
    JSON.stringify(item)
  );
  // } catch (err) {
  //   console.error(err);
  //   return Promise.reject(err);
  // }
}
/**
 * Update user preference - flags, defaults, layouts etc
 *
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
export async function updateLayout(item: UserLayout): Promise<void> {
  // try {
  const res = await axiosInstance.post(
    "/api/UserSettings/updateUserLayout",
    JSON.stringify(item)
  );
  // } catch (err) {
  //   console.error(err);
  //   return Promise.reject(err);
  // }
}
/**
 * Delete user preference - flags, defaults, layouts etc
 *
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if authentication is successful, false otherwise.
 */
export async function deletePreferences(): Promise<void> {
  // try {
  const res = await axiosInstance.get(
    "/api/UserSettings/DeleteUserPreferenceByUserId"
  );
  return Promise.resolve();
  // } catch (err) {
  //   console.error(err);
  //   return Promise.reject(err);
  // }
}
