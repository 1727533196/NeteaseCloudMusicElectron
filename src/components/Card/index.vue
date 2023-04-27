<script setup lang="ts">
interface Props {
  picUrl: string
  name: string
  isClick?: boolean,
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
      :class='["card", {"card-click": isClick}]'
    ></div>
    <span :class="['text', {'card-click': isClick}]">{{props.name}}</span>
  </div>
</template>

<style lang="less" scoped>
.card-box {
  display: inline-block;
  width: calc(15vw - 20px);
  margin-bottom: 20px;
  box-sizing: content-box;
  //& + & {
  //  margin-left: calc(10% - 90px);
  //}
  .card {
    width: calc(15vw - 20px);
    height: calc(15vw - 20px);
    border-radius: 5px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: 0.3s;
  }
  .card:hover {
    box-shadow: 0 5px 15px 5px rgba(0, 0, 0, 0.1);
  }
  .card-click {
    cursor: pointer;
  }
  .text {
    margin-top: 5px;
    color: @text;
    font-size: 15px;
    .textOverflow(2);
  }
}

</style>