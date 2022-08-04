import {reactive} from "vue";
import {CurrentItem, getLikeMusicListIds, GetMusicDetailData, getPlayListDetail, PlayList} from "@/api/musicList";
import {useUserInfo} from "@/store";
import {useMusicAction} from "@/store/music";

interface State {
  playList: GetMusicDetailData[]
  listInfo: PlayList
  ids: number[]
  loading: boolean,
}

export const playListState = reactive<State>({
  playList: [],
  listInfo: {} as PlayList,
  ids: [],
  loading: false,
})

export default () => {
  const store = useUserInfo()
  const music = useMusicAction()
  // 获取用户指定歌单列表
  const getPlayListDetailFn = async (id: number) => {
    playListState.loading = true
    music.oldList = {tracks: playListState.playList, ...playListState.listInfo}
    try {
      // 如果用户没有登录
      if(!store.profile.userId) {
        const {playlist} = await getPlayListDetail(id)
        playListState.playList = playlist.tracks
        playListState.ids = playlist.tracks.map(item => item.id)
        const {tracks, ...args} = playlist
        playListState.listInfo = args
        music.updateCurrentItem(playlist)
        return
      }
      const [{playlist}, {ids}] = await Promise.all([getPlayListDetail(id), getLikeMusicListIds(store.profile.userId)])
      playListState.playList = playlist.tracks
      playListState.ids = playlist.tracks.map(item => item.id)
      const {tracks, ...args} = playlist
      playListState.listInfo = args
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

