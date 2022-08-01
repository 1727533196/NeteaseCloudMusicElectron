import {reactive, ref} from "vue";
import {CurrentItem, getLikeMusicListIds, getPlayListDetail} from "@/api/musicList";
import {useUserInfo} from "@/store";
import {useMusicAction} from "@/store/music";

interface State {
  playList: CurrentItem
  ids: number[]
  loading: boolean,
}

export const playListState = reactive<State>({
  playList: {} as CurrentItem,
  ids: [],
  loading: false,
})

export default () => {
  const store = useUserInfo()
  const music = useMusicAction()
  // 获取用户指定歌单列表
  const getPlayListDetailFn = async (id: number) => {
    playListState.loading = true
    music.oldList = playListState.playList
    try {
      // 如果用户没有登录
      if(!store.profile.userId) {
        const {playlist} = await getPlayListDetail(id)
        playListState.playList = playlist
        playListState.ids = playlist.tracks.map(item => item.id)
        music.updateCurrentItem(playlist)
        return
      }
      const [{playlist}, {ids}] = await Promise.all([getPlayListDetail(id), getLikeMusicListIds(store.profile.userId)])
      playListState.playList = playlist
      playListState.ids = playlist.tracks.map(item => item.id)
      music.updateCurrentItem(playlist)
      store.updateUserLikeIds(ids)
    } finally {
      playListState.loading = false
    }
  }

  return {
    getPlayListDetailFn,
  }
}

