import { defineStore } from "pinia";

export const useFlags = defineStore("flagsId", {
  state: () => {
    return {
      isLogin: false,
      isOpenMusicDetail: false,
    }
  },
})