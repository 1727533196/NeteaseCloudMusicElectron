import {getMusicDetail, getMusicDetailData, getMusicUrl} from "@/api/musicList";
import {nextTick, reactive, Ref, ref, watch} from "vue";
import {playListState} from "@/layout/BaseAside/usePlayList";
import {randomNum} from "@/utils";
import {MusicPlayerInstanceType} from "@/components/MusicPlayer/index.vue";

interface State {
  musicUrl: string
  songs: getMusicDetailData
}
export const useListPower = (audioInstance: Ref<MusicPlayerInstanceType | undefined>) => {
  const state = reactive<State>({
    musicUrl: '',
    songs: {} as getMusicDetailData
  })
  const index = ref(0)
  const lastIndexList: number[] = []
  watch(index, (value, oldValue) => {
    lastIndexList.push(oldValue)
  })
  const getMusicUrlHandler = async (id: string, i?: number) => {
    const [{data}, {songs}] = await Promise.all([getMusicUrl(id), getMusicDetail(id)])
    state.songs = songs[0]
    index.value = i === undefined ? index.value : i

    audioInstance.value!.reset(true)
    await audioInstance.value!.audio!.pause(false)
    state.musicUrl = data[0].url
    nextTick(() => {
      audioInstance.value!.audio!.play(true)
    })
  }

  const orderTarget = (i: 0 | 1 | 2 | 3) => {
    if (i === 0) {
      return index.value + 1 > playListState.ids.length - 1 ? 0 : index.value + 1
    } else if (i === 1) {
      return index.value
    } else if (i === 2) {
      return randomNum(0, playListState.ids.length - 1)
    } else {
      return index.value + 1
    }
  }
  const playEnd = () => {
    index.value = orderTarget(audioInstance.value?.orderStatusVal!)
    if (index.value > playListState.ids.length - 1) {
      return
    }
    getMusicUrlHandler(String(playListState.ids[index.value]))
  }
  const cutSongHandler = (target: boolean) => {
    if ([0, 1, 3].includes(audioInstance.value?.orderStatusVal!)) {
      index.value = target ? index.value + 1 : index.value - 1
      if (index.value > playListState.ids.length - 1) {
        index.value = 0
      } else if (index.value < 0) {
        index.value = playListState.ids.length - 1
      }
      target ?
        getMusicUrlHandler(String(playListState.ids[index.value])) :
        getMusicUrlHandler(String(playListState.ids[index.value]))
      return
    }
    if (!target) {
      const i = (lastIndexList[lastIndexList.length - 1] as number | undefined) ||
        orderTarget(audioInstance.value?.orderStatusVal!)
      getMusicUrlHandler(String(playListState.ids[i]))
      lastIndexList.splice(lastIndexList.length - 1)
      return;
    }
    playEnd()
  }

  return {
    state,
    getMusicUrlHandler,
    cutSongHandler,
    playEnd
  }
}