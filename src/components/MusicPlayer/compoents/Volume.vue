<script setup lang="ts">
import {ref, watch} from "vue";
import {GetMusicDetailData} from "@/api/musicList";
import {State} from "@/components/MusicPlayer/useMouseSlide";
import {useFlags} from "@/store/flags";

interface Props {
  mouseenterHandler: (target: 'volume') => void
  mouseleaveHandler: (target: 'volume') => void
  mousedownHandler: (event: MouseEvent,target: 'volume') => void
  circleDown: (event: MouseEvent,target: 'volume') => void
  volumeHandler: (target: boolean) => void
  mouseupHandler: () => void
  songs: GetMusicDetailData
  mouseState: State
}
const flags = useFlags()
const props = defineProps<Props>()
const volume = ref<HTMLDivElement>()

defineExpose({
  volume
})
</script>

<template>
  <div
    @mouseleave="props.mouseleaveHandler('volume')"
    @mouseenter="props.mouseenterHandler('volume')"
    class="volume-container"
  >
    <i
      v-if="!props.mouseState.isMute"
      @click="props.volumeHandler(true)"
      class="iconfont icon-yinliang"/>
    <i
      v-else
      @click="props.volumeHandler(false)"
      class="iconfont icon-jingyin"/>
    <div
      @mouseup="mouseupHandler"
      class="layer"
    >
      <div
        @mousedown="props.mousedownHandler($event, 'volume')"
        ref="volume"
        :style="{borderRadius: props.mouseState.progress ? '5px' : ''}"
        class="progress"
      >
        <div
          :style="{width: props.mouseState.volumeWidth +'%', borderRadius: props.mouseState.progress ? '5px' : ''}"
          class="progress-bar"
        >
          <div
            @mousedown.stop.prevent="props.circleDown($event, 'volume')"
            class="circle"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.volume-container {
  margin-left: 50px;
  position: relative;
  //width: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 130px;
  .layer {
    height: 5px;
    box-sizing: border-box;
    width: 90px;
    border-radius: 5px;
    .progress {
      width: 90px;
      background-color: rgba(255,255,255, 0.1);
      height: 5px;
      position: relative;
      border-radius: 5px;
    }
    .progress-bar {
      position: relative;
      height: 5px;
      background-color: rgb(236,65,65);
      z-index: 2;
      width: 90px;
      bottom: 0;
      border-radius: 5px;
      .circle {
        position: absolute;
        right: -7px;
        top: 50%;
        transform: translateY(-50%);
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background-color: rgb(236,65,65);
      }
    }
  }
  .icon-yinliang {
    font-size: 20px;
  }
  .iconfont {
    cursor: pointer;
    //transform: translateY(-50%);
    //position: absolute;
    //top: 50%;
    color: @text;
  }
  .iconfont:hover {
    color: white;
  }

}
</style>