<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {Lyric, useMusicAction} from "@/store/music";
import {formattingTime, toggleImg} from "@/utils";
import Comment from "@/components/MusicDetail/Comment.vue";

interface Props {
  modelValue: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const music = useMusicAction()
const defaultImg = '/src/assets/defaultBg.png'
const cntrEl = ref<HTMLDivElement>()
const lyrEl = ref<HTMLDivElement>()
let currentLyrEl: HTMLCollectionOf<HTMLDivElement>

const bg = computed(() => {
  return music.songs.al?.picUrl || defaultImg
})
const setModelValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const targetTime = ref<HTMLDivElement>()
const currentLyrLine = ref<Lyric>({time: 0, line: 1, text: '0'})
const isEnterLyric = ref(false) // 用来显示当前歌词的时间
const currentEnterLyric = ref<Lyric>(currentLyrLine.value)
const moveBox = ref<HTMLDivElement>()
let index = 0

function findLyric(time: number) {
  const result = music.lyric.find((item, index) => {
    if(index + 1 >= music.lyric.length) {
      return item
    }
    return item.time <= time && music.lyric[index+1].time > time
  })
  result && moveLyric(result)
}
function moveLyric(currentLyr: Lyric) {
  currentLyrLine.value = currentLyr
  index = currentLyr.line - 1

  // 当用户操作滚动条时，不自动滚动
  if(!isUserWheel) {
    nextTick(() => {
      const top = moveBox.value!.offsetTop / 4 + moveBox.value!.offsetTop
      lyrEl.value!.scrollTo({
        top: currentLyrEl[0].offsetTop+top - (lyrEl.value!.clientHeight/2),
        behavior: 'smooth'
      })
      // currentLyrEl[0].scrollIntoView({
      //   block: 'center',
      //   behavior: 'smooth',
      // })
    })
  }
}
watch(() => music.currentTime, (currentTime, lastTime) => {
  if(!lyrEl.value || !moveBox.value || music.lyric.notSupportedScroll) return

  // 当时间跨度大于等于一秒时，就代表快进了时间, 取绝对值，防止是倒退
  if(Math.abs(currentTime - lastTime) >= 1) {
    findLyric(currentTime)
    return
  }

  // 歌词是否到底
  if(!music.lyric[index+1]) return;
  if(currentLyrEl.length && (currentTime >= music.lyric[index+1].time)) {
    moveLyric(music.lyric[index+1])
    return
  }
})
const containerEl = ref<HTMLDivElement>()
const correctHeight = ref<number>(0)
const scrollEl = ref<HTMLDivElement>()
const top = ref<number>(0)
let direction = false
let isTransition = ref(true)
onMounted(() => {
  currentLyrEl = document.querySelector('.lyric-container')!
    .getElementsByClassName('current-lyric-item') as HTMLCollectionOf<HTMLDivElement>
  correctHeight.value = document.body.clientHeight

  // 解决切换图片闪烁问题
  watch(bg, (val) => {
    toggleImg(val).then(img => {
      if(cntrEl.value) {
        cntrEl.value.style.backgroundImage = `url(${img.src})`;
        (cntrEl.value.querySelector('.bg-img') as HTMLDivElement).style.backgroundImage = `url(${img.src})`
      }
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
      console.log(top.value)
    }
  })
})

window.onresize = () => {
  correctHeight.value = document.body.clientHeight
  if(direction) {
    isTransition.value = false
    top.value = -correctHeight.value - 1
  }
}
const mouseenter = (e: Event, lyric: Lyric) => {
  isEnterLyric.value = true
  // 文本定位
  const el = e.target as HTMLDivElement
  targetTime.value!.style.left = el.offsetLeft + 5 + 'px'
  targetTime.value!.style.top = el.offsetTop + (el.offsetHeight / 4)  + 'px'
  currentEnterLyric.value = lyric
}
const mouseleave = () => {
  isEnterLyric.value = false
}

let isUserWheel = false // 是否为用户滚动，当用户滚动时，会在用户停止三秒之后置为false
let timeout: NodeJS.Timeout
// 此事件只有当用户主动滑动滚轮才会触发，而编程的方式来操作滚动条则不会触发
const wheelHandler = () => {
  isUserWheel = true
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    isUserWheel = false
  },3000)
}
const closeDetail = () => {
  setModelValue.value = false
}
const lyricClick = (time: number) => {
  if (music.lyric.notSupportedScroll) {
    return
  }
  $audio.el.currentTime = time
}


</script>

<template>
  <div ref="containerEl" :class="['container', {open: setModelValue}]">
    <el-icon :size="45" @click="closeDetail" class="close np-drag"><ArrowDown /></el-icon>
    <div class="box" :style="{height: correctHeight +'px'}">
      <div
        ref="scrollEl"
        class="scroll-box"
        :style="{height: correctHeight * 2 + 'px', top: top +'px',
        transition: isTransition ? '0.5s' : 'none'}"
      >
        <div ref="cntrEl" class="music-detail-container">
          <div class="shadow">
            <div class="lyric-and-bg-container">
              <div class="bg-img"></div>
              <div
                ref="lyrEl"
                @wheel.stop="wheelHandler"
                class="lyric-container"
              >
                <div v-if="music.lyric.notSupportedScroll" class="lyric-item not-supported-scroll">*该歌词不支持自动滚动* <span>求滚动</span></div>
                <div
                  ref="moveBox"
                  class="move-box"
                >
                  <template v-for="item in music.lyric">
                    <div
                      v-if="item.text"
                      @mouseenter="mouseenter($event, item)"
                      @mouseleave="mouseleave"
                      @click="lyricClick(item.time)"
                      :class="['lyric-item', {'current-lyric-item': currentLyrLine.line === item.line}]"
                    >{{item.text}}</div>
                    <div :class="['empty-lyric',{'current-lyric-item': currentLyrLine.line === item.line}]" v-else-if="!music.lyric.notSupportedScroll"></div>
                  </template>
                  <span
                    style="position: absolute; font-size: 12px"
                    v-show="!music.lyric.notSupportedScroll && isEnterLyric"
                    ref="targetTime"
                  >{{formattingTime(currentEnterLyric.time * 1000)}}</span>
                </div>
              </div>
            </div>
            <div
              class="test"
              style="height: 80px; position: absolute;bottom: 0;width: 100%;"
            ></div>
          </div>
        </div>
        <comment/>
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
  }
  // 这里使用fixed是为了让高度固定, 如果参考container的高度,会导致在过渡过程中图片按比例缩放
  .music-detail-container {
    position: fixed;
    height: 100%;
    width: 100%;
    transition: 1s background;
    background-image: url("../../assets/../assets/defaultBg.png");
    background-color: @bgColor;
    .bgSetting();
    .shadow {
      backdrop-filter: blur(15px);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.4);
      .lyric-and-bg-container {
        display: flex;
        margin-top: 17vh;
        justify-content: space-around;
        align-items: center;
        height: 58vh;
        .bg-img {
          transition: 1s background;
          width: 45vh;
          height: 45vh;
          border-radius: 5px;
          transform: translateX(3vw);
          .bgSetting();
        }
        .lyric-container {
          height: 100%;
          width: 40vw;
          border-radius: 5px;
          overflow: auto;
          box-shadow: 0 5px 15px 5px rgba(0,0,0,0.05);
          position: relative;
          //scroll-behavior: smooth; // 111
          .not-supported-scroll {
            transform: translateX(-50%);
            position: absolute;
            left: 50%;
            top: 70px;
            color: @darkText;
            span {
              cursor: pointer;
              font-size: 16px;
              color: @darkText;
              &:hover {
                color: @text;
              }
            }
          }
          &::-webkit-scrollbar {
            display: none;
          }
          .move-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            width: 100%;
            top: 30%;
            padding: 0 20px;
            transition: 0.3s;
            .lyric-item {
              min-height: 10px;
              padding: 10px 40px;
              width: 100%;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              margin: 3px 0;
              &:hover {
                background-color: rgba(255,255,255,0.05);
              }
            }
            .empty-lyric {
              height: 41px;
            }
            .lyric-item.current-lyric-item {
              color: rgb(30,204,148);
            }
          }
        }
      }
    }
  }
}
.container.open {
  transform: translateY(0) !important;
  visibility: visible;
  //height: calc(100%) !important;
}

</style>