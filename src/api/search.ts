import request from "@/utils/request";
import {GetMusicDetailData} from "@/api/musicList";

interface CloudSearch {
  code: number
  result: {
    searchQcReminder: null
    songCount: number
    songs: GetMusicDetailData[]
  }
}
export const cloudSearch = (keywords: string, limit = 30) =>
  request<{keywords: string, limit: number}, CloudSearch>('/cloudsearch', {keywords, limit})

// 热搜列表(详细)
export const searchHotDetail = () => request('/search/hot/detail')