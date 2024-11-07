import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { auth } from '../firebaseConfig'
import Login from '../components/Login.vue'
import Profile from '../components/Profile.vue'
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
  const currentUser = auth.currentUser

  if (requiresAuth && !currentUser) {
    next('/')
  } else if (!requiresAuth && currentUser && to.name === 'login') {
    next('/profile')
  } else {
    next()
  }
})

export default router
