import {defineStore} from "pinia";

export const useSettings = defineStore('settingsId', {
  state() {
    return {
      lyricBg: 'rgb' as 'rgb' | 'rhythm',
    }
  }
})