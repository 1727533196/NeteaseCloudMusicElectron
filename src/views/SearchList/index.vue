<script setup lang="ts" name="SearchList">
import SongList from '@/components/SongList/index.vue'
import {useMusicAction} from "@/store/music";
import {header} from './config'
import {useRoute} from "vue-router";
import {cloudSearch} from "@/api/search";
import {reactive, watch} from "vue";
import {GetMusicDetailData} from "@/api/musicList";

interface State {
  result: GetMusicDetailData[]
  songCount: number
}
const music = useMusicAction()
const route = useRoute()
const state = reactive<State>({
  result: [],
  songCount: 0,
})

function init() {
  const {key} = route.query as {key: string}
  search(key)
}
const search = async (key: string, limit = 30) => {
  const {result} = await cloudSearch(key, limit)
  state.songCount = result.songCount
  state.result = result.songs
}

watch(() => route.fullPath, (val) => {
  if(route.path === '/search') {
    init()
  }
}, {
  immediate: true,
})
</script>

<template>
  <SongList
    @play="music.getMusicUrlHandler"
    :header="header"
    :songs="music.songs"
    :list="state.result"
  ></SongList>
</template>

<style lang="less" scoped>

</style>