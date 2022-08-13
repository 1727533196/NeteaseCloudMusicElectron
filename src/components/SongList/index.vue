<script setup lang="ts">
import {ref} from "vue";
import {formattingTime} from '@/utils'
import {GetMusicDetailData, PlayList} from "@/api/musicList";
import {useUserInfo} from "@/store";
import useMusic from "@/components/MusicPlayer/useMusic";
import {useMusicAction} from "@/store/music";

interface Props {
  list: GetMusicDetailData[] // 列表信息
  songs: GetMusicDetailData // 播放器正在播放的歌曲信息
  loading?: boolean // 是否加载中
  ids?: number[] // 歌曲id列表
  listInfo?: PlayList // 歌单信息
  scroll?: boolean // 是否显示滚动条
}
const props = defineProps<Props>()
const emit = defineEmits(['play']) // 播放歌曲
const store = useUserInfo()
const music = useMusicAction()
const {likeMusic} = useMusic()
const id = ref(0)

const formatCount = (index: number) => {
  return index.toString().length > 1 ? index : '0' + index
}
const playHandler = (item: GetMusicDetailData, index: number) => {
  // 歌曲相同的情况下, 如果当前双击的歌曲不是当前正在播放的歌单歌曲,那应该播放
  if(music.runtimeList.id === music.currentItem.id) {
    // 没暂停，双击当前应该什么都不做
    if($audio.isPlay && props.songs.id === item.id) {
      return
    }
    // 暂停，双击应该继续播放。
    if(!$audio.isPlay && props.songs.id === item.id) {
      return $audio.play()
    }
  }
  // 判断与当前歌单是否相同
  if(music.runtimeList.id !== music.currentItem.id && props.ids && props.listInfo) {
    // 如果不相同就更新 当前歌单
    music.updateRuntimeList({tracks:props.list, ...props.listInfo}, props.ids)
  }
  id.value = item.id
  emit('play', item.id, index)
}
const mousedownHandler = (item: GetMusicDetailData) => {
  id.value = item.id
}
const isLike = (item: GetMusicDetailData) => {
  return store.userLikeIds.includes(item.id)
}
const activeText = (item: GetMusicDetailData) => {
  if(props.listInfo) {
    return item.id === props.songs.id && (props.listInfo.id === music.runtimeList.id)
  } else {
    return item.id === props.songs.id
  }
}
</script>

<template>
  <div :style="{overflowY: props.scroll ? 'auto' : 'visible'}" class="container">
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
        @mousedown="mousedownHandler(item)"
        :key="item.id"
        v-for="(item, i) in props.list"
        class="list"
        :style="{background: item.id === id ? 'rgba(255, 255, 255, 0.08)' :
       i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'none'}"
      >
        <div class="item empty">{{ formatCount(i + 1) }}</div>
        <div class="item handle">
          <i v-if="isLike(item)" @click="likeMusic(item.id, false)"  class="iconfont icon-xihuan1"></i>
          <i v-else  @click="likeMusic(item.id)"  class="iconfont icon-xihuan"></i>
        </div>
        <div
          :style="{color: activeText(item) ? 'rgb(255,60,60)' : ''}"
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
.container {
  margin-top: 20px;
  flex: 1;
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
    width: 50px;
  }
  .handle {
    width: 45px;
    margin-right: 20px;
  }
  .title {
    width: 40%;
    color: @text;
    margin-right: 40% - 38px;
    .textOverflow();;
  }
  .singer {
    width: 20%;
    .textOverflow();;
    margin-right: 20% - 19px;
  }
  .album {
    width: 20%;
    .textOverflow();;
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
      width: 45px;
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