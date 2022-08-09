<script setup lang="ts">
import {reactive} from "vue";
import {Recommend, recommendSongList} from "@/api/home";
import CardChunk from '@/components/CardChunk/index.vue'
import Card from '@/components/Card/index.vue'
import test from '@/assets/test.png'

interface State {
  recommend: Recommend[]
}
const state = reactive<State>({
  recommend: []
})
async function init() {
  const {recommend} = await recommendSongList()
  state.recommend = recommend
  console.log('result 获取每日推荐歌单', recommend)
}
init()
</script>

<template>
  <div class="container">
    <CardChunk :recommend="state.recommend" title="推荐歌单">
      <Card name="每日歌曲推荐" pic-url="/src/assets/test.png"></Card>
    </CardChunk>
  </div>
</template>

<style lang="less" scoped>
.container {

}
</style>