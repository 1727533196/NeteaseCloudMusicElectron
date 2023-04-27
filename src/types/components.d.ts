import Tabs from '@/components/Tabs/index.vue'
import TabPane from '@/components/Tabs/TabPane.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    Tabs: typeof Tabs;
    TabPane: typeof TabPane;
  }
}

export {}