import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Swipe, SwipeItem, Loadmore, Spinner, Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui';
import 'mint-ui/lib/style.css'
import Tool from "./lib/js/toolp"
import Axios from "axios"

Vue.config.productionTip = false

// axios配置
Axios.defaults.baseURL = "http://www.xcodeyun.cn:30000"
Vue.prototype.$axios = Axios;

// 工具方法配置
Vue.prototype.$tool = new Tool(Vue);

Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Spinner.name, Spinner);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
