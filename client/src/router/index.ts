import { createRouter, createWebHistory } from 'vue-router';
import { ROUTES } from '@/constants';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTES.HOME,
      component: HomeView,
    },
    {
      path: `/${ROUTES.SINGLE_PLAYER}`,
      name: ROUTES.SINGLE_PLAYER,
      component: () => import('../views/SinglePlayerView.vue'),
    },
    {
      path: `/${ROUTES.MULTI_PLAYER}`,
      name: ROUTES.MULTI_PLAYER,
      component: () => import('../views/MultiPlayerView.vue'),
    },
  ],
});

export default router;
