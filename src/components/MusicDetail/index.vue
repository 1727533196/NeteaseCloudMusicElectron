<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {Lyric, useMusicAction} from "@/store/music";
import {useFlags} from "@/store/flags";
import {formattingTime} from "@/utils";

interface Props {
  modelValue: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const music = useMusicAction()
const defaultImg = '/src/assets/defaultBg.png'
const flags = useFlags()
const musicDetailContainerEl = ref<HTMLDivElement>()
const lyrEl = ref<HTMLDivElement>()
let currentLyricEl: HTMLCollectionOf<HTMLDivElement>

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
const closeDetail = () => {
  flags.isOpenDetail = setModelValue.value = false
}
const lyricClick = (time: number) => {
  $audio.el.currentTime = time
}
let container: HTMLDivElement | null
const top = ref(100)
const targetTime = ref<HTMLDivElement>()
const currentLyrLine = ref<Lyric>({time: 0, line: 1, text: '0'})
const isEnterLyric = ref(false) // 用来显示当前歌词的时间
const currentEnterLyric = ref<Lyric>(currentLyrLine.value)
const moveBox = ref<HTMLDivElement>()

onMounted(() => {
  watch(() => music.songs.id, () => {
    if(!music.lyric.length) return
    nextTick(() => {
      const items = document.querySelector('.lyric-container')!.getElementsByClassName('lyric-item')
      for (let i = 0; i < items.length; i++) {
        items[i].setAttribute('height', items[i].clientHeight+'')
      }
    })
  }, {
    immediate: true,
  })

  currentLyricEl = document.querySelector('.lyric-container')!.getElementsByClassName('current-lyric-item') as HTMLCollectionOf<HTMLDivElement>
  // 解决切换图片闪烁问题
  watch(bg, (val) => {
    const img = new Image()
    img.src = val
    img.onload = () => {
      if(musicDetailContainerEl.value) {
        musicDetailContainerEl.value.style.backgroundImage = `url(${img.src})`;
        (musicDetailContainerEl.value.querySelector('.bg-img') as HTMLDivElement).style.backgroundImage = `url(${img.src})`
      }
    }
  })

  watch(() => music.currentTime, (val) => {
    if(!lyrEl.value || !moveBox.value) return

    const item = music.lyric.find((item, index) => {
      if(index + 1 >= music.lyric.length) {
        return item
      }
      return item.time <= val && music.lyric[index+1].time > val
    })
    if(item) {
      if(!isUserWheel && currentLyricEl.length) {
        const top = moveBox.value?.offsetTop / 4 + moveBox.value?.offsetTop
        lyrEl.value!.scrollTo({
          top: currentLyricEl[0].offsetTop+top - (lyrEl.value!.clientHeight/2),
          behavior: 'smooth'
        })
      }
      currentLyrLine.value = item
    }
  })

})
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

</script>

<template>
  <div :class="['container', {open: setModelValue}]">
    <el-icon :size="45" @click="closeDetail" class="close np-drag"><ArrowDown /></el-icon>
    <div ref="musicDetailContainerEl" class="music-detail-container">
      <div class="shadow">
        <div class="lyric-and-bg-container">
          <div class="bg-img"></div>
          <div
            ref="lyrEl"
            @wheel="wheelHandler"
            class="lyric-container"
          >
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
                <div class="empty-lyric" v-else></div>
              </template>
              <span
                style="position: absolute; font-size: 12px"
                v-show="isEnterLyric"
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
  </div>
</template>

<style lang="less" scoped>
.container {
  position: fixed;
  height: 0;
  width: 100%;
  bottom: 0;
  left: 0;
  transition: height 0.4s;
  z-index: 2005;
  overflow: hidden;
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
      backdrop-filter: blur(10px);
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
  height: calc(100%) !important;
}

</style>