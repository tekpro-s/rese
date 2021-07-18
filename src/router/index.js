import Vue from 'vue'
import VueRouter from 'vue-router'
import Mypage from '../views/Mypage.vue'
import Login from '../views/Login.vue'
import Resgister from '../views/Resgister.vue'
import Thanks from '../views/Thanks.vue'
import Done from '../views/Done.vue'
import Shops from '../views/Shops.vue'
import Detail from '../views/Detail.vue'
import store from "../store/index";

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Shops',
  component: Shops,

  meta: {
    requiresAuth: true,
  }
}, {
  path: '/login',
  name: 'Login',
  component: Login
}, {
  path: '/register',
  name: 'Register',
  component: Resgister
}, {
  path: '/thanks',
  name: 'Thanks',
  component: Thanks
}, {
  path: '/mypage',
  name: 'Mypage',
  component: Mypage,
  meta: {
    requiresAuth: true,
  }
}, {
  path: '/done',
  name: 'Done',
  component: Done
},
{
  path: "/detail/:shop_id",
  name: "Detail",
  component: Detail,
  meta: {
    requiresAuth: true,
  },
  props: true,
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !store.state.auth
  ) {
    next({
      path: "/",
      query: {
        redirect: to.fullPath,
      },
    });
  } else {
    next();
  }
});

export default router