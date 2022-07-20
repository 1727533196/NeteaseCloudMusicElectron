<script setup lang="ts">
import SongList from '@/components/SongList/index.vue'
import {state} from '@/components/Search/useSearch'

</script>

<template>
  <SongList :songs="state.songs" :list="state.resultList"></SongList>
</template>

<style lang="less" scoped>

</style>