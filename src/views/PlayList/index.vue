<script setup lang="ts">
import {playListState} from "@/layout/BaseAside/usePlayList";
import SongList from '@/components/SongList/index.vue'
import SongInfo from '@/components/SongInfo/index.vue'
import {useUserInfo} from '@/store'
import {useMusicAction} from "@/store/music";

const store = useUserInfo()
const music = useMusicAction()
console.log('111', 111)
</script>

<template>
  <SongInfo></SongInfo>
  <SongList
    @play="music.getMusicUrlHandler"
    :loading="playListState.loading"
    :songs="music.songs"
    :list="playListState.playList"
  />
</template>

<style lang="less" scoped>

</style>