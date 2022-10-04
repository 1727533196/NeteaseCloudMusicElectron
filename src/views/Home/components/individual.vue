<script setup lang="ts">
import {reactive} from "vue";
import {Recommend, recommendSongList} from "@/api/home";
import CardChunk from '@/components/CardChunk/index.vue'
import Card from '@/components/Card/index.vue'
import {useRouter} from "vue-router";

const recommendSongs = 'recommendSongs'
interface State {
  recommend: Recommend[],
}
const state = reactive<State>({
  recommend: [],
})
const router = useRouter()
async function init() {
  const {recommend} = await recommendSongList()
  state.recommend = recommend
}
init()

const playDetailList = (item: Recommend | typeof recommendSongs) => {
  // 类型保护
  const id = (<Recommend>item).id || item
  router.push(`/daily-recommend?id=${id}`)
}
</script>

<template>
  <div class="container">
    <CardChunk @click="playDetailList" :recommend="state.recommend" title="推荐歌单">
      <Card @click="playDetailList(recommendSongs)" name="每日歌曲推荐" pic-url="/src/assets/test.png"></Card>
    </CardChunk>
  </div>
</template>

<style lang="less" scoped>
.container {

}
</style>