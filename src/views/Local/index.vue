<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import {useSettings} from "@/store/settings";

const router = useRouter()

const changeTheme = (theme: 'dark' | 'default') => {
  const themeObj = {
    default: 'theme',
    dark: 'theme1',
  }
  document.documentElement.setAttribute('data-theme', themeObj[theme])
}
const value1 = ref(0)
const change = (val: number) => {
  console.log(val)
}
const test = () => {
  console.log(111)
}

const settings = useSettings()
const setBg = (val: 'rgb' | 'rhythm') => {
  settings.lyricBg = val
}
</script>

<template>
  <h1>本地播放与下载</h1>
  <div class='play-list-item' @click="router.replace('/test2')">获取个人信息</div>
  <el-slider @click="test" @change="change" v-model="value1" />
  <base-button @click="changeTheme('default')" style="width: 60px;margin-top: 20px">白色</base-button>
  <base-button @click="changeTheme('dark')" style="width: 60px;margin-top: 20px">深色</base-button>
  <div class="test"></div>
  <base-button @click="setBg('rgb')" style="width: 108px;margin-top: 20px">纯色模式</base-button>
  <base-button @click="setBg('rhythm')" style="width: 108px;margin-top: 20px">跳动模式</base-button>
  <base-button @click="() => router.push('yrc-test')">goto YRC</base-button>
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
