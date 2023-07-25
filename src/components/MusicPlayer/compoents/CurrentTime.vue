<script setup lang="ts">
import {ref} from "vue";
import {GetMusicDetailData} from "@/api/musicList";
import {State} from "@/components/MusicPlayer/useMouseSlide";
import {useFlags} from "@/store/flags";

interface Props {
  mouseenterHandler: (target: 'progress') => void
  mouseleaveHandler: (target: 'progress') => void
  mousedownHandler: (event: MouseEvent,target: 'progress') => void
  circleDown: (event: MouseEvent,target: 'progress') => void
  songs: GetMusicDetailData
  mouseState: State
}
const props = defineProps<Props>()
const plan = ref<HTMLDivElement>()
const flags = useFlags()

defineExpose({
  plan,
})
</script>

<template>
  <div
    ref="plan"
    v-if="props.songs.ar"
    @mouseenter="props.mouseenterHandler('progress')"
    @mouseleave="props.mouseleaveHandler('progress')"
    @mousedown="props.mousedownHandler($event, 'progress')"
    :class="['plan', {'enter-plan': props.mouseState.progress}]"
  >
    <div
      :style="{borderRadius: props.mouseState.progress ? '5px' : '', background: flags.isOpenDetail ? 'rgba(255,255,255,0.15)' : ''}"
      class="progress"
    ></div>
    <div
      :style="{width: props.mouseState.width +'%', borderRadius: props.mouseState.progress ? '5px' : ''}"
      class="progress-bar"
    >
      <div
        @mousedown.stop.prevent="props.circleDown($event, 'progress')"
        v-show="props.mouseState.progress"
        class="circle"
      ></div>
    </div>
  </div>
  <div v-else class="plan">
    <div
      class="progress"
    ></div>
  </div>
</template>

<style lang="less" scoped>
.plan.enter-plan {
  height: 6px;
  overflow: visible;
  border-radius: 5px;
}
.plan {
  transition: 0.1s;
  position: relative;
  width: 100%;
  height: 1px;
  overflow: hidden;
  .progress {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgb(73,73,76);
    height: 100%;
  }
  .progress-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: rgb(236,65,65);
    z-index: 2;
    width: 0;
    .circle {
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      height: 10px;
      width: 10px;
      border-radius: 50%;
      background-color: rgb(236,65,65);
    }
  }
}
</style>