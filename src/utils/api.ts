import { LoginResponse } from "@/models/auth";
import { MarketDisplayItemContract } from "@/models/marketData";
import { IUser } from "@/models/trading";
import { axiosInstance, noAuthInstance } from "@/plugins/axios";

/**
 * Gets the user profile object from HQ
 *
 * @function
 * @returns {Promise<boolean>} A promise that resolves to true if call is successful, false otherwise.
 */
export async function getHQAccessProfile(): Promise<IUser | null> {
  try {
    // Make call to backend to login - all call need /api/{controller}
    const res = await axiosInstance.get("/api/authenticate/getHQAccess");
    if (res && res.data) {
      // Assign data to the store
      console.log("Data for hq: ", res.data);

      // authStore.setHQ(res.data);
      return res.data;
    }
  } catch (err) {
    return Promise.reject(err);
  }
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
  try {
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
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
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
      "/api/StaticData/GetAllMembers",
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
