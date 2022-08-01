import { defineStore } from 'pinia'
import {profile} from "@/api/user";
import {CurrentItem, PlayList} from "@/api/musicList";

export const useUserInfo = defineStore('userInfoId', {
  state: () => {
    return {
      profile: {
        avatarUrl: '', // 用户头像
        backgroundUrl: '', // 用户背景图片
        nickname: '', // 用户昵称
        createTime: null as null | number,
        vipType: null as null | number,
        userId: null as null | number, // 用户id
      },
      userPlayListInfo: [] as PlayList[], // 用户歌单列表信息
      userLikeIds: [] as number[], // 用户喜欢列表ids
      volume: Number(localStorage.getItem('volume')) || 1, // 用户当前播放器音量
    }
  },
  actions: {
    updateProfile(val: profile) {
      type key = keyof typeof val
      for (const valKey in this.profile) {
        // @ts-ignore
        this.profile[valKey as key] = val[valKey as key]
      }
      this.profile.userId && localStorage.setItem('userId', String(this.profile.userId))
    },
    updateUserPlayList(val: PlayList[]) {
      this.userPlayListInfo = val
    },
    updateUserLikeIds(ids: number[]) {
      this.userLikeIds = ids
    },
  }
})

/*
export const useUserInfo = defineStore({
  id: 'counter',
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    increment() {
      this.counter++
    }
  }
})
 */
