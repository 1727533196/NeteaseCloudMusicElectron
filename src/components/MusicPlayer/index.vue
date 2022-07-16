<script setup lang="ts">
import {defineProps, ref, defineExpose, Ref, UnwrapRef, computed} from "vue";
import {useUserInfo} from "@/store";
import useMouseSlide from "@/components/MusicPlayer/useMouseSlide";
import {getMusicDetailData} from "@/api/musicList";
import {formattingTime} from "@/utils";
import CurrentTime from './compoents/CurrentTime.vue';
import Volume from './compoents/Volume.vue'
import useMusic from "@/components/MusicPlayer/useMusic";


const orderStatus = ['icon-xunhuan', 'icon-danquxunhuan', 'icon-suijibofang', 'icon-shunxubofang',]

export interface MusicPlayerInstanceType {
  play: () => void,
  orderStatusVal: UnwrapRef<typeof orderStatusVal>,
  audio: Ref<HTMLAudioElement | undefined>
}

interface Props {
  src: string
  ids: number[]
  songs: getMusicDetailData
}

const {likeMusic} = useMusic()
const store = useUserInfo()
const props = defineProps<Props>()
const emit = defineEmits(['playEnd', 'cutSong'])
const isPlay = ref(false)
// 0列表循环  1单曲循环  2随机播放  3顺序播放
const orderStatusVal = ref<0 | 1 | 2 | 3>(0)
const audio = ref<HTMLAudioElement>()
const plan = ref<InstanceType<typeof CurrentTime>>()
const volume = ref<InstanceType<typeof Volume>>()

console.log('store', store)
let timer: NodeJS.Timer
function transitionVolume(volume: number, target: boolean = true) {
  clearInterval(timer)
  if(target) {
    timer = setInterval(() => {
      audio.value!.volume = Math.min(audio.value!.volume + volume / 10, volume)
      if (audio.value!.volume >= volume) {
        clearInterval(timer)
      }
    }, 50)
    return
  }
  timer = setInterval(() => {
    audio.value!.volume = Math.max(audio.value!.volume - volume / 10, 0)
    if (audio.value!.volume <= 0) {
      clearInterval(timer)
      audio.value?.pause()
      audio.value!.volume = volume
    }
  }, 50)
}

const play = () => {
  let volume = store.volume
  audio.value!.volume = 0
  transitionVolume(volume)
  audio.value?.play()
  isPlay.value = true
}
const pause = () => {
  let volume = store.volume
  transitionVolume(volume, false)
  isPlay.value = false
}
const end = () => {
  emit('playEnd')
}
const setOrderHandler = () => {
  orderStatusVal.value = (orderStatusVal.value + 1 >= orderStatus.length ? 0 : orderStatusVal.value + 1) as typeof orderStatusVal.value
}
const isLike = computed(() => {
  return store.userLikeIds.includes(props.songs.id)
})
const id = computed(() => {
  return props.songs.id
})

const {
  mouseleaveHandler,
  mouseenterHandler,
  mousedownHandler,
  timeupdate,
  circleDown,
  volumeHandler,
  volumechange,
  mouseupHandler,
  state: mouseState,
} = useMouseSlide(<Ref<HTMLAudioElement>>audio, plan, volume)

// onmouseenter 鼠标移入
// onmouseleave 鼠标移出
defineExpose({
  audio,
  play,
  orderStatusVal: orderStatusVal,
})
</script>

<template>
  <div class="bottom-container">
    <audio
      @timeupdate="timeupdate"
      @volumechange="volumechange"
      @ended="end"
      ref="audio"
      class="plyr-audio"
      :src="props.src"
    ></audio>
    <div class="left">
      <div
        :style="{backgroundImage: `url(${props.songs.al?.picUrl})`}"
        class="picture"
      ></div>
      <div class="name-info">
        <span class="song-name">{{ props.songs.name }}</span>
        <div class="name-container">
          <template v-for="(item, i) in props.songs.ar">
            <span class="name">{{ item.name }}</span>
            <span v-if="i === 0 && i !== props.songs.ar.length-1">/</span>
          </template>
        </div>
      </div>
      <i v-if="isLike" @click="likeMusic(id, false)"  class="iconfont icon-xihuan1"></i>
      <i v-else  @click="likeMusic(id)"  class="iconfont icon-xihuan"></i>
    </div>
    <div class="center">
      <div class="cut-container">
        <i @click="setOrderHandler" :class="['iconfont', orderStatus[orderStatusVal]]"></i>
        <i @click="emit('cutSong', false)" class="iconfont cut icon-shangyishou"></i>
        <i v-show="isPlay" @click="pause" class="iconfont operation icon-Pause"></i>
        <i v-show="!isPlay" @click="play" class="iconfont operation icon-kaishi1"></i>
        <i @click="emit('cutSong', true)" class="iconfont cut icon-xiayishou"></i>
      </div>
      <div class="plan-container">
        <div v-if="props.songs.ar" class="current-time">{{ formattingTime(mouseState.currentTime * 1000) }}</div>
        <CurrentTime
          ref="plan"
          :mouse-state="mouseState"
          :mousedown-handler="mousedownHandler"
          :mouseenter-handler="mouseenterHandler"
          :mouseleave-handler="mouseleaveHandler"
          :circle-down="circleDown"
          :songs="props.songs"
        />
        <div v-if="props.songs.ar" class="total-time">{{ formattingTime(props.songs.dt) }}</div>
      </div>
    </div>
    <div class="right">
      <Volume
        ref="volume"
        :mouse-state="mouseState"
        :mousedown-handler="mousedownHandler"
        :mouseenter-handler="mouseenterHandler"
        :mouseleave-handler="mouseleaveHandler"
        :mouseup-handler="mouseupHandler"
        :circle-down="circleDown"
        :volume-handler="volumeHandler"
        :songs="props.songs"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.bottom-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 15px;

  .left {
    display: flex;
    align-items: center;
    color: @text;
    width: 25%;

    .iconfont {
      cursor: pointer;
      position: relative;
      top: -8px;
    }
    .icon-xihuan {
      color: @darkText;
      font-size: 22px;
    }
    .icon-xihuan1 {
      font-size: 21px;
      color: rgb(235, 65, 65);
    }

    .picture {
      background-size: contain;
      width: 50px;
      height: 50px;
      border-radius: 5px;
    }

    .name-info {
      font-size: 14px;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;

      .song-name {
        font-size: 15px;
        max-width: 140px;
        @textOverflow();
      }

      .name-container {
        max-width: 140px;
        @textOverflow();
      }
    }
  }

  .center {
    color: rgb(212, 212, 212);
    width: 441px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .cut-container {
      //width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .iconfont + .iconfont {
        cursor: pointer;
        margin-left: 35px;
      }

      .iconfont:not(.operation):hover {
        color: rgb(194, 58, 59);
      }

      .operation:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .cut {
        font-size: 18px;
      }

      .operation {
        //margin: 0 40px;
        color: @text;
        font-size: 18px;
        display: inline-block;
        width: 37px;
        line-height: 37px;
        text-align: center;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.05);

        &::before {
          margin-left: 3px;
        }
      }

      .icon-Pause {
        font-size: 16px;

        &::before {
          margin-left: 1px;
        }
      }
    }

    .plan-container {
      display: flex;
      align-items: center;
      margin-top: 3px;
      height: 15px;

      .current-time, .total-time {
        color: rgb(86, 96, 91);
        font-size: 11px;
      }
    }
  }

  .right {
    width: 25%;
    color: @text;
  }

}

</style>