<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Header from '@/components/Header/index.vue'
import Aside from '@/components/Aside/index.vue'
import {getUserAccountFn} from "@/utils/userInfo";

// const platform = window.electronAPI.platform
getUserAccountFn()
</script>

<template>
  <Header></Header>
  <Aside></Aside>
  <div class="main">
    <div class="top"></div>
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@import '@/assets/base.less';

</style>
