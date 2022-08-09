<script setup lang="ts">
import {reactive} from "vue";
import {Recommend, recommendSongList} from "@/api/home";
import CardChunk from '@/components/CardChunk/index.vue'
import Card from '@/components/Card/index.vue'
import {useRouter} from "vue-router";

interface State {
  recommend: Recommend[]
}
const state = reactive<State>({
  recommend: []
})
const router = useRouter()
async function init() {
  const {recommend} = await recommendSongList()
  state.recommend = recommend
  console.log('result 获取每日推荐歌单', recommend)
}
init()

const playDetailList = (item: Recommend) => {
  router.push(`/daily-recommend?id=${item.id}`)
}
</script>

<template>
  <div class="container">
    <CardChunk @click="playDetailList" :recommend="state.recommend" title="推荐歌单">
      <Card @click="playDetailList" name="每日歌曲推荐" pic-url="/src/assets/test.png"></Card>
    </CardChunk>
  </div>
</template>

<style lang="less" scoped>
.container {

}
</style>