// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const routes = [
  {
    path: "/",
    redirect: "/authentication/login",
  },
  {
    path: "/authentication",
    component: () => import("@/layouts/auth/Authentication.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/Authentication/Login.vue"),
      },
      // Add more authentication-related routes (e.g., register) here
    ],
  },
  {
    path: "/app",
    component: () => import("@/layouts/app/Default.vue"),
    children: [
      {
        path: "trading",
        name: "Trading",
        component: () => import("@/views/Trading.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      // {
      //   path: 'user-profile',
      //   name: 'UserProfile',
      //   component: () => import('@/views/UserProfile.vue'),
      // },
      // Add more authenticated routes here
    ],
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Implement route guards
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const authStore = useAuthStore();
  const isAuthenticated = !authStore.isTokenExpired;
  console.log("Route requires auth: ", requiresAuth);
  console.log("Authenticated: ", isAuthenticated);
  console.log("To: ", to.name);
  if (requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  } else if (isAuthenticated == true && to.name == "Login") {
    console.log("Go to trading: ", isAuthenticated);

    next({
      name: "Trading",
    });
  } else {
    console.log(
      "Go to else : ",
      requiresAuth,
      isAuthenticated == true,
      to.name == "Login"
    );
    next();
  }
});

export default router;
