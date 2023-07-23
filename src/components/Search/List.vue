<script setup lang="ts">

interface Props {
  list: []
  keywordsList: {
    order: string[]
    allMatch: []
    albums?: []
    artists?: []
    playlists?: []
    songs?:[]
  }
  model: 'hot' | 'keywords'
}

const emit = defineEmits(['click'])
const props = defineProps<Props>()
const config = {
  allMatch: {
    text: '猜你想搜',
    icon: '<el-icon><Search /></el-icon>',
  },
  songs: {
    text: '单曲',
    icon: '',
  },
  artists:{
    text: '歌手',
    icon: '',
  } ,
  albums: {
    text: '专辑',
    icon: ''
  },
  playlists: {
    text: '歌单',
    icon: ''
  },
}


</script>

<template>
  <div class="list">
    <template v-if="model === 'hot'">
      <div  @click="emit('click', item)" v-for="(item, index) in props.list" class="item">
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
    </template>
    <template v-if="model === 'keywords'">
      <div class="suggest-box" v-for="key in props.keywordsList.order">
        <div class="title">{{ config[key].text }}</div>
        <div @click="emit('click', target, key)" class="item" v-for="target in props.keywordsList[key]">
          <div class="name" v-html="target.text"/>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.list {
  height: 100%;
  overflow: auto;
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
  .suggest-box {
    padding-top: 10px;
    .title {
      color: @moreDark;
      font-size: 16px;
      padding: 0 20px 10px 34px;
    }
    .name {
      font-size: 13px;
    }
    .item {
      cursor: pointer;
      padding: 8px 35px;
      height: auto;
    }
  }

}
</style>