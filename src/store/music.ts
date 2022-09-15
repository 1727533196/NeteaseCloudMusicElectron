import {defineStore} from "pinia";
import {CurrentItem, getLyric, getMusicDetail, GetMusicDetailData, getMusicUrl} from "@/api/musicList";
import {nextTick, watch, ref} from "vue";
import {formatLyric, randomNum} from "@/utils";

const index = ref(0)
const lastIndexList = ref<number[]>([])
watch(index, (value, oldValue) => {
  lastIndexList.value.push(oldValue)
})
export type Lyric = {time: number, text: string, line: number}
// 会把用户当前正在播放的列表单独存储起来，以便切换歌单时没有播放切换的歌单不会被清空
export const useMusicAction = defineStore('musicActionId', {
  state() {
    return {
      musicUrl: '', // 用户当前播放器播放的音乐url
      songs: {} as GetMusicDetailData, // 用户当前播放器播放的音乐
      currentItem: {} as CurrentItem, // 用户当前选中的歌单列表，会随着用户选中的菜单变化
      runtimeList: {} as CurrentItem, // 用户当前正在播放音乐的列表
      oldList: {} as CurrentItem, // 用户上一次播放的歌单列表
      runtimeIds: [] as number[], // 用户当前正在播放音乐的列表ids
      lyric: [] as Lyric[],
      klyric: '',
      currentTime: 0,
    }
  },
  actions: {
    updateCurrentItem(val: CurrentItem) {
      val.name = val.specialType === 5 ? '我喜欢的歌单' : val.name
      this.currentItem = val
    },
    updateRuntimeList(list: CurrentItem, ids: number []) {
      this.runtimeList = list
      this.runtimeIds = ids
    },
    // 获取歌词
    async getLyricHandler(id: number) {
      const {klyric, lrc} = await getLyric(id)
      // 首先对歌词进行格式化处理
      // {time: number(s), text: string}
      this.lyric = formatLyric(lrc.lyric)
    },
    // 获取音乐url
    async getMusicUrlHandler(id: number, i?: number) {
      this.getLyricHandler(id)
      const [{data}, {songs}] = await Promise.all([getMusicUrl(id), getMusicDetail(id)])
      this.songs = songs[0]
      index.value = i === undefined ? index.value : i
      $audio.reset(true)
      await $audio.pause(false)
      this.musicUrl = data[0].url
      nextTick(() => {
        $audio.play()
      })
    },
    orderTarget(i: 0 | 1 | 2 | 3) {
      if (i === 0) {
        return index.value + 1 > this.runtimeIds.length - 1 ? 0 : index.value + 1
      } else if (i === 1) {
        return index.value
      } else if (i === 2) {
        return randomNum(0, this.runtimeIds.length - 1)
      } else {
        return index.value + 1
      }
    },
    playEnd() {
      index.value = this.orderTarget($audio?.orderStatusVal!)
      if (index.value > this.runtimeIds.length - 1) {
        return
      }
      this.getMusicUrlHandler(this.runtimeIds[index.value])
    },
    cutSongHandler(target: boolean) {
      if ([0, 1, 3].includes($audio?.orderStatusVal!)) {
        index.value = target ? index.value + 1 : index.value - 1
        if (index.value > this.runtimeIds.length - 1) {
          index.value = 0
        } else if (index.value < 0) {
          index.value = this.runtimeIds.length - 1
        }
        target ?
          this.getMusicUrlHandler(this.runtimeIds[index.value]) :
          this.getMusicUrlHandler(this.runtimeIds[index.value])
        return
      }
      if (!target) {
        const i = (lastIndexList.value[lastIndexList.value.length - 1] as number | undefined) ||
          this.orderTarget($audio?.orderStatusVal!)
        this.getMusicUrlHandler(this.runtimeIds[i])
        lastIndexList.value.splice(lastIndexList.value.length - 1)
        return;
      }
      this.playEnd()
    },
  },

})

