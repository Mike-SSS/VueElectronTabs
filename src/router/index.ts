// // Composables
// import { createRouter, createWebHistory } from 'vue-router'

// const routes = [
//   {
//     path: '/',
//     component: () => import('@/layouts/default/Default.vue'),
//     children: [
//       {
//         path: '',
//         name: 'Trading',
//         // route level code-splitting
//         // this generates a separate chunk (about.[hash].js) for this route
//         // which is lazy-loaded when the route is visited.
//         component: () => import('@/views/Home.vue'),
//       },
//       {
//         path: 'user-profile',
//         name: 'UserProfile',
//         // route level code-splitting
//         // this generates a separate chunk (about.[hash].js) for this route
//         // which is lazy-loaded when the route is visited.
//         component: () => import('@/views/UserProfile.vue'),
//       },
//     ],
//   },
//   {
//     path: '/authentication',
//     component: () => import('@/layouts/default/Authentication.vue'),
//     children: [
//       {
//         path: 'login',
//         name: 'Login',
//         component: () => import('@/views/Authentication/Login.vue'),
//       },
//     ],
//   },
// ]

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes,
// })

// export default router


// Composables
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/store/authStore"



const routes = [
  {
    path: '/',
    redirect: '/authentication/login',
  },
  {
    path: '/authentication',
    component: () => import('@/layouts/auth/Authentication.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Authentication/Login.vue'),
      },
      // Add more authentication-related routes (e.g., register) here
    ],
  },
  {
    path: '/app',
    component: () => import('@/layouts/app/Default.vue'),
    children: [
      {
        path: 'trading',
        name: 'Trading',
        component: () => import('@/views/Trading.vue'),
      },
      {
        path: 'user-profile',
        name: 'UserProfile',
        component: () => import('@/views/UserProfile.vue'),
      },
      // Add more authenticated routes here
    ],
    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// Implement route guards
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isLoggedIn;

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
