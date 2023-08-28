<script setup lang="ts">
import {ref} from "vue";

const model = ref(0)

const change = () => {

}
const input = () => {

}
const timeupdate = () => {
  if(isDown.value || state.stop){
    return
  }
  music.currentTime = audio.value!.currentTime
  state.width = (audio.value!.currentTime / audio.value!.duration) * 100
}
</script>

<template>
  <div>
    <el-slider
      v-model="model"
      @change="change"
      @input="input"
      :show-tooltip="false"
      :show-stops="false"
      style="width: 80px;overflow: hidden"
    />
  </div>
</template>

<style scoped lang="less">
:deep(.el-slider__button-wrapper) {
  cursor: pointer !important;
}
:deep(.el-slider__button) {
  display: none;
}
</style>