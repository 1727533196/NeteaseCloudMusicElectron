import {cloudSearch} from "@/api/search";
import {reactive} from "vue";
import {GetMusicDetailData} from "@/api/musicList";

interface State {
  resultList: GetMusicDetailData[]
  songCount: number
}
export const state = reactive<State>({
  resultList: [],
  songCount: 0,
})
export default () => {
  const search = async (key: string, limit = 30) => {
    const {result} = await cloudSearch(key, limit)
    state.songCount = result.songCount
    state.resultList = result.songs
  }

  return {
    search
  }
}