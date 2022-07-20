import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from "./router";
import {createPinia} from "pinia";
import './assets/iconfont/iconfont.css'
import ElementIcon from "@/plugins/element-icon";

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .use(ElementPlus, { zIndex: 3000 })
    .use(ElementIcon)
    .mount('#app')
