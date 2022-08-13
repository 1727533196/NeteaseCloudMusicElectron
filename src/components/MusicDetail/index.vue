<script setup lang="ts">

import {computed, defineEmits} from "vue";

interface Props {
  modelValue: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const setModelValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

</script>

<template>
  <div :class="['container', {open: setModelValue}]">
    <span @click="setModelValue=false" class="close">关闭</span>
    <div class="music-detail-container"></div>
  </div>
</template>

<style lang="less" scoped>
.container {
  position: fixed;
  height: 0;
  width: 100%;
  bottom: 75px;
  left: 0;
  transition: height 0.5s;
  z-index: 2003;
  overflow: hidden;
  .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    font-size: 20px;
    cursor: pointer;
  }
  .music-detail-container {
    height: 100%;
    width: 100%;
    background-color: @bgColor;
  }
}
.container.open {
  height: calc(100% - 75px) !important;
}

</style>