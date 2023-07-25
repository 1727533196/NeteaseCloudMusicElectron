<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()
</script>

<template>
  <h1>本地播放与下载</h1>
  <div class='play-list-item' @click="router.replace('/test2')">获取个人信息</div>

  <base-button style="width: 60px;margin-top: 20px">白色</base-button>
  <base-button style="width: 60px;margin-top: 20px">深色</base-button>
</template>

<style scoped>

</style>