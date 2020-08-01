import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/faxian"
  },
  {
    path: "/wode",
    component: () => import("./../views/wode.vue")
  },
  {
    path: "/faxian",
    component: () => import("./../views/faxian.vue")
  },
  {
    path: "/yuncun",
    component: () => import("./../views/yuncun.vue")
  },
  {
    path: "/shipin",
    component: () => import("./../views/shipin.vue")
  },
  {
    path: "/userInfo",
    component: () => import("./../views/userInfo.vue")
  }
]

const router = new VueRouter({
  routes,
  linkActiveClass: "RouterActive"
})

export default router
