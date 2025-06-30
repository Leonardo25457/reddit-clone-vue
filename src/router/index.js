import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import HomeLogin from '../views/HomeLogin.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: HomeLogin
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const isAuth = store.getters.isAuthenticated;
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuth) {
    next({ name: 'login' });
  } else if (to.name === 'login' && isAuth) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
