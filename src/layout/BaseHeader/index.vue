<script setup lang="ts">
import {useUserInfo} from "@/store";
import Search from '@/components/Search/index.vue'

const store = useUserInfo()

</script>

<template>
  <div class="window-container">
    <div class="left np-drag"></div>
    <div class="center no-drag">
      <Search/>
    </div>
    <div class="right no-drag">
      <div :style="{backgroundImage: `url(${store.profile.avatarUrl})`}" class="head-portraits"></div>
      <div class="nickname">{{store.profile.nickname}}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.window-container {
  height: 60px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 2002;
  background-color: rgb(34,34,37);
  border-bottom: 2px rgb(176,34,34) solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    background-image: url("@/assets/bg-logo.png");
    width: 125px;
    height: 30px;
    background-size: contain;
    cursor: pointer;
    margin-left: 15px;
  }
  .center {
  }
  .right {
    margin-right: 200px;
    display: flex;
    align-items: center;
    .head-portraits {
      border-radius: 50%;
      width: 30px;
      height: 30px;
      background: url("https://p1.music.126.net/siSjcSLr8ybRZ3VUpC-9hg==/109951165504329717.jpg");
      background-size: contain;
      margin-right: 6px;
    }
    .nickname {
      max-width: 80px;
      .textOverflow();;
      color: rgb(165,167,168);
      font-size: 12px;
    }
  }

}

</style>