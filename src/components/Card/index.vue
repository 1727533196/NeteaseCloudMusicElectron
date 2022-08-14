<script setup lang="ts">
interface Props {
  picUrl: string
  name: string
}
const emit = defineEmits(['click'])
const props = defineProps<Props>()

const clickHandler = () => {
  emit('click')
}
</script>

<template>
  <div class="card-box">
    <div
      @click="clickHandler"
      :style="{backgroundImage: `url(${props.picUrl}`}"
      class="card"
    ></div>
    <div class="text">{{props.name}}</div>
  </div>
</template>

<style lang="less" scoped>
.card-box {
  width: calc(15vw - 10px);
  max-width: calc(40vw - 10px);
  margin-bottom: 20px;
  .card {
    width: calc(15vw - 10px);
    max-width: calc(40vw - 10px);
    max-height: calc(40vw - 10px);
    height: calc(15vw - 10px);
    border-radius: 5px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .text {
    margin-top: 5px;
    color: @text;
    font-size: 15px;
    .textOverflow(2);
  }
}

</style>