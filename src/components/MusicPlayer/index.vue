<script setup lang="ts">
import {ref, onMounted, reactive, UnwrapRef} from "vue";
import {useUserInfo} from "@/store";
import {useMusicAction} from "@/store/music";
import ProgressBar from "@/components/MusicPlayer/ProgressBar.vue";
import {GetMusicDetailData} from "@/api/musicList";
import DetailLeft from "@/components/MusicPlayer/DetailLeft.vue";
import DetailCenter from "@/components/MusicPlayer/DetailCenter.vue";
import DetailRight from "@/components/MusicPlayer/DetailRight.vue";
import {ListenerName, useListener} from '@/components/MusicPlayer/listener';

const orderStatus = ['icon-xunhuan', 'icon-danquxunhuan', 'icon-suijibofang', 'icon-shunxubofang',]
type userAudio = {
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
  oldTime: number
  transitionIsPlay: UnwrapRef<boolean>
  addListener: (listener: ListenerName) => void
}
interface Props {
  src: string
  ids?: number[]
  songs: GetMusicDetailData
}
const store = useUserInfo()
const props = defineProps<Props>()
const emit = defineEmits(['playEnd', 'cutSong'])
const isPlay = ref(false)
// 0列表循环  1单曲循环  2随机播放  3顺序播放
const orderStatusVal = ref<0 | 1 | 2 | 3>(0)
const audio = ref<userAudio>()
const plan = ref<InstanceType<typeof CurrentTime>>() // 进度条组件实例
const music = useMusicAction()
const transitionIsPlay = ref(false)
const { addListener } = useListener(audio)

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
  timeState.stop = false

  // 开始时直接改变就可以，让逐字歌词跟得上
  transitionIsPlay.value = true
  return transitionVolume(volume, true,lengthen)
}
function pause(isNeed: boolean = true, lengthen: boolean = false) {
  let volume = store.volume
  // 是否需要更新暂停标识， 什么时候不需要，就比如切换下一首歌的时候:
  // 这个时候会先调用pause暂停上一首进行过渡，然后在调用play播放，这个时候就不需要更新暂停标识
  isNeed && (isPlay.value = false)
  return transitionVolume(volume, false, lengthen).then(() => {
    // 暂停时应该等待音量过渡完成在改变，让逐字歌词也有一个暂停过渡效果
    transitionIsPlay.value = false
  })
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

const timeState = reactive({
  model: 0,
  stop: false,
  currentTime: 0,
  previousTime: 0, // 新增属性来保存旧的 currentTime
})

const timeupdate = () => {
  if(timeState.stop || isNaN($audio.el.duration)){
    return
  }
  // 在更新 currentTime 之前，保存旧的值
  timeState.previousTime = music.state.currentTime;
  music.state.currentTime = $audio.time
  timeState.model = ($audio.time / $audio.el.duration) * 100
}
addListener('handleTimeUpdate', timeupdate)


const reset = (val: boolean) => {
  timeState.model = 0
  timeState.currentTime = 0
  isPlay.value = val
  transitionIsPlay.value = val
  // 这里需要停止timeupdate的事件监视，因为在暂停音乐时会过渡结束（就相当于还是在播放一段时间），
  //  这样会导致进度条进度重置不及时
  timeState.stop = true  // 在每次play方法时都会重置stop值
}
const end = () => {
  emit('playEnd')
}
const setOrderHandler = () => {
  orderStatusVal.value = (orderStatusVal.value + 1 >= orderStatus.length ? 0 : orderStatusVal.value + 1) as typeof orderStatusVal.value
}

const exposeObj = {
  el: audio,
  orderStatusVal,
  isPlay,
  reset,
  play,
  pause,
  transitionIsPlay,
  addListener,
}
Object.defineProperty(exposeObj, 'time', {
  get(): number {
    return audio.value!.currentTime
  },
  set(time: number) {
    audio.value!.currentTime = time
  },
})
Object.defineProperty(exposeObj, 'oldTime', {
  get(): number {
    return timeState.previousTime
  }
})
defineExpose(exposeObj)

</script>

<template>
  <div class="bottom-container">
    <audio
      @ended="end"
      ref="audio"
      class="plyr-audio"
      :src="props.src"
    ></audio>
    <DetailLeft :songs="props.songs"/>
    <DetailCenter
        :orderStatus="orderStatus"
        :isPlay="isPlay"
        :orderStatusVal="orderStatusVal"
        @play="play"
        @pause="pause"
        @cutSong="(val) => emit('cutSong', val)"
        @setOrderHandler="setOrderHandler"
    />
    <DetailRight
        :currentTime="music.state.currentTime"
        :songs="props.songs"
        :audio="audio"
    />
  </div>
  <div class="plan-container">
    <ProgressBar
      v-model="timeState.model"
      v-model:stop="timeState.stop"
      :songs="props.songs"
    />
  </div>
</template>

<style lang="less">
.plan-container {
  display: flex;
  align-items: center;
  height: 15px;
  position: absolute;
  top: -8.5px;
  width: 100%;
}
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
}

</style>