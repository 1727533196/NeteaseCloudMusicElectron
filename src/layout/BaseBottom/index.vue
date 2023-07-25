<script setup lang="ts" name="Bottom">

</script>

<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.container {
  height: 75px;
  background-color: rgb(28,28,36);
  border-top: rgb(59,59,62) 1px solid;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2003;
  width: 100%;
}
</style>