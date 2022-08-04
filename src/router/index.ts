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
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchList/index.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home/index.vue')
    },
    {
      path: '/fm',
      name: 'fm',
      component: () => import('@/views/PrivateFm/index.vue')
    },
    {
      path: '/video',
      name: 'video',
      component: () => import('@/views/Video/index.vue')
    },
    {
      path: '/follow',
      name: 'follow',
      component: () => import('@/views/Follow/index.vue')
    },
    {
      path: '/local',
      name: 'local',
      component: () => import('@/views/Local/index.vue')
    },
    {
      path: '/lately',
      name: 'lately',
      component: () => import('@/views/LatelyPlay/index.vue')
    },
  ],
  scrollBehavior: () => ({top: 0,})
})

export default router