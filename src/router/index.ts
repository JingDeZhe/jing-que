import { createRouter, createWebHashHistory } from 'vue-router'

import Paint from '../views/paint/Paint.vue'
import Viewer from '../views/viewer/Viewer.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/paint',
    },
    {
      path: '/paint',
      name: 'paint',
      component: Paint,
    },
    {
      path: '/viewer',
      name: 'viewer',
      component: Viewer,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
