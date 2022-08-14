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
      const {playlist} = await getPlayListDetail(id)
      updatePlayList(playlist)
    } finally {
      playListState.loading = false
    }
  }
  const updatePlayList = async (list: CurrentItem) => {
    playListState.playList = list.tracks
    playListState.ids = list.tracks.map(item => item.id)
    // 过滤掉track属性
    const {tracks, ...args} = list
    playListState.listInfo = args
    music.updateCurrentItem(list)
    if(store.isLogin) {
      const { ids } = await getLikeMusicListIds(store.profile.userId!)
      ids.length && store.updateUserLikeIds(ids)
    }
  }

  return {
    getPlayListDetailFn,
    updatePlayList,
  }
}

