import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from "./router";
// import {createPinia} from "pinia";
import './assets/iconfont/iconfont.css'
import ElementIcon from "@/plugins/element-icon";
import InitComponent from '@/plugins/component'
import pinia from "@/store/sotre";

createApp(App)
    .use(router)
    .use(pinia)
    .use(ElementPlus, { zIndex: 3000 })
    .use(ElementIcon)
    .use(InitComponent)
    .mount('#app')
