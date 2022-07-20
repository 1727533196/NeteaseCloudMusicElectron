import {cloudSearch} from "@/api/search";
import {reactive} from "vue";
import {getMusicDetailData} from "@/api/musicList";

interface State {
  resultList: getMusicDetailData[]
  songCount: number
  songs: getMusicDetailData
}
export const state = reactive<State>({
  resultList: [],
  songCount: 0,
  songs: {} as getMusicDetailData
})
export default () => {
  const search = async (key: string, limit = 30) => {
    const {result} = await cloudSearch(key, limit)
    console.log(result)
    state.songCount = result.songCount
    state.resultList = result.songs
  }

  return {
    search
  }
}