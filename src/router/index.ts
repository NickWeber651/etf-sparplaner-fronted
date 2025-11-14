/**
 * === ROUTER-KONFIGURATION ===
 * Der Router ist wie ein Dispatcher in Java - verteilt URLs auf Komponenten
 * Wie ein Switch-Statement: Wenn URL = "/login" dann zeige LoginView
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    /**
     * === LOGIN-ROUTE ===
     * URL: /login
     * Lazy Loading = View wird erst geladen wenn sie gebraucht wird
     * (Performance-Optimierung - wie lazy initialization in Java)
     */
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    /**
     * === REGISTRIERUNGS-ROUTE ===
     * URL: /register
     * Ebenfalls Lazy Loading für bessere Performance
     */
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
  ],
})

export default router
