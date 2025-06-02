import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLoginView from '../views/auth/AdminLoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/medalhas',
      name: 'admin-medalhas',
      component: () => import('../views/admin/MedalhasView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/alunos',
      name: 'admin-alunos',
      component: () => import('../views/admin/AlunosView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/vincular-medalha',
      name: 'admin-vincular-medalha',
      component: () => import('../views/admin/VincularMedalhaAluno.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/aluno',
      name: 'aluno-dashboard',
      component: () => import('../views/aluno/AlunoDashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/auth/AdminLoginView.vue')
    },
    {
      path: '/validar/:id',
      name: 'validar-medalha',
      component: () => import('@/views/ValidarMedalha.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: to => {
        const authStore = useAuthStore()
        if (authStore.user) {
          return authStore.user.role === 'admin' ? '/admin' : '/aluno'
        }
        return '/login'
      }
    }
  ]
})

// Guard de navegação global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Se a rota requer autenticação
  if (to.meta.requiresAuth) {
    // Se não está autenticado, redireciona para login
    if (!authStore.user) {
      next(to.meta.requiresAdmin ? '/admin/login' : '/login')
      return
    }
    
    // Se é uma rota de admin e o usuário não é admin
    if (to.meta.requiresAdmin && authStore.user.role !== 'admin') {
      next('/aluno')
      return
    }
    
    // Se é uma rota de aluno e o usuário é admin
    if (to.path.startsWith('/aluno') && authStore.user.role === 'admin') {
      next('/admin')
      return
    }
  }
  
  // Se está autenticado e tenta acessar login ou home
  if (authStore.user && (to.path === '/login' || to.path === '/admin/login' || to.path === '/')) {
    next(authStore.user.role === 'admin' ? '/admin' : '/aluno')
    return
  }
  
  next()
})

export default router 