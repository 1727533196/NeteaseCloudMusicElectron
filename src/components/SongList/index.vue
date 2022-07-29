<script setup lang="ts">
import {ref} from "vue";
import {formattingTime} from '@/utils'
import {getMusicDetailData} from "@/api/musicList";
import {useUserInfo} from "@/store";
import useMusic from "@/components/MusicPlayer/useMusic";

interface Props {
  list: getMusicDetailData[]
  songs: getMusicDetailData
  loading?: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['play'])
const store = useUserInfo()
const {likeMusic} = useMusic()
const id = ref(0)

const formatCount = (index: number) => {
  return index.toString().length > 1 ? index : '0' + index
}
const playHandler = (item: getMusicDetailData, index: number) => {
  id.value = item.id
  emit('play', item.id, index)
}
const isLike = (item: getMusicDetailData) => {
  return store.userLikeIds.includes(item.id)
}
</script>

<template>
  <div class="container">
    <div class="title-container">
      <div class="title-item empty"></div>
      <div class="title-item handle">操作</div>
      <div class="title-item title">标题</div>
      <div class="title-item singer">歌手</div>
      <div class="title-item album">专辑</div>
      <div class="title-item time">时间</div>
    </div>
    <div
      v-show="props.loading"
      v-loading="props.loading"
      class="loading"></div>
<!--    设置背景颜色时，一定要用background，不要用backgroundColor-->
    <div class="list-container">
      <div
        @dblclick="playHandler(item, i)"
        :key="item.id"
        v-for="(item, i) in props.list"
        class="list"
        :style="{background: item.id === props.songs.id ? 'rgba(255, 255, 255, 0.08)' :
       i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'none'}"
      >
        <div class="item empty">{{ formatCount(i + 1) }}</div>
        <div class="item handle">
          <i v-if="isLike(item)" @click="likeMusic(item.id, false)"  class="iconfont icon-xihuan1"></i>
          <i v-else  @click="likeMusic(item.id)"  class="iconfont icon-xihuan"></i>
        </div>
        <div
          :style="{color: item.id === props.songs.id ? 'rgb(255,60,60)' : ''}"
          class="item title"
        >
          {{ item.name }}
        </div>
        <div class="item singer">
          <span style="margin-right: 5px" v-for="item in item.ar">{{ item.name }}</span>
        </div>
        <div class="item album">{{ item.al.name }}</div>
        <div class="item time">{{ formattingTime(item.dt) }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import './scroll';
.container {
  margin-top: 20px;
  overflow-y: auto;
  flex: 1;
  margin-bottom: 136px;
  position: relative;
  .loading {
    position: absolute;
    width: 100%;
    height: 100%;
    :deep(.el-loading-mask) {
      background-color: #2b2b2b;
    }
  }
  .empty {
    width: 5%;
  }
  .handle {
    width: 4%;
    margin-right: 5%;
  }
  .title {
    width: 40%;
    color: @text;
    margin-right: 40% - 38px;
    @textOverflow();
  }
  .singer {
    width: 20%;
    @textOverflow();
    margin-right: 20% - 19px;
  }
  .album {
    width: 20%;
    @textOverflow();
    margin-right: 20% - 19px;
  }
  .time {
    width: 10%;
  }
  .title-container {
    padding: 0 25px;
    display: flex;
    font-size: 14px;
    height: 35px;
    color: @darkText;
    justify-content: space-around;

    .empty {
      width: 40px;
    }
    .title-item {
      text-align: left;
    }
    .title-item.title {
      color: @darkText;
    }
  }
  .list {
    padding: 0 25px;
    justify-content: space-around;
    font-size: 14px;
    display: flex;
    height: 35px;
    color: @darkText;
    align-items: center;
    .item {
      text-align: left;
    }
    .handle {
      font-size: 18px;
      cursor: pointer;
      text-align: center;
      .icon-xihuan1 {
        font-size: 18px;
        color: #eb4141;
      }
      .icon-xihuan {
        color: #a5a7a8;
        font-size: 19px;
      }
    }

    .title {
      color: @text;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.06) !important;
    }
  }
}
</style>