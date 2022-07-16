<script setup lang="ts">
import {defineExpose, ref} from "vue";
import {getMusicDetailData} from "@/api/musicList";
import {State} from "@/components/MusicPlayer/useMouseSlide";

interface Props {
  mouseenterHandler: (target: 'volume') => void
  mouseleaveHandler: (target: 'volume') => void
  mousedownHandler: (event: MouseEvent,target: 'volume') => void
  circleDown: (event: MouseEvent,target: 'volume') => void
  volumeHandler: (target: boolean) => void
  mouseupHandler: () => void
  songs: getMusicDetailData
  mouseState: State
}
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
    <div
      @mouseup="mouseupHandler"
      v-show="props.mouseState.volume"
      :style="{height: 100+'px'}"
      class="layer"
    >
      <div
        @mousedown="props.mousedownHandler($event, 'volume')"
        ref="volume"
        :style="{borderRadius: props.mouseState.progress ? '5px' : ''}"
        class="progress"
      >
        <div
          :style="{height: props.mouseState.height +'%', borderRadius: props.mouseState.progress ? '5px' : ''}"
          class="progress-bar"
        >
          <div
            @mousedown.stop.prevent="props.circleDown($event, 'volume')"
            class="circle"
          ></div>
        </div>
      </div>
      <div class="triangle"/>
    </div>
    <i
      v-if="!props.mouseState.isMute"
      @click="props.volumeHandler(true)"
      class="iconfont icon-yinliang"/>
    <i
      v-else
      @click="props.volumeHandler(false)"
      class="iconfont icon-jingyin"/>
  </div>
</template>

<style lang="less" scoped>
.volume-container {
  margin-left: 110px;
  position: relative;
  width: 20px;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  .layer {
    background-color: rgb(37,37,37);
    height: 0;
    padding: 10px 0;
    box-sizing: border-box;
    width: 30px;
    border-radius: 5px;
    border: 1px solid rgb(47,47,47);
    position: absolute;
    box-shadow: #00000019 0 0 5px 5px;
    top: -115px;
    display: flex;
    justify-content: center;
    align-items: center;
    .block {
      height: 20px;
      width: 30px;
      position: absolute;
      bottom: -30px;
    }
    .triangle {
      position: absolute;
      padding-bottom: 20px;
      bottom: -33px;
      width: 0px;
      height: 0px;
      border: 6px solid #000;
      border-top-color: rgb(50,50,50);
      border-bottom-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
    }
    .progress {
      width: 3px;
      background-color: rgb(73,73,76);
      height: 100%;
      position: relative;
    }
    .progress-bar {
      position: absolute;
      height: 100%;
      background-color: rgb(236,65,65);
      z-index: 2;
      width: 3px;
      bottom: 0;
      .circle {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-46%);
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
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
  }
  .iconfont:hover {
    color: white;
  }

}
</style>