<script setup lang="ts">
import {formatDate} from "@/utils";
import {watch} from "vue";
import {useMusicAction} from "@/store/music";
import {useUserInfo} from "@/store";

const music = useMusicAction()
const store = useUserInfo()

console.log('store', store)
watch(music.currentItem, (val) => {
  console.log('val', val)
})
</script>

<template>
  <div v-if="music.currentItem.coverImgUrl" class="list-info">
    <div :style="{backgroundImage: `url(${music.currentItem.coverImgUrl})`}" class="left"></div>
    <div class="right">
      <div class="song-name">
        <div class="tag">歌单</div>
        <div class="name">{{music.currentItem.creator.nickname}}</div>
      </div>
      <div style="margin-top: 5px" class="song-info">
        <div :style="{backgroundImage: `url(${music.currentItem.creator.avatarUrl})`}" class="avatar"></div>
        <div class="nickname">{{store.profile.nickname}}</div>
        <div class="create-timer">{{formatDate(music.currentItem.createTime, 'YY-MM-DD hh:mm:ss')}}创建</div>
      </div>
      <div class="song-handle">
        <div class="btn">播放全部</div>
        <div class="btn">收藏</div>
        <div class="btn">分享</div>
        <div class="btn">下载全部</div>
      </div>
      <div class="song-count">
        <div class="p1">
          <span>歌曲 : </span>
          <span class="total">{{ music.currentItem.trackCount }}</span>
        </div>
        <div class="p2">
          <span>播放 : </span>
          <span class="count">{{ music.currentItem.playCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.list-info {
  display: flex;
  padding: 0 25px;

  .left {
    background-image: url("https://p1.music.126.net/9GAbSb_hlXPu66HWInJOww==/109951162846052486.jpg");
    background-size: contain;
    width: 180px;
    height: 180px;
    border-radius: 10px;
  }
  .right {
    margin-left: 20px;
    >div {
      display: flex;
      align-items: center;
      color: @text;
    }
    >div + div {
      margin-top: 10px;
    }

    .song-name {
      .name {
        color: @text;
        font-size: 25px;
        margin-left: 10px;
      }
      .tag {
        font-size: 13px;
        border-radius: 3px;
        padding: 0 5px;
        color: @subject;
        border: 1px solid @subject;
        &+& {
          margin-left: 5px;
        }
      }
    }
    .song-info {
      font-size: 12px;
      *+*{
        margin-left: 8px;
      }
      .avatar {
        border-radius: 50%;
        width: 25px;
        height: 25px;
        background-size: contain;
        cursor: pointer;
      }
      .nickname {
        color: rgb(133,185,230);
        cursor: pointer;
        &:hover {
          color: rgb(150,200,230);
        }
      }
      .create-timer {
        color: @darkText;
      }
    }
    .song-handle {
      font-size: 14px;
      .btn {
        padding: 5px 15px;
        border-radius: 30px;
        border: 1px solid rgb(70,70,70);
        & {
          cursor: pointer;
        }
        &:hover {
          background-color: rgba(255,255,255,0.03);
        }
        &:first-child:hover {
          background-color: rgb(220,20,20);
        }
      }
      .btn:first-child {
        background-color: @subject;
        border: none;
        color: white;
      }
      .btn + .btn {
        margin-left: 8px;
      }
    }
    .song-count {
      font-size: 13px;
      .p1 {
        margin-right: 13px;
      }
      >div {
        >span {
          color: @darkText;
        }
        >:first-child {
          color: @text;
        }
      }
    }
  }
}
</style>