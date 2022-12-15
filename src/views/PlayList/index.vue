<script setup lang="ts">
import SongList from '@/components/SongList/index.vue'
import SongInfo from '@/components/SongInfo/index.vue'
import usePlayList,{playListState} from "@/layout/BaseAside/usePlayList"
import {useMusicAction} from "@/store/music"
import {header} from "@/views/PlayList/config";
import {watch} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()
const music = useMusicAction()
const {getPlayListDetailFn} = usePlayList()
watch(() => route.fullPath, () => {
  if(route.query.id) {
    getPlayListDetailFn(+route.query.id!)
    document.querySelector('.main')!.scrollTop = 0
  }
}, {
  immediate: true,
})


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