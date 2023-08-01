<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()

const changeTheme = (theme: 'dark' | 'default') => {
  const themeObj = {
    default: 'theme',
    dark: 'theme1',
  }
  document.documentElement.setAttribute('data-theme', themeObj[theme])
}
</script>

<template>
  <h1>本地播放与下载</h1>
  <div class='play-list-item' @click="router.replace('/test2')">获取个人信息</div>

  <base-button @click="changeTheme('default')" style="width: 60px;margin-top: 20px">白色</base-button>
  <base-button @click="changeTheme('dark')" style="width: 60px;margin-top: 20px">深色</base-button>
  <div class="test"></div>
</template>

<style lang="less">
.test {
    width: 100px;
    height: 100px;
}
#app {
  //.bg_color()
}
</style>
