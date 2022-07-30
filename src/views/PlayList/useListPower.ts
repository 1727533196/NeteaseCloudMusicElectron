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


}