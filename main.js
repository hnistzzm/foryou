import App from './App'
// #ifndef VUE3
import Vue from 'vue'
import axios from 'axios'
import uView from 'uview-ui';
import {mixin} from './mixin/mixin'
import 'animate.css'

import Http from '@/common/api/request.js'
Vue.prototype.$http = Http
Vue.use(uView);
Vue.mixin(mixin)
const res = uni.getSystemInfoSync();
let fontSize = res.screenWidth/20 + 'px';
console.log("fonrsize",fontSize);
Vue.prototype.$footFontSize = fontSize;
Vue.prototype.HOST = "/"


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif