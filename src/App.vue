<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import {onMounted, reactive, ref} from 'vue'
import Header from '@/layout/BaseHeader/index.vue'
import Aside from '@/layout/BaseAside/index.vue'
import Bottom from '@/layout/BaseBottom/index.vue'
import MusicPlayer, {MusicPlayerInstanceType} from '@/components/MusicPlayer/index.vue'
import {getUserAccountFn} from "@/utils/userInfo"
import {useMusicAction} from "@/store/music";

// const platform = window.electronAPI.platform
const audioInstance = ref<MusicPlayerInstanceType>()
const music = useMusicAction()
onMounted(() => {
  if(audioInstance.value !== undefined) {
    window.$audio = audioInstance.value!
  }
})
getUserAccountFn()

</script>

<template>
  <Header></Header>
  <Aside></Aside>
  <div class="main">
    <div class="top"></div>
    <router-view></router-view>
  </div>
  <Bottom>
    <MusicPlayer
      ref="audioInstance"
      @cutSong="music.cutSongHandler"
      @playEnd="music.playEnd"
      :songs="music.songs"
      :src="music.musicUrl"
    ></MusicPlayer>
  </Bottom>
</template>

<style lang="less">
@import '@/assets/base.less';

</style>
