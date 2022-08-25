import { defineStore } from "pinia";

export const useFlags = defineStore("flagsId", {
  state: () => {
    return {
      isMaximize: false, // 是否是最大化状态
      isMinimize: false, // 是否是最小化状态
      isOpenDetail: false, // 是否打开歌曲详情页面
    }
  },
})