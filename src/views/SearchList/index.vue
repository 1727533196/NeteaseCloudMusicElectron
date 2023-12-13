<script setup lang="ts" name="SearchList">
import SongList from '@/components/SongList/index.vue'
import {useMusicAction} from "@/store/music";
import {columns, tabsConfig} from './config'
import {useRoute} from "vue-router";
import {cloudSearch} from "@/api/search";
import {reactive, ref, watch} from "vue";
import {GetMusicDetailData} from "@/api/musicList";

interface State {
  result: GetMusicDetailData[]
  songCount: number
}
const music = useMusicAction()
const route = useRoute()
const limit = ref(50)
const page = ref(1)
const loading = ref(false)
const state = reactive<State>({
  result: [],
  songCount: 0,
})
const activeName = ref<string>(tabsConfig[0].name)

function init() {
  const {key} = route.query as {key: string}
  search(key, (page.value-1) * limit.value, limit.value)
}
const search = async (key: string, offset: number, limit: number) => {
  loading.value = true
  const {result} = await cloudSearch(key, offset, limit).finally(() => {
    loading.value = false
  })
  state.songCount = result.songCount
  state.result = result.songs
}

const currentChange = (val: number) => {
  page.value = val
  init()
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
  <span class="keyword">搜索 {{route.query.key}}</span>
  <tabs v-model="activeName">
    <tab-pane
      v-for="item in tabsConfig"
      :name="item.name"
      :label="item.label"
    ></tab-pane>
  </tabs>
  <SongList
    @current-change="currentChange"
    @play="music.getMusicUrlHandler"
    is-loading-endflyback
    :loading="loading"
    :columns="columns"
    :songs="music.state.songs"
    :list="state.result"
    is-paging
    :total="state.songCount"
    :page-size="limit"
    :current-page="page"
  ></SongList>
</template>

<style lang="less" scoped>
.keyword {
  color: #d2d2d2;
  font-size: 22px;
  margin-left: 10px;
}

</style>