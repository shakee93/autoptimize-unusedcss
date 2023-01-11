import { createRouter, createWebHashHistory } from 'vue-router'
import onboard from '../views/onboard.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: onboard
    },

  ]
})

export default router
