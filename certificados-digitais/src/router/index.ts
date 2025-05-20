import { createRouter, createWebHistory } from 'vue-router'
import AdminLoginView from '../views/auth/AdminLoginView.vue'
import AlunoLoginView from '../views/auth/AlunoLoginView.vue'
import HomeView from '../views/HomeView.vue'
import { supabase } from '../services/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin-login',
      component: AdminLoginView
    },
    {
      path: '/aluno-login',
      name: 'aluno-login',
      component: AlunoLoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/aluno',
      name: 'aluno',
      component: () => import('../views/aluno/AlunoView.vue'),
      meta: { requiresAuth: true, role: 'aluno' }
    }
  ]
})

// Proteção de rotas por papel
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (to.meta.requiresAuth && !session) {
    if (to.meta.role === 'admin') {
      next('/')
    } else if (to.meta.role === 'aluno') {
      next('/aluno-login')
    } else {
      next('/')
    }
  } else if (to.meta.requiresAuth && session) {
    // Buscar papel do usuário
    const { data: userData } = await supabase
      .from('users')
      .select('função')
      .eq('id', session.user.id)
      .single()
    if (to.meta.role && userData && userData['função'] !== to.meta.role) {
      // Redireciona para login correto
      if (userData['função'] === 'admin') {
        next('/home')
      } else if (userData['função'] === 'aluno') {
        next('/aluno')
      } else {
        next('/')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
