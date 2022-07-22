<script setup lang="ts">
import {ref} from "vue";
import {playListState} from "@/layout/BaseAside/usePlayList";
import MusicPlayer, {MusicPlayerInstanceType} from '@/components/MusicPlayer/index.vue'
import SongList from '@/components/SongList/index.vue'
import Bottom from '@/layout/BaseBottom/index.vue'
import SongInfo from '@/components/SongInfo/index.vue'
import {useListPower} from "@/views/PlayList/useListPower";
import {useUserInfo} from '@/store'

const store = useUserInfo()
console.log(store)
const audioInstance = ref<MusicPlayerInstanceType>()
const {getMusicUrlHandler, cutSongHandler, playEnd, state} = useListPower(audioInstance)
</script>

<template>
  <SongInfo></SongInfo>
  <SongList @play="getMusicUrlHandler" :songs="state.songs" :list="playListState.playList"/>
  <Bottom>
    <MusicPlayer
      @cutSong="cutSongHandler"
      @playEnd="playEnd"
      ref="audioInstance"
      :ids="playListState.ids"
      :songs="state.songs"
      :src="state.musicUrl"></MusicPlayer>
  </Bottom>
</template>

<style lang="less" scoped>

</style>