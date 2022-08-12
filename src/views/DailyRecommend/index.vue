<script setup lang="ts">
import {useRoute} from "vue-router";
import {useMusicAction} from "@/store/music";
import usePlayList, {playListState} from "@/layout/BaseAside/usePlayList";
import SongInfo from '@/components/SongInfo/index.vue';
import SongList from '@/components/SongList/index.vue'
import {recommendSong} from "@/api/home";
import {playListMock} from "@/views/DailyRecommend/dailyRecommendSongsConfig";

const { getPlayListDetailFn, updatePlayList } = usePlayList()
const route = useRoute()
const music = useMusicAction()

const init = () => {
  const { id } = route.query as { id: number | 'recommendSongs' | null}
  // 是否是每日推荐歌曲
  if (id === 'recommendSongs') {
    recommendSong().then(({data}) => {
      playListMock.tracks = data.dailySongs
      console.log('playListMock', playListMock)
      updatePlayList(playListMock)
    })
  } else {
    id && getPlayListDetailFn(+id)
  }
}
init()
</script>

<template>
  <SongInfo v-if="false"></SongInfo>
  <SongList
    @play="music.getMusicUrlHandler"
    :loading="playListState.loading"
    :songs="music.songs"
    :ids="playListState.ids"
    :list="playListState.playList"
    :list-info="playListState.listInfo"
  />
</template>

<style scoped>

</style>