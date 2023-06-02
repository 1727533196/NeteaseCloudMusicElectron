<script setup lang="ts" name="Home">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import {tabsConfig} from './config'

const activeName = ref(tabsConfig[0].name)

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<template>
  <div class="padding-container">
    <tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <tab-pane :name="item.name" :label="item.label" v-for="item in tabsConfig">
        <component v-if="item.name === activeName" :is="item.component"></component>
      </tab-pane>
    </tabs>
  </div>
</template>

<style lang="less" scoped>

</style>