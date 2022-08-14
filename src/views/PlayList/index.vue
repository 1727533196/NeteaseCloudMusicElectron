<script setup lang="ts">
import SongList from '@/components/SongList/index.vue'
import SongInfo from '@/components/SongInfo/index.vue'
import {playListState} from "@/layout/BaseAside/usePlayList"
import {useMusicAction} from "@/store/music"

const music = useMusicAction()
</script>

<template>
  <SongInfo></SongInfo>
  <SongList
    @play="music.getMusicUrlHandler"
    :loading="playListState.loading"
    :songs="music.songs"
    :ids="playListState.ids"
    :list="playListState.playList"
    :list-info="playListState.listInfo"
  />
</template>

<style lang="less" scoped>

</style>