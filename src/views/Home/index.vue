<script setup lang="ts">
import {Banner, banner} from "@/api/home";
import {reactive} from "vue";

const state = reactive({
  banners: [] as Banner[]
})
async function getBanner() {
  const {banners} = await banner()
  state.banners = banners
}
getBanner()

</script>

<template>
  <h1>发现音乐</h1>
  <div class="home-container">
    <el-carousel :autoplay="false" :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in state.banners" :key="item.imageUrl">
        <img class="home-banner" :src="item.imageUrl" alt="img">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  width: 800px;
  .el-carousel__item {
    border-radius: 5px;
    .home-banner {
      margin: 0;
      width: 100%;
      height: 100%;
    }
  }
  .el-carousel__item.is-active {
    width: 540px;
    transform: translateX(130px) scale(1) !important;
    border-radius: 10px;
  }

}
</style>