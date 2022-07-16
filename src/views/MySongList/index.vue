<script setup lang="ts">
import {reactive, ref, nextTick, watch} from "vue";
import {getMusicDetail, getMusicDetailData, getMusicUrl} from "@/api/musicList";
import MusicPlayer, {MusicPlayerInstanceType} from '@/components/MusicPlayer/index.vue'
import List from '@/components/List/index.vue'
import {playListState} from "@/components/Aside/usePlayList";
import Bottom from '@/components/Bottom/index.vue'
import {randomNum, formatDate} from "@/utils";
import {useUserInfo} from "@/store";


interface State {
  phone: string
  code: string
  musicUrl: string
  songs: getMusicDetailData
}

const state = reactive<State>({
  phone: '',
  code: '',
  musicUrl: '',
  songs: {} as getMusicDetailData
})
const store = useUserInfo()
const audio = ref<MusicPlayerInstanceType>()
const index = ref(0)
const lastIndexList: number[] = []
watch(index, (value, oldValue) => {
  lastIndexList.push(oldValue)
  console.log('lastIndexList', lastIndexList)
})
const getMusicUrlHandler = async (id: string, i?: number) => {
  const [{data}, {songs}] = await Promise.all([getMusicUrl(id), getMusicDetail(id)])
  state.musicUrl = data[0].url
  state.songs = songs[0]
  index.value = i === undefined ? index.value : i
  nextTick(() => {
    audio.value?.play()
  })
  console.log('list data', data)
}

const orderTarget = (i: 0 | 1 | 2 | 3) => {
  if (i === 0) {
    return index.value + 1 > playListState.ids.length - 1 ? 0 : index.value + 1
  } else if (i === 1) {
    return index.value
  } else if (i === 2) {
    return randomNum(0, playListState.ids.length - 1)
  } else {
    return index.value + 1
  }
}
const playEnd = () => {
  index.value = orderTarget(audio.value?.orderStatusVal!)
  if (index.value > playListState.ids.length - 1) {
    return
  }
  getMusicUrlHandler(String(playListState.ids[index.value]))
}
const cutSongHandler = (target: boolean) => {
  if ([0, 1, 3].includes(audio.value?.orderStatusVal!)) {
    console.log('index', index.value, target)
    index.value = target ? index.value + 1 : index.value - 1
    console.log('index', index.value)
    if (index.value > playListState.ids.length - 1) {
      index.value = 0
    } else if (index.value < 0) {
      index.value = playListState.ids.length - 1
    }
    target ?
      getMusicUrlHandler(String(playListState.ids[index.value])) :
      getMusicUrlHandler(String(playListState.ids[index.value]))
    return
  }
  if (!target) {
    const i = (lastIndexList[lastIndexList.length - 1] as number | undefined) ||
      orderTarget(audio.value?.orderStatusVal!)
    getMusicUrlHandler(String(playListState.ids[i]))
    lastIndexList.splice(lastIndexList.length - 1)
    return;
  }
  playEnd()
}
</script>

<template>
  <div class="list-info">
    <div :style="{backgroundImage: `url(${store.currentItem.coverImgUrl})`}" class="left"></div>
    <div class="right">
      <div class="song-name">
        <div class="tag">歌单</div>
        <div class="name">{{store.currentItem.creator.nickname}}</div>
      </div>
      <div style="margin-top: 5px" class="song-info">
        <div :style="{backgroundImage: `url(${store.currentItem.creator.avatarUrl})`}" class="avatar"></div>
        <div class="nickname">{{store.profile.nickname}}</div>
        <div class="create-timer">{{formatDate(store.currentItem.createTime, 'YY-MM-DD hh:mm:ss')}}创建</div>
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
          <span class="total">{{ store.currentItem.trackCount }}</span>
        </div>
        <div class="p2">
          <span>播放 : </span>
          <span class="count">{{ store.currentItem.playCount }}</span>
        </div>
      </div>
    </div>
  </div>
  <List @play="getMusicUrlHandler" :songs="state.songs" :list="playListState.playList"/>
  <Bottom>
    <MusicPlayer
      @cutSong="cutSongHandler"
      @playEnd="playEnd"
      ref="audio"
      :ids="playListState.ids"
      :songs="state.songs"
      :src="state.musicUrl"></MusicPlayer>
  </Bottom>
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