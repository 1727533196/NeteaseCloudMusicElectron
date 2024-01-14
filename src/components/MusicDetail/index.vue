<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch, onUnmounted} from "vue";
import {Lyric, useMusicAction} from "@/store/music";
import {animation, getScreenFps, Yrc} from "@/utils";
import Comment from "@/components/MusicDetail/Comment.vue";
import {useFlags} from "@/store/flags";
import {useSettings} from "@/store/settings";
import LyricDisplay from "./LyricDisplay.vue";
import FlowBg from './FlowBg.vue'

interface Props {
  modelValue: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const music = useMusicAction()
const flags = useFlags()
const settings = useSettings()
const containerEl = ref<HTMLDivElement>()
const top = ref<number>(0)
const correctHeight = ref<number>(0)
const index = ref(0)
const currentLyrLine = ref<Lyric | Yrc>({time: 0, line: 1, text: '0'})
let direction = false
let isTransition = ref(true)
let yrcIndex = 0 // 当前字的索引
let suspend = false // 歌曲运行时暂停的标识

const bg = computed(() => {
  return music.state.songs.al?.picUrl
})
const setModelValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
let cut = false
// 切换歌曲时
watch(() => music.state.songs.id, () => {
  cut = true
  index.value = 0
  currentLyrLine.value = {time: 0, line: 1, text: '0'}
  yrcIndex = 0
})

function step() {
  // 没有播放，或不支持滚动歌词
  if(
    !music.state.lyric.length
    || !window.$audio?.isPlay
    || music.state.lyric.notSupportedScroll
    || cut
    || index.value > music.state.lyric.length - 1)
  {
    return
  }

  const time = $audio ? parseFloat($audio.time.toFixed(3)) : 0
  const oldTime = $audio ? parseFloat($audio.oldTime.toFixed(3)) : 0

  // 当时间跨度大于等于一秒时，就代表快进了时间, 取绝对值，防止是倒退
  if(Math.abs(time - oldTime) >= 1) {
    findLyric(time)
    // 如果是逐字歌词的情况下
    if(music.state.lrcMode === 1) {
      findYrcIndex(index.value)
      higWidth(index.value)
    }
    return
  }
  if(time >= music.state.lyric[index.value].time) {
    moveLyric(music.state.lyric[index.value])
  }


}

// 高亮当前快进
function higWidth(index: number) {
  if(yrcIndex === -1) return
  const yrc = ((music.state.lyric as Yrc[])[index] || {yrc: []}).yrc
  for(let i = 0; i < yrcIndex; i++) {
    yrc[i].width = 100 + '%'
  }
}
// 24.184 <= time && 25.93 > 24.184
function findLyric(time: number) {
  console.log(time)
  const len = music.state.lyric.length - 1
  const result = music.state.lyric.find((item, index) => {
    if(index >= len) {
      return music.state.lyric[len]
    }
    return item.time <= time && music.state.lyric[index+1].time > time
  })
  console.log('result',result)
  result && moveLyric(result)
}
function moveLyric(currentLyr: Lyric | Yrc) {
  const lastIndex = index.value

  // line 是从1开始的，所以就相当于++了
  index.value = currentLyr.line

  runHig(index.value - 1, lastIndex - 1)
}
// 逐字歌词的过渡
function runHig(index: number, lastIndex: number) {
  if(music.state.lrcMode !== 1) {
    return
  }
  alone(index)
}

// 清除上一次
function clearWidth(lastIndex: number) {
  if(lastIndex < 0 || lastIndex > music.state.lyric.length-1) {
    console.error('清除宽度时已超出索引:',lastIndex)
    return
  }
  const yrc = (music.state.lyric as Yrc[])[lastIndex].yrc
  yrc.forEach(item => {
    item.width = 0
  })
}
function alone(index: number) {
  let yrcIndex = 0

  transitionYrc()
  function transitionYrc() {
    if(index < 0 || index > music.state.lyric.length-1) {
      console.error('过渡逐字时已超出索引:',index)
      return
    }
    const yrc = (music.state.lyric as Yrc[])[index].yrc
    if(yrcIndex > yrc.length - 1 || yrcIndex < 0 || cut) {
      // 5  6
      // return
      clearWidth(index)
      // 如果切换了，则指向第一行
      currentLyrLine.value = cut ? music.state.lyric[0] :music.state.lyric[index+1]
      return
    }
    const current = yrc[yrcIndex]
    let delayTime = 0
    // 如果距离当前时间没有延迟
    if(parseFloat($audio.time.toFixed(2)) - (current.cursor) <= 0) {

    } else {
      delayTime = (parseFloat($audio.time.toFixed(2)) - current.cursor) * 1000
    }
    const transition = current.transition * 1000 - delayTime

    const pause = animation(transition, (elapsed, done) => {
      const width = elapsed / transition * 100
      current.width = width + '%'
      if(done) {
        if(width !== 100) {
          console.error(`'结束但没过渡完成:',width,
                '时间:',${elapsed},${transition},
                '目标:', ${yrc[yrcIndex]},
                '索引:', ${yrc}
            `)
        }
        console.log(`
          '歌曲时间:', ${parseFloat($audio.time.toFixed(2))},
          '字的结束时间:', ${current.cursor + current.transition}
          '延迟时间:', ${parseFloat($audio.time.toFixed(2)) - (current.cursor + yrc[yrcIndex].transition)}
        `)
        if(yrcIndex === yrc.length - 1) {

        }
        pause(true)
        yrcIndex++
        transitionYrc()
      }
    })

  }
}

function findYrcIndex(index: number) {
  if(index < 0 || index > music.state.lyric.length - 1) {
    return
  }
  const time = music.state.currentTime
  const yrc = (music.state.lyric as Yrc[])[index].yrc
  // 暂时兼容
  if(!yrc) return
  yrcIndex = yrc.findIndex((item, index) => {
    if(index === 0) {
      if(index + 1 > yrc.length - 1) {
        return time >= item.cursor
      }
      return time >= item.cursor && time < yrc[index + 1].cursor
    }
    return time > yrc[index - 1].cursor && time <= item.cursor
  })
}

const closeDetail = () => {
  setModelValue.value = false
}
const lyricClick = (time: number) => {
  if (music.state.lyric.notSupportedScroll) {
    return
  }
  $audio.el.currentTime = time
}
window.onresize = () => {
  correctHeight.value = document.body.clientHeight
  if(direction) {
    isTransition.value = false
    top.value = -correctHeight.value - 1
  }
}

function initWatcher() {
  getScreenFps().then(fps => {
    console.log('fps:',fps)
    if(fps > 115) {
      startMoveLyr()
    } else {
      console.log(111)
      setInterval(step, 1)
    }
  })
}
function startMoveLyr() {
  step()
  requestAnimationFrame(startMoveLyr)
}
onMounted(() => {
  setTimeout(() => {
    initWatcher()
  }, 2000)
  correctHeight.value = document.body.clientHeight

  nextTick(() => {
    watch(() => $audio.isPlay, (value) => {
      if(value && suspend) {
        suspend = false
        // worker.postMessage({
        //   pause: true,
        //   val: false,
        // })
      }
    })
    $audio.el.addEventListener('canplay', () => {
      cut = false
      currentLyrLine.value = music.state.lyric[0]
    })
  })
  containerEl.value && containerEl.value.addEventListener('wheel', (event: WheelEvent) => {
    isTransition.value = true
    // event.wheelDelta 值为负则向下滚动，值为正则向上
    if(event.wheelDelta > 0) {
      top.value = 0
      direction = false
    } else {
      // 这里加上1像素的偏移量是为了防止出现高度小数点的情况
      direction = true
      top.value = -correctHeight.value - 1
    }
  })
})
onUnmounted(() => {
  window.onresize = null
})
</script>

<template>
  <div ref="containerEl" :class="['container', {open: setModelValue}]">
    <el-icon :size="45" @click="closeDetail" class="close np-drag"><ArrowDown /></el-icon>
    <div class="box" :style="{height: correctHeight +'px'}">
      <div
        class="scroll-box"
        :style="{height: correctHeight * 2 + 'px', top: top +'px',
        transition: isTransition ? '0.5s' : 'none'}"
      >
        <FlowBg :bg="bg"/>
        <div class="music-detail-container">
          <LyricDisplay
              @lyricClick="lyricClick"
              :lyric="music.state.lyric"
              :lrcMode="music.state.lrcMode"
              :current-lyr-line="currentLyrLine"
              :bg="bg"
          />
          <div
              class="test"
              style="height: 80px; position: absolute;bottom: 0;width: 100%;"
          ></div>
        </div>
        <Comment/>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  visibility: hidden;
  position: fixed;
  height: 100%;
  width: 100%;
  bottom: 0;
  left: 0;
  transition: 0.4s;
  z-index: 2005;
  overflow: hidden;
  transform: translateY(100%);

  .box {
    overflow: hidden;
    width: 100%;
    .scroll-box {
      position: relative;
      transition: 0.5s;
      overflow: hidden;
      background-color: @bgColor;
    }
  }
  .close {
    z-index: 1;
    position: absolute;
    top: 12px;
    left: 15px;
    padding: 10px;
    font-size: 20px;
    cursor: pointer;
    //border: 1px solid rgba(255, 255, 255, 0.1);
    //background-color: rgba(255, 255, 255, 0.05);
    //border-radius: 10px;
  }
  // 这里使用fixed是为了让高度固定, 如果参考container的高度,会导致在过渡过程中图片按比例缩放
  .music-detail-container {
    position: fixed;
    height: 100%;
    width: 100%;
    transition: 1s;
    //background-image: url("../../assets/../assets/defaultBg.png");
    //background-color: @bgColor;
    .bgSetting();
  }
}
.container.open {
  transform: translateY(0) !important;
  visibility: visible;
  //height: calc(100%) !important;
  .test {
    background-color: rgba(255, 255, 255, 0.05);
    //background-color: rgba(0, 0, 0, 0.2);
  }
}

</style>
