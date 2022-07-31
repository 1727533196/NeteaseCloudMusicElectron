import {defineStore} from "pinia";
import {getMusicDetail, getMusicDetailData, getMusicUrl} from "@/api/musicList";
import {nextTick, watch, ref} from "vue";
import {playListState} from "@/layout/BaseAside/usePlayList";
import {randomNum} from "@/utils";

const index = ref(0)
const lastIndexList = ref<number[]>([])
watch(index, (value, oldValue) => {
  lastIndexList.value.push(oldValue)
})
export const useMusicAction = defineStore('musicActionId', {
  state() {
    return {
      musicUrl: '',
      songs: {} as getMusicDetailData,
    }
  },
  actions: {
    // 获取音乐url
    async getMusicUrlHandler(id: string, i?: number) {
      const [{data}, {songs}] = await Promise.all([getMusicUrl(id), getMusicDetail(id)])
      this.songs = songs[0]
      index.value = i === undefined ? index.value : i
      $audio.reset(true)
      await $audio.pause(false)
      console.log('data', data)
      this.musicUrl = data[0].url
      console.log('this.musicUrl', this.musicUrl)
      nextTick(() => {
        $audio.play()
      })
    },
    orderTarget(i: 0 | 1 | 2 | 3) {
      if (i === 0) {
        return index.value + 1 > playListState.ids.length - 1 ? 0 : index.value + 1
      } else if (i === 1) {
        return index.value
      } else if (i === 2) {
        return randomNum(0, playListState.ids.length - 1)
      } else {
        return index.value + 1
      }
    },
    playEnd() {
      index.value = this.orderTarget($audio?.orderStatusVal!)
      if (index.value > playListState.ids.length - 1) {
        return
      }
      this.getMusicUrlHandler(String(playListState.ids[index.value]))
    },
    cutSongHandler(target: boolean) {
      if ([0, 1, 3].includes($audio?.orderStatusVal!)) {
        index.value = target ? index.value + 1 : index.value - 1
        if (index.value > playListState.ids.length - 1) {
          index.value = 0
        } else if (index.value < 0) {
          index.value = playListState.ids.length - 1
        }
        target ?
          this.getMusicUrlHandler(String(playListState.ids[index.value])) :
          this.getMusicUrlHandler(String(playListState.ids[index.value]))
        return
      }
      if (!target) {
        const i = (lastIndexList.value[lastIndexList.value.length - 1] as number | undefined) ||
          this.orderTarget($audio?.orderStatusVal!)
        this.getMusicUrlHandler(String(playListState.ids[i]))
        lastIndexList.value.splice(lastIndexList.value.length - 1)
        return;
      }
      this.playEnd()
    },
  },

})
