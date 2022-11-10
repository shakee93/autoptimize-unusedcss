import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '../views/dashboard.vue'


const router = createRouter({

  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard
    },
    {
      path: '/unused-css',
      name: 'unused-css',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/pages/unused-css/index.vue')
    },
    {
      path: '/critical-css',
      name: 'critical-css',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/pages/critical-css.vue')
    },
    {
      path: '/image-delivery',
      name: 'image-delivery',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/pages/image-delivery.vue')
    },
    {
      path: '/speed-monitoring',
      name: 'speed-monitoring',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/pages/speed-monitoring.vue')
    },
    {
      path: '/asset-manager',
      name: 'asset-manager',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/pages/asset-manager.vue')
    },
    {
      path: '/font-optimization',
      name: 'font-optimization',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/pages/font-optimization.vue')
    },

  ]
})

export default router
