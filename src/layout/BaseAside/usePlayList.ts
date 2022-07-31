import {reactive, ref} from "vue";
import {getLikeMusicListIds, getMusicDetailData, getPlayListDetail} from "@/api/musicList";
import {useUserInfo} from "@/store";

interface State {
  playList: getMusicDetailData[]
  ids: number[]
  loading: boolean,
}

export const playListState = reactive<State>({
  playList: [],
  ids: [],
  loading: false,
})

export default () => {
  const store = useUserInfo()
  // 获取用户指定歌单列表
  const getPlayListDetailFn = async (id: number) => {
    playListState.loading = true
    try {
      // 如果用户没有登录
      if(!store.profile.userId) {
        const {playlist} = await getPlayListDetail(id)
        playListState.playList = playlist.tracks;
        playListState.ids = playlist.tracks.map(item => item.id)
        return
      }
      const [{playlist}, {ids}] = await Promise.all([getPlayListDetail(id), getLikeMusicListIds(store.profile.userId)])
      playListState.playList = playlist.tracks;
      playListState.ids = playlist.tracks.map(item => item.id)
      store.updateCurrentItem(playlist)
      store.updateUserLikeIds(ids)
    } finally {
      playListState.loading = false
    }
  }

  return {
    getPlayListDetailFn,
  }
}

