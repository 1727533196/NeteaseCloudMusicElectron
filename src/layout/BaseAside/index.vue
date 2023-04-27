<script setup lang="ts" name="BaseAside">
import {ref, watch } from "vue";
import {useUserInfo} from "@/store";
import {useRoute, useRouter} from "vue-router";
import {asideMenuConfig, ListItem, paths} from "@/layout/BaseAside/config";

const store = useUserInfo()
const current = ref<ListItem>()

const router = useRouter()
const route = useRoute()
const init = () => {
  // 这里需要特殊处理的有 【创建的歌单】 和 【收藏的歌单】两个列表
    if(route.query.id && route.path === '/play-list') {
      current.value = {
        id: +route.query.id,
        path: '/play-list'
      } as ListItem
    }
  // itemClick(asideMenuConfig[0].list[0])
}
watch(() => route.path, (value) => {
  if(route.query.id) {
    const id = +route.query.id
    current.value = store.userPlayListInfo.find(item => item.id === id) as ListItem
  }
  paths.includes(value) || (current.value = undefined)
})
const itemClick = (item: ListItem) => {
  // current在这里为上一次
  // 有id说明获取的是歌单
  if(item.id && item.id !== current.value?.id) {
    // 不在使用左侧菜单点击获取，仅传参
    // getPlayListDetailFn(item.id)
    // 防止上一次current没有id导致下面判断path出问题
    current.value?.id && (current.value = item)
  }
  // if(item.path === current.value?.path) {
  //   return
  // }
  router.push({
    path: item.path,
    query: {
      id: item.id,
    }
  })
  current.value = item
}
let flag = false
watch(() => route.query.id, () => {
  if(flag) {
    return
  }
  flag = true
  init()
})
// 列表选中条件，有id优先id，没有id用path
</script>

<template>
  <div class="aside">
    <div class="play-container">
      <template :key="i" v-for="(menuItem, i) in asideMenuConfig">
        <div class="lump">
          <div v-if="menuItem.mark && menuItem.list.length" class="title">{{menuItem.title}}</div>
          <div
            @click="itemClick(item)"
            v-for="item in menuItem.list"
            :style="{fontSize: item.fontSize+'px' || ''}"
            :class="['play-list-item', {current: current && current?.id ? current.id === item.id : item.path === route.path}]"
          >
            <i :class="['iconfont', item.icon || '']"></i>
            <span>{{item.name}}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.aside {
  border-right: 1px rgb(67,67,67) solid;
  width: 250px;
  height: 100%;
  background-color: rgb(43,43,43);
  //position: fixed;
  //left: 0;
  //top: 62px;
  padding: 10px 10px;
  box-sizing: border-box;
  overflow-y: auto;
  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
  &::-webkit-scrollbar-thumb {
    visibility: hidden;
  }

  .play-container {
    .lump {
      padding-bottom: 10px;
      .title {
        font-size: 14px;
        color: @darkText;
        text-align: left;
        padding: 0 10px;
        margin-bottom: 5px;
      }
      .play-list-item {
        cursor: pointer;
        color: @text;
        font-size: 14px;
        text-align: left;
        line-height: 40px;
        .textOverflow();;
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