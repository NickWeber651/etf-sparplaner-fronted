/**
 * === ROUTER-KONFIGURATION ===
 * Der Router ist wie ein Dispatcher in Java - verteilt URLs auf Komponenten
 * Wie ein Switch-Statement: Wenn URL = "/login" dann zeige LoginView
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isAuthenticated } from '../services/authApi'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },  // Geschützte Route
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
      meta: { guestOnly: true },  // Nur für nicht-eingeloggte User
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
      meta: { guestOnly: true },  // Nur für nicht-eingeloggte User
    },
  ],
})

/**
 * === NAVIGATION GUARD ===
 * Wird vor jedem Route-Wechsel ausgeführt (wie ein Filter in Spring Security)
 *
 * Prüft:
 * 1. Geschützte Routen: Redirect zu /login wenn nicht eingeloggt
 * 2. Guest-Only Routen: Redirect zu / wenn bereits eingeloggt
 */
router.beforeEach((to, _from, next) => {
  const loggedIn = isAuthenticated()

  // Geschützte Route, aber nicht eingeloggt → zu Login
  if (to.meta.requiresAuth && !loggedIn) {
    console.log('🔒 Route geschützt, Redirect zu /login')
    next({ name: 'login' })
    return
  }

  // Guest-Only Route (Login/Register), aber bereits eingeloggt → zu Home
  if (to.meta.guestOnly && loggedIn) {
    console.log('✅ Bereits eingeloggt, Redirect zu /')
    next({ name: 'home' })
    return
  }

  // Alles OK, weiter zur Route
  next()
})

export default router
