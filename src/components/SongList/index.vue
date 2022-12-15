<script setup lang="ts">
import {ref} from "vue"
import {useRouter} from "vue-router"
import {lookup} from '@/utils'
import {GetMusicDetailData, PlayList} from "@/api/musicList"
import {useUserInfo} from "@/store"
import useMusic from "@/components/MusicPlayer/useMusic"
import {useMusicAction} from "@/store/music"

export interface Header {
  title: string
  key: string
  prop?: string
  width?: string
  type?: 'index' | 'handle'
  class?: string
  process?: (arg: any) => any
  slot?: (item: GetMusicDetailData) => HTMLElement
}

interface Props {
  list: GetMusicDetailData[] // 列表信息
  songs: GetMusicDetailData // 播放器正在播放的歌曲信息
  header: Header[]
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

const router = useRouter()
const userDetail = (id: number) => {
  router.push(`/detail?uid=${id}`)
}
</script>

<template>
  <div :style="{overflowY: props.scroll ? 'auto' : 'visible'}" class="container">
    <div class="title-container">
      <template v-for="config in props.header">
        <div
          v-if="!config.type"
          :style="{width: config.width}"
          :class="['title-item', config.class]"
        >{{ config.title }}</div>
        <div
          v-else-if="config.type === 'index'"
          :style="{width: config.width}"
          :class="['title-item', config.class]"
        ></div>
        <div
          v-else-if="config.type === 'handle'"
          :style="{width: config.width}"
          :class="['title-item', config.class]"
        >{{ config.title }}</div>
      </template>
    </div>
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
        <template v-for="config in props.header">
          <template v-if="!config.type">
            <div
              v-if="config.key === 'title'"
              :style="{color: activeText(item) ? 'rgb(255,60,60)' : '', width: config.width}"
              :class="['item', config.class]"
            >
              {{ item.name }}
            </div>
            <div
              :style="{width: config.width}"
              v-else-if="config.key === 'singer'"
              :class="['item', config.class]"
            >
              <span
                v-for="ar in item.ar"
                @click="userDetail(ar.id)"
                class="name"
                style="margin-right: 5px"
              >{{ ar.name }}</span>
            </div>
            <div
              :style="{width: config.width}"
              :class="['item', config.class]"
              v-else-if="config.slot"
              v-html="config.slot(item)"/>
            <div
              v-else
              :style="{width: config.width}"
              :class="['item', config.class]"
            >
              <template v-if="config.process">{{ config.process(item[config.prop]) }}</template>
              <template v-else>{{lookup(item, config.prop) }}</template>
            </div>
          </template>

          <div
            :style="{width: config.width}"
            v-else-if="config.type === 'index'"
            :class="['item', config.class]"
          >{{ formatCount(i + 1) }}</div>
          <div
            :style="{width: config.width}"
            v-else-if="config.type === 'handle'"
            :class="['item', config.class]"
          >
            <i v-if="isLike(item)" @click="likeMusic(item.id, false)"  class="iconfont icon-xihuan1"></i>
            <i v-else  @click="likeMusic(item.id)"  class="iconfont icon-xihuan"></i>
          </div>
        </template>
      </div>
    </div>

    <div
      v-show="props.loading"
      v-loading="props.loading"
      class="loading"></div>
  </div>
</template>

<style lang="less" scoped>
.container {
  margin-top: 20px;
  flex: 1;
  position: relative;
  .loading {
    position: absolute;
    z-index: 99;
    top: 0;
    height: 100%;
    width: 100%;
    :deep(.el-loading-mask) {
      background-color: #2b2b2b;

      .el-loading-spinner {
        top: 5%;
      }
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
    .name {
      cursor: pointer;
      &:hover {
        color: @text;
      }
    }

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
        margin-left: 4px;
      }
      .icon-xihuan {
        color: #a5a7a8;
        font-size: 19px;
        margin-left: 4px;
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