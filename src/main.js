import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from "axios"
import { Swipe, SwipeItem } from 'mint-ui';
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false

Axios.defaults.baseURL = "http://www.xcodeyun.cn:30000"

Vue.prototype.$axios = Axios;

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
