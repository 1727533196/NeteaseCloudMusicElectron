<script setup lang="ts">
import {ref} from "vue";
import {useUserInfo} from "@/store";
import usePlayList from "./usePlayList";
import {useRouter} from "vue-router";
import {asideMenuConfig, ListItem} from "@/layout/BaseAside/config";

const store = useUserInfo()
const current = ref<ListItem>()

const router = useRouter()
const {getPlayListDetailFn} = usePlayList()
const itemClick = (item: ListItem) => {
  // current在这里为上一次
  console.log('item.path , current.value?.path', item.name , current.value?.name)
  // 有id说明获取的是歌单
  if(item.id && item.id !== current.value?.id) {
    getPlayListDetailFn(item.id)
    // 防止上一次current没有id导致下面判断path出问题
    current.value?.id && (current.value = item)
  }
  if(item.path === current.value?.path) {
    return
  }
  router.push(item.path)
  current.value = item
}

</script>

<template>
  <div class="aside">
    <div class="play-container">
      <template :key="i" v-for="(menuItem, i) in asideMenuConfig">
        <div class="lump">
          <div v-if="menuItem.mark" class="title">{{menuItem.title}}</div>
          <div
            @click="itemClick(item)"
            v-for="item in menuItem.list"
            :class="['play-list-item', {current: current?.id ? current.id === item.id : i === 0}]"
          >{{item.name}}</div>
        </div>
      </template>
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
    .lump {
      .title {
        font-size: 14px;
        color: @darkText;
      }
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
}
</style>