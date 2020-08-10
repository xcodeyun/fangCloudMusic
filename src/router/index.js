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
    path: "/dongtai",
    component: () => import("./../views/dongtai.vue")
  },
  {
    path: "/shipin",
    component: () => import("./../views/shipin.vue")
  },
  {
    path: "/userInfo",
    component: () => import("./../views/userInfo.vue")
  },
  {
    path: "/infoPage",
    component: () => import("./../views/infoPage.vue")
  },
  {
    path: "/wode/init/:handle",
    component: () => import("./../views/init.vue")
  },
  {
    path: "/lyric",
    component: () => import("./../views/iyric.vue")
  }
]

const router = new VueRouter({
  routes,
  linkActiveClass: "RouterActive"
})

export default router
