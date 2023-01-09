<script setup lang="ts">
import {ref, Ref, UnwrapRef, computed, onMounted, toRef} from "vue";
import {useUserInfo} from "@/store";
import useMouseSlide from "@/components/MusicPlayer/useMouseSlide";
import {GetMusicDetailData} from "@/api/musicList";
import {formattingTime} from "@/utils";
import CurrentTime from './compoents/CurrentTime.vue';
import Volume from './compoents/Volume.vue'
import useMusic from "@/components/MusicPlayer/useMusic";
import {useFlags} from "@/store/flags";
import {useMusicAction} from "@/store/music";

const orderStatus = ['icon-xunhuan', 'icon-danquxunhuan', 'icon-suijibofang', 'icon-shunxubofang',]
type userAudio =   {
  play: (lengthen?: boolean) => Promise<undefined>,
  pause: (isNeed?: boolean, lengthen?: boolean) => Promise<undefined>
} & Omit<HTMLAudioElement, 'pause' | 'play'>

export interface MusicPlayerInstanceType {
  orderStatusVal: UnwrapRef<typeof orderStatusVal>
  el: UnwrapRef<userAudio>
  isPlay: UnwrapRef<boolean>
  reset: (val: boolean) => void
  pause: typeof pause
  play: typeof play
  time: number
}
interface Props {
  src: string
  ids?: number[]
  songs: GetMusicDetailData
}
const {likeMusic} = useMusic()
const store = useUserInfo()
const props = defineProps<Props>()
const emit = defineEmits(['playEnd', 'cutSong'])
const isPlay = ref(false)
// 0列表循环  1单曲循环  2随机播放  3顺序播放
const orderStatusVal = ref<0 | 1 | 2 | 3>(0)
const audio = ref<userAudio>()
const plan = ref<InstanceType<typeof CurrentTime>>() // 进度条组件实例
const volume = ref<InstanceType<typeof Volume>>() // 音量组件实例
const music = useMusicAction()

let originPlay: HTMLMediaElement["play"]
let originPause: HTMLMediaElement["pause"]
onMounted(() => {
  originPlay = audio.value!.play as HTMLMediaElement["play"]
  originPause = audio.value!.pause as HTMLMediaElement["pause"]
  // 播放，音量过渡提高
  audio.value!.play = play
  // 音量过渡减少为0，然后暂停
  audio.value!.pause = pause
})
function play(lengthen: boolean = false) {
  let volume = store.volume
  audio.value!.volume = 0
  originPlay.call(audio.value)
  isPlay.value = true
  mouseState.stop = false
  return transitionVolume(volume, true,lengthen)
}
function pause(isNeed: boolean = true, lengthen: boolean = false) {
  let volume = store.volume
  // 是否需要更新暂停标识， 什么时候不需要，就比如切换下一首歌的时候:
  //  这个时候会先调用pause暂停上一首进行过渡，然后在调用play播放，这个时候就不需要更新暂停标识
  isNeed && (isPlay.value = false)
  return transitionVolume(volume, false, lengthen)
}
let timer: NodeJS.Timer
// 当过渡完成时会返回Promise
function transitionVolume(volume: number, target: boolean = true, lengthen: boolean = false): Promise<undefined> {
  clearInterval(timer)
  const playVolume = lengthen ? 40 : 15
  const pauseVolume = lengthen ? 20 : 10
  return new Promise((resolve) => {
    if(target) {
      timer = setInterval(() => {
        audio.value!.volume = Math.min(audio.value!.volume + volume / playVolume, volume)
        if (audio.value!.volume >= volume) {
          resolve(undefined)
          clearInterval(timer)
        }
      }, 50)
      return
    }
    timer = setInterval(() => {
      audio.value!.volume = Math.max(audio.value!.volume - volume / pauseVolume, 0)
      if (audio.value!.volume <= 0) {
        clearInterval(timer)
        originPause.call(audio.value)
        audio.value!.volume = volume
        resolve(undefined)
      }
    }, 50)
  })
}
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

const reset = (val: boolean) => {
  mouseState.width = 0
  mouseState.currentTime = 0
  isPlay.value = val
  // 这里需要停止timeupdate的事件监视，因为在暂停音乐时会过渡结束（就相当于还是在播放一段时间），
  //  这样会导致进度条进度重置不及时
  mouseState.stop = true  // 在每次play方法时都会重置stop值
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

const flags = useFlags()
const openMusicDetail = () => {
  flags.isOpenDetail = !flags.isOpenDetail
}
const exposeObj = {
  el: audio,
  orderStatusVal,
  isPlay,
  reset,
  play,
  pause,
}
Object.defineProperty(exposeObj, 'time', {
  get(): number {
    return audio.value!.currentTime
  },
  set(time: number) {
    audio.value!.currentTime = time
  },
})
// onmouseenter 鼠标移入
// onmouseleave 鼠标移出
defineExpose(exposeObj)



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
        @click="openMusicDetail"
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
        <i v-show="isPlay"  @click="audio.pause" class="iconfont operation icon-Pause"></i>
        <i v-show="!isPlay" @click="audio.play(false)" class="iconfont operation icon-kaishi1"></i>
        <i @click="emit('cutSong', true)" class="iconfont cut icon-xiayishou"></i>
      </div>
      <div class="plan-container">
        <CurrentTime
          ref="plan"
          :mouse-state="mouseState"
          :mousedown-handler="mousedownHandler"
          :mouseenter-handler="mouseenterHandler"
          :mouseleave-handler="mouseleaveHandler"
          :circle-down="circleDown"
          :songs="props.songs"
        />
      </div>
    </div>
    <div class="right">
      <div v-if="props.songs.ar" class="current-time">{{ formattingTime(music.currentTime * 1000) }}</div>
      <span style="margin: 0 5px;line-height: 15px">/</span>
      <div v-if="props.songs.ar" class="total-time">{{ formattingTime(props.songs.dt) }}</div>
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

<style lang="less">
.el-overlay {
  .music-drawer {
    background-image: url("../../assets/defaultBg.png");
    .bgSetting()
  }

}
</style>
<style lang="less" scoped>
:deep(.el-drawer) {
  height: 100%;
}
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
      .bgSetting();
      width: 50px;
      height: 50px;
      border-radius: 5px;

    }
    .picture:hover {
      filter:blur(2px);
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
        .textOverflow();;
      }

      .name-container {
        max-width: 140px;
        .textOverflow();;
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

      .iconfont {
        cursor: pointer;
      }
      .iconfont + .iconfont {
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
      height: 15px;
      position: absolute;
      top: -8px;
      width: 100%;
    }
  }

  .right {
    width: 25%;
    display: flex;
    align-items: center;
    .current-time, .total-time {
      color: @text;
      font-size: 12px;
    }
  }

}

</style>