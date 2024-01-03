<script lang="ts" setup>
import {formattingTime, Yrc} from "@/utils";
import {Lyric} from "@/store/music";
import {ref} from "vue";

interface Props {
  lyric: Lyric[] | Yrc[]
  lrcMode: 1 | 0
  currentLyrLine: Lyric
  isBlur: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['wheelHandler', 'lyricClick'])
const isEnterLyric = ref(false) // 用来显示当前歌词的时间
const targetTime = ref<HTMLDivElement>()
const currentEnterLyric = ref<Lyric>({time: 0, line: 1, text: '0'})
const lyrEl = ref<HTMLDivElement>()
const moveBox = ref<HTMLDivElement>()

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

defineExpose({
  lyrEl,
  moveBox,
})
</script>

<template>
  <div :style="{'backdrop-filter': isBlur ? 'blur(15px)' : 'none' }" class="shadow">
    <div class="lyric-and-bg-container">
      <div :style="{transform: props.lyric.length ? '' : 'translateX(0)'}" class="bg-img"></div>
      <div
          ref="lyrEl"
          @wheel.stop="$emit('wheelHandler')"
          class="lyric-container"
          v-show="props.lyric.length"
      >
        <template v-if="props.lrcMode === 1">
          <div
              v-if="props.lrcMode === 1"
              ref="moveBox"
              class="move-box"
          >
            <div
                @mouseenter="mouseenter($event, item)"
                @mouseleave="mouseleave"
                @click="$emit('lyricClick', item.time)"
                :class="{'lyric-item': true, 'current-lyric-item': currentLyrLine.line === item.line}"
                v-for="item in props.lyric"
            >
              <div
                  v-for="yrcItem in item.yrc"
                  style="position: relative;display: inline-block;width: auto;padding: 0"
              >
                <span
                    class="transition"
                    :style="{
                  background: `linear-gradient(to right, #fff ${yrcItem.width}, rgba(255, 255, 255, 0.3) 0%)`,
                  '-webkit-background-clip': 'text'
                }"
                >{{yrcItem.text}}</span>
              </div>
            </div>
            <span
                style="position: absolute; font-size: 12px"
                v-show="!props.lyric.notSupportedScroll && isEnterLyric"
                ref="targetTime"
            >{{formattingTime(currentEnterLyric.time * 1000)}}</span>
          </div>
        </template>
        <template v-else>
          <div v-if="props.lyric.notSupportedScroll" class="lyric-item not-supported-scroll">*该歌词不支持自动滚动* <span>求滚动</span></div>
          <div
              ref="moveBox"
              class="move-box"
          >
            <template v-for="item in props.lyric">
              <div
                  v-if="item.text"
                  @mouseenter="mouseenter($event, item)"
                  @mouseleave="mouseleave"
                  @click="$emit('lyricClick', item.time)"
                  :class="['hover-item', 'lyric-item', {'current-lyric-item': currentLyrLine.line === item.line, 'current-lyric-line-item': currentLyrLine.line === item.line}]"
              >{{item.text}}</div>
              <div
                  :class="['empty-lyric',{'current-lyric-item': currentLyrLine.line === item.line}]"
                  v-else-if="!props.lyric.notSupportedScroll"
              />
            </template>
            <span
                style="position: absolute; font-size: 12px"
                v-show="!props.lyric.notSupportedScroll && isEnterLyric"
                ref="targetTime"
            >{{formattingTime(currentEnterLyric.time * 1000)}}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
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
      mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
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
            background: linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0.3) 0%);
            -webkit-background-clip: text;
            color: transparent;
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
</style>