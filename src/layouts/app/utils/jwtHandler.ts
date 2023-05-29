import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { Base64 } from "js-base64";

export default function useJwtHandler() {
  const store = useAuthStore();

  // Get the token from the store
  const token = computed(() => store.token);

  // Decode JWT
  const decodeJwt = (jwt: string | null | undefined) => {
    if (!jwt) {
      return null;
    }

    const base64Url = jwt.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/") + "==";
    const jsonPayload = decodeURIComponent(
      Base64.atob(base64)
        .split("")
        .map(
          (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  // Check if JWT is expired
  const isJwtExpired = (jwt: string) => {
    const decoded = decodeJwt(jwt);

    if (!decoded) {
      return null;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  };

  return {
    token,
    decodeJwt,
    isJwtExpired,
  };
}
