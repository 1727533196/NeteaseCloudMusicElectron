<script setup lang="ts">

interface Props {
  list: []
}

const emit = defineEmits(['click'])
const props = defineProps<Props>()


</script>

<template>
  <div class="list">
    <div @click="emit('click', item)" v-for="(item, index) in props.list" class="item">
      <div class="sort">{{ index+1 }}</div>
      <div class="content">
        <div class="title">
          <span class="name">{{ item.searchWord }}</span>
          <img v-if="item.iconUrl" :src="item.iconUrl" class="icon">
          <span class="score">{{ item.score }}</span>
        </div>
        <div class="desc">{{item.content}}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.list {
  .item {
    display: flex;
    align-items: center;
    height: 60px;
    cursor: pointer;
    padding: 0 25px;
    &:hover {
      background-color: rgba(0,0,0,0.05);
    }

    .sort {
      margin-right: 30px;
      color: @darkText;
    }
    .content {
      display: flex;
      flex-direction: column;
      .title {
        margin-bottom: 5px;
        .name {
          font-size: 13px;
          font-weight: 800;
        }
        .score {
          color: @moreDark;
          font-size: 12px;
        }
        .icon {
          height: 13px;
        }
        > * {
          margin-right: 5px;
        }

      }
      .desc {
        font-size: 12px;
        color: @moreDark;
      }
    }
  }
  .item:nth-child(-n+3) {
    .sort {
      color: rgba(255, 0, 0, 0.9);
    }
  }
}
</style>