<script setup lang="ts">
import SongList from '@/components/SongList/index.vue'
import {state} from '@/components/Search/useSearch'
import {useMusicAction} from "@/store/music";
import {header} from './config'

const music = useMusicAction()
</script>

<template>
  <SongList
    @play="music.getMusicUrlHandler"
    :header="header"
    :songs="music.songs"
    :list="state.resultList"
  ></SongList>
</template>

<style lang="less" scoped>

</style>