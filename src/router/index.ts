import {createRouter, createWebHashHistory} from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/test2',
      name: 'test2',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Test/test2.vue')
    },
    {
      path: '/play-list',
      name: 'playList',
      component: () => import('@/views/PlayList/index.vue')
    }
  ]
})

export default router