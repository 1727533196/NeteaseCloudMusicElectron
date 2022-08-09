<script setup lang="ts">
import {useRoute} from "vue-router";
import {useMusicAction} from "@/store/music";
import usePlayList, {playListState} from "@/layout/BaseAside/usePlayList";
import SongInfo from '@/components/SongInfo/index.vue';
import SongList from '@/components/SongList/index.vue'


const { getPlayListDetailFn } = usePlayList()
const route = useRoute()
const music = useMusicAction()

const init = () => {
  route.query.id && getPlayListDetailFn(+route.query.id)
}
init()
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

<style scoped>

</style>