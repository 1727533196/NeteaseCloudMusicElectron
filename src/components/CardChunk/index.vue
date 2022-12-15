<script setup lang="ts">
import Card from '@/components/Card/index.vue'
import {Recommend} from "@/api/home";

interface Props {
  recommend: Recommend[]
  title: string
}
const props = defineProps<Props>()
const emit = defineEmits(['click'])

// 点击滑动卡片
const clickSliderHandler = () => {
  emit('click')
}
</script>

<template>
  <div class="chunk-container">
    <div class="header">
      {{ props.title }}
      <el-icon><ArrowRight /></el-icon>
    </div>
    <div class="subject">
      <slot></slot>
      <Card
        @click="emit('click', item)"
        v-for="item in props.recommend"
        is-click
        :item="item"
        :name="item.name"
        :pic-url="item.picUrl"
      />
    </div>
<!--    <el-icon @click="clickSliderHandler" :size="50" class="arrow left"><ArrowLeft /></el-icon>-->
<!--    <el-icon @click="clickSliderHandler" :size="50" class="arrow right"><ArrowRight /></el-icon>-->
  </div>
</template>

<style lang="less" scoped>
.chunk-container {
  position: relative;
  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .left {
    left: -42px;
  }
  .right {
    right: -40px;
  }
  .header {
    font-size: 20px;
    color: @text;
    font-weight: 800;
    display: flex;
    align-items: center;
  }

  .subject {
    padding-top: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    //overflow-x: auto;
  }
}
</style>