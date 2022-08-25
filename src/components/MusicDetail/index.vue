<script setup lang="ts">
import {computed, ref} from "vue";
import {useMusicAction} from "@/store/music";
import {useFlags} from "@/store/flags";

interface Props {
  modelValue: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const music = useMusicAction()
const defaultImg = '/src/assets/defaultBg.png'
const flags = useFlags()

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
</script>

<template>
  <div :class="['container', {open: setModelValue}]">
    <el-icon :size="45" @click="closeDetail" class="close np-drag"><ArrowDown /></el-icon>
    <div :style="{backgroundImage: `url(${bg})`}" class="music-detail-container">
      <div class="shadow">
        <div class="lyric-and-bg-container">
          <div :style="{backgroundImage: `url(${bg})`}" class="bg-img"></div>
          <div class="lyric-container"></div>
        </div>
        <div class="test" style="height: 80px; position: absolute;bottom: 0;width: 100%"></div>
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
  transition: height 0.5s;
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
    background-image: url("../../assets/../assets/defaultBg.png");
    .bgSetting();
    .shadow {
      backdrop-filter: blur(5px);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.35);
      .lyric-and-bg-container {
        display: flex;
        margin-top: 17vh;
        justify-content: space-around;
        align-items: center;
        height: 58vh;
        .bg-img {
          width: 45vh;
          height: 45vh;
          border-radius: 5px;
          transform: translateX(12vw);
          .bgSetting();
        }
        .lyric-container {
          height: 100%;
          width: 40vw;
          border-radius: 5px;
          background-color: rgba(0,0,0,0.35);
        }
      }
    }
  }
}
.container.open {
  height: calc(100%) !important;
}

</style>