<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {Lyric, useMusicAction} from "@/store/music";
import {formattingTime, toggleImg, Yrc} from "@/utils";
import Comment from "@/components/MusicDetail/Comment.vue";
import {useFlags} from "@/store/flags";
import MyWorker from "@/utils/worker.ts?worker"
import {colorExtraction, gradualChange, useRhythm} from './useMusic'
import {useSettings} from "@/store/settings";

interface Props {
  modelValue: boolean
}
const defaultImg = '/src/assets/defaultBg.png'
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const music = useMusicAction()
const flags = useFlags()
const settings = useSettings()
const cntrEl = ref<HTMLDivElement>()
const lyrEl = ref<HTMLDivElement>()
const targetTime = ref<HTMLDivElement>()
const moveBox = ref<HTMLDivElement>()
const containerEl = ref<HTMLDivElement>()
const top = ref<number>(0)
const correctHeight = ref<number>(0)
const index = ref(0)
const currentLyrLine = ref<Lyric>({time: 0, line: 1, text: '0'})
const currentEnterLyric = ref<Lyric>(currentLyrLine.value)
const isEnterLyric = ref(false) // 用来显示当前歌词的时间
const worker = new MyWorker()
let direction = false
let isTransition = ref(true)
let currentLyrEl: HTMLCollectionOf<HTMLDivElement>
let isUserWheel = false // 是否为用户滚动，当用户滚动时，会在用户停止三秒之后置为false
let timeout: NodeJS.Timeout
let yrcIndex = 0 // 当前字的索引
let suspend = false // 歌曲运行时暂停的标识

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

let cut = false
// 切换歌曲时
watch(() => music.songs.id, (val, oldVal) => {
  cut = true
  index.value = 0
  isUserWheel = false
  yrcIndex = 0
  nextTick(() => {
    lyrEl.value!.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
  worker.postMessage({
    pause: true,
    val: true,
  })
})

function findLyric(time: number) {
  const result = music.lyric.find((item, index) => {
    // if(index + 1 >= music.lyric.length) {
    //   return item
    // }
    return item.time <= time && music.lyric[index+1].time > time
  })
  result && moveLyric(result)
}
function moveLyric(currentLyr: Lyric) {
  currentLyrLine.value = currentLyr
  const lastIndex = index.value

  index.value = currentLyr.line

  runHig(index.value-1, lastIndex - 1)
  // 当用户操作滚动条时，不自动滚动
  if(!isUserWheel) {
    nextTick(() => {
      const top = moveBox.value!.offsetTop / 1.5 + moveBox.value!.offsetTop
      lyrEl.value!.scrollTo({
        top: currentLyrEl[0].offsetTop+top - (lyrEl.value!.clientHeight/2),
        behavior: 'smooth'
      })
    })
  }
}
watch(() => music.currentTime, (currentTime, lastTime) => {
  // console.log(index.value, music.currentTime)
  if(!lyrEl.value || !moveBox.value || music.lyric.notSupportedScroll) return
  if(cut) {
    cut = false
    return
  }
  // 当时间跨度大于等于一秒时，就代表快进了时间, 取绝对值，防止是倒退
  if(Math.abs(currentTime - lastTime) >= 1) {
    findLyric(currentTime)
    if(music.lrcMode === 1) {
      findYrcIndex(index.value - 1)
      worker.postMessage({
        pause: true,
        val: true,
      })
      higWidth(index.value - 1)
    }
    return
  }
  // 歌词是否到底
  if(!music.lyric[index.value]) return;
  if(currentLyrEl.length && (currentTime >= music.lyric[index.value].time)) {
    moveLyric(music.lyric[index.value])
    return
  }
})

// 高亮当前快进
function higWidth(index: number) {
  if(yrcIndex === -1) return
  const yrc = ((music.lyric as Yrc[])[index] || {yrc: []}).yrc
  for(let i = 0; i < yrcIndex; i++) {
    yrc[i].width = 100 + '%'
  }
}
// 清除上一次
function clearWidth(lastIndex: number) {
  const yrc = ((music.lyric as Yrc[])[lastIndex] || {yrc: []}).yrc
  yrc.forEach(item => {
    item.width = 0
  })
}
function transitionYrc(index: number) {
  const yrc = (music.lyric as Yrc[])[index].yrc
  if(yrcIndex < yrc.length) {
    const transition = (yrc[yrcIndex] || {transition: 0}).transition * 1000

    worker.postMessage({
      transition: transition,
      test: yrc[yrcIndex].text,
      yrcIndex
    })
  }
}
// 监听消息
worker.onmessage = e => {
  const {elapsed, done, transition} = e.data
  if(cut) {
    return
  }
  const yrc = ((music.lyric as Yrc[])[index.value - 1] || {}).yrc
  let width: number
  width = 100
  if($audio.transitionIsPlay) {
    if(yrc[yrcIndex]) {
      width = elapsed / transition * 100
      yrc[yrcIndex].width = width + '%'
    }
    if(done && yrc[yrcIndex]) {
      yrc[yrcIndex].width = 100 + '%'
      yrcIndex++

      if(yrcIndex <= yrc.length) {
        transitionYrc(index.value - 1)
      }
    }
  } else {
    suspend = true
    worker.postMessage({
      pause: true,
      val: true,
    })
  }
}
function findYrcIndex(index: number) {
  if(index < 0 || index > music.lyric.length - 1) {
    return
  }
  const time = music.currentTime
  const yrc = (music.lyric as Yrc[])[index].yrc
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
function runHig(index: number, lastIndex: number) {
  if(music.lrcMode !== 1) {
    return
  }
  yrcIndex = 0
  clearWidth(lastIndex)
  if(yrcIndex !== -1) {
    transitionYrc(index)
  } else {
    worker.postMessage({
      pause: true,
      val: true,
    })
  }
}

onMounted(() => {
  const rhythmBox = document.querySelector('#rhythm-box') as HTMLDivElement
  const {splitImg} = useRhythm(rhythmBox)
  currentLyrEl = document.querySelector('.lyric-container')!
    .getElementsByClassName('current-lyric-item') as HTMLCollectionOf<HTMLDivElement>
  correctHeight.value = document.body.clientHeight

  // 解决切换图片闪烁问题
  watch(bg, (val) => {
    toggleImg(val).then(img => {
      if(cntrEl.value) {
        const rgb = colorExtraction(img)
        gradualChange(img, rgb);
        music.updateBgColor(rgb)
        splitImg(img)

        ;(cntrEl.value.querySelector('.bg-img') as HTMLDivElement).style.backgroundImage = `url(${img.src})`
      }
    })
  })
  nextTick(() => {
    watch(() => $audio.isPlay, (value) => {
      if(value && suspend) {
        suspend = false
        worker.postMessage({
          pause: true,
          val: false,
        })
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
    }
  })
})
const mouseenter = (e: Event, lyric: Lyric) => {
  isEnterLyric.value = true
  // 文本定位
  const el = e.target as HTMLDivElement
  targetTime.value!.style.left = el.offsetLeft + 5 + 'px'
  targetTime.value!.style.top = el.offsetTop + (el.offsetHeight / 3)  + 'px'
  currentEnterLyric.value = lyric
}
const mouseleave = () => {
  isEnterLyric.value = false
}

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
window.onresize = () => {
  correctHeight.value = document.body.clientHeight
  if(direction) {
    isTransition.value = false
    top.value = -correctHeight.value - 1
  }
}
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
        <div>
          <div id="gradual1"/>
          <div id="gradual2"/>
          <div id="rhythm-box"></div>
        </div>
        <div ref="cntrEl" class="music-detail-container">
          <div class="shadow">
            <div class="lyric-and-bg-container">
              <div :style="{transform: music.lyric.length ? '' : 'translateX(0)'}" class="bg-img"></div>
              <div
                ref="lyrEl"
                @wheel.stop="wheelHandler"
                class="lyric-container"
                v-show="music.lyric.length"
              >
                <template v-if="music.lrcMode === 1">
                  <div
                    v-if="music.lrcMode === 1"
                    ref="moveBox"
                    class="move-box"
                  >
                    <div
                      @mouseenter="mouseenter($event, item)"
                      @mouseleave="mouseleave"
                      @click="lyricClick(item.time)"
                      :class="{'lyric-item': true, 'current-lyric-item': currentLyrLine.line === item.line}" v-for="item in music.lyric">
                      <div
                        v-for="yrcItem in item.yrc"
                        style="position: relative;display: inline-block;width: auto;padding: 0"
                      >
                        <span style="white-space: pre-wrap">{{yrcItem.text}}</span>
                        <span class="transition" :style="{ width: yrcItem.width }">{{yrcItem.text}}</span>
                      </div>
                    </div>
                    <span
                      style="position: absolute; font-size: 12px"
                      v-show="!music.lyric.notSupportedScroll && isEnterLyric"
                      ref="targetTime"
                    >{{formattingTime(currentEnterLyric.time * 1000)}}</span>
                  </div>
                </template>
                <template v-else>
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
                        :class="['hover-item', 'lyric-item', {'current-lyric-item': currentLyrLine.line === item.line, 'current-lyric-line-item': currentLyrLine.line === item.line}]"
                      >{{item.text}}</div>
                      <div :class="['empty-lyric',{'current-lyric-item': currentLyrLine.line === item.line}]" v-else-if="!music.lyric.notSupportedScroll"></div>
                    </template>
                    <span
                      style="position: absolute; font-size: 12px"
                      v-show="!music.lyric.notSupportedScroll && isEnterLyric"
                      ref="targetTime"
                    >{{formattingTime(currentEnterLyric.time * 1000)}}</span>
                  </div>
                </template>
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
      background-color: @bgColor;
      #gradual1, #gradual2 {
        height: 100%;
        width: 100%;
        transition: 1s;
        position: absolute;
      }
      #rhythm-box {
        position: absolute;
        filter: blur(90px);
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
        :global(.cut-image) {
          transition: 0.3s linear;
          animation: rotate 100s infinite linear;
        }
      }
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
        transition: 1s;
        .bg-img {
          transition: 1s;
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
          //box-shadow: 0 5px 15px 5px rgba(0,0,0,0.05);
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
            //align-items: center;
            position: absolute;
            width: 100%;
            top: 30%;
            padding: 0 20px;
            transition: 0.3s;
            .lyric-item {
              min-height: 10px;
              padding: 10px 60px;
              //width: 100%;
              border-radius: 10px;
              display: flex;
              align-items: center;
              //justify-content: center;
              //text-align: center;
              margin: 3px 0;
              transition: 0.5s font-size;
              flex-wrap: wrap;
              color: rgba(255, 255, 255, 0.3);
              font-size: 23px;
              &:hover {
                background-color: rgba(255,255,255,0.05);
              }
              .transition {
                left: 0;
                top: 0;
                position: absolute;
                color: white;
                width: 0;
                overflow: hidden;
                z-index: 99;
                white-space: nowrap;
                //white-space: pre-line;
              }
            }
            .empty-lyric {
              height: 41px;
            }
            .lyric-item.current-lyric-item {
              //font-size: 18px;
            }
            .lyric-item.current-lyric-line-item {
              color: white;
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
  .test {
    background-color: rgba(255, 255, 255, 0.05);
    //background-color: rgba(0, 0, 0, 0.2);
  }
}

</style>