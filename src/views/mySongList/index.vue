<script setup lang="ts">
import {reactive, ref, nextTick, watch} from "vue";
import {getMusicDetail, getMusicDetailData, getMusicUrl} from "@/api/musicList";
import MusicPlayer, {MusicPlayerInstanceType} from '@/components/MusicPlayer/index.vue'
import List from '@/components/List/index.vue'
import {playListState} from "@/components/Aside/usePlayList";
import Bottom from '@/components/Bottom/index.vue'
import {randomNum} from "@/utils";

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
    <div class="left"></div>
    <div class="right"></div>
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

  }
}

</style>