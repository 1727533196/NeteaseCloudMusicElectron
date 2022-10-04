<script setup lang="ts">
import SongList from '@/components/SongList/index.vue'
import SongInfo from '@/components/SongInfo/index.vue'
import {playListState} from "@/layout/BaseAside/usePlayList"
import {useMusicAction} from "@/store/music"
import {header} from "@/views/PlayList/config";

const music = useMusicAction()
</script>

<template>
  <SongInfo></SongInfo>
  <SongList
    @play="music.getMusicUrlHandler"
    :header="header"
    :loading="playListState.loading"
    :songs="music.songs"
    :ids="playListState.ids"
    :list="playListState.playList"
    :list-info="playListState.listInfo"
  />
</template>

<style lang="less" scoped>

</style>