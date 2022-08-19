<script setup lang="ts">
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
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane :name="item.name" :label="item.label" v-for="item in tabsConfig">
        <component :is="item.component"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="less" scoped>
.padding-container {
  :deep(.el-tabs) {
    .el-tabs__active-bar {
      background-color: @subject;
    }
    .el-tabs__content {
      overflow: inherit;
    }
    .el-tabs__item {
      color: @darkText;
      font-size: 16px;
      transition: font-size 0.1s;
    }
    .el-tabs__nav-wrap::after {
      content: none;
    }
    .is-active {
      font-size: 20px !important;
      color: white !important;
      font-weight: 800;
    }
    .el-tabs__content {
      padding-top: 20px;
      text-align: left;
    }
  }



}
</style>