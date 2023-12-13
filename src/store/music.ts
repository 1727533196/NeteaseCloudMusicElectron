import {defineStore} from "pinia";
import {CurrentItem, getLyric, getMusicDetail, GetMusicDetailData, getMusicUrl} from "@/api/musicList";
import {nextTick, watch, ref, reactive} from "vue";
import {formatLyric, parseYrc, randomNum, Yrc} from "@/utils";

const index = ref(0)
const lastIndexList = ref<number[]>([])
watch(index, (value, oldValue) => {
  lastIndexList.value.push(oldValue)
})
export type Lyric = {time: number | boolean, text: string, line: number}
interface State {
  musicUrl: string
  songs: GetMusicDetailData | {}
  currentItem: CurrentItem | {}
  runtimeList: CurrentItem | {}
  oldList: CurrentItem | {}
  runtimeIds: number[]
  lyric: Lyric[] | Yrc[]
  klyric: string
  currentTime: 0
  lrcMode: 0 | 1
  bgColor: Array<Array<string>>
}
// 会把用户当前正在播放的列表单独存储起来，以便切换歌单时没有播放切换的歌单不会被清空
export const useMusicAction = defineStore('musicActionId', () => {
  const state = reactive<State>({
    musicUrl: '', // 用户当前播放器播放的音乐url
    songs: {}, // 用户当前播放器播放的音乐
    currentItem: {}, // 用户当前选中的歌单列表，会随着用户选中的菜单变化
    runtimeList: {}, // 用户当前正在播放音乐的列表
    oldList: {}, // 用户上一次播放的歌单列表
    runtimeIds: [], // 用户当前正在播放音乐的列表ids
    lyric: [],
    klyric: '',
    currentTime: 0,
    lrcMode: 1,
    bgColor: [], // 当前正在播放的音乐主题色
  })

  const updateCurrentItem = (val: CurrentItem) => {
    val.name = val.specialType === 5 ? '我喜欢的歌单' : val.name
    state.currentItem = val
  }
  const updateRuntimeList = (list: CurrentItem, ids: number []) => {
    state.runtimeList = list
    state.runtimeIds = ids
  }
  // 获取歌词
  const getLyricHandler = async (id: number) => {
    const {klyric, lrc, yrc} = await getLyric(id)
    // 首先对歌词进行格式化处理
    // {time: number(s), text: string}
    if(yrc && yrc.lyric) {
      state.lyric = parseYrc(yrc.lyric)
      state.lrcMode = 1
    } else {
      state.lyric = formatLyric(lrc.lyric)
      state.lrcMode = 0
    }
  }
  // 获取音乐url
  const getMusicUrlHandler = async (id: number, i?: number) => {
    getLyricHandler(id)
    const [{data}, {songs}] = await Promise.all([getMusicUrl(id), getMusicDetail(id.toString())])
    state.songs = songs[0]
    index.value = i === undefined ? index.value : i
    $audio.reset(true)
    await $audio.pause(false)
    state.musicUrl = data[0].url
    nextTick(() => {
      $audio.play()
    })
  }
  const orderTarget = (i: 0 | 1 | 2 | 3) => {
    if (i === 0) {
      return index.value + 1 > state.runtimeIds.length - 1 ? 0 : index.value + 1
    } else if (i === 1) {
      return index.value
    } else if (i === 2) {
      return randomNum(0, state.runtimeIds.length - 1)
    } else {
      return index.value + 1
    }
  }
  const playEnd = () => {
    index.value = orderTarget($audio?.orderStatusVal!)
    if (index.value > state.runtimeIds.length - 1) {
      return
    }
    getMusicUrlHandler(state.runtimeIds[index.value])
  }
  const cutSongHandler = (target: boolean) => {
    if ([0, 1, 3].includes($audio?.orderStatusVal!)) {
      index.value = target ? index.value + 1 : index.value - 1
      if (index.value > state.runtimeIds.length - 1) {
        index.value = 0
      } else if (index.value < 0) {
        index.value = state.runtimeIds.length - 1
      }
      target ?
        getMusicUrlHandler(state.runtimeIds[index.value]) :
        getMusicUrlHandler(state.runtimeIds[index.value])
      return
    }
    if (!target) {
      const i = (lastIndexList.value[lastIndexList.value.length - 1] as number | undefined) ||
        orderTarget($audio?.orderStatusVal!)
      getMusicUrlHandler(state.runtimeIds[i])
      lastIndexList.value.splice(lastIndexList.value.length - 1)
      return;
    }
    playEnd()
  }
  const updateBgColor = (colors: Array<Array<string>>) => {
    state.bgColor = colors
  }

  return {
    state,
    updateCurrentItem,
    updateRuntimeList,
    getLyricHandler,
    getMusicUrlHandler,
    orderTarget,
    playEnd,
    cutSongHandler,
    updateBgColor,
  }
})

