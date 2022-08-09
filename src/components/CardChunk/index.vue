<script setup lang="ts">
import Card from '@/components/Card/index.vue'
import {Recommend} from "@/api/home";

interface Props {
  recommend: Recommend[]
  title: string
}
const props = defineProps<Props>()
const emit = defineEmits(['click'])
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
        :item="item"
        :name="item.name"
        :pic-url="item.picUrl"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.chunk-container {
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
  }
}
</style>