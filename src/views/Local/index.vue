<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()
</script>

<template>
  <h1>本地播放与下载</h1>
  <div class='play-list-item' @click="router.replace('/test2')">获取个人信息</div>
</template>

<style scoped>

</style>