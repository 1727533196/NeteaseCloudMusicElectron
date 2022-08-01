import {defineStore} from "pinia";
import {CurrentItem, getMusicDetail, GetMusicDetailData, getMusicUrl} from "@/api/musicList";
import {nextTick, watch, ref} from "vue";
import {playListState} from "@/layout/BaseAside/usePlayList";
import {randomNum} from "@/utils";
import {useUserInfo} from "@/store/index";

console.log('use', useUserInfo)
const index = ref(0)
const lastIndexList = ref<number[]>([])
watch(index, (value, oldValue) => {
  lastIndexList.value.push(oldValue)
})
export const useMusicAction = defineStore('musicActionId', {
  state() {
    return {
      musicUrl: '',
      songs: {} as GetMusicDetailData,
      currentItem: {} as CurrentItem, // 用户当前左侧选中的歌单列表，会随着用户选中的菜单变化
      runtimeList: {} as CurrentItem, // 用户当前正在播放音乐的列表
      runtimeIds: [] as number[], // 用户当前正在播放音乐的列表ids
      oldList: {} as CurrentItem, // 用户上一次播放的歌单列表
    }
  },
  actions: {
    updateCurrentItem(val: CurrentItem) {
      val.name = val.specialType === 5 ? '我喜欢的歌单' : val.name

      this.currentItem = val
      setTimeout(() => {
        console.log('playlist', this.currentItem)
      }, 2000)
    },
    updateRuntimeList(list: CurrentItem, ids: number []) {
      this.runtimeList = list
      this.runtimeIds = ids
    },
    // 获取音乐url
    async getMusicUrlHandler(id: string, i?: number) {
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
      this.getMusicUrlHandler(String(this.runtimeIds[index.value]))
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
          this.getMusicUrlHandler(String(this.runtimeIds[index.value])) :
          this.getMusicUrlHandler(String(this.runtimeIds[index.value]))
        return
      }
      if (!target) {
        const i = (lastIndexList.value[lastIndexList.value.length - 1] as number | undefined) ||
          this.orderTarget($audio?.orderStatusVal!)
        this.getMusicUrlHandler(String(this.runtimeIds[i]))
        lastIndexList.value.splice(lastIndexList.value.length - 1)
        return;
      }
      this.playEnd()
    },
  },

})
