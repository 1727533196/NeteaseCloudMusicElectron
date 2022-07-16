import { defineStore } from 'pinia'
import {profile} from "@/api/user";
import {playList} from "@/api/musicList";

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
      userPlayList: [] as playList[], // 用户歌单
      userLikeIds: [] as number[], // 用户喜欢列表ids
      currentItem: {} as playList, // 用户当前选中的列表
      volume: Number(localStorage.getItem('volume')) || 1
    }
  },
  actions: {
    updateProfile(val: profile) {
      type key = keyof typeof val
      for (const valKey in this.profile) {
        this.profile[valKey as key] = val[valKey as key]
      }
      this.profile.userId && localStorage.setItem('userId', String(this.profile.userId))
    },
    updateUserPlayList(val: playList[]) {
      this.userPlayList = val
    },
    updateUserLikeIds(ids: number[]) {
      this.userLikeIds = ids
    },
    updateCurrentItem(val: playList) {
      val.name = val.specialType === 5 ? '我喜欢的歌单' : val.name
      this.currentItem = val
    }
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
