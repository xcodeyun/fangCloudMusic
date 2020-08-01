import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from "axios"
import { Swipe, SwipeItem } from 'mint-ui';
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false

Axios.defaults.baseURL = "http://www.xcodeyun.cn:30000"

// Axios.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   console.log("正常 --> ", response)
//   return response;
// }, function (error) {
//   // 对响应错误做点什么
//   return error;
// });

Vue.prototype.$axios = Axios;

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
