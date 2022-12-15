<script setup lang="ts">
import {useMusicAction} from "@/store/music";
import {getUserCloud} from "@/api/musicList";
import {header} from './config'
import SongList from '@/components/SongList/index.vue'
import {reactive} from "vue";

const music = useMusicAction()

const state = reactive({
  loading: true,
  ids: [],
  list: [],
  listInfo: {},
})

getUserCloud(200).then(res => {
  state.list = res.data.map(item => ({
    ...item.simpleSong,
    ...item,
    simpleSong: {},
  }))
  state.loading = false
  console.log('Y---> res', state.list)
})

</script>

<template>
  <SongList
    @play="music.getMusicUrlHandler"
    :songs="music.songs"
    :header="header"
    :loading="state.loading"
    :ids="state.ids"
    :list="state.list"
    :list-info="state.listInfo"
  ></SongList>
</template>

<style scoped>

</style>