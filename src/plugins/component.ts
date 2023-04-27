import Tabs from '@/components/Tabs/index.vue'
import TabPane from '@/components/Tabs/TabPane.vue'
import {App} from "vue";

const componentArr = [Tabs, TabPane]

export default (app: App) => {
  componentArr.forEach(component => {
    console.log(component)
    app.component(component.name, component)
  })
}