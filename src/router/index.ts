import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { auth } from '../firebaseConfig'
import Login from '../components/Login.vue'
import Profile from '../components/Profile.vue'
import { isTokenValid } from '../utils'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const token = localStorage.getItem('userToken')
  const isAuthenticated = isTokenValid(token)

  if (requiresAuth && !isAuthenticated) {
    next('/')
  } else if (!requiresAuth && isAuthenticated && to.name === 'login') {
    next('/profile')
  } else {
    next()
  }
})

export default router
