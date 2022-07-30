<script setup lang="ts">
import SongList from '@/components/SongList/index.vue'
import {state} from '@/components/Search/useSearch'
import {useMusicAction} from "@/store/music";

const music = useMusicAction()
</script>

<template>
  <SongList
    @play="music.getMusicUrlHandler"
    :songs="state.songs"
    :list="state.resultList"></SongList>
</template>

<style lang="less" scoped>

</style>