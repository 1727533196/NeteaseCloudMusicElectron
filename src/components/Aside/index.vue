<script setup lang="ts">
import {ref} from "vue";
import {useUserInfo} from "@/store";
import usePlayList from "@/components/Aside/usePlayList";
import {playList} from "@/api/musicList";
import {useRouter} from "vue-router";

const store = useUserInfo()
const current = ref<playList>()

const router = useRouter()
const {getPlayListDetailFn} = usePlayList()
const itemClick = (item: playList) => {
  router.push('/song-list')
  console.log('item', item)
  current.value = item
  store.updateCurrentItem(current.value)
  getPlayListDetailFn(item.id)
}

</script>

<template>
  <div class="aside">
    <div class="play-container">
      <div
          @click="itemClick(item)"
          v-for="(item, i) in store.userPlayList"
          :key="item.id"
          :class="['play-list-item', {current: current?.id ? current.id === item.id : i === 0}]"
      >{{item.specialType === 5 ? '我喜欢的音乐' : item.name}}</div>
      <div class='play-list-item' @click="router.replace('/test2')">获取个人信息</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.aside {
  border-right: 1px rgb(67,67,67) solid;
  width: 190px;
  height: 100%;
  background-color: rgb(43,43,43);
  position: fixed;
  left: 0;
  top: 62px;
  padding: 10px 10px;

  .play-container {
    .play-list-item {
      cursor: pointer;
      color: @text;
      font-size: 15px;
      text-align: left;
      line-height: 40px;
      @textOverflow();
      padding: 0 10px;
      border-radius: 5px;
    }
    .play-list-item:hover{
      background-color: rgba(255,255,255,0.05);
    }
    .current.play-list-item {
      background-color: rgba(255,255,255,0.05);
    }
  }
}
</style>