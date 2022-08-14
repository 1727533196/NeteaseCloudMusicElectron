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
  font-size: 14px;
  display: inline-block;
  padding: 5px 15px;
  border-radius: 30px;
  cursor: pointer;
  & + & {
    margin-left: 8px;
  }
}
.btn.subject {
  background-color: @subject;
  color: white;
  &:first-child:hover {
    background-color: rgb(220,20,20);
  }
}
.btn.default {
  border: 1px solid rgb(70,70,70);
  &:hover {
    background-color: rgba(255,255,255,0.03);
  }
}

</style>