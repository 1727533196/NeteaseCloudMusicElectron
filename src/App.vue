<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRoute} from "vue-router";
import {useMusicAction} from "@/store/music";
import '@/utils/shortcutKey'
import {getUserAccountFn} from "@/utils/userInfo"
import {useFlags} from "@/store/flags";
import Header from '@/layout/BaseHeader/index.vue'
import Aside from '@/layout/BaseAside/index.vue'
import Bottom from '@/layout/BaseBottom/index.vue'
import MusicDetail from '@/components/MusicDetail/index.vue'
import MusicPlayer, {MusicPlayerInstanceType} from '@/components/MusicPlayer/index.vue'
import Login from '@/components/Login/index.vue'
import {useUserInfo} from "@/store";
import PlayListDrawer from '@/components/PlayListDrawer/index.vue'
import {useAnonimousLogin} from "@/utils/useLogin";

const audioInstance = ref<MusicPlayerInstanceType>()
const login = ref()
const music = useMusicAction()
const flags = useFlags()
const route = useRoute()
const store = useUserInfo()
// 初始化全局属性
onMounted(() => {
  if(audioInstance.value !== undefined) {
    window.$audio = audioInstance.value!
    console.log(window.$audio)
  }
  window.$login = login.value!
  useAnonimousLogin()
  document.addEventListener('click', () => {
    flags.isOpenDrawer = false
  })
})
getUserAccountFn()

</script>

<template>
  <div id="opacity-bg" style="position: fixed;width: 100%;height: 100%;transition: 0.5s"></div>
  <div id="opacity-bg1" style="position: fixed;width: 100%;height: 100%;transition: 0.5s"></div>
  <MusicDetail v-model="flags.isOpenDetail"/>
  <PlayListDrawer v-model="flags.isOpenDrawer"/>
  <div style="height: calc(100% - 75px);position: relative;z-index: auto">
    <div id="box">
      <Aside></Aside>
      <div class="main">
        <Header></Header>
        <div class="body">
          <div class="top"></div>
          <router-view v-slot="{Component}">
            <!--          <keep-alive>-->
            <component :is="Component"></component>
            <!--          </keep-alive>-->
          </router-view>
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
  </div>
  <Bottom>
    <teleport :disabled="!flags.isOpenDetail" to=".music-detail-container .test">
      <MusicPlayer
        ref="audioInstance"
        @cutSong="music.cutSongHandler"
        @playEnd="music.playEnd"
        :songs="music.state.songs"
        :src="music.state.musicUrl"
      ></MusicPlayer>
    </teleport>
  </Bottom>
  <Login ref="login"></Login>
</template>

<style lang="less">
@import '@/assets/base.less';
</style>
