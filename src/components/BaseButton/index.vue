<script setup lang="ts">
import {withDefaults} from "vue";

interface Props {
  type?: 'default' | 'subject'
}
const props = withDefaults(defineProps<Props>(), {
  type: 'default'
})
const emit = defineEmits(['click'])

</script>

<template>
  <div @click="emit('click')" :class="['btn', props.type]">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.btn {
  font-size: 15px;
  display: inline-block;
  padding: 11px 23px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  position: relative;
  color: white;
  & + & {
    margin-left: 8px;
  }
}
.btn.subject {
  background-image: linear-gradient(rgb(255, 17, 104), rgb(252, 61, 73));
  color: white;
  &:hover {
    background-image: linear-gradient(rgb(229, 15, 94), rgb(252, 61, 73));
  }
}
.btn.default {
  //border: 0.5px solid rgb(70,70,70);
  background-color: rgb(33,33,39);
  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
}


</style>