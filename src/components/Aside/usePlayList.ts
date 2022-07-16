import {reactive} from "vue";
import {getLikeMusicListIds, getMusicDetailData, getPlayListDetail} from "@/api/musicList";
import {useUserInfo} from "@/store";

interface State {
  playList: getMusicDetailData[]
  ids: number[]
}

export const playListState = reactive<State>({
  playList: [],
  ids: [],
})

export default () => {
  const store = useUserInfo()
  const getPlayListDetailFn = async (id: number) => {
    if(!store.profile.userId) {
      const {playlist} = await getPlayListDetail(id)
      playListState.playList = playlist.tracks;
      playListState.ids = playlist.tracks.map(item => item.id)
      return
    }
    const [{playlist}, {ids}] = await Promise.all([getPlayListDetail(id), getLikeMusicListIds(store.profile.userId)])
    playListState.playList = playlist.tracks;
    playListState.ids = playlist.tracks.map(item => item.id)
    store.updateUserLikeIds(ids)
  }

  return {
    getPlayListDetailFn
  }
}

