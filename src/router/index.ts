import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      path: '/validar/:id',
      name: 'validar-medalha',
      component: () => import('@/views/ValidarMedalha.vue')
    }
  ]
})

export default router 